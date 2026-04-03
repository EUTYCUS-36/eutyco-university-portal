/**
 * ================================================================
 * EUTYCO UNIVERSITY — Undergraduate Dashboard
 * dashboard.js  ·  v3.0
 * ================================================================
 *
 * TABLE OF CONTENTS
 * ─────────────────────────────────────────────────────────────────
 *  1.  Bootstrap — DOMContentLoaded entry point
 *  2.  Utility: escapeHTML (XSS prevention)
 *  3.  Dynamic Date & Greeting (time-aware, motivational)
 *  4.  Dark Mode — Sun/Moon toggle + localStorage
 *  5.  Sidebar Collapse (desktop icons-only mode + localStorage)
 *  6.  Mobile Sidebar Menu (hamburger + overlay + ESC)
 *  7.  Navigation — section switching (Courses, Grades, Settings)
 *  8.  Settings Page — sync settings toggles with live state
 *  9.  Tutorial Overlay — first-time session walkthrough
 * 10.  Assignment Checkboxes
 * 11.  Grade Chart — enhanced hover tooltips with analysis text
 * 12.  Widget Chat — send message (widget)
 * 13.  Download Buttons — feedback animation
 * 14.  Active Nav Link Switching
 * 15.  MODAL SYSTEM
 *        15a. openModal / closeModal helpers
 *        15b. Backdrop + ESC close + focus trap
 *        15c. Assignments "View All" → modal-assignments
 *        15d. Grades "Full Report" → modal-grade-report
 *        15e. Chat "Expand" → modal-chat
 *        15f. Notes "View All" → modal-notes
 *        15g. Profile modal (name link + avatar buttons)
 *        15h. Feedback modal (Report Issue button + form)
 *        15i. Assignment filter pills
 *        15j. Grade report actions
 *        15k. Expanded chat messaging
 *        15l. File attach buttons
 * 16.  Upload Work Buttons
 * 17.  Ask AI Assistant Buttons
 * 18.  Pinned Items
 * 19.  To-Do / Focus List (with GPA projection insight)
 * 20.  Notifications Dropdown
 * 21.  Video / Audio Call Stubs
 * 22.  Toast Notification System
 * 23.  Routing Architecture API (window.UniPortal)
 * 24.  Button Interaction Stubs
 * 25.  Animate Grade Chart on Load
 * ================================================================
 */

'use strict';

/* ── 1. BOOTSTRAP ────────────────────────────────────────────────
   All init functions run after the DOM is fully parsed.
────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  setDynamicGreeting();
  initDarkMode();
  initSidebarCollapse();
  initMobileMenu();
  initNavigation();
  initSettingsPage();
  initTutorial();
  initAssignmentCheckboxes();
  initGradeChart();
  initWidgetChat();
  initDownloadButtons();
  initNavLinks();
  initModalSystem();
  initUploadButtons();
  initAskAIButtons();
  initPinnedItems();
  initTodoList();
  initNotifications();
  initCallButtons();
  initButtonStubs();
  animateChart();
});


/* ── 2. UTILITY: escapeHTML ──────────────────────────────────────
   Converts user-typed text to HTML entities to prevent XSS.
   MUST be used on any string inserted via innerHTML.
────────────────────────────────────────────────────────────────── */
function escapeHTML(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}


/* ── 3. DYNAMIC DATE & GREETING ──────────────────────────────────
   Writes the current date into #display-date.
   Updates the topbar greeting with a time-aware message and a
   motivational suffix to make the experience feel personal.
────────────────────────────────────────────────────────────────── */
function setDynamicGreeting() {
  /* ── Date display ── */
  var dateEl = document.getElementById('display-date');
  if (dateEl) {
    var opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('en-US', opts);
  }

  /* ── Time-aware greeting with motivational suffix ── */
  var greetingEl = document.getElementById('topbar-greeting-text');
  if (!greetingEl) return;

  var hour = new Date().getHours();
  var timeGreeting, suffix;

  if (hour >= 5 && hour < 12) {
    timeGreeting = 'Good morning';
    suffix = 'Ready to conquer today?';
  } else if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good afternoon';
    suffix = 'Keep the momentum going.';
  } else if (hour >= 17 && hour < 21) {
    timeGreeting = 'Good evening';
    suffix = 'Wrap up strong tonight.';
  } else {
    timeGreeting = 'Still at it';
    suffix = 'Rest matters too, Alex.';
  }

  greetingEl.innerHTML =
    timeGreeting + ', <a href="#" class="greeting-name-link" id="btn-open-profile" aria-label="Open your profile">Alex</a> — <em style="font-size:0.85em;opacity:0.7">' + suffix + '</em>';
}


/* ── 4. DARK MODE ────────────────────────────────────────────────
   Sun/Moon toggle in the topbar. Applies [data-theme="dark"] to
   <html>. Saves preference to localStorage across sessions.
   Also syncs the Settings page toggle.

   v4 fix: settingsToggle.checked is now set inside applyDark() so
   it reliably reflects the correct state whenever the settings
   section is navigated to — even if the user has toggled dark mode
   before opening that section.
────────────────────────────────────────────────────────────────── */
function initDarkMode() {
  var btn       = document.getElementById('btn-theme-toggle');
  var iconSun   = document.getElementById('icon-sun');
  var iconMoon  = document.getElementById('icon-moon');
  var settingsToggle = document.getElementById('setting-dark-mode');

  /* Apply saved preference immediately on load (before first paint) */
  var saved = localStorage.getItem('eutyco-theme');
  applyDark(saved === 'dark', /* silent */ true);

  if (!btn) return;

  btn.addEventListener('click', function () {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyDark(!isDark);
  });

  /* Settings page toggle — also wires up change handler */
  if (settingsToggle) {
    settingsToggle.addEventListener('change', function () {
      applyDark(settingsToggle.checked);
    });
  }

  /* Helper: apply or remove dark theme.
     silent=true skips the toast on initial load. */
  function applyDark(on, silent) {
    var settTog = document.getElementById('setting-dark-mode'); // re-query in case section just navigated
    if (on) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('eutyco-theme', 'dark');
      if (iconSun)  iconSun.style.display  = '';
      if (iconMoon) iconMoon.style.display = 'none';
      if (settTog) settTog.checked = true;
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('eutyco-theme', 'light');
      if (iconSun)  iconSun.style.display  = 'none';
      if (iconMoon) iconMoon.style.display = '';
      if (settTog) settTog.checked = false;
    }
  }

  /* Expose applyDark so navigation.js can re-sync when settings opens */
  window._applyDarkMode = applyDark;
}


