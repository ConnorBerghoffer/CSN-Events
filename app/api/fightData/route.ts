// File: pages/api/fights/[fightuuid].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { access } from 'fs';
import { supabase } from '../createClient';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fightuuid } = req.query;  // Extracting fightuuid from the URL

  if (req.method === 'GET') {
    //TODO add a check to see if the user should have access to this fight,
    let access = true;
    if(!access){ 
      console.error('User tried to access a fight they shouldnt have acess to:');
      return res.status(500).json({ error: 'Failed to fetch fight: invalid user' });
    }



    // Fetch rows from the 'fights' table where 'eventUUID' matches 'fightuuid'
    const { data, error } = await supabase
      .from('fights')
      .select('*')
      .eq('eventUUID', fightuuid as string);

    if (error) {
      console.error('Error fetching fights:', error);
      return res.status(500).json({ error: 'Failed to fetch fights' });
    }

    // Return the data as JSON
    res.status(200).json(data);
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
