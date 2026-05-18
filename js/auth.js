// js/auth.js — Sirf auth logic

const Auth = (() => {
  let _supabase = null;
  let _currentUser = null;
  let _onAuthChangeCallbacks = [];
  let _initialized = false;

  function init() {
    if (_initialized) return; // Double init prevent karo
    _initialized = true;

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
    if (!_supabase) init();
    const { data: { session } } = await _supabase.auth.getSession();
    if (session?.user) {
      _currentUser = session.user;
    }
    return session;
  }

  function getCurrentUser() {
    return _currentUser;
  }

  async function signUp(name, email, password) {
    if (!_supabase) init();
    const { data, error } = await _supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    if (error) throw error;
    if (data.user) {
      await _saveUserToDb(data.user.id, name, email);
    }
    return data;
  }

  async function signIn(email, password) {
    if (!_supabase) init();
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signInWithOtp(email) {
    if (!_supabase) init();
    const { error } = await _supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  }

  // FIX: redirectTo auth_callback.html pe — yahi Google OAuth complete karta hai
  async function signInWithGoogle() {
    if (!_supabase) init();
    const { error } = await _supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth_callback.html'
      }
    });
    if (error) throw error;
  }

  async function signOut() {
    if (!_supabase) init();
    const { error } = await _supabase.auth.signOut();
    if (error) throw error;
    _currentUser = null;
  }

  async function _saveUserToDb(userId, name, email) {
    if (!_supabase) init();
    const { error } = await _supabase
      .from('users')
      .upsert({
        id: userId,
        name,
        email,
        plan: 'free',
        mins_used: 0,
        total_msgs: 0,
        sessions: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    if (error) console.error('DB save error:', error);
  }

  async function getUserProfile(userId) {
    if (!_supabase) init();
    const { data, error } = await _supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  }

  async function updateUserStats(userId, updates) {
    if (!_supabase) init();
    const { error } = await _supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) console.error('Stats update error:', error);
  }

  return {
    init,
    onAuthChange,
    getSession,
    getCurrentUser,
    signUp,
    signIn,
    signInWithOtp,
    signInWithGoogle,
    signOut,
    getUserProfile,
    updateUserStats,
  };
})();
