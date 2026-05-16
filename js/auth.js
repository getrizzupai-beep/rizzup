// ============================================
// AUTH.JS — Gender Save + Single Tab Signup + Safe Supabase Updates
// ============================================

let supabaseClient = null;
let currentUser = null;

// Initialize Supabase
function initAuth() {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
    console.log('✅ Supabase initialized');
  } else {
    console.error('❌ Supabase library not loaded');
  }
}

// Check if user is logged in
async function checkAuth() {
  if (!supabaseClient) return false;
  
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    
    if (session) {
      currentUser = session.user;
      await loadUserProfile();
      return true;
    }
    return false;
  } catch (err) {
    console.error('Auth check error:', err);
    return false;
  }
}

// Load user profile with gender
async function loadUserProfile() {
  if (!currentUser || !supabaseClient) return;
  
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', currentUser.id)
      .single();
    
    if (error) {
      // User row doesn't exist, create it
      if (error.code === 'PGRST116') {
        await createUserProfile();
      } else {
        throw error;
      }
    } else {
      currentUser.profile = data;
      // Store gender in localStorage for quick access
      if (data.gender) {
        localStorage.setItem('userGender', data.gender);
      }
    }
  } catch (err) {
    console.error('Load profile error:', err);
  }
}

// Create user profile with gender
async function createUserProfile(gender = 'male') {
  if (!currentUser || !supabaseClient) return;
  
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .insert([
        {
          id: currentUser.id,
          email: currentUser.email,
          gender: gender,
          xp: 0,
          badges: [],
          course_progress: {},
          streak: 0,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    currentUser.profile = data;
    localStorage.setItem('userGender', gender);
    console.log('✅ Profile created with gender:', gender);
  } catch (err) {
    console.error('Create profile error:', err);
  }
}

// Signup with gender
async function signupWithGender(email, password, gender) {
  if (!supabaseClient) {
    alert('Supabase not initialized. Please refresh.');
    return;
  }
  
  try {
    // Step 1: Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/app.html'
      }
    });
    
    if (authError) throw authError;
    
    currentUser = authData.user;
    
    // Step 2: Create profile with gender
    await createUserProfile(gender);
    
    // Step 3: Redirect to app (SAME TAB — no new tab!)
    window.location.href = 'app.html';
    
  } catch (err) {
    console.error('Signup error:', err);
    alert('Signup failed: ' + err.message);
  }
}

// Login
async function loginUser(email, password) {
  if (!supabaseClient) {
    alert('Supabase not initialized. Please refresh.');
    return;
  }
  
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    currentUser = data.user;
    await loadUserProfile();
    
    // Redirect to app (SAME TAB)
    window.location.href = 'app.html';
    
  } catch (err) {
    console.error('Login error:', err);
    alert('Login failed: ' + err.message);
  }
}

// Logout
async function logoutUser() {
  if (!supabaseClient) return;
  
  try {
    await supabaseClient.auth.signOut();
    currentUser = null;
    localStorage.removeItem('userGender');
    window.location.href = 'index.html';
  } catch (err) {
    console.error('Logout error:', err);
  }
}

// Get user gender
function getUserGender() {
  // Check localStorage first (faster)
  const stored = localStorage.getItem('userGender');
  if (stored) return stored;
  
  // Check profile
  if (currentUser?.profile?.gender) {
    return currentUser.profile.gender;
  }
  
  return 'male'; // Default
}

// Update user stats (XP, badges, progress)
async function updateUserStats(updates) {
  if (!currentUser || !supabaseClient) return;
  
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .update(updates)
      .eq('id', currentUser.id)
      .select()
      .single();
    
    if (error) throw error;
    
    currentUser.profile = { ...currentUser.profile, ...data };
    return data;
  } catch (err) {
    console.error('Update stats error:', err);
    return null;
  }
}

// Get current user
function getCurrentUser() {
  return currentUser;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initAuth,
    checkAuth,
    signupWithGender,
    loginUser,
    logoutUser,
    getUserGender,
    updateUserStats,
    getCurrentUser,
    loadUserProfile
  };
}