/* ── 5. SIDEBAR COLLAPSE (desktop) ──────────────────────────────
   Toggles .sidebar-collapsed on .layout to shrink the sidebar to
   icons-only mode (var(--sidebar-collapsed-w) = 64px).
   Main content expands to fill the reclaimed space via CSS.
   State saved to localStorage so it persists across page loads.
   Disabled at ≤1100px viewport (CSS hides the button).
────────────────────────────────────────────────────────────────── */
function initSidebarCollapse() {
  var btn             = document.getElementById('btn-sidebar-collapse');
  var layout          = document.getElementById('layout');
  var settingsToggle  = document.getElementById('setting-sidebar-collapsed');

  if (!btn || !layout) return;

  /* Restore saved state */
  var savedState = localStorage.getItem('eutyco-sidebar');
  if (savedState === 'collapsed') {
    layout.classList.add('sidebar-collapsed');
    rotateCollapseBtn(true);
    if (settingsToggle) settingsToggle.checked = true;
  }

  btn.addEventListener('click', function () {
    var isCollapsed = layout.classList.toggle('sidebar-collapsed');
    localStorage.setItem('eutyco-sidebar', isCollapsed ? 'collapsed' : 'expanded');
    rotateCollapseBtn(isCollapsed);
    if (settingsToggle) settingsToggle.checked = isCollapsed;
  });

  /* Settings page toggle also controls collapse */
  if (settingsToggle) {
    settingsToggle.addEventListener('change', function () {
      var should = settingsToggle.checked;
      if (should) {
        layout.classList.add('sidebar-collapsed');
        rotateCollapseBtn(true);
        localStorage.setItem('eutyco-sidebar', 'collapsed');
      } else {
        layout.classList.remove('sidebar-collapsed');
        rotateCollapseBtn(false);
        localStorage.setItem('eutyco-sidebar', 'expanded');
      }
    });
  }

  /* Rotate the chevron icon when collapsed/expanded */
  function rotateCollapseBtn(collapsed) {
    btn.style.transform = collapsed ? 'rotate(180deg)' : '';
  }
}


/* ── 6. MOBILE SIDEBAR MENU ──────────────────────────────────────
   Hamburger (#btn-hamburger) toggles the off-canvas sidebar.
   The backdrop overlay (#sidebar-overlay) closes it on tap.
   ESC key also closes. Nav-link taps auto-close on mobile.
────────────────────────────────────────────────────────────────── */
function initMobileMenu() {
  var sidebar  = document.getElementById('sidebar');
  var overlay  = document.getElementById('sidebar-overlay');
  var hamburger = document.getElementById('btn-hamburger');

  if (!sidebar || !overlay || !hamburger) return;

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
  });

  sidebar.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });
}


/* ── 7. NAVIGATION — section switching ──────────────────────────
   Maps sidebar nav IDs to content section IDs.
   When a nav item is clicked: hides all sections, shows the
   matching one, and updates the active link highlight.
   "Dashboard" is the default, always shown on load.

   v4 fix: sections now toggled via .active class (not style.display)
   so the CSS fadeSlideUp animation fires correctly on every switch.
────────────────────────────────────────────────────────────────── */
function initNavigation() {
  var navSectionMap = {
    'nav-dashboard':    'section-dashboard',
    'nav-courses':      'section-courses',
    'nav-grades':       'section-grades',
    'nav-settings':     'section-settings'
    /* nav-chat, nav-assignments, nav-calendar open modals via initButtonStubs */
  };

  var allSections = ['section-dashboard', 'section-courses', 'section-grades', 'section-settings'];
  var allNavLinks = document.querySelectorAll('#sidebar .nav-link');

  /* Ensure dashboard is the startup active section */
  var dashEl = document.getElementById('section-dashboard');
  if (dashEl && !dashEl.classList.contains('active')) dashEl.classList.add('active');

  Object.keys(navSectionMap).forEach(function (navId) {
    var link = document.getElementById(navId);
    if (!link) return;

    link.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = navSectionMap[navId];

      /* Hide all sections by removing .active */
      allSections.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.classList.remove('active');
      });

      /* Reveal target section — CSS animation triggers via .active */
      var target = document.getElementById(targetId);
      if (target) {
        /* Re-insert the element so the CSS animation re-fires */
        target.classList.remove('active');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            target.classList.add('active');
          });
        });
      }

      /* Update active nav link highlight */
      allNavLinks.forEach(function (l) {
        l.classList.remove('active');
        l.removeAttribute('aria-current');
      });
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');

      /* Scroll to top of content */
      var main = document.getElementById('main-content');
      if (main) main.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      /*
        When navigating to Settings, re-sync the dark mode toggle
        so it accurately reflects the current theme state, regardless
        of whether the user toggled dark mode before opening Settings.
      */
      if (targetId === 'section-settings' && typeof window._applyDarkMode === 'function') {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        window._applyDarkMode(isDark, true);
      }
    });
  });
}


