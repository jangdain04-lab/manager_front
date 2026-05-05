import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Polyline,
  Line,
  Text as SvgText,
} from 'react-native-svg';
import { Colors } from '../../components/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_MARGIN = 24;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;
const CHART_WIDTH = CARD_WIDTH - 40;
const CHART_HEIGHT = 230;

type RiskLevel = 'critical' | 'warning' | 'safe';

interface PredictionItem {
  id: string;
  sector: string;
  time: string;
  level: RiskLevel;
  count: number;
  progress: number;
  icon: keyof typeof Ionicons.glyphMap;
  values: number[];
}

const PREDICTIONS: PredictionItem[] = [
  {
    id: '1',
    sector: '백년관 버정길',
    time: '5분 후',
    level: 'critical',
    count: 58,
    progress: 82,
    icon: 'trending-up',
    values: [22, 30, 35, 38, 42, 45, 48, 52, 55, 58],
  },
  {
    id: '2',
    sector: '공대 흡연부스 옆',
    time: '10분 후',
    level: 'critical',
    count: 62,
    progress: 88,
    icon: 'trending-up',
    values: [21, 29, 34, 38, 42, 45, 46, 50, 54, 62],
  },
  {
    id: '3',
    sector: '공대-백년관 사이',
    time: '18분 후',
    level: 'warning',
    count: 42,
    progress: 61,
    icon: 'pulse',
    values: [22, 29, 34, 38, 42, 45, 47, 49, 51, 43],
  },
  {
    id: '4',
    sector: '자연과학대 앞',
    time: '25분 후',
    level: 'warning',
    count: 38,
    progress: 55,
    icon: 'trending-up',
    values: [22, 29, 34, 37, 42, 45, 47, 49, 51, 40],
  },
  {
    id: '5',
    sector: '인경관 주차장 입구',
    time: '30분 후',
    level: 'safe',
    count: 28,
    progress: 40,
    icon: 'pulse',
    values: [22, 29, 34, 37, 42, 45, 47, 49, 51, 29],
  },
  {
    id: '6',
    sector: '백년관 잔디구장',
    time: '45분 후',
    level: 'safe',
    count: 24,
    progress: 34,
    icon: 'trending-down',
    values: [22, 29, 34, 37, 42, 45, 47, 49, 51, 25],
  },
];

function getLevelText(level: RiskLevel) {
  if (level === 'critical') return '위험';
  if (level === 'warning') return '주의';
  return '양호';
}

function getLevelColor(level: RiskLevel) {
  if (level === 'critical') return '#E93035';
  if (level === 'warning') return '#F59E0B';
  return '#16A34A';
}

function getLevelBg(level: RiskLevel) {
  if (level === 'critical') return '#FFF1F1';
  if (level === 'warning') return '#FFF8E8';
  return '#ECFDF3';
}

function getLevelBorder(level: RiskLevel) {
  if (level === 'critical') return '#F6CACA';
  if (level === 'warning') return '#F6E2A9';
  return '#BFEFD1';
}

