// ============================================
// MAIN.JS — App initialization & utilities
// ============================================

// Tab switching for app.html
function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  
  // Show selected tab
  const selectedTab = document.getElementById(tabName + 'Tab');
  if (selectedTab) selectedTab.style.display = 'block';
  
  // Update nav active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // Find the clicked nav link and make it active
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.textContent.toLowerCase().includes(tabName.toLowerCase()) || 
        link.getAttribute('onclick')?.includes(tabName)) {
      link.classList.add('active');
    }
  });
  
  // Refresh content based on tab
  if (tabName === 'dashboard' && typeof renderStats === 'function') {
    renderStats();
    renderBadges();
  } else if (tabName === 'course' && typeof renderCourseGrid === 'function') {
    renderCourseGrid();
  } else if (tabName === 'chat' && typeof renderScenarioButtons === 'function') {
    renderScenarioButtons();
  } else if (tabName === 'badges' && typeof renderAllBadges === 'function') {
    renderAllBadges();
  }
}

// Render all badges (for badges tab)
function renderAllBadges() {
  const container = document.getElementById('allBadgesContainer');
  if (!container || typeof CONFIG === 'undefined') return;
  
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const earnedBadges = user?.profile?.badges || [];
  
  container.innerHTML = CONFIG.BADGES.map(badge => {
    const isEarned = earnedBadges.includes(badge.id);
    return `
      <div class="badge ${isEarned ? 'earned' : 'locked'}" style="padding: 24px;">
        <span class="badge-icon" style="font-size: 48px;">${isEarned ? badge.icon : '🔒'}</span>
        <span class="badge-name" style="font-size: 14px; margin-top: 12px;">${badge.name}</span>
        <p style="font-size: 12px; color: var(--gray); margin-top: 4px;">${badge.desc}</p>
      </div>
    `;
  }).join('');
}

// Utility: Format date
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Utility: Debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { showTab, renderAllBadges, formatDate, debounce };
}
