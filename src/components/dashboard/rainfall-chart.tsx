'use client';

import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { date: 'Lun', rainfall: 4 },
  { date: 'Mar', rainfall: 3 },
  { date: 'Mié', rainfall: 9 },
  { date: 'Jue', rainfall: 5 },
  { date: 'Vie', rainfall: 12 },
  { date: 'Sáb', rainfall: 8 },
  { date: 'Dom', rainfall: 15 },
];

const chartConfig = {
    rainfall: {
        label: 'Precipitación',
        color: 'hsl(var(--accent))',
    },
};

export function RainfallChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Precipitación Semanal</CardTitle>
        <CardDescription>Acumulación de precipitación en los últimos 7 días</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis unit="mm" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                type="monotone"
                dataKey="rainfall"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{
                  fill: 'hsl(var(--chart-2))',
                  r: 4,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
