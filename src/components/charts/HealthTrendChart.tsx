"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function HealthTrendChart({ data, dataKey }: { data: any[]; dataKey: string }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
