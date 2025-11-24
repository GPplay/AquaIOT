'use client';

import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { date: 'Mon', rainfall: 4 },
  { date: 'Tue', rainfall: 3 },
  { date: 'Wed', rainfall: 9 },
  { date: 'Thu', rainfall: 5 },
  { date: 'Fri', rainfall: 12 },
  { date: 'Sat', rainfall: 8 },
  { date: 'Sun', rainfall: 15 },
];

const chartConfig = {
    rainfall: {
        label: 'Rainfall',
        color: 'hsl(var(--accent))',
    },
};

export function RainfallChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Rainfall</CardTitle>
        <CardDescription>Rainfall accumulation over the last 7 days</CardDescription>
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
