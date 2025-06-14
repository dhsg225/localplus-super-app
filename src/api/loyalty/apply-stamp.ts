import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Generic Express-style handler
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;
    // TODO: Verify QR payload signature, timestamp, and replay protection
    // For now, assume payload contains: { user_id, loyalty_program_id }
    const { user_id, loyalty_program_id } = typeof payload === 'string' ? JSON.parse(payload) : payload;
    if (!user_id || !loyalty_program_id) {
      return res.status(400).json({ error: 'Missing user_id or loyalty_program_id' });
    }

    // Fetch user's current stamps
    const { data: userStamp, error: fetchError } = await supabase
      .from('user_loyalty_stamps')
      .select('*')
      .eq('user_id', user_id)
      .eq('loyalty_program_id', loyalty_program_id)
      .single();
    if (fetchError) {
      return res.status(404).json({ error: 'Loyalty card not found' });
    }

    // Update stamps_collected and last_stamp_at
    const newStamps = (userStamp.stamps_collected || 0) + 1;
    const isCompleted = newStamps >= userStamp.stamps_required;
    const { error: updateError } = await supabase
      .from('user_loyalty_stamps')
      .update({
        stamps_collected: newStamps,
        last_stamp_at: new Date().toISOString(),
        is_completed: isCompleted,
        completed_at: isCompleted && !userStamp.completed_at ? new Date().toISOString() : userStamp.completed_at
      })
      .eq('id', userStamp.id);
    if (updateError) {
      return res.status(500).json({ error: 'Failed to update stamps' });
    }

    // TODO: Log stamp transaction in stamp_transactions table

    return res.status(200).json({ success: true, newStamps, isCompleted });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
} 