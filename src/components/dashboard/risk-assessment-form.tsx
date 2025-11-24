'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getFloodRiskAssessment } from '@/app/actions';
import { ShieldCheck, ShieldAlert, Loader2, Bot } from 'lucide-react';
import type { FloodRiskAssessmentOutput } from '@/ai/flows/flood-risk-assessment';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  sensorData: z.string().min(10, 'Please provide more detailed sensor data.'),
  historicalData: z.string().min(10, 'Please provide more detailed historical data.'),
  weatherForecast: z.string().min(10, 'Please provide more detailed weather forecast data.'),
});

type FormValues = z.infer<typeof formSchema>;

const riskIcons = {
  low: <ShieldCheck className="h-5 w-5 text-green-500" />,
  medium: <ShieldAlert className="h-5 w-5 text-yellow-500" />,
  high: <ShieldAlert className="h-5 w-5 text-red-500" />,
};

const riskVariants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined } = {
  low: 'default',
  medium: 'default',
  high: 'destructive',
};

const riskTextColors = {
    low: 'text-green-600 dark:text-green-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    high: 'text-red-600 dark:text-red-400',
}

export function RiskAssessmentForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FloodRiskAssessmentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sensorData: 'Current water level is 2.5m, flow rate is 15 m³/s.',
      historicalData: 'Minor flooding occurred last year at 3.0m. Major flooding at 4.5m in 2018.',
      weatherForecast: 'Heavy rainfall (20-30mm) expected in the next 12 hours. Thunderstorms possible.',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);
    const response = await getFloodRiskAssessment(values);
    if ('error' in response) {
      setError(response.error);
    } else {
      setResult(response);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="col-span-1 flex flex-col md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Assessment</CardTitle>
            <Bot className="text-muted-foreground h-5 w-5"/>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            {result ? (
                <div className={cn("text-2xl font-bold flex items-center gap-2", riskTextColors[result.riskLevel])}>
                    {riskIcons[result.riskLevel]}
                    <span className="capitalize">{result.riskLevel} Risk</span>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">Run assessment for the latest flood risk projection.</p>
            )}
        </CardContent>
        <div className="border-t p-4 pt-2">
            <DialogTrigger asChild>
                <Button className="w-full" size="sm">Assess Risk</Button>
            </DialogTrigger>
        </div>
      </Card>
      
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">AI Flood Risk Assessment</DialogTitle>
          <DialogDescription>
            Input the latest data to generate a new risk assessment. The AI will analyze the inputs to predict the flood risk level.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sensorData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Real-time Sensor Data</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Current water level is 2.5m..." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="historicalData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Flood Data</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Minor flooding occurred last year at 3.0m..." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weatherForecast"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weather Forecast</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Heavy rainfall (20-30mm) expected..." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Generate Assessment
              </Button>
            </DialogFooter>
          </form>
        </Form>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Assessment Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {result && (
          <div className="mt-6 space-y-4 rounded-lg border bg-muted/50 p-4">
            <h3 className="font-headline text-lg">Assessment Result</h3>
            <div className="flex items-center gap-2">
                <p className="font-medium">Risk Level:</p>
                <Badge variant={riskVariants[result.riskLevel]} className="capitalize text-base">
                    {riskIcons[result.riskLevel]}
                    {result.riskLevel}
                </Badge>
            </div>
            <div>
                <h4 className="font-semibold">Key Risk Factors</h4>
                <p className="text-sm text-muted-foreground">{result.riskFactors}</p>
            </div>
            <div>
                <h4 className="font-semibold">Recommendations</h4>
                <p className="text-sm text-muted-foreground">{result.recommendations}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
