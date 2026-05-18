// js/auth.js — Sirf auth logic
// FIX: INITIAL_SESSION handle karo taaki login persist ho page reload pe

const Auth = (() => {
  let _supabase = null;
  let _currentUser = null;
  let _onAuthChangeCallbacks = [];

  // Supabase client init
  function init() {
    _supabase = window.supabase.createClient(
      CONFIG.SUPABASE_URL,
      CONFIG.SUPABASE_ANON_KEY
    );

    // Auth state changes sun
    // Supabase v2 mein page reload pe INITIAL_SESSION fire hota hai, SIGNED_IN nahi
    _supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] Event:', event, session?.user?.email || 'no user');

      if (event === 'SIGNED_IN' && session?.user) {
        _currentUser = session.user;
        _onAuthChangeCallbacks.forEach(cb => cb('SIGNED_IN', session.user));

      } else if (event === 'INITIAL_SESSION') {
        // Yeh page reload pe fire hota hai — IMPORTANT FIX
        if (session?.user) {
          _currentUser = session.user;
          _onAuthChangeCallbacks.forEach(cb => cb('SIGNED_IN', session.user));
        } else {
          // No session on page load
          _onAuthChangeCallbacks.forEach(cb => cb('SIGNED_OUT', null));
        }

      } else if (event === 'SIGNED_OUT') {
        _currentUser = null;
        _onAuthChangeCallbacks.forEach(cb => cb('SIGNED_OUT', null));

      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Token silently refresh — sirf user update, re-render nahi
        _currentUser = session.user;
      }
    });
  }

  // Auth change pe callback register karo
  function onAuthChange(callback) {
    _onAuthChangeCallbacks.push(callback);
  }

  // Current session check karo
  async function getSession() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (session?.user) {
      _currentUser = session.user;
    }
    return session;
  }

  // Current user
  function getCurrentUser() {
    return _currentUser;
  }

  // Email/password signup
  async function signUp(name, email, password) {
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

  // Email/password login
  async function signIn(email, password) {
    const { data, error } = await _supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  // Magic link / OTP
  async function signInWithOtp(email) {
    const { error } = await _supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  }

  // Google OAuth
  async function signInWithGoogle() {
    const { error } = await _supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/app.html'
      }
    });
    if (error) throw error;
  }

  // Logout
  async function signOut() {
    const { error } = await _supabase.auth.signOut();
    if (error) throw error;
    _currentUser = null;
  }

  // User data DB mein save karo
  async function _saveUserToDb(userId, name, email) {
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

  // User profile fetch karo
  async function getUserProfile(userId) {
    const { data, error } = await _supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('getUserProfile error:', error);
      return null;
    }
    return data;
  }

  // Stats update karo
  async function updateUserStats(userId, updates) {
    const { error } = await _supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) console.error('Stats update error:', error);
  }

  // Public API
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
