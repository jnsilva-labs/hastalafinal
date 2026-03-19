const { getSupabase } = require('../../lib/supabase');

// Restrict admin CORS to same-origin only
function getCorsOrigin(req) {
  const origin = req.headers.origin || '';
  const allowed = [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]
    .filter(Boolean)
    .map(u => u.startsWith('http') ? u : 'https://' + u);
  // Allow same-origin, Vercel preview URLs, and localhost for dev
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
  // Build CORS headers with origin check
  const corsHeaders = { ...CORS_HEADERS_BASE, 'Access-Control-Allow-Origin': getCorsOrigin(req) };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    return res.end();
  }

  // Set CORS headers on all responses
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));

  // GET: usage info
  if (req.method === 'GET') {
    return res.status(200).json({
      endpoint: '/api/tweets/fetch',
      method: 'POST',
      description: 'Fetch tweets from X API and upsert into Supabase. Requires x-admin-password header.',
    });
  }

  // POST: fetch tweets from X API
  if (req.method === 'POST') {
    // Verify admin password
    const password = req.headers['x-admin-password'];
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check Supabase
    const supabase = getSupabase(true);
    if (!supabase) {
      return res.status(503).json({ error: 'Supabase not configured' });
    }

    // Check X API bearer token
    const bearerToken = process.env.X_BEARER_TOKEN || process.env.X_API_BEARER_TOKEN;
    if (!bearerToken) {
      return res.status(503).json({ error: 'X API bearer token not configured' });
    }

    try {
      // Call X API v2 recent search
      const query = encodeURIComponent('#HastaLaFinal -is:retweet');
      const fields = 'tweet.fields=created_at,author_id,text&expansions=author_id&user.fields=name,username,profile_image_url';
      const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&${fields}&max_results=20`;

      const xResponse = await fetch(url, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });

      if (!xResponse.ok) {
        const errorBody = await xResponse.text();
        return res.status(502).json({
          error: 'X API request failed',
          status: xResponse.status,
          detail: errorBody,
        });
      }

      const data = await xResponse.json();

      if (!data.data || data.data.length === 0) {
        return res.status(200).json({ message: 'No tweets found', count: 0 });
      }

      // Build user lookup map from includes
      const users = {};
      if (data.includes && data.includes.users) {
        for (const u of data.includes.users) {
          users[u.id] = {
            display_name: u.name,
            handle: u.username,
            avatar_url: u.profile_image_url || null,
          };
        }
      }

      // Prepare rows for upsert
      const rows = data.data.map((tweet) => {
        const user = users[tweet.author_id] || {};
        return {
          tweet_id: tweet.id,
          author_id: tweet.author_id,
          display_name: user.display_name || 'Unknown',
          handle: user.handle || 'unknown',
          avatar_url: user.avatar_url || null,
          text: tweet.text,
          created_at: tweet.created_at,
          status: 'pending',
        };
      });

      // Upsert into Supabase (don't overwrite status if tweet already exists)
      const { error: upsertError } = await supabase
        .from('tweets')
        .upsert(rows, { onConflict: 'tweet_id', ignoreDuplicates: true });

      if (upsertError) {
        return res.status(500).json({ error: 'Supabase upsert failed', detail: upsertError.message });
      }

      return res.status(200).json({ message: 'Tweets fetched and stored', count: rows.length });
    } catch (err) {
      return res.status(500).json({ error: 'Internal error', detail: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
