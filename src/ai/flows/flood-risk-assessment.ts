'use server';

/**
 * @fileOverview Assesses flood risk based on sensor data, historical data, and weather forecasts.
 *
 * - assessFloodRisk - A function that initiates the flood risk assessment process.
 * - FloodRiskAssessmentInput - The input type for the assessFloodRisk function.
 * - FloodRiskAssessmentOutput - The return type for the assessFloodRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FloodRiskAssessmentInputSchema = z.object({
  sensorData: z.string().describe('Real-time data from water level sensors.'),
  historicalData: z.string().describe('Historical flood data for the area.'),
  weatherForecast: z.string().describe('Weather forecast data for the next 24-48 hours.'),
});
export type FloodRiskAssessmentInput = z.infer<typeof FloodRiskAssessmentInputSchema>;

const FloodRiskAssessmentOutputSchema = z.object({
  riskLevel: z.enum(['low', 'medium', 'high']).describe('The assessed flood risk level.'),
  riskFactors: z.string().describe('Key factors contributing to the flood risk.'),
  recommendations: z.string().describe('Recommendations for preparedness and mitigation.'),
});
export type FloodRiskAssessmentOutput = z.infer<typeof FloodRiskAssessmentOutputSchema>;

export async function assessFloodRisk(input: FloodRiskAssessmentInput): Promise<FloodRiskAssessmentOutput> {
  return assessFloodRiskFlow(input);
}

const floodRiskAssessmentPrompt = ai.definePrompt({
  name: 'floodRiskAssessmentPrompt',
  input: {schema: FloodRiskAssessmentInputSchema},
  output: {schema: FloodRiskAssessmentOutputSchema},
  prompt: `You are an AI-powered flood risk assessment tool. Analyze the provided sensor data, historical data, and weather forecasts to determine the current and near-future risk of flooding.

Sensor Data: {{{sensorData}}}
Historical Data: {{{historicalData}}}
Weather Forecast: {{{weatherForecast}}}

Based on this information, determine the risk level (low, medium, or high), identify the key risk factors, and provide recommendations for preparedness and mitigation.

Ensure that the output matches the FloodRiskAssessmentOutputSchema, with descriptions from the schema being used when determining the values to set.`, 
});

const assessFloodRiskFlow = ai.defineFlow(
  {
    name: 'assessFloodRiskFlow',
    inputSchema: FloodRiskAssessmentInputSchema,
    outputSchema: FloodRiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await floodRiskAssessmentPrompt(input);
    return output!;
  }
);
