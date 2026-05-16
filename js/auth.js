// js/auth.js — Sirf auth logic

const Auth = (() => {
  let _supabase = null;
  let _currentUser = null;
  let _onAuthChangeCallbacks = [];

  function init() {
    _supabase = window.supabase.createClient(
      CONFIG.SUPABASE_URL,
      CONFIG.SUPABASE_ANON_KEY
    );

    _supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        _currentUser = session.user;
        _onAuthChangeCallbacks.forEach(cb => cb('SIGNED_IN', session.user));
      } else if (event === 'SIGNED_OUT') {
        _currentUser = null;
        _onAuthChangeCallbacks.forEach(cb => cb('SIGNED_OUT', null));
      }
    });
  }

  function onAuthChange(callback) {
    _onAuthChangeCallbacks.push(callback);
  }

  async function getSession() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (session?.user) _currentUser = session.user;
    return session;
  }

  function getCurrentUser() {
    return _currentUser;
  }

  // ─── SIGNUP WITH GENDER ─────────────────────────────────────────
  async function signUp(name, email, password, gender = 'male') {
    const { data, error } = await _supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, gender: gender } }
    });
    if (error) throw error;
    if (data.user) await _saveUserToDb(data.user.id, name, email, gender);
    return data;
  }

  async function signIn(email, password) {
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signInWithOtp(email) {
    const { error } = await _supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  }

  // ─── GOOGLE LOGIN — PKCE FLOW (Fixed) ───────────────────────────
  async function signInWithGoogle() {
    // PKCE flow with proper redirect handling
    const redirectUrl = window.location.origin + '/auth_callback.html';

    const { data, error } = await _supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        skipBrowserRedirect: false,
      }
    });

    if (error) throw error;

    // For implicit flow, data.url will redirect automatically
    // For PKCE, Supabase handles the code exchange
    return data;
  }

  // ─── HANDLE OAUTH CALLBACK (PKCE) ─────────────────────────────
  async function handleOAuthCallback() {
    // Parse URL hash for access_token (implicit flow)
    // Or parse query params for code (PKCE flow)
    const hash = window.location.hash;
    const query = window.location.search;

    if (hash && hash.includes('access_token')) {
      // Implicit flow — session already set by Supabase
      const { data: { session }, error } = await _supabase.auth.getSession();
      if (error) throw error;
      return session;
    }

    if (query && query.includes('code=')) {
      // PKCE flow — exchange code for session
      const { data, error } = await _supabase.auth.exchangeCodeForSession(query);
      if (error) throw error;
      return data?.session;
    }

    return null;
  }

  async function signOut() {
    const { error } = await _supabase.auth.signOut();
    if (error) throw error;
    _currentUser = null;
  }

  // ─── SAVE USER TO DB WITH GENDER ────────────────────────────────
  async function _saveUserToDb(userId, name, email, gender = 'male') {
    try {
      const { error } = await _supabase
        .from('users')
        .upsert({
          id: userId,
          name,
          email,
          gender: gender,
          plan: 'free',
          total_msgs: 0,
          sessions: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
      if (error) console.error('DB save error:', error);
    } catch (e) {
      console.error('DB save error:', e);
    }
  }

  // ─── GET USER PROFILE WITH GENDER ───────────────────────────────
  async function getUserProfile(userId) {
    try {
      const { data, error } = await _supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('Profile fetch error:', error);
        return null;
      }
      // Add defaults for missing columns
      return {
        ...data,
        gender: data.gender || 'male',
        xp: data.xp || 0,
        badges: data.badges || [],
        course_progress: data.course_progress || {},
        streak: data.streak || 0,
      };
    } catch (e) {
      console.error('Profile fetch error:', e);
      return null;
    }
  }

  async function updateUserStats(userId, updates) {
    try {
      const safeUpdates = {};
      if (updates.total_msgs !== undefined) safeUpdates.total_msgs = updates.total_msgs;
      if (updates.sessions !== undefined) safeUpdates.sessions = updates.sessions;
      if (updates.plan !== undefined) safeUpdates.plan = updates.plan;
      if (updates.gender !== undefined) safeUpdates.gender = updates.gender;

      const { error } = await _supabase
        .from('users')
        .update({ ...safeUpdates, updated_at: new Date().toISOString() })
        .eq('id', userId);
      if (error) console.error('Stats update error:', error);
    } catch (e) {
      console.error('Stats update error:', e);
    }
  }

  return {
    init, onAuthChange, getSession, getCurrentUser,
    signUp, signIn, signInWithOtp, signInWithGoogle,
    handleOAuthCallback, signOut, getUserProfile, updateUserStats,
  };
})();
