'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { time: 'Hace 6h', level: 1.8 },
  { time: 'Hace 5h', level: 1.9 },
  { time: 'Hace 4h', level: 2.1 },
  { time: 'Hace 3h', level: 2.2 },
  { time: 'Hace 2h', level: 2.4 },
  { time: 'Hace 1h', level: 2.3 },
  { time: 'Ahora', level: 2.5 },
];

const chartConfig = {
    level: {
        label: 'Nivel del Agua',
        color: 'hsl(var(--primary))',
    },
};

export function WaterLevelChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia del Nivel del Agua</CardTitle>
        <CardDescription>Nivel del agua en las últimas 6 horas</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis unit="m" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="level" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
