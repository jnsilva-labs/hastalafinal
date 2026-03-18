(function () {
  'use strict';

  // --- DOM refs ---
  const passwordInput = document.getElementById('password-input');
  const fetchBtn = document.getElementById('fetch-btn');
  const counterEl = document.getElementById('counter');
  const statusMsg = document.getElementById('status-msg');
  const pendingList = document.getElementById('pending-list');
  const approvedList = document.getElementById('approved-list');

  // --- Password handling ---
  function getPassword() {
    return sessionStorage.getItem('admin_pw') || passwordInput.value.trim();
  }

  passwordInput.addEventListener('input', function () {
    const pw = passwordInput.value.trim();
    if (pw) {
      sessionStorage.setItem('admin_pw', pw);
    }
  });

  // Restore from sessionStorage on load
  const savedPw = sessionStorage.getItem('admin_pw');
  if (savedPw) {
    passwordInput.value = savedPw;
  }

  // --- Status messages ---
  function showStatus(msg, type) {
    statusMsg.textContent = msg;
    statusMsg.className = 'status-msg' + (type ? ' ' + type : '');
  }

  // --- API helpers ---
  const API_BASE = '/api/tweets';

  async function apiFetch(endpoint, method, body) {
    const opts = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': getPassword(),
      },
    };
    if (body) {
      opts.body = JSON.stringify(body);
    }
    const resp = await fetch(API_BASE + endpoint, opts);
    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(data.error || 'Request failed (' + resp.status + ')');
    }
    return data;
  }

  // --- Render helpers ---
  function renderAvatar(url) {
    if (url) {
      return '<img class="tweet-item__avatar" src="' + escapeHtml(url) + '" alt="" />';
    }
    return '<div class="tweet-item__avatar"></div>';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderPendingCard(tweet) {
    var id = escapeHtml(tweet.tweet_id);
    return (
      '<div class="tweet-item tweet-item--pending" data-tweet-id="' + id + '">' +
        '<div class="tweet-item__header">' +
          renderAvatar(tweet.avatar_url) +
          '<div>' +
            '<div class="tweet-item__name">' + escapeHtml(tweet.display_name) + '</div>' +
            '<div class="tweet-item__handle">@' + escapeHtml(tweet.handle) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="tweet-item__text">' + escapeHtml(tweet.text) + '</div>' +
        '<div class="tweet-item__actions">' +
          '<button class="btn btn-approve" onclick="adminAction(\'' + id + '\', \'approved\')">Approve</button>' +
          '<button class="btn btn-reject" onclick="adminAction(\'' + id + '\', \'rejected\')">Reject</button>' +
        '</div>' +
      '</div>'
    );
  }

  function renderApprovedCard(tweet) {
    return (
      '<div class="tweet-item tweet-item--approved">' +
        '<div class="tweet-item__header">' +
          renderAvatar(tweet.avatar_url) +
          '<div>' +
            '<div class="tweet-item__name">' + escapeHtml(tweet.display_name) + '</div>' +
            '<div class="tweet-item__handle">@' + escapeHtml(tweet.handle) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="tweet-item__text">' + escapeHtml(tweet.text) + '</div>' +
      '</div>'
    );
  }

  // --- State ---
  var pendingTweets = [];
  var approvedTweets = [];

  function updateCounter() {
    counterEl.innerHTML =
      '<strong>' + pendingTweets.length + '</strong> pending &middot; ' +
      '<strong>' + approvedTweets.length + '</strong> approved';
  }

  function renderPending() {
    if (pendingTweets.length === 0) {
      pendingList.innerHTML = '<div class="empty-msg">No pending tweets.</div>';
    } else {
      pendingList.innerHTML = pendingTweets.map(renderPendingCard).join('');
    }
  }

  function renderApproved() {
    if (approvedTweets.length === 0) {
      approvedList.innerHTML = '<div class="empty-msg">No approved tweets yet.</div>';
    } else {
      approvedList.innerHTML = approvedTweets.map(renderApprovedCard).join('');
    }
  }

  function renderAll() {
    renderPending();
    renderApproved();
    updateCounter();
  }

  // --- Load pending tweets ---
  async function loadPending() {
    if (!getPassword()) return;
    try {
      pendingTweets = await apiFetch('/approve', 'GET');
      renderPending();
      updateCounter();
    } catch (err) {
      // Silently fail on auto-refresh, only show on manual
    }
  }

  // --- Load approved tweets ---
  async function loadApproved() {
    try {
      const resp = await fetch(API_BASE + '/approved');
      approvedTweets = await resp.json();
      renderApproved();
      updateCounter();
    } catch (err) {
      // Silently fail
    }
  }

  // --- Fetch new tweets from X API ---
  fetchBtn.addEventListener('click', async function () {
    var pw = getPassword();
    if (!pw) {
      showStatus('Enter admin password first.', 'error');
      return;
    }

    fetchBtn.disabled = true;
    showStatus('Fetching tweets from X API...');

    try {
      var result = await apiFetch('/fetch', 'POST');
      showStatus('Fetched ' + (result.count || 0) + ' tweets.', 'success');
      await loadPending();
      await loadApproved();
    } catch (err) {
      showStatus(err.message, 'error');
    } finally {
      fetchBtn.disabled = false;
    }
  });

  // --- Approve / Reject ---
  window.adminAction = async function (tweetId, action) {
    var pw = getPassword();
    if (!pw) {
      showStatus('Enter admin password first.', 'error');
      return;
    }

    // Disable buttons on the card being acted on
    var card = document.querySelector('[data-tweet-id="' + tweetId + '"]');
    if (card) {
      var buttons = card.querySelectorAll('button');
      buttons.forEach(function (b) { b.disabled = true; });
    }

    try {
      await apiFetch('/approve', 'POST', { tweet_id: tweetId, action: action });
      showStatus('Tweet ' + action + '.', 'success');
      await loadPending();
      await loadApproved();
    } catch (err) {
      showStatus(err.message, 'error');
      // Re-enable buttons on error
      if (card) {
        var buttons = card.querySelectorAll('button');
        buttons.forEach(function (b) { b.disabled = false; });
      }
    }
  };

  // --- Initial load ---
  async function initialLoad() {
    await loadPending();
    await loadApproved();
  }

  initialLoad();

  // --- Auto-refresh every 15 seconds ---
  setInterval(function () {
    loadPending();
    loadApproved();
  }, 15000);
})();
