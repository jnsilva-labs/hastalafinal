const { getSupabase } = require('../../lib/supabase');

// Restrict admin CORS to same-origin only
function getCorsOrigin(req) {
  const origin = req.headers.origin || '';
  const allowed = [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]
    .filter(Boolean)
    .map(u => u.startsWith('http') ? u : 'https://' + u);
  if (!origin || origin.includes('localhost') || origin.includes('.vercel.app') || allowed.includes(origin)) {
    return origin || '*';
  }
  return 'null';
}

const CORS_HEADERS_BASE = {
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-password',
};

module.exports = async function handler(req, res) {
  const corsHeaders = { ...CORS_HEADERS_BASE, 'Access-Control-Allow-Origin': getCorsOrigin(req) };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    return res.end();
  }

  // Set CORS headers on all responses
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));

  // Verify admin password for both GET and POST
  const password = req.headers['x-admin-password'];
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check Supabase
  const supabase = getSupabase(true);
  if (!supabase) {
    return res.status(503).json({ error: 'Supabase not configured' });
  }

  // GET: return all pending tweets
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('tweets')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: 'Query failed', detail: error.message });
      }

      return res.status(200).json(data || []);
    } catch (err) {
      return res.status(500).json({ error: 'Internal error', detail: err.message });
    }
  }

  // POST: approve or reject a tweet
  if (req.method === 'POST') {
    try {
      const { tweet_id, action } = req.body || {};

      if (!tweet_id || !action) {
        return res.status(400).json({ error: 'Missing tweet_id or action' });
      }

      if (action !== 'approved' && action !== 'rejected') {
        return res.status(400).json({ error: 'Action must be "approved" or "rejected"' });
      }

      const { error } = await supabase
        .from('tweets')
        .update({ status: action })
        .eq('tweet_id', tweet_id);

      if (error) {
        return res.status(500).json({ error: 'Update failed', detail: error.message });
      }

      return res.status(200).json({ success: true, tweet_id, status: action });
    } catch (err) {
      return res.status(500).json({ error: 'Internal error', detail: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
