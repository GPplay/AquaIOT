'use server';

import { assessFloodRisk, type FloodRiskAssessmentInput, type FloodRiskAssessmentOutput } from '@/ai/flows/flood-risk-assessment';

export async function getFloodRiskAssessment(input: FloodRiskAssessmentInput): Promise<FloodRiskAssessmentOutput | { error: string }> {
  try {
    const result = await assessFloodRisk(input);
    return result;
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unknown error occurred.' };
  }
}
