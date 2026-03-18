/* ===== tweets.js — Voces de Venezuela Tweet Wall ===== */
/* Hasta la Final — Venezuela WBC 2026 */
/* Fetches approved tweets from Supabase, falls back to placeholders */

(function () {
  'use strict';

  var grid = document.getElementById('voces-grid');
  if (!grid) return;

  // -------------------------------------------------------
  // Supabase config
  // -------------------------------------------------------
  var SUPABASE_URL = 'https://aepcfyhjazijcaargtmy.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlcGNmeWhqYXppamNhYXJndG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDE3NDEsImV4cCI6MjA4OTM3Nzc0MX0.s9yVgSQx8AExoiN5SuLNoKR12_nVSTGRwzvSNe5tcZM';

  // -------------------------------------------------------
  // Placeholder tweets (shown when no approved tweets exist)
  // -------------------------------------------------------
  var PLACEHOLDER_TWEETS = [
    { display_name: 'Voces de Venezuela', handle: 'HastaLaFinal', text: 'Las voces llegan esta noche... Voices arrive tonight...', avatar_url: null, isHero: true },
    { display_name: '\u{1F1FB}\u{1F1EA}', handle: 'Venezuela', text: 'Preparados para la historia. Ready to make history.', avatar_url: null },
    { display_name: '\u26BE', handle: 'WBC2026', text: 'Esta noche se escribe un nuevo cap\u00EDtulo. Tonight, a new chapter is written.', avatar_url: null },
    { display_name: '\u{1F30E}', handle: 'Diaspora', text: 'Desde cada rinc\u00F3n del mundo. From every corner of the world.', avatar_url: null },
    { display_name: '\u{1F525}', handle: 'HastaLaFinal', text: 'Sal\u00ED de Venezuela hace 6 a\u00F1os. Esta noche, por primera vez, no me siento lejos.', avatar_url: null },
    { display_name: '\u2764\uFE0F', handle: 'VenezuelaWBC', text: 'My kids were born here. They\'ve never been to Venezuela. But tonight they\'re screaming VAMOS louder than anyone.', avatar_url: null },
    { display_name: '\u{1F319}', handle: 'MadridVzla', text: 'Son las 2 de la ma\u00F1ana en Madrid y todo el edificio est\u00E1 despierto.', avatar_url: null },
    { display_name: '\u2B50', handle: 'MiamiVzla', text: 'El barrio entero est\u00E1 en la calle. Never felt more Venezuelan in my life.', avatar_url: null },
  ];

  var refreshTimer = null;
  // Track IDs we've already rendered so we can detect & animate new arrivals
  var renderedIds = new Set();

  // -------------------------------------------------------
  // Utilities
  // -------------------------------------------------------

  /** Escape HTML entities to prevent XSS */
  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // -------------------------------------------------------
  // Fetch approved tweets from Supabase REST API
  // -------------------------------------------------------
  async function fetchApprovedTweets() {
    try {
      var res = await fetch(
        SUPABASE_URL + '/rest/v1/tweets?status=eq.approved&order=approved_at.desc&limit=25',
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          }
        }
      );
      if (!res.ok) throw new Error('Supabase API error: ' + res.status);
      var tweets = await res.json();
      return tweets.length > 0 ? tweets : null;
    } catch (_err) {
      return null;
    }
  }

  // -------------------------------------------------------
  // Normalize tweet data (Supabase row -> render-friendly)
  // -------------------------------------------------------
  function normalizeTweet(row) {
    return {
      id: row.id || null,
      display_name: row.display_name || row.handle || 'Anon',
      handle: row.handle || 'anon',
      text: row.text || row.tweet_text || '',
      avatar_url: row.avatar_url || null,
      tweet_id: row.tweet_id || null,
      isHero: false,
    };
  }

  // -------------------------------------------------------
  // Render a single tweet card
  // -------------------------------------------------------
  function renderTweet(tweet, index) {
    var isHero = index === 0 || tweet.isHero;
    var card = document.createElement('article');
    card.className = 'tweet-card' + (isHero ? ' tweet-card--hero' : '');
    card.setAttribute('aria-label', 'Tweet from @' + escapeHTML(tweet.handle));
    if (tweet.id) card.setAttribute('data-tweet-id', tweet.id);

    // --- Avatar ---
    var avatarHTML;
    if (tweet.avatar_url) {
      avatarHTML = '<img class="tweet-card__avatar" '
        + 'src="' + escapeHTML(tweet.avatar_url) + '" '
        + 'alt="' + escapeHTML(tweet.display_name) + '" '
        + 'loading="lazy" width="44" height="44">';
    } else {
      var initial = (tweet.display_name || '?').charAt(0);
      avatarHTML = '<span class="tweet-card__avatar tweet-card__avatar--placeholder" aria-hidden="true">'
        + escapeHTML(initial)
        + '</span>';
    }

    // --- Header (avatar + name + handle) ---
    var headerHTML = '<header class="tweet-card__header">'
      + avatarHTML
      + '<div class="tweet-card__identity">'
      +   '<span class="tweet-card__name">' + escapeHTML(tweet.display_name) + '</span>'
      +   '<span class="tweet-card__handle">@' + escapeHTML(tweet.handle) + '</span>'
      + '</div>'
      + '</header>';

    // --- Body ---
    var bodyHTML = '<p class="tweet-card__text">' + escapeHTML(tweet.text) + '</p>';

    // --- Footer (optional link to X/Twitter) ---
    var footerHTML = '';
    if (tweet.tweet_id) {
      footerHTML = '<footer class="tweet-card__footer">'
        + '<a class="tweet-card__link" '
        +   'href="https://x.com/i/status/' + escapeHTML(tweet.tweet_id) + '" '
        +   'target="_blank" rel="noopener noreferrer" '
        +   'aria-label="View on X">'
        +   'View on X'
        + '</a>'
        + '</footer>';
    }

    card.innerHTML = headerHTML + bodyHTML + footerHTML;
    return card;
  }

  // -------------------------------------------------------
  // GSAP staggered reveal animation
  // -------------------------------------------------------
  function animateCards() {
    var cards = gsap.utils.toArray('.tweet-card');
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: 30 });

    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '#voces',
        start: 'top 75%',
        once: true,
      },
    });
  }

  /** Animate newly appended cards */
  function animateNewCards(cards) {
    if (!cards.length) return;
    gsap.from(cards, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.08,
    });
  }

  // -------------------------------------------------------
  // Full render (initial load or full replacement)
  // -------------------------------------------------------
  function renderAll(tweets) {
    grid.innerHTML = '';
    renderedIds.clear();

    var fragment = document.createDocumentFragment();
    tweets.forEach(function (tweet, i) {
      fragment.appendChild(renderTweet(tweet, i));
      if (tweet.id) renderedIds.add(tweet.id);
    });
    grid.appendChild(fragment);
  }

  // -------------------------------------------------------
  // Poll: fetch new tweets and append/replace as needed
  // -------------------------------------------------------
  async function pollForUpdates() {
    var supabaseTweets = await fetchApprovedTweets();
    if (!supabaseTweets) return; // API error or no tweets — keep current view

    var normalized = supabaseTweets.map(normalizeTweet);

    // Check if we're currently showing placeholders (no data-tweet-id attrs)
    var isShowingPlaceholders = !grid.querySelector('[data-tweet-id]');

    if (isShowingPlaceholders) {
      // Replace placeholders with real tweets
      renderAll(normalized);
      gsap.from(gsap.utils.toArray('.tweet-card'), {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.06,
      });
      return;
    }

    // Find new tweets that haven't been rendered yet
    var newTweets = normalized.filter(function (t) {
      return t.id && !renderedIds.has(t.id);
    });

    if (newTweets.length > 0) {
      // Prepend new tweets at the top of the grid
      var newCards = [];
      newTweets.forEach(function (tweet) {
        var card = renderTweet(tweet, 0); // index 0 for styling consistency
        grid.insertBefore(card, grid.firstChild);
        newCards.push(card);
        if (tweet.id) renderedIds.add(tweet.id);
      });
      animateNewCards(newCards);
    }
  }

  // -------------------------------------------------------
  // Supabase Realtime subscription (optional enhancement)
  // Uses Supabase Realtime over WebSocket for instant updates
  // -------------------------------------------------------
  function subscribeToRealtime() {
    // Build the Realtime WebSocket URL
    var realtimeUrl = SUPABASE_URL.replace('https://', 'wss://') + '/realtime/v1/websocket?apikey=' + SUPABASE_ANON_KEY + '&vsn=1.0.0';

    try {
      var ws = new WebSocket(realtimeUrl);
      var heartbeatRef = 0;
      var heartbeatInterval = null;
      var channelTopic = 'realtime:public:tweets';

      ws.onopen = function () {
        // Join the channel for tweets table changes
        ws.send(JSON.stringify({
          topic: channelTopic,
          event: 'phx_join',
          payload: {
            config: {
              postgres_changes: [{
                event: 'UPDATE',
                schema: 'public',
                table: 'tweets',
                filter: 'status=eq.approved'
              }, {
                event: 'INSERT',
                schema: 'public',
                table: 'tweets',
                filter: 'status=eq.approved'
              }]
            }
          },
          ref: '1'
        }));

        // Start heartbeat to keep connection alive
        heartbeatInterval = setInterval(function () {
          heartbeatRef++;
          ws.send(JSON.stringify({
            topic: 'phoenix',
            event: 'heartbeat',
            payload: {},
            ref: String(heartbeatRef)
          }));
        }, 30000);
      };

      ws.onmessage = function (event) {
        try {
          var msg = JSON.parse(event.data);
          // Listen for postgres_changes events
          if (msg.event === 'postgres_changes' && msg.payload) {
            var record = msg.payload.record || msg.payload.new;
            if (record && record.status === 'approved') {
              var tweet = normalizeTweet(record);
              if (tweet.id && !renderedIds.has(tweet.id)) {
                var card = renderTweet(tweet, 0);
                grid.insertBefore(card, grid.firstChild);
                renderedIds.add(tweet.id);
                animateNewCards([card]);

                // If we were showing placeholders, do a full refresh
                if (!grid.querySelector('[data-tweet-id]')) {
                  pollForUpdates();
                }
              }
            }
          }
        } catch (_e) {
          // Ignore parse errors on non-JSON messages
        }
      };

      ws.onclose = function () {
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        // Reconnect after 5 seconds
        setTimeout(subscribeToRealtime, 5000);
      };

      ws.onerror = function () {
        ws.close();
      };
    } catch (_err) {
      // Realtime not available — polling will handle updates
    }
  }

  // -------------------------------------------------------
  // Init: fetch, render, animate, subscribe
  // -------------------------------------------------------
  async function init() {
    // Try fetching from Supabase first
    var supabaseTweets = await fetchApprovedTweets();

    if (supabaseTweets) {
      // Render real approved tweets
      var normalized = supabaseTweets.map(normalizeTweet);
      renderAll(normalized);
    } else {
      // Fall back to placeholders
      renderAll(PLACEHOLDER_TWEETS);
    }

    // Animate cards in with GSAP + ScrollTrigger
    animateCards();

    // Poll every 60 seconds for new approved tweets
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(pollForUpdates, 60000);

    // Attempt Supabase Realtime subscription for instant updates
    subscribeToRealtime();
  }

  // -------------------------------------------------------
  // Start
  // -------------------------------------------------------
  init();
})();