function PredictionChart({
  color,
  values,
}: {
  color: string;
  values: number[];
}) {
  const leftPad = 38;
  const rightPad = 18;
  const topPad = 22;
  const bottomPad = 34;

  const graphW = CHART_WIDTH - leftPad - rightPad;
  const graphH = CHART_HEIGHT - topPad - bottomPad;

  const max = 70;
  const currentIndex = 5;

  const getX = (index: number) =>
    leftPad + (index / (values.length - 1)) * graphW;

  const getY = (value: number) =>
    topPad + graphH - (value / max) * graphH;

  const pastPoints = values
    .slice(0, currentIndex + 1)
    .map((v, i) => `${getX(i)},${getY(v)}`)
    .join(' ');

  const futurePoints = values
    .slice(currentIndex)
    .map((v, i) => `${getX(i + currentIndex)},${getY(v)}`)
    .join(' ');

  const currentX = getX(currentIndex);

  return (
    <View style={styles.chartWrap}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {[0, 20, 40, 60].map(v => {
          const y = getY(v);

          return (
            <React.Fragment key={v}>
              <Line
                x1={leftPad}
                y1={y}
                x2={CHART_WIDTH - rightPad}
                y2={y}
                stroke="#E4E7EB"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <SvgText
                x={leftPad - 12}
                y={y + 4}
                fontSize="10"
                fill="#8B95A1"
                textAnchor="end"
              >
                {v}
              </SvgText>
            </React.Fragment>
          );
        })}

        <Line
          x1={currentX}
          y1={topPad}
          x2={currentX}
          y2={CHART_HEIGHT - bottomPad}
          stroke="#8B95A1"
          strokeWidth="2"
          strokeDasharray="6 6"
        />

        <SvgText
          x={currentX}
          y={topPad - 5}
          fontSize="9"
          fill="#8B95A1"
          textAnchor="middle"
        >
          현재
        </SvgText>

        <Polyline
          points={pastPoints}
          fill="none"
          stroke="#2F80ED"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <Polyline
          points={futurePoints}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="6 6"
        />

        {['25분전', '15분전', '5분전', '현재', '+5분', '+10분', '+20분'].map(
          (label, i) => {
            const mappedIndex = i === 0 ? 0 : i === 1 ? 2 : i === 2 ? 4 : i === 3 ? 5 : i === 4 ? 6 : i === 5 ? 7 : 9;

            return (
              <SvgText
                key={label}
                x={getX(mappedIndex)}
                y={CHART_HEIGHT - 10}
                fontSize="10"
                fill="#8B95A1"
                textAnchor="middle"
              >
                {label}
              </SvgText>
            );
          },
        )}
      </Svg>

      <View style={styles.legendDivider} />

      <View style={styles.chartLegendRow}>
        <View style={styles.chartLegendItem}>
          <View style={[styles.legendLine, { backgroundColor: '#2F80ED' }]} />
          <Text style={styles.chartLegendText}>과거 데이터</Text>
        </View>

        <View style={styles.chartLegendItem}>
          <View style={[styles.legendDashed, { borderColor: color }]} />
          <Text style={styles.chartLegendText}>예측 데이터</Text>
        </View>
      </View>
    </View>
  );
}

function PredictionCard({
  item,
  expanded,
  onPress,
}: {
  item: PredictionItem;
  expanded: boolean;
  onPress: () => void;
}) {
  const color = getLevelColor(item.level);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.predictionCard,
        {
          backgroundColor: getLevelBg(item.level),
          borderColor: getLevelBorder(item.level),
        },
      ]}
    >
      <View style={styles.cardMainArea}>
        <View style={styles.predictionTop}>
          <View style={styles.predictionTitleRow}>
            <Ionicons name={item.icon} size={18} color={color} />
            <Text style={styles.predictionTitle}>{item.sector}</Text>
          </View>

          <View style={[styles.countBadge, { backgroundColor: color }]}>
            <Text style={styles.countBadgeText}>{item.count}명</Text>
          </View>
        </View>

        <Text style={styles.predictionSubText}>
          {item.time}{' '}
          <Text style={{ color, fontWeight: '900' }}>
            {getLevelText(item.level)}
          </Text>{' '}
          예상
        </Text>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${item.progress}%` as any,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      </View>

      {expanded && (
        <View style={styles.expandedArea}>
          <Text style={styles.chartTitle}>혼잡도 예측 그래프</Text>
          <PredictionChart color={color} values={item.values} />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function SectorMonitoring() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleCard = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>위험도 예측 그래프</Text>
          <Text style={styles.subtitle}>실시간 혼잡도 예측</Text>
        </View>

        <View style={styles.content}>
          {PREDICTIONS.map(item => (
            <PredictionCard
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onPress={() => toggleCard(item.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingBottom: 112,
  },
  header: {
    paddingHorizontal: 28,
    paddingTop: 76,
    paddingBottom: 32,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 6,
  },

  predictionCard: {
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  cardMainArea: {
    padding: 14,
  },
  predictionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  predictionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingRight: 10,
  },
  predictionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -0.25,
  },
  countBadge: {
    minWidth: 58,
    height: 38,
    borderRadius: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
  predictionSubText: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    marginTop: 14,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },

  expandedArea: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 8,
  },
  chartWrap: {
    alignItems: 'center',
  },
  legendDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.07)',
    marginTop: 2,
    marginBottom: 12,
  },
  chartLegendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
  },
  chartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendLine: {
    width: 24,
    height: 2,
    borderRadius: 2,
  },
  legendDashed: {
    width: 24,
    height: 0,
    borderTopWidth: 2,
    borderStyle: 'dashed',
  },
  chartLegendText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
});