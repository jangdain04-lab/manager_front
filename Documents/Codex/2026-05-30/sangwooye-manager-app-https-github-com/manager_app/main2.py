import cv2
from ultralytics import YOLO
import numpy as np
import torch
import threading
import time
import yt_dlp
import requests

# =========================================================
# 1. 설정 및 모델 로드
# =========================================================
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = YOLO('yolo11s.pt').to(device)

if device == 'cuda':
    model.model.half()

# =========================================================
# 백엔드 연동 설정
# =========================================================
BACKEND_URL = "http://127.0.0.1:8000/analysis"
ZONE_ID = "A"
SEND_INTERVAL_SEC = 1.0
last_send_time = 0

# 유튜브 주소 설정
VIDEO_URL = "https://www.youtube.com/watch?v=A2F-Iih1AQ0"

ydl_opts = {'format': 'best'}

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    info = ydl.extract_info(VIDEO_URL, download=False)
    VIDEO_PATH = info['url']

stream = cv2.VideoCapture(VIDEO_PATH)
VIDEO_FPS = stream.get(cv2.CAP_PROP_FPS) or 30.0
FRAME_DURATION = 1.0 / VIDEO_FPS

# =========================================================
# 2. 평지 기준 프레임워크 설정
# =========================================================
THRESHOLD_GREEN_TO_YELLOW = 0.5
THRESHOLD_YELLOW_TO_RED = 0.25

REAL_WIDTH = 8
REAL_HEIGHT = 21
ROI_AREA_M2 = REAL_WIDTH * REAL_HEIGHT

# =========================================================
# 3. 전역 공유 데이터
# =========================================================
shared_frame = None
shared_results = {'boxes': [], 'ids': []}
lock = threading.Lock()

# =========================================================
# 4. 백엔드 전송 함수
# =========================================================
def send_analysis_to_backend(zone_id, people_count, density, speed, slope=0):
    data = {
        "zone_id": zone_id,
        "people_count": people_count,
        "density": density,
        "speed": speed,
        "slope": slope
    }

    try:
        response = requests.post(BACKEND_URL, json=data, timeout=1)

        if response.status_code == 200:
            print("[BACKEND] 저장 성공:", response.json())
        else:
            print("[BACKEND] 저장 실패:", response.status_code, response.text)

    except requests.exceptions.RequestException as e:
        print("[BACKEND] 전송 실패:", e)


# =========================================================
# 5. ROI 설정
# =========================================================
ret, first_frame = stream.read()

if not ret:
    raise RuntimeError("영상을 불러올 수 없습니다.")

roi_rect = cv2.selectROI("1. Zone Selection", first_frame, False)
cv2.destroyWindow("1. Zone Selection")

rx, ry, rw, rh = roi_rect


# =========================================================
# 6. AI 분석 스레드
# =========================================================
def ai_worker():
    global shared_results

    while True:
        with lock:
            if shared_frame is None:
                continue

            working_frame = shared_frame[ry:ry + rh, rx:rx + rw].copy()

        results = model.track(
            working_frame,
            imgsz=640,
            conf=0.1,
            persist=True,
            tracker="bytetrack.yaml",
            classes=[0],
            verbose=False
        )[0]

        with lock:
            if results.boxes is not None and results.boxes.id is not None:
                shared_results['boxes'] = results.boxes.xyxy.cpu().numpy()
                shared_results['ids'] = results.boxes.id.cpu().numpy().astype(int)
            else:
                shared_results['boxes'] = []
                shared_results['ids'] = []


threading.Thread(target=ai_worker, daemon=True).start()


# =========================================================
# 7. 메인 루프
# =========================================================
while True:
    start_time = time.time()

    ret, frame = stream.read()

    if not ret:
        break

    with lock:
        shared_frame = frame.copy()
        curr_boxes = shared_results['boxes']
        curr_ids = shared_results['ids']

    display_crop = frame[ry:ry + rh, rx:rx + rw].copy()

    # =====================================================
    # 위험도 계산 로직
    # =====================================================
    current_count = len(curr_ids)

    if current_count > 0:
        m_per_person = ROI_AREA_M2 / current_count

        if m_per_person < THRESHOLD_YELLOW_TO_RED:
            status, color = "DANGER (RED)", (0, 0, 255)
        elif m_per_person < THRESHOLD_GREEN_TO_YELLOW:
            status, color = "CAUTION (YELLOW)", (0, 255, 255)
        else:
            status, color = "NORMAL (GREEN)", (0, 255, 0)
    else:
        m_per_person = float('inf')
        status, color = "NORMAL (GREEN)", (0, 255, 0)

    # =====================================================
    # 백엔드 전송용 데이터 계산
    # =====================================================
    density = current_count / ROI_AREA_M2

    # 현재 코드에는 실제 속도 계산이 없으므로 임시값 사용
    # 나중에 사람 이동거리 기반 속도 계산값으로 교체하면 됨
    speed = 1.0

    slope = 0

    now = time.time()

    if now - last_send_time >= SEND_INTERVAL_SEC:
        send_analysis_to_backend(
            zone_id=ZONE_ID,
            people_count=current_count,
            density=density,
            speed=speed,
            slope=slope
        )

        last_send_time = now

    # =====================================================
    # 시각화: 바운딩 박스
    # =====================================================
    for box, tid in zip(curr_boxes, curr_ids):
        x1, y1, x2, y2 = map(int, box)

        cv2.rectangle(display_crop, (x1, y1), (x2, y2), color, 2)
        cv2.putText(
            display_crop,
            f"ID:{tid}",
            (x1, y1 - 5),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.4,
            color,
            1
        )

    # =====================================================
    # 대시보드 UI
    # =====================================================
    overlay = display_crop.copy()
    cv2.rectangle(overlay, (0, 0), (280, 120), (0, 0, 0), -1)
    display_crop = cv2.addWeighted(overlay, 0.6, display_crop, 0.4, 0)

    cv2.putText(
        display_crop,
        f"STATUS: {status}",
        (10, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        color,
        2
    )

    cv2.putText(
        display_crop,
        f"Area: {ROI_AREA_M2:.1f} m2",
        (10, 55),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.5,
        (255, 255, 255),
        1
    )

    cv2.putText(
        display_crop,
        f"M(0): {m_per_person:.2f} m2/person",
        (10, 75),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.5,
        (255, 255, 255),
        1
    )

    cv2.putText(
        display_crop,
        f"People Count: {current_count}",
        (10, 95),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.5,
        (255, 255, 255),
        1
    )

    cv2.putText(
        display_crop,
        f"Density: {density:.3f} person/m2",
        (10, 115),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.5,
        (255, 255, 255),
        1
    )

    cv2.imshow("Crowd Safety Framework (Flat Ground)", display_crop)

    # FPS 유지
    elapsed = time.time() - start_time

    if elapsed < FRAME_DURATION:
        time.sleep(FRAME_DURATION - elapsed)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


stream.release()
cv2.destroyAllWindows()