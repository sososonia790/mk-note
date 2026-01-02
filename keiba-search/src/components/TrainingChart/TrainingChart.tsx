/**
 * TrainingChart コンポーネント
 * Rechartsで調教タイムグラフ描画
 * Requirements: 3.3
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TrainingData } from '../../types';
import styles from './TrainingChart.module.css';

interface TrainingChartProps {
  trainings: TrainingData[];
  horseName?: string;
}

interface ChartDataPoint {
  date: string;
  slope?: number;
  cw?: number;
  course: 'slope' | 'cw';
}

/**
 * 調教データをグラフ用データに変換
 * 最終タイム（上がり）を使用
 */
export function transformToChartData(trainings: TrainingData[]): ChartDataPoint[] {
  // 日付でソート（古い順）
  const sorted = [...trainings].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sorted.map(training => {
    const lastTime = training.times[training.times.length - 1];
    return {
      date: training.date,
      [training.course]: lastTime,
      course: training.course,
    };
  });
}

/**
 * 日付を短縮形式にフォーマット (MM/DD)
 */
function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export const TrainingChart: React.FC<TrainingChartProps> = ({ trainings, horseName }) => {
  const chartData = transformToChartData(trainings);

  // Y軸の範囲を計算（タイムなので小さい方が良い）
  const allTimes = trainings.flatMap(t => t.times);
  const minTime = allTimes.length > 0 ? Math.floor(Math.min(...allTimes) - 0.5) : 11;
  const maxTime = allTimes.length > 0 ? Math.ceil(Math.max(...allTimes) + 0.5) : 14;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>調教タイム推移</h2>
        {horseName && <div className={styles.horseName}>{horseName}</div>}
      </div>
      {trainings.length === 0 ? (
        <div className={styles.emptyMessage}>調教データがありません</div>
      ) : (
        <>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDateShort}
                  stroke="#6c757d"
                  fontSize={12}
                />
                <YAxis
                  domain={[minTime, maxTime]}
                  reversed
                  stroke="#6c757d"
                  fontSize={12}
                  tickFormatter={(value) => `${value.toFixed(1)}秒`}
                />
                <Tooltip
                  formatter={(value: number | undefined) => value !== undefined ? [`${value.toFixed(1)}秒`, '上がりタイム'] : ['-', '上がりタイム']}
                  labelFormatter={(label) => `日付: ${label}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="slope"
                  stroke="#28A745"
                  strokeWidth={2}
                  dot={{ fill: '#28A745', strokeWidth: 2, r: 4 }}
                  connectNulls
                  name="坂路"
                />
                <Line
                  type="monotone"
                  dataKey="cw"
                  stroke="#0142C2"
                  strokeWidth={2}
                  dot={{ fill: '#0142C2', strokeWidth: 2, r: 4 }}
                  connectNulls
                  name="CW"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.slopeDot}`}></span>
              <span>坂路</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.cwDot}`}></span>
              <span>CW</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
