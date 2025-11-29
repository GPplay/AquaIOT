'use client';

import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
    waterLevel: {
        label: 'Nivel Agua (m)',
        color: 'hsl(var(--chart-1))',
    },
    temperature: {
        label: 'Temp (°C)',
        color: 'hsl(var(--chart-2))',
    },
    pressure: {
        label: 'Presión (hPa)',
        color: 'hsl(var(--chart-3))',
    },
};

export function RealtimeChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas en Tiempo Real</CardTitle>
        <CardDescription>Últimas lecturas del dispositivo (actualizado cada 10s)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis yAxisId="left" stroke="hsl(var(--chart-1))" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="waterLevel"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="temperature"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
               <Line
                yAxisId="right"
                type="monotone"
                dataKey="pressure"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={false}
                hide
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