/* ── 8. SETTINGS PAGE — sync toggles ────────────────────────────
   Privacy and notification toggles on the Settings page.
   Changes are stored in localStorage for persistence.
────────────────────────────────────────────────────────────────── */
function initSettingsPage() {
  var settingIds = [
    'setting-faculty-tracking',
    'setting-ai-analysis',
    'setting-share-advisor',
    'setting-research-hooks',
    'setting-notif-assignments',
    'setting-notif-grades',
    'setting-notif-chat'
  ];

  settingIds.forEach(function (id) {
    var toggle = document.getElementById(id);
    if (!toggle) return;

    /* Restore saved state */
    var saved = localStorage.getItem('eutyco-setting-' + id);
    if (saved !== null) toggle.checked = saved === 'true';

    toggle.addEventListener('change', function () {
      localStorage.setItem('eutyco-setting-' + id, String(toggle.checked));
      var label = toggle.closest('.settings-row')
        ? toggle.closest('.settings-row').querySelector('.settings-row-label')
        : null;
      var labelText = label ? label.textContent : 'Setting';
      showToast(
        (toggle.checked ? '✓ ' : '✕ ') + labelText + (toggle.checked ? ' enabled.' : ' disabled.'),
        toggle.checked ? 'success' : 'default'
      );
    });
  });
}


/* ── 9. TUTORIAL OVERLAY ─────────────────────────────────────────
   Shown once per session for first-time users (uses sessionStorage).
   Multi-step walkthrough with dot indicators.
   Dismissible via "Skip tour" or by completing all steps.
────────────────────────────────────────────────────────────────── */
function initTutorial() {
  var overlay   = document.getElementById('tutorial-overlay');
  var nextBtn   = document.getElementById('btn-tutorial-next');
  var skipBtn   = document.getElementById('btn-tutorial-skip');
  var steps     = overlay ? Array.from(overlay.querySelectorAll('.tutorial-step')) : [];
  var dots      = overlay ? Array.from(overlay.querySelectorAll('.tutorial-step-dot')) : [];

  if (!overlay || !steps.length) return;

  /* Skip if already seen this session */
  if (sessionStorage.getItem('eutyco-tutorial-done')) return;

  var currentStep = 0;

  /* Delay show slightly so page renders first */
  setTimeout(function () {
    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');
  }, 900);

  /* Next / Finish button */
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (currentStep < steps.length - 1) {
        goToStep(currentStep + 1);
      } else {
        closeTutorial();
      }
    });
  }

  /* Skip button */
  if (skipBtn) skipBtn.addEventListener('click', closeTutorial);

  /* ESC key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('visible')) closeTutorial();
  });

  function goToStep(idx) {
    steps[currentStep].classList.remove('active');
    dots[currentStep].classList.remove('active');
    currentStep = idx;
    steps[currentStep].classList.add('active');
    dots[currentStep].classList.add('active');

    /* Update button label on last step */
    if (nextBtn) {
      nextBtn.querySelector('svg') && (nextBtn.innerHTML = currentStep === steps.length - 1
        ? 'Get started <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>'
        : 'Next <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>');
    }
  }

  function closeTutorial() {
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
    sessionStorage.setItem('eutyco-tutorial-done', '1');
    showToast('🎓 Welcome to Eutyco Portal! Explore your dashboard freely.', 'success', 4500);
  }
}


/* ── 10. ASSIGNMENT CHECKBOXES ───────────────────────────────────
   Toggle completion state on each assignment row.
   Supports both click and keyboard (Enter / Space).
────────────────────────────────────────────────────────────────── */
function initAssignmentCheckboxes() {
  document.querySelectorAll('.assignment-checkbox').forEach(function (cb) {
    function toggle() {
      var checked = cb.classList.toggle('checked');
      cb.setAttribute('aria-checked', String(checked));
      var item  = cb.closest('.assignment-item');
      var title = item && item.querySelector('.assignment-title');
      if (title) title.classList.toggle('done', checked);
    }

    cb.addEventListener('click', toggle);
    cb.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
}


/* ── 11. GRADE CHART — ENHANCED HOVER TOOLTIPS ───────────────────
   Converts SVG viewBox coordinates → real CSS pixel positions.
   Each dot now shows two lines:
     Line 1: "Week N · XX%"
     Line 2: AI analysis text (e.g., "Brilliant work — top 15%!")
   Replaces the single-line static tooltip with a richer analysis.
────────────────────────────────────────────────────────────────── */
function initGradeChart() {
  var tooltip = document.getElementById('chart-tooltip');
  var svg     = document.getElementById('grade-chart-svg');
  if (!tooltip || !svg) return;

  svg.querySelectorAll('.chart-dot').forEach(function (dot) {

    dot.addEventListener('mouseenter', function () {
      var label    = dot.getAttribute('data-label') || '';
      var analysis = dot.getAttribute('data-analysis') || '';

      /* Two-line tooltip: grade + analysis */
      tooltip.innerHTML =
        escapeHTML(label) +
        (analysis ? '<span class="tooltip-analysis">' + escapeHTML(analysis) + '</span>' : '');

      /* Convert SVG viewBox coords → container-relative CSS pixels */
      var container = svg.closest('.chart-container');
      var svgRect   = svg.getBoundingClientRect();
      var contRect  = container.getBoundingClientRect();
      var viewBox   = svg.viewBox.baseVal;
      var scaleX    = svgRect.width  / viewBox.width;
      var scaleY    = svgRect.height / viewBox.height;

      tooltip.style.left    = (parseFloat(dot.getAttribute('cx')) * scaleX + svgRect.left - contRect.left) + 'px';
      tooltip.style.top     = (parseFloat(dot.getAttribute('cy')) * scaleY + svgRect.top  - contRect.top)  + 'px';
      tooltip.style.opacity = '1';
    });

    dot.addEventListener('mouseleave', function () {
      tooltip.style.opacity = '0';
    });
  });
}


/* ── 12. WIDGET CHAT — SEND MESSAGE ──────────────────────────────
   Appends new "self" message bubbles to #chat-messages-list.
   Triggered by the send button or Enter key.
   Uses the new .chat-content wrapper for robust right-alignment.
────────────────────────────────────────────────────────────────── */
function initWidgetChat() {
  var input   = document.getElementById('chat-input-field');
  var sendBtn = document.getElementById('btn-chat-send');
  var list    = document.getElementById('chat-messages-list');

  if (!input || !sendBtn || !list) return;

  function sendMessage() {
    var text = input.value.trim();
    if (!text) return;

    var msg = document.createElement('div');
    msg.className = 'chat-message self';
    msg.innerHTML =
      '<div class="chat-avatar" style="background:#2563eb" aria-hidden="true">A</div>' +
      '<div class="chat-content">' +
        '<div class="chat-sender">You</div>' +
        '<div class="chat-bubble">' + escapeHTML(text) + '</div>' +
      '</div>';

    list.appendChild(msg);
    input.value = '';
    list.scrollTop = list.scrollHeight;
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
}


/* ── 13. DOWNLOAD BUTTONS — FEEDBACK ANIMATION ───────────────────
   Shows a green checkmark for 1.8 s then reverts.
   Wire data-href to a real URL for actual file downloads.
────────────────────────────────────────────────────────────────── */
function initDownloadButtons() {
  document.querySelectorAll('.btn-download').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();

      var original = btn.innerHTML;
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      btn.style.background = '#16a34a';
      btn.style.color      = '#fff';

      setTimeout(function () {
        btn.innerHTML       = original;
        btn.style.background = '';
        btn.style.color      = '';
      }, 1800);
    });
  });
}


