import './Graph.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import type { GraphDataPoint } from '@/modules/graph';

/**
 * Customization options for bar columns
 */
export interface BarColumnOptions {
  /** Fill color of the bars (can be hex, rgb, or gradient id) */
  fill?: string;
  /** Stroke color of the bars */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Border radius for rounded corners */
  radius?: number | [number, number, number, number];
  /** Bar width (auto if not specified) */
  barSize?: number;
  /** Minimum bar height */
  minPointSize?: number;
  /** Animation duration in milliseconds */
  animationDuration?: number;
}

/**
 * Graph component options
 */
export interface GraphOptions {
  /** Show grid lines */
  showGrid?: boolean;
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Show X axis */
  showXAxis?: boolean;
  /** Show Y axis */
  showYAxis?: boolean;
  /** X axis label */
  xAxisLabel?: string;
  /** Y axis label */
  yAxisLabel?: string;
  /** Bar column customization options */
  barOptions?: BarColumnOptions;
  /** Chart height */
  height?: number;
  /** Chart margin */
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

interface GraphProps {
  /** Array of data points to display */
  data: GraphDataPoint[];
  /** Graph configuration options */
  options?: GraphOptions;
}

function Graph(props: GraphProps) {
  const { data, options = {} } = props;

  // Default options
  const {
    showGrid = false,
    showTooltip = true,
    showXAxis = true,
    showYAxis = false,
    xAxisLabel,
    yAxisLabel,
    barOptions = {},
    height = 300,
    margin = { top: 15, right: 10, left: 10, bottom: 0 },
  } = options;

  // Default bar options
  const {
    fill = '#8884d8',
    stroke = '#8884d8',
    strokeWidth = 0,
    radius = 4,
    barSize,
    minPointSize = 0,
    animationDuration = 800,
  } = barOptions;

  // Transform data for Recharts format
  const chartData = data.map((point) => {
    // Ensure time is a Date object (handle serialization issues)
    const time = point.time instanceof Date ? point.time : new Date(point.time);
    
    return {
      time: time,
      value: point.value,
      // Format time for display
      timeLabel: time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  });

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="graph-empty">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="graph-container">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={margin}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
          
          {showXAxis && (
            <XAxis
              dataKey="timeLabel"
              label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
              tick={{ fontSize: 12 }}
            />
          )}
          
          {showYAxis && (
            <YAxis
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              tick={{ fontSize: 12 }}
            />
          )}
          
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              labelFormatter={(label) => `Time: ${label}`}
              formatter={(value: number) => [value.toFixed(2), 'Value']}
            />
          )}
          
          <Bar
            dataKey="value"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            radius={radius}
            barSize={barSize}
            minPointSize={minPointSize}
            animationDuration={animationDuration}
          >
            <LabelList
              dataKey="value"
              position="top"
              fill="#666"
              fontSize={12}
              formatter={(value: unknown) => {
                if (typeof value === 'number') {
                  return value.toFixed(0);
                }
                return String(value);
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Graph;
