"use client";

import { LineChart, Line, ResponsiveContainer } from 'recharts';

export function Sparkline({ data, color = "#00c4cc" }: { data: number[], color?: string }) {
  const chartData = data.map((value, i) => ({ value, index: i }));

  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