/* ── 14. ACTIVE NAV LINK SWITCHING ──────────────────────────────
   Manages .active state for sidebar links that don't switch
   sections (e.g. chat, calendar). Section-switching links
   are handled by initNavigation() above.
────────────────────────────────────────────────────────────────── */
function initNavLinks() {
  var links = document.querySelectorAll('#sidebar .nav-link');

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      /* Skip links that navigate to real URLs */
      if (href && href !== '#') return;

      /* Don't interfere with section-switching links (handled elsewhere) */
      var sectionNavIds = ['nav-dashboard', 'nav-courses', 'nav-grades', 'nav-settings'];
      if (sectionNavIds.indexOf(link.id) !== -1) return;

      e.preventDefault();
      links.forEach(function (l) {
        l.classList.remove('active');
        l.removeAttribute('aria-current');
      });
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    });
  });
}


/* ── 15. MODAL SYSTEM ────────────────────────────────────────────
   Centralised modal management.
   - One shared backdrop (click to close)
   - ESC key to close
   - Focus trap for accessibility (Tab key stays inside modal)
   - All modal triggers wired here
────────────────────────────────────────────────────────────────── */
function initModalSystem() {
  var activeModal = null;
  var backdrop    = document.getElementById('modal-backdrop');

  /* ── 15a. Helpers ── */
  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;

    /* Close any currently open modal first */
    if (activeModal && activeModal !== modal) closeModal(activeModal.id);

    modal.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('active');
    backdrop.setAttribute('aria-hidden', 'false');
    activeModal = modal;
    document.body.style.overflow = 'hidden';

    /* Focus first interactive element */
    var focusable = modal.querySelectorAll('button, input, select, textarea, [tabindex="0"]');
    if (focusable.length) setTimeout(function () { focusable[0].focus(); }, 50);
  }

  function closeModal(target) {
    var modal = typeof target === 'string' ? document.getElementById(target) : target;
    if (!modal) return;

    modal.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('active');
    backdrop.setAttribute('aria-hidden', 'true');
    activeModal = null;
    document.body.style.overflow = '';
  }

  /* Expose globally so Upload and AI sections can call openModal */
  initModalSystem._open  = openModal;
  initModalSystem._close = closeModal;

  /* ── 15b. Backdrop + ESC ── */
  backdrop.addEventListener('click', function () {
    if (activeModal) closeModal(activeModal);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && activeModal) closeModal(activeModal);
  });

  /* ── Focus trap ── */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !activeModal) return;

    var focusable = Array.from(activeModal.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'
    )).filter(function (el) { return el.offsetParent !== null; });

    if (!focusable.length) return;

    var first = focusable[0];
    var last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

  /* ── 15c. Assignments ── */
  wire('btn-assignments-view-all', function () { openModal('modal-assignments'); });
  wire('modal-assignments-close',  function () { closeModal('modal-assignments'); });

  /* ── 15d. Grade Report ── */
  wire('btn-grades-detail',  function () { openModal('modal-grade-report'); });
  wire('modal-grades-close', function () { closeModal('modal-grade-report'); });

  /* ── 15e. Chat Expand ── */
  wire('btn-chat-expand',  function () { openModal('modal-chat'); });
  wire('modal-chat-close', function () { closeModal('modal-chat'); });

  /* ── 15f. Notes ── */
  wire('btn-notes-view-all', function () { openModal('modal-notes'); });
  wire('modal-notes-close',  function () { closeModal('modal-notes'); });

  /* ── 15g. Profile modal — opened by name link AND avatars ── */
  function openProfile() { openModal('modal-profile'); }

  wire('modal-profile-close', function () { closeModal('modal-profile'); });
  wire('topbar-avatar', openProfile);
  wire('sidebar-avatar', openProfile);

  /* The greeting-name link is re-created by setDynamicGreeting, so delegate */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('#btn-open-profile');
    if (link) { e.preventDefault(); openProfile(); }
  });

  /* Profile sync button */
  wire('btn-sync-portal', function () {
    var syncEl = document.getElementById('btn-sync-portal');
    if (syncEl) {
      var orig = syncEl.innerHTML;
      syncEl.innerHTML = '<svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> Syncing…';
      setTimeout(function () {
        syncEl.innerHTML = orig;
        var lastSync = document.getElementById('profile-last-sync');
        if (lastSync) lastSync.textContent = 'Just now';
        showToast('✓ Portal synced — all records up to date.', 'success');
      }, 1800);
    }
  });

  /* ── 15h. Feedback / Report Issue modal ── */
  wire('btn-report-issue',      function () { openModal('modal-feedback'); });
  wire('modal-feedback-close',  function () { closeModal('modal-feedback'); });
  wire('btn-feedback-cancel',   function () { closeModal('modal-feedback'); });

  /* Handle feedback form submission */
  var feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var type    = document.getElementById('feedback-type')?.value;
      var subject = document.getElementById('feedback-subject')?.value.trim();
      var desc    = document.getElementById('feedback-desc')?.value.trim();

      if (!type || !subject || !desc) {
        showToast('⚠️ Please fill in all fields before submitting.', 'warning');
        return;
      }

      closeModal('modal-feedback');
      feedbackForm.reset();
      showToast('✅ Report submitted. The Eutyco IT team will respond within 24 hours.', 'success', 5000);
    });
  }

  /* AI and Upload modal close buttons */
  wire('modal-ai-close',     function () { closeModal('modal-ai'); });
  wire('modal-upload-close', function () { closeModal('modal-upload'); });

  /* ── 15i. Assignment filter pills ── */
  document.querySelectorAll('.filter-pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.filter-pill').forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');

      var filter = pill.getAttribute('data-filter');
      document.querySelectorAll('.modal-assignment-item').forEach(function (item) {
        var status = item.getAttribute('data-status') || 'upcoming';
        var show   = filter === 'all' || status === filter;
        item.classList.toggle('hidden', !show);
        item.style.display = show ? '' : 'none';
      });
    });
  });

  /* ── 15j. Grade report actions ── */
  wire('btn-download-pdf-report', function () {
    closeModal('modal-grade-report');
    showToast('📄 PDF report queued for download.', 'success');
  });
  wire('btn-email-advisor', function () {
    showToast('📧 Message sent to Dr. Okonkwo — your academic advisor.', 'success');
  });

  /* ── 15k. Expanded chat messaging (modal) ── */
  (function () {
    var input   = document.getElementById('modal-chat-input-field');
    var sendBtn = document.getElementById('btn-modal-chat-send');
    var list    = document.getElementById('modal-chat-messages-list');
    if (!input || !sendBtn || !list) return;

    function send() {
      var text = input.value.trim();
      if (!text) return;

      var msg = document.createElement('div');
      msg.className = 'chat-message self';
      msg.innerHTML =
        '<div class="chat-avatar" style="background:#2563eb" aria-hidden="true">A</div>' +
        '<div class="chat-content">' +
          '<div class="chat-sender">You</div>' +
          '<div class="chat-bubble">' + escapeHTML(text) + '</div>' +
        '</div>';

      list.appendChild(msg);
      input.value = '';
      list.scrollTop = list.scrollHeight;
    }

    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });
  })();

  /* ── 15l. File attach buttons ── */
  attachFileInput('btn-modal-attach',  'modal-file-input',  'the group chat');
  attachFileInput('btn-widget-attach', 'widget-file-input', 'chat');

  /* ── Small helpers ── */
  function wire(id, handler) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', handler);
  }

  function attachFileInput(btnId, inputId, context) {
    var btn   = document.getElementById(btnId);
    var input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener('click', function () { input.click(); });
    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      if (file) {
        showToast('📎 "' + file.name + '" attached to ' + context + '.', 'success');
        input.value = '';
      }
    });
  }
}


