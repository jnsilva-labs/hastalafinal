const { getSupabase } = require('../../lib/supabase');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const PLACEHOLDER_TWEETS = [
  {
    display_name: 'Coming Soon',
    handle: 'HastaLaFinal',
    text: 'Las voces llegan esta noche... / Voices arrive tonight...',
    avatar_url: null,
  },
];

module.exports = async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  // Set CORS headers on all responses
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check Supabase — if not configured, return placeholder
  const supabase = getSupabase(false);
  if (!supabase) {
    return res.status(200).json(PLACEHOLDER_TWEETS);
  }

  try {
    const { data, error } = await supabase
      .from('tweets')
      .select('display_name, handle, text, avatar_url, created_at, tweet_id')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase query error:', error.message);
      return res.status(200).json(PLACEHOLDER_TWEETS);
    }

    if (!data || data.length === 0) {
      return res.status(200).json(PLACEHOLDER_TWEETS);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Approved tweets error:', err.message);
    return res.status(200).json(PLACEHOLDER_TWEETS);
  }
};
