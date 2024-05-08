import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../createClient';
import { NextResponse } from 'next/server';

export async function GET(
  req: NextApiRequest
) {
    // Fetch all rows from the 'events' table
    const { data, error } = await supabase
      .from('events')
      .select('*');

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json({ error: 'Failed to fetch events' });
    }

    // Return the data as JSON
    return NextResponse.json(data);
}