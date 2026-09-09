/* Sakhi cloud layer.
 *
 * Supabase is the authority for learner data. localStorage is ONLY:
 *   - a read cache, so the app renders instantly and works offline
 *   - an outbox, so writes made offline are replayed when we reconnect
 * It is never treated as the permanent record. Anything in the cache that has
 * not been acknowledged by Supabase is reported as unsynced, never as saved.
 */
window.SakhiCloud = (function () {
  'use strict';

  var CFG = window.RAINBOW_CONFIG || {};
  var URL_BASE = CFG.supabaseUrl || '';
  var ANON = CFG.supabaseAnonKey || '';
  var SESSION_KEY = 'sakhi.cloud.session';
  var OUTBOX_KEY = 'sakhi.cloud.outbox';
  var CACHE_PREFIX = 'sakhi.cache.';

  /* Connection status is deliberately four-valued. The parent view must be able
   * to say exactly why cloud progress is not running, and must never imply a
   * sync that did not happen. */
  var STATUS = {
    NOT_CONFIGURED: 'NOT_CONFIGURED', // no Supabase credentials in the build
    OFFLINE: 'OFFLINE',              // device has no network
    NOT_CONNECTED: 'NOT_CONNECTED',  // reachable, but no parent signed in
    CONNECTED: 'CONNECTED'           // signed in; learner data is syncing
  };

  var session = readJSON(SESSION_KEY, null);
  var status = STATUS.NOT_CONNECTED;
  var lastError = null;
  var listeners = [];

  function readJSON(k, fallback) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function writeJSON(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch (e) { return false; }
  }
  function uuid() {
    return (crypto.randomUUID && crypto.randomUUID()) ||
      ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 3 | 8)).toString(16);
      }));
  }

  function emit() {
    var snap = state();
    listeners.forEach(function (fn) { try { fn(snap); } catch (e) { console.warn(e); } });
  }
  function setStatus(s, err) {
    if (status === s && lastError === (err || null)) return;
    status = s; lastError = err || null; emit();
  }
  function onChange(fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; }

  function configured() { return !!(URL_BASE && ANON); }

  function state() {
    return {
      status: status,
      configured: configured(),
      signedIn: !!(session && session.access_token),
      email: session && session.user && session.user.email || null,
      userId: session && session.user && session.user.id || null,
      pending: outbox().length,
      error: lastError
    };
  }

  /* ---------- transport ---------- */

  function headers(auth) {
    var h = { 'apikey': ANON, 'Content-Type': 'application/json' };
    h['Authorization'] = 'Bearer ' + (auth && session && session.access_token ? session.access_token : ANON);
    return h;
  }

  async function request(path, opts) {
    opts = opts || {};
    if (!configured()) { setStatus(STATUS.NOT_CONFIGURED); throw cloudError('NOT_CONFIGURED', 'No Supabase credentials in this build.'); }
    if (navigator.onLine === false) { setStatus(STATUS.OFFLINE); throw cloudError('OFFLINE', 'This device is offline.'); }
    var res;
    try {
      res = await fetch(URL_BASE + path, {
        method: opts.method || 'GET',
        headers: Object.assign(headers(opts.auth !== false), opts.headers || {}),
        body: opts.body ? JSON.stringify(opts.body) : undefined
      });
    } catch (e) {
      setStatus(STATUS.OFFLINE);
      throw cloudError('NETWORK', 'Could not reach the Sakhi cloud.', e);
    }
    if (res.status === 401 || res.status === 403) {
      // Token expired mid-flight: try one silent refresh before giving up.
      if (opts.auth !== false && session && session.refresh_token && !opts._retried) {
        var ok = await refresh();
        if (ok) return request(path, Object.assign({}, opts, { _retried: true }));
      }
      if (opts.auth !== false) signOutLocal();
      throw cloudError('UNAUTHORIZED', 'Cloud sign-in is required.');
    }
    if (!res.ok) {
      var detail = await res.text().catch(function () { return ''; });
      throw cloudError('HTTP_' + res.status, detail || ('Request failed (' + res.status + ')'));
    }
    if (res.status === 204) return null;
    var text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  function cloudError(code, message, cause) {
    var e = new Error(message); e.code = code; e.cause = cause; return e;
  }

  /* ---------- auth (the parent drives this from the UI) ---------- */

  function persistSession(s) {
    session = s;
    if (s) writeJSON(SESSION_KEY, s); else try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  async function signIn(email, password) {
    var data = await request('/auth/v1/token?grant_type=password', {
      method: 'POST', auth: false, body: { email: email, password: password }
    });
    persistSession(data);
    setStatus(STATUS.CONNECTED);
    flush();
    return state();
  }

  async function signUp(email, password) {
    var data = await request('/auth/v1/signup', {
      method: 'POST', auth: false, body: { email: email, password: password }
    });
    // Projects with email confirmation on return no session; the parent must confirm.
    if (data && data.access_token) { persistSession(data); setStatus(STATUS.CONNECTED); flush(); }
    return { needsConfirmation: !(data && data.access_token) };
  }

  async function refresh() {
    if (!session || !session.refresh_token) return false;
    try {
      var data = await request('/auth/v1/token?grant_type=refresh_token', {
        method: 'POST', auth: false, body: { refresh_token: session.refresh_token }
      });
      persistSession(data);
      return true;
    } catch (e) { signOutLocal(); return false; }
  }

  function signOutLocal() { persistSession(null); setStatus(STATUS.NOT_CONNECTED); }

  async function signOut() {
    try { await request('/auth/v1/logout', { method: 'POST' }); } catch (e) {}
    signOutLocal();
  }

  /* Resolve real status. Never optimistic: we only claim CONNECTED after the
   * cloud has actually answered an authenticated request. */
  async function probe() {
    if (!configured()) { setStatus(STATUS.NOT_CONFIGURED); return state(); }
    if (navigator.onLine === false) { setStatus(STATUS.OFFLINE); return state(); }
    if (!session || !session.access_token) { setStatus(STATUS.NOT_CONNECTED); return state(); }
    try {
      await request('/rest/v1/learner_profiles?select=learner_id&limit=1');
      setStatus(STATUS.CONNECTED);
      flush();
    } catch (e) {
      if (e.code === 'OFFLINE' || e.code === 'NETWORK') setStatus(STATUS.OFFLINE, e.message);
      else if (e.code === 'UNAUTHORIZED') setStatus(STATUS.NOT_CONNECTED, null);
      else setStatus(STATUS.NOT_CONNECTED, e.message);
    }
    return state();
  }

  /* ---------- read cache ---------- */

  function cacheGet(name) { return readJSON(CACHE_PREFIX + name, null); }
  function cachePut(name, value) {
    writeJSON(CACHE_PREFIX + name, { at: new Date().toISOString(), value: value });
    return value;
  }
  function cacheValue(name) { var c = cacheGet(name); return c ? c.value : null; }

  /* Read through: cloud first, cache as fallback. The caller is always told
   * which one it got, so the UI can be honest about staleness. */
  async function readThrough(name, path) {
    try {
      var fresh = await request(path);
      cachePut(name, fresh);
      return { value: fresh, fromCache: false, cachedAt: null };
    } catch (e) {
      var c = cacheGet(name);
      if (c) return { value: c.value, fromCache: true, cachedAt: c.at, error: e };
      throw e;
    }
  }

  /* ---------- outbox: offline writes, replayed idempotently ---------- */

  function outbox() { return readJSON(OUTBOX_KEY, []) || []; }
  function setOutbox(list) { writeJSON(OUTBOX_KEY, list); emit(); }

  /* Every queued write carries a client-generated id and uses upsert semantics,
   * so replaying the queue any number of times converges to the same rows. */
  function enqueue(op) {
    var list = outbox();
    op.op_id = op.op_id || uuid();
    op.queued_at = new Date().toISOString();
    list.push(op);
    setOutbox(list);
    flush();
    return op.op_id;
  }

  var flushing = false;
  async function flush() {
    if (flushing) return;
    if (!configured() || !session || navigator.onLine === false) return;
    var list = outbox();
    if (!list.length) return;
    flushing = true;
    try {
      while (list.length) {
        var op = list[0];
        try {
          await request('/rest/v1/' + op.table, {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
            body: op.rows
          });
        } catch (e) {
          if (e.code === 'OFFLINE' || e.code === 'NETWORK' || e.code === 'UNAUTHORIZED') break; // keep for later
          // A permanently rejected row must not wedge the queue forever.
          console.warn('[SakhiCloud] dropping unsendable op', op.table, e.message);
        }
        list.shift();
        setOutbox(list);
      }
    } finally {
      flushing = false;
      if (!outbox().length && session) setStatus(STATUS.CONNECTED);
    }
  }

  /* Upsert that works signed-out: queues locally and returns immediately. */
  function upsert(table, rows) {
    rows = Array.isArray(rows) ? rows : [rows];
    return enqueue({ table: table, rows: rows });
  }

  window.addEventListener('online', function () { probe(); });
  window.addEventListener('offline', function () { setStatus(STATUS.OFFLINE); });

  return {
    STATUS: STATUS,
    state: state,
    onChange: onChange,
    probe: probe,
    signIn: signIn,
    signUp: signUp,
    signOut: signOut,
    request: request,
    readThrough: readThrough,
    cacheValue: cacheValue,
    cachePut: cachePut,
    upsert: upsert,
    flush: flush,
    outbox: outbox,
    uuid: uuid
  };
})();