/* ── 16. UPLOAD WORK BUTTONS ─────────────────────────────────────
   Each .btn-upload-work reads data-assignment, sets the modal
   context label, then opens modal-upload.
   Simulates upload progress 0 → 100% over ~2 seconds.
────────────────────────────────────────────────────────────────── */
function initUploadButtons() {
  document.querySelectorAll('.btn-upload-work').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();

      var name  = btn.getAttribute('data-assignment') || 'Assignment';
      var nameEl = document.getElementById('upload-assignment-name');
      if (nameEl) nameEl.textContent = name;

      /* Reset state */
      var dropZone  = document.getElementById('upload-drop-zone');
      var progress  = document.getElementById('upload-progress-area');
      var successEl = document.getElementById('upload-success');
      var fillEl    = document.getElementById('upload-progress-fill');
      var pctEl     = document.getElementById('upload-pct');

      if (dropZone)  dropZone.style.display  = '';
      if (progress)  progress.style.display  = 'none';
      if (successEl) successEl.style.display = 'none';
      if (fillEl)    fillEl.style.width       = '0%';
      if (pctEl)     pctEl.textContent        = '0%';

      if (initModalSystem._open) initModalSystem._open('modal-upload');
    });
  });

  /* Browse Files button triggers hidden file input */
  var browseBtn    = document.getElementById('btn-browse-files');
  var uploadInput  = document.getElementById('upload-file-input');
  var progressArea = document.getElementById('upload-progress-area');
  var progressFill = document.getElementById('upload-progress-fill');
  var uploadPct    = document.getElementById('upload-pct');
  var uploadName   = document.getElementById('upload-file-name');
  var successMsg   = document.getElementById('upload-success');
  var dropZone     = document.getElementById('upload-drop-zone');

  if (!browseBtn || !uploadInput) return;

  browseBtn.addEventListener('click', function () { uploadInput.click(); });

  uploadInput.addEventListener('change', function () {
    var file = uploadInput.files && uploadInput.files[0];
    if (!file) return;

    if (dropZone)     dropZone.style.display     = 'none';
    if (progressArea) progressArea.style.display = '';
    if (successMsg)   successMsg.style.display   = 'none';
    if (uploadName)   uploadName.textContent      = file.name;

    uploadInput.value = '';

    var pct   = 0;
    var timer = setInterval(function () {
      pct += Math.floor(Math.random() * 14) + 4; /* random increment 4–17 */
      if (pct >= 100) {
        pct = 100;
        clearInterval(timer);
        setTimeout(function () {
          if (progressArea) progressArea.style.display = 'none';
          if (successMsg)   successMsg.style.display   = '';
          var assignName = document.getElementById('upload-assignment-name');
          showToast('✅ "' + (assignName ? assignName.textContent : 'Assignment') + '" submitted successfully.', 'success');
        }, 500);
      }
      if (progressFill) progressFill.style.width = pct + '%';
      if (uploadPct)    uploadPct.textContent     = pct + '%';
    }, 80);
  });
}


