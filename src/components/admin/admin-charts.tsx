"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminCharts({ data }: { data: any[] }) {
    return (
        <div style={{ width: '100%', height: 300 }}>
            {data.length > 0 ? (
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Legend />
                        <Bar dataKey="users" fill="#3b82f6" name="Total Users" />
                        <Bar dataKey="exams" fill="#10b981" name="Exams Taken" />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    No Data
                </div>
            )}
        </div>
    );
}
