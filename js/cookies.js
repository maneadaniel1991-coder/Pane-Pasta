// cookies.js - Comprehensive Cookie Management System

// Core Cookie Functions
function setCookie(name, value, days, secure = true, sameSite = 'Strict') {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    
    let cookieString = name + "=" + (value || "") + expires + "; path=/";
    
    if (secure && window.location.protocol === 'https:') {
        cookieString += "; Secure";
    }
    
    cookieString += "; SameSite=" + sameSite;
    
    document.cookie = cookieString;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// Cookie Categories
const CookieCategories = {
    NECESSARY: 'necessary',
    FUNCTIONAL: 'functional', 
    ANALYTICS: 'analytics',
    MARKETING: 'marketing'
};

// Cookie Consent Management
class CookieConsent {
    constructor() {
        this.consentGiven = false;
        this.preferences = {
            [CookieCategories.NECESSARY]: true, // Always true
            [CookieCategories.FUNCTIONAL]: false,
            [CookieCategories.ANALYTICS]: false,
            [CookieCategories.MARKETING]: false
        };
        
        this.init();
    }
    
    init() {
        // Check if consent already given
        const consent = getCookie('cookie_consent');
        if (consent) {
            this.consentGiven = true;
            this.loadPreferences();
            this.applyCookieSettings();
        } else {
            this.showConsentBanner();
        }
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    showConsentBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'block';
        }
    }
    
    hideConsentBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }
    
    acceptAll() {
        this.preferences = {
            [CookieCategories.NECESSARY]: true,
            [CookieCategories.FUNCTIONAL]: true,
            [CookieCategories.ANALYTICS]: true,
            [CookieCategories.MARKETING]: true
        };
        
        this.saveConsent();
        this.applyCookieSettings();
        this.hideConsentBanner();
    }
    
    rejectAll() {
        this.preferences = {
            [CookieCategories.NECESSARY]: true, // Always true
            [CookieCategories.FUNCTIONAL]: false,
            [CookieCategories.ANALYTICS]: false,
            [CookieCategories.MARKETING]: false
        };
        
        this.saveConsent();
        this.applyCookieSettings();
        this.hideConsentBanner();
    }
    
    saveCustomPreferences() {
        // Get preferences from modal checkboxes
        this.preferences[CookieCategories.FUNCTIONAL] = 
            document.getElementById('functional-cookies')?.checked || false;
        this.preferences[CookieCategories.ANALYTICS] = 
            document.getElementById('analytics-cookies')?.checked || false;
        this.preferences[CookieCategories.MARKETING] = 
            document.getElementById('marketing-cookies')?.checked || false;
        
        this.saveConsent();
        this.applyCookieSettings();
        this.hideConsentBanner();
        this.closeSettingsModal();
    }
    
    saveConsent() {
        setCookie('cookie_consent', 'given', 365);
        setCookie('cookie_preferences', JSON.stringify(this.preferences), 365);
        this.consentGiven = true;
    }
    
    loadPreferences() {
        const prefs = getCookie('cookie_preferences');
        if (prefs) {
            try {
                this.preferences = { ...this.preferences, ...JSON.parse(prefs) };
            } catch (e) {
                console.warn('Failed to parse cookie preferences');
            }
        }
    }
    
    applyCookieSettings() {
        // Apply functional cookies
        if (this.preferences[CookieCategories.FUNCTIONAL]) {
            this.enableFunctionalCookies();
        }
        
        // Apply analytics cookies
        if (this.preferences[CookieCategories.ANALYTICS]) {
            this.enableAnalytics();
        }
        
        // Apply marketing cookies
        if (this.preferences[CookieCategories.MARKETING]) {
            this.enableMarketing();
        }
    }
    
    enableFunctionalCookies() {
        // Enable user preferences, theme settings, etc.
        console.log('Functional cookies enabled');
        
        // Load saved theme
        const savedTheme = getCookie('site_theme');
        if (savedTheme) {
            this.applyTheme(savedTheme);
        }
        
        // Load other user preferences
        this.loadUserPreferences();
    }
    
    enableAnalytics() {
        console.log('Analytics cookies enabled');
        
        // Example: Google Analytics (replace with your tracking ID)
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        
        // Track page view
        this.trackPageView();
    }
    
    enableMarketing() {
        console.log('Marketing cookies enabled');
        
        // Example: Marketing pixels, retargeting, etc.
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'granted'
            });
        }
    }
    
    // User Preference Functions
    saveTheme(theme) {
        if (this.preferences[CookieCategories.FUNCTIONAL]) {
            setCookie('site_theme', theme, 365);
            this.applyTheme(theme);
        }
    }
    
    applyTheme(theme) {
        document.body.className = document.body.className.replace(/\w*-theme/g, '');
        document.body.classList.add(theme + '-theme');
        
        // Update theme selector if it exists
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            themeSelector.value = theme;
        }
    }
    
    loadUserPreferences() {
        // Load other saved preferences
        const language = getCookie('preferred_language');
        if (language) {
            this.setLanguage(language);
        }
        
        const fontSize = getCookie('font_size');
        if (fontSize) {
            this.setFontSize(fontSize);
        }
    }
    
    setLanguage(lang) {
        if (this.preferences[CookieCategories.FUNCTIONAL]) {
            setCookie('preferred_language', lang, 365);
            // Apply language changes
            document.documentElement.lang = lang;
        }
    }
    
    setFontSize(size) {
        if (this.preferences[CookieCategories.FUNCTIONAL]) {
            setCookie('font_size', size, 365);
            document.documentElement.style.fontSize = size;
        }
    }
    
    // Analytics Functions
    trackPageView() {
        if (this.preferences[CookieCategories.ANALYTICS]) {
            // Simple page view tracking
            const pageData = {
                page: window.location.pathname,
                title: document.title,
                timestamp: new Date().toISOString()
            };
            
            console.log('Page view tracked:', pageData);
            
            // You can send this to your analytics service
            // Example: Google Analytics, Adobe Analytics, etc.
        }
    }
    
    trackEvent(eventName, eventData = {}) {
        if (this.preferences[CookieCategories.ANALYTICS]) {
            console.log('Event tracked:', eventName, eventData);
            
            // Send to analytics service
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, eventData);
            }
        }
    }
    
    // Settings Modal Functions
    openSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            // Update checkboxes with current preferences
            document.getElementById('functional-cookies').checked = 
                this.preferences[CookieCategories.FUNCTIONAL];
            document.getElementById('analytics-cookies').checked = 
                this.preferences[CookieCategories.ANALYTICS];
            document.getElementById('marketing-cookies').checked = 
                this.preferences[CookieCategories.MARKETING];
            
            modal.style.display = 'block';
        }
    }
    
    closeSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    setupEventListeners() {
        // Banner buttons
        document.getElementById('accept-all-cookies')?.addEventListener('click', () => {
            this.acceptAll();
        });
        
        document.getElementById('reject-all-cookies')?.addEventListener('click', () => {
            this.rejectAll();
        });
        
        document.getElementById('cookie-settings-btn')?.addEventListener('click', () => {
            this.openSettingsModal();
        });
        
        // Modal buttons
        document.getElementById('save-cookie-preferences')?.addEventListener('click', () => {
            this.saveCustomPreferences();
        });
        
        document.getElementById('close-cookie-modal')?.addEventListener('click', () => {
            this.closeSettingsModal();
        });
        
        // Theme selector
        document.getElementById('theme-selector')?.addEventListener('change', (e) => {
            this.saveTheme(e.target.value);
        });
    }
}

// Initialize Cookie Consent when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cookieConsent = new CookieConsent();
});

// Utility functions for easy access
window.trackEvent = function(eventName, eventData) {
    if (window.cookieConsent) {
        window.cookieConsent.trackEvent(eventName, eventData);
    }
};

window.saveUserPreference = function(key, value, days = 365) {
    if (window.cookieConsent && window.cookieConsent.preferences[CookieCategories.FUNCTIONAL]) {
        setCookie(key, value, days);
    }
};
