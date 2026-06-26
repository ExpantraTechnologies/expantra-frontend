import type { NextApiRequest, NextApiResponse } from 'next';
import { RestaurantOrchestrator } from '../../../services/restaurantOrchestrator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const result = await RestaurantOrchestrator.handleIntent(req.body);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Restaurant intent error', err);
    return res.status(500).json({ error: 'internal_error' });
  }
}