/* ── 17. ASK AI ASSISTANT BUTTONS ────────────────────────────────
   Sparkle buttons (.btn-ai-assist) read data-assignment,
   set the AI modal context pill, clear previous chat history,
   then open modal-ai.
   Suggestion buttons and typed messages generate simulated replies.
────────────────────────────────────────────────────────────────── */
function initAskAIButtons() {
  /* Wire each assignment sparkle button */
  document.querySelectorAll('.btn-ai-assist').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();

      var assignment = btn.getAttribute('data-assignment') || 'Your Assignment';
      var ctxEl      = document.getElementById('ai-assignment-context');
      if (ctxEl) ctxEl.textContent = assignment;

      /* Reset AI chat to greeting */
      var chatArea = document.getElementById('ai-chat-area');
      if (chatArea) {
        chatArea.innerHTML =
          '<div class="ai-bubble ai">' +
            '<span class="ai-sparkle-icon small" aria-hidden="true">✦</span>' +
            ' Hi Alex! I can help with <strong>' + escapeHTML(assignment) + '</strong>. Where shall we start?' +
          '</div>';
      }

      if (initModalSystem._open) initModalSystem._open('modal-ai');
    });
  });

  /* Suggestion buttons */
  document.querySelectorAll('.ai-suggestion-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      appendAIExchange(btn.textContent.trim());
    });
  });

  /* Typed message */
  var aiInput   = document.getElementById('ai-chat-input');
  var aiSendBtn = document.getElementById('btn-ai-send');

  if (aiInput && aiSendBtn) {
    aiSendBtn.addEventListener('click', sendAIMessage);
    aiInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAIMessage(); }
    });
  }

  function sendAIMessage() {
    if (!aiInput) return;
    var text = aiInput.value.trim();
    if (!text) return;
    aiInput.value = '';
    appendAIExchange(text);
  }

  function appendAIExchange(userText) {
    var chatArea = document.getElementById('ai-chat-area');
    if (!chatArea) return;

    /* User bubble */
    var userBubble = document.createElement('div');
    userBubble.className = 'ai-bubble user';
    userBubble.textContent = userText;
    chatArea.appendChild(userBubble);
    chatArea.scrollTop = chatArea.scrollHeight;

    /* Simulated AI response after brief "thinking" delay */
    setTimeout(function () {
      var aiBubble = document.createElement('div');
      aiBubble.className = 'ai-bubble ai';
      aiBubble.innerHTML =
        '<span class="ai-sparkle-icon small" aria-hidden="true">✦</span> ' +
        escapeHTML(generateAIReply(userText));
      chatArea.appendChild(aiBubble);
      chatArea.scrollTop = chatArea.scrollHeight;
    }, 900);
  }

  /**
   * Returns a contextual placeholder response.
   * Replace with a real API call in production.
   */
  function generateAIReply(prompt) {
    var p = prompt.toLowerCase();
    if (p.includes('summar') || p.includes('lecture'))
      return 'Here\'s a concise summary of the key concepts relevant to this topic, highlighting the most exam-critical sections for you.';
    if (p.includes('outline') || p.includes('structure'))
      return 'Suggested outline: Introduction → Background Review → Methodology → Analysis → Conclusion. Want me to expand any section in detail?';
    if (p.includes('research') || p.includes('paper'))
      return 'I found 5 relevant papers. Key authors: Johnson (2024) on complexity analysis and Patel et al. (2023) on modern approaches. Shall I summarise one?';
    if (p.includes('mistake') || p.includes('check') || p.includes('draft'))
      return 'Common pitfalls to avoid: 1) Insufficient citations, 2) Weak thesis statement, 3) Missing edge-case analysis. Share your draft and I\'ll review it specifically.';
    if (p.includes('deadline') || p.includes('plan') || p.includes('schedule'))
      return 'Here\'s a 3-day plan: Day 1 — Research & outline (2 hrs). Day 2 — First draft (3 hrs). Day 3 — Revise & submit (1 hr). Want reminders set?';
    return 'That\'s a great question. Based on the course materials and your current progress, I\'d recommend focusing on the core concepts first. Would you like me to elaborate on a specific aspect?';
  }
}


