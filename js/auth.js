// js/auth.js — Supabase authentication

const Auth = (() => {
  let _supabase = null;
  let _currentUser = null;
  let _authCallback = null;

  function init() {
    _supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

    // Listen for auth changes
    _supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        _currentUser = session.user;
        _authCallback?.('SIGNED_IN', session.user);
      } else if (event === 'SIGNED_OUT') {
        _currentUser = null;
        _authCallback?.('SIGNED_OUT', null);
      }
    });
  }

  async function getSession() {
    if (!_supabase) return null;
    const { data: { session } } = await _supabase.auth.getSession();
    if (session?.user) _currentUser = session.user;
    return session;
  }

  function getCurrentUser() {
    return _currentUser;
  }

  async function signInWithGoogle() {
    if (!_supabase) throw new Error('Supabase not initialized');
    const { data, error } = await _supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/app.html' }
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    if (!_supabase) return;
    await _supabase.auth.signOut();
    _currentUser = null;
  }

  async function getUserProfile(userId) {
    if (!_supabase) return null;

    // Try to get existing profile
    const { data, error } = await _supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (data) return data;

    // Create new profile if not exists
    const user = getCurrentUser();
    if (!user) return null;

    const newProfile = {
      id: userId,
      email: user.email,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      avatar: user.user_metadata?.avatar_url || '',
      plan: 'free',
      total_msgs: 0,
      sessions: 0,
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      course_progress: {},
      ai_gender: 'female',
      created_at: new Date().toISOString(),
    };

    const { data: inserted, error: insertError } = await _supabase
      .from('users')
      .insert([newProfile])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating profile:', insertError);
      return null;
    }

    return inserted;
  }

  async function updateUserStats(userId, updates) {
    if (!_supabase) return;
    const { error } = await _supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
    if (error) console.error('Error updating stats:', error);
  }

  function onAuthChange(callback) {
    _authCallback = callback;
  }

  return {
    init,
    getSession,
    getCurrentUser,
    signInWithGoogle,
    signOut,
    getUserProfile,
    updateUserStats,
    onAuthChange,
  };
})();