/* ── 18. PINNED ITEMS ────────────────────────────────────────────
   Manage-pins button shows a toast.
   Pin links smooth-scroll to their target widget section.
────────────────────────────────────────────────────────────────── */
function initPinnedItems() {
  var managePinsBtn = document.getElementById('btn-manage-pins');
  if (managePinsBtn) {
    managePinsBtn.addEventListener('click', function () {
      showToast('📌 To manage pins, right-click any nav item and select "Pin to Sidebar". Changes are saved automatically.', 'default', 4500);
    });
  }

  document.querySelectorAll('.pin-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;

      var targetId = href.replace('#', '');
      var target   = document.getElementById(targetId);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      /* Close mobile sidebar */
      if (window.innerWidth <= 768) {
        var sidebar = document.getElementById('sidebar');
        var overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}


/* ── 19. TO-DO / FOCUS LIST ──────────────────────────────────────
   Full CRUD task list with:
   - Add task (input + button / Enter key)
   - Toggle done/undone
   - Delete task (hover to reveal × button)
   - GPA projection insight panel (AI simulation)
   - localStorage persistence
────────────────────────────────────────────────────────────────── */
function initTodoList() {
  var input      = document.getElementById('todo-input');
  var addBtn     = document.getElementById('btn-todo-add');
  var listEl     = document.getElementById('todo-list');
  var emptyEl    = document.getElementById('todo-empty');
  var insightEl  = document.getElementById('todo-insight-text');

  if (!input || !addBtn || !listEl) return;

  /* Load saved todos from localStorage */
  var todos = [];
  try {
    todos = JSON.parse(localStorage.getItem('eutyco-todos') || '[]');
  } catch (e) {
    todos = [];
  }

  /* Initial render */
  render();

  /* Add task on button click or Enter */
  addBtn.addEventListener('click', addTask);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); addTask(); }
  });

  function addTask() {
    var text = input.value.trim();
    if (!text) return;

    todos.push({ text: text, done: false, id: Date.now() });
    input.value = '';
    save();
    render();
    showToast('✅ Task added to your focus list.', 'success', 2000);
  }

  function render() {
    listEl.innerHTML = '';

    if (emptyEl) emptyEl.style.display = todos.length ? 'none' : '';

    todos.forEach(function (todo, idx) {
      var item = document.createElement('div');
      item.className = 'todo-item' + (todo.done ? ' done' : '');
      item.setAttribute('role', 'listitem');

      var cb = document.createElement('div');
      cb.className = 'todo-checkbox' + (todo.done ? ' checked' : '');
      cb.setAttribute('role', 'checkbox');
      cb.setAttribute('aria-checked', String(todo.done));
      cb.setAttribute('tabindex', '0');
      cb.setAttribute('aria-label', 'Mark task ' + (todo.done ? 'undone' : 'done'));

      var txt = document.createElement('span');
      txt.className = 'todo-text';
      txt.textContent = todo.text;

      var delBtn = document.createElement('button');
      delBtn.className = 'btn-todo-delete';
      delBtn.setAttribute('aria-label', 'Delete task: ' + todo.text);
      delBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

      /* Toggle done */
      function toggleDone() {
        todos[idx].done = !todos[idx].done;
        save();
        render();
      }

      cb.addEventListener('click', toggleDone);
      cb.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDone(); }
      });

      /* Delete */
      delBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        todos.splice(idx, 1);
        save();
        render();
      });

      item.appendChild(cb);
      item.appendChild(txt);
      item.appendChild(delBtn);
      listEl.appendChild(item);
    });

    updateInsight();
  }

  function save() {
    try { localStorage.setItem('eutyco-todos', JSON.stringify(todos)); } catch (e) {}
  }

  /**
   * Updates the AI GPA insight text based on task completion rate.
   * This simulates the intelligence hook showing how consistency
   * impacts projected GPA — a motivational feedback loop.
   */
  function updateInsight() {
    if (!insightEl) return;

    var total    = todos.length;
    var done     = todos.filter(function (t) { return t.done; }).length;
    var rate     = total > 0 ? Math.round((done / total) * 100) : 0;

    var gpaDelta, insight;

    if (total === 0) {
      insight = 'Start adding focus tasks to see your AI-powered GPA impact analysis.';
    } else if (rate === 100) {
      gpaDelta = '+0.18';
      insight = '<strong>100% of tasks complete!</strong> Projected GPA impact: <strong style="color:#16a34a">' + gpaDelta + '</strong> — consistent high achievers attract research collaboration opportunities.';
    } else if (rate >= 80) {
      gpaDelta = '+0.12';
      insight = '<strong>' + rate + '% complete.</strong> Excellent consistency. Projected GPA impact: <strong style="color:#16a34a">' + gpaDelta + '</strong>.';
    } else if (rate >= 50) {
      gpaDelta = '+0.05';
      insight = '<strong>' + rate + '% complete.</strong> Good progress. Projected GPA impact: <strong>' + gpaDelta + '</strong>. Completing all tasks could boost it further.';
    } else if (rate > 0) {
      gpaDelta = '+0.01';
      insight = '<strong>' + rate + '% complete (' + done + '/' + total + ').</strong> Projected GPA impact: <strong>' + gpaDelta + '</strong>. Focus on completing more tasks today.';
    } else {
      gpaDelta = '−0.05';
      insight = '<strong>0% tasks completed.</strong> Consistent inaction projects a GPA impact of <strong style="color:var(--clr-urgent)">' + gpaDelta + '</strong>. Check off even one task to start.';
    }

    insightEl.innerHTML = insight;
  }
}


/* ── 20. NOTIFICATIONS DROPDOWN ──────────────────────────────────
   Bell button toggles a dropdown panel.
   Clicking outside or pressing ESC closes it.
   "Mark all read" removes unread styling and clears the dot.
────────────────────────────────────────────────────────────────── */
function initNotifications() {
  var btn      = document.getElementById('btn-notifications');
  var dropdown = document.getElementById('notif-dropdown');
  var markAll  = document.getElementById('btn-mark-all-read');
  var notifDot = btn ? btn.querySelector('.notif-dot') : null;

  if (!btn || !dropdown) return;

  /* Toggle dropdown */
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = dropdown.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  /* Close when clicking outside */
  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target) && e.target !== btn) {
      dropdown.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ESC to close */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && dropdown.classList.contains('open')) {
      dropdown.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  /* Mark all read */
  if (markAll) {
    markAll.addEventListener('click', function () {
      dropdown.querySelectorAll('.notif-dot-indicator').forEach(function (d) {
        d.classList.remove('unread'); // remove blue colour
        d.classList.add('read');
      });
      dropdown.querySelectorAll('.notif-item.unread').forEach(function (item) {
        item.classList.remove('unread');
      });
      /* Remove the red dot on the bell */
      if (notifDot) notifDot.remove();
      showToast('✓ All notifications marked as read.', 'success');
    });
  }

  /* Clicking an individual notification item */
  dropdown.querySelectorAll('.notif-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var dot = item.querySelector('.notif-dot-indicator');
      if (dot) { dot.classList.remove('unread'); dot.classList.add('read'); }
      item.classList.remove('unread');

      /* Check if all read → remove bell dot */
      var anyUnread = dropdown.querySelector('.notif-item.unread');
      if (!anyUnread && notifDot) notifDot.remove();

      dropdown.classList.remove('open');
    });
  });

  /* View all link */
  var viewAll = document.getElementById('btn-view-all-notifs');
  if (viewAll) {
    viewAll.addEventListener('click', function (e) {
      e.preventDefault();
      dropdown.classList.remove('open');
      showToast('📋 Full notification history coming soon.', 'default');
    });
  }
}


/* ── 21. VIDEO / AUDIO CALL BUTTONS ──────────────────────────────
   Stub handlers for the call icon buttons in the chat widget.
   Replace with real WebRTC / Zoom / Meet integration in production.
────────────────────────────────────────────────────────────────── */
function initCallButtons() {
  var audioBtn = document.getElementById('btn-audio-call');
  var videoBtn = document.getElementById('btn-video-call');

  if (audioBtn) {
    audioBtn.addEventListener('click', function () {
      showToast('📞 Starting audio call with CS 202 Study Group…', 'default', 3500);
      /* INTEGRATION POINT: AudioCallModule.start('cs202-group'); */
    });
  }

  if (videoBtn) {
    videoBtn.addEventListener('click', function () {
      showToast('🎥 Starting video call with CS 202 Study Group…', 'default', 3500);
      /* INTEGRATION POINT: VideoCallModule.start('cs202-group'); */
    });
  }
}


/* ── 22. TOAST NOTIFICATION SYSTEM ──────────────────────────────
   Creates temporary toast messages in #toast-container.

   @param {string} message   - Text content to display.
   @param {string} [type]    - 'success' | 'warning' | 'error' | 'default'
   @param {number} [duration] - Milliseconds before auto-dismiss (default 3200)
────────────────────────────────────────────────────────────────── */
function showToast(message, type, duration) {
  type     = type     || 'default';
  duration = duration || 3200;

  var container = document.getElementById('toast-container');
  if (!container) return;

  var icons = { success: '✅', warning: '⚠️', error: '❌', default: 'ℹ️' };

  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML =
    '<span class="toast-icon" aria-hidden="true">' + (icons[type] || '💬') + '</span>' +
    '<span>' + escapeHTML(message) + '</span>';

  container.appendChild(toast);

  /* Auto-dismiss with fade-out */
  setTimeout(function () {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity    = '0';
    toast.style.transform  = 'translateX(110%)';
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 320);
  }, duration);
}


/* ── 23. ROUTING ARCHITECTURE API ────────────────────────────────
   Exposed on window.UniPortal so the wider project's routing
   logic can call these from any script or page.

   USAGE:
     UniPortal.showFacultyPortalLink('/faculty');
     UniPortal.showMastersPortalLink('/masters');
     UniPortal.scrollToWidget('widget-assignments');
     UniPortal.goToFacultyPortal();
────────────────────────────────────────────────────────────────── */
window.UniPortal = {

  /** Reveal the Faculty Portal sidebar link. */
  showFacultyPortalLink: function (href) {
    var link = document.getElementById('nav-faculty-portal');
    if (!link) return;
    link.style.display = 'flex';
    if (href) link.setAttribute('href', href);
  },

  /** Reveal the Master's Portal sidebar link. */
  showMastersPortalLink: function (href) {
    var link = document.getElementById('nav-masters-portal');
    if (!link) return;
    link.style.display = 'flex';
    if (href) link.setAttribute('href', href);
  },

  /** Smooth-scroll to a dashboard widget by its element ID. */
  scrollToWidget: function (widgetId) {
    var el = document.getElementById(widgetId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  /** Navigate to the Faculty Portal page. */
  goToFacultyPortal: function () {
    var link = document.getElementById('nav-faculty-portal');
    window.location.href = (link && link.href) || '/faculty-portal';
  },

  /** Navigate to the Master's Portal page. */
  goToMastersPortal: function () {
    var link = document.getElementById('nav-masters-portal');
    window.location.href = (link && link.href) || '/masters-portal';
  }
};


/* ── 24. BUTTON INTERACTION STUBS ────────────────────────────────
   Console stubs for nav items / buttons not yet wired to real
   routes. Replace console.log() with router.push() or
   modal.open() when those modules are available.
────────────────────────────────────────────────────────────────── */
function initButtonStubs() {
  var stubs = {
    'btn-schedule-view-all': function () {
      showToast('📅 Full schedule view coming soon.', 'default');
    },
    'nav-chat': function (e) {
      e && e.preventDefault();
      showToast('💬 Chat is open in the widget below.', 'default');
      UniPortal.scrollToWidget('widget-chat');
    },
    'nav-calendar': function (e) {
      e && e.preventDefault();
      showToast('📅 Calendar module coming soon.', 'default');
    },
    'nav-assignments': function (e) {
      e && e.preventDefault();
      /* Open the assignments modal directly from sidebar */
      if (initModalSystem._open) initModalSystem._open('modal-assignments');
    }
  };

  Object.keys(stubs).forEach(function (id) {
    var handler = stubs[id];
    var el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('click', handler);

    /* Keyboard support for role="button" elements */
    if (el.getAttribute('role') === 'button') {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(e); }
      });
    }
  });
}


/* ── 25. ANIMATE GRADE CHART ON LOAD ─────────────────────────────
   Uses SVG stroke-dashoffset technique to "draw" the grade
   trend line from left to right on first load.

   Technique:
   1. Measure total path length via getTotalLength().
   2. Set dasharray = length (the line is one long dash).
   3. Set dashoffset = length (slides the dash off → invisible).
   4. Transition dashoffset → 0 (the line "draws" itself in).
────────────────────────────────────────────────────────────────── */
function animateChart() {
  var line = document.getElementById('chart-line');
  if (!line) return;

  var length = line.getTotalLength();

  line.style.strokeDasharray  = length;
  line.style.strokeDashoffset = length;
  line.style.transition       = 'stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s';

  /*
   * Double rAF ensures the browser has painted the invisible
   * start state before beginning the animation.
   * Without this, the transition may be skipped entirely.
   */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      line.style.strokeDashoffset = '0';
    });
  });
}