/**
 * Northland ALX - Main JavaScript File
 * Production-Grade JavaScript for GitHub Pages
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    CAROUSEL_AUTO_INTERVAL: 7000,
    SCROLL_OFFSET: 80,
    ANIMATION_DURATION: 300
  };

  // Utility Functions
  const utils = {
    /**
     * Debounce function to limit function calls
     */
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    /**
     * Smooth scroll to element
     */
    smoothScrollTo: function(element, offset = 0) {
      const targetPosition = element.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    },

    /**
     * Check if element is in viewport
     */
    isInViewport: function(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    /**
     * Add event listener with error handling
     */
    addEventListenerSafe: function(element, event, handler, options = false) {
      if (element && typeof handler === 'function') {
        try {
          element.addEventListener(event, handler, options);
        } catch (error) {
          console.warn('Failed to add event listener:', error);
        }
      }
    }
  };

  // Carousel Module
  const carousel = {
    track: null,
    items: [],
    prevBtn: null,
    nextBtn: null,
    currentIndex: 0,
    autoInterval: null,
    isPlaying: true,

    init: function() {
      this.track = document.querySelector('.carousel-track');
      this.items = Array.from(document.querySelectorAll('.carousel-item'));
      this.prevBtn = document.querySelector('.carousel-btn.prev');
      this.nextBtn = document.querySelector('.carousel-btn.next');

      if (!this.track || this.items.length === 0) {
        console.warn('Carousel elements not found');
        return;
      }

      this.bindEvents();
      this.startAutoPlay();
    },

    bindEvents: function() {
      utils.addEventListenerSafe(this.prevBtn, 'click', () => this.goToPrevious());
      utils.addEventListenerSafe(this.nextBtn, 'click', () => this.goToNext());

      // Pause on hover
      utils.addEventListenerSafe(this.track.parentElement, 'mouseenter', () => this.pauseAutoPlay());
      utils.addEventListenerSafe(this.track.parentElement, 'mouseleave', () => this.startAutoPlay());

      // Touch/swipe support
      let startX = 0;
      let endX = 0;

      utils.addEventListenerSafe(this.track, 'touchstart', (e) => {
        startX = e.touches[0].clientX;
        this.pauseAutoPlay();
      });

      utils.addEventListenerSafe(this.track, 'touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const difference = startX - endX;

        if (Math.abs(difference) > 50) { // Minimum swipe distance
          if (difference > 0) {
            this.goToNext();
          } else {
            this.goToPrevious();
          }
        }
        this.startAutoPlay();
      });

      // Keyboard navigation
      utils.addEventListenerSafe(document, 'keydown', (e) => {
        if (this.isCarouselFocused()) {
          switch(e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              this.goToPrevious();
              break;
            case 'ArrowRight':
              e.preventDefault();
              this.goToNext();
              break;
          }
        }
      });
    },

    isCarouselFocused: function() {
      const carouselElement = this.track.parentElement;
      return carouselElement.contains(document.activeElement);
    },

    updateCarousel: function() {
      if (!this.track) return;
      
      const translateX = -this.currentIndex * 100;
      this.track.style.transform = `translateX(${translateX}%)`;
      
      // Update ARIA attributes for accessibility
      this.items.forEach((item, index) => {
        item.setAttribute('aria-hidden', index !== this.currentIndex);
      });
    },

    goToNext: function() {
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
      this.updateCarousel();
    },

    goToPrevious: function() {
      this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
      this.updateCarousel();
    },

    startAutoPlay: function() {
      if (this.autoInterval) {
        clearInterval(this.autoInterval);
      }
      
      this.autoInterval = setInterval(() => {
        if (this.isPlaying) {
          this.goToNext();
        }
      }, CONFIG.CAROUSEL_AUTO_INTERVAL);
      
      this.isPlaying = true;
    },

    pauseAutoPlay: function() {
      this.isPlaying = false;
    }
  };

  // Navigation Module
  const navigation = {
    init: function() {
      this.bindSmoothScrolling();
      this.bindMobileMenu();
      this.handleScrollEffects();
    },

    bindSmoothScrolling: function() {
      const navLinks = document.querySelectorAll('nav a[href^="#"]');
      
      navLinks.forEach(link => {
        utils.addEventListenerSafe(link, 'click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            utils.smoothScrollTo(targetElement, CONFIG.SCROLL_OFFSET);
          }
        });
      });
    },

    bindMobileMenu: function() {
      // Mobile menu functionality can be added here
      // Currently the nav is responsive with CSS flexbox
    },

    handleScrollEffects: function() {
      const navbar = document.querySelector('.fixed-navbar');
      const logo = document.querySelector('.logo');
      
      const handleScroll = utils.debounce(() => {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
          navbar?.classList.add('scrolled');
        } else {
          navbar?.classList.remove('scrolled');
        }
        
        // Switch logo based on background context
        this.updateLogoContext();
      }, 16); // ~60fps

      utils.addEventListenerSafe(window, 'scroll', handleScroll);
    },

    updateLogoContext: function() {
      const logo = document.querySelector('.logo');
      if (!logo) return;

      const rect = logo.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const elementBelow = document.elementFromPoint(centerX, centerY);
      const section = elementBelow?.closest('section, header, footer');
      
      if (section) {
        const bgColor = window.getComputedStyle(section).backgroundColor;
        const hasLightBg = this.isLightBackground(bgColor) || 
                          section.classList.contains('bg-white') ||
                          section.classList.contains('bg-gray-50') ||
                          section.classList.contains('bg-gray-100');
        
        if (hasLightBg) {
          logo.style.backgroundImage = 'url(assets/logo-dark.svg)';
        } else {
          logo.style.backgroundImage = 'url(assets/logo-light.svg)';
        }
      }
    },

    isLightBackground: function(rgbColor) {
      // Parse RGB and check if it's a light color
      const match = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const [, r, g, b] = match.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 155; // Threshold for light colors
      }
      return true; // Default to light
    }
  };

  // Form Handling Module
  const forms = {
    init: function() {
      this.handleContactForm();
      this.handleNewsletterForm();
    },

    handleContactForm: function() {
      const contactForm = document.getElementById('contactForm');
      
      utils.addEventListenerSafe(contactForm, 'submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (this.validateContactForm(data)) {
          this.submitContactForm(data);
        }
      });
    },

    handleNewsletterForm: function() {
      const newsletterForm = document.getElementById('newsletterForm');
      
      utils.addEventListenerSafe(newsletterForm, 'submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (this.validateEmail(email)) {
          this.submitNewsletterForm(email);
        }
      });
    },

    validateContactForm: function(data) {
      const { name, email, message } = data;
      
      if (!name?.trim()) {
        this.showNotification('Please enter your name', 'error');
        return false;
      }
      
      if (!this.validateEmail(email)) {
        this.showNotification('Please enter a valid email address', 'error');
        return false;
      }
      
      if (!message?.trim()) {
        this.showNotification('Please enter a message', 'error');
        return false;
      }
      
      return true;
    },

    validateEmail: function(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    submitContactForm: function(data) {
      // Here you would typically send the data to your backend
      console.log('Contact form submitted:', data);
      this.showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
      document.getElementById('contactForm').reset();
    },

    submitNewsletterForm: function(email) {
      // Here you would typically send the email to your newsletter service
      console.log('Newsletter subscription:', email);
      this.showNotification('Thank you for subscribing to our newsletter!', 'success');
      document.getElementById('newsletterForm').reset();
    },

    showNotification: function(message, type = 'info') {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
      
      // Style the notification
      Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        color: 'white',
        backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
        zIndex: '1000',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out'
      });
      
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
      }, 100);
      
      // Remove after 5 seconds
      setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 5000);
    }
  };

  // Logo Enhancement Module
  const logoEnhancer = {
    init: function() {
      this.setupLogoLoadingStates();
      this.setupLogoInteractions();
      this.setupContextSwitching();
    },

    setupLogoLoadingStates: function() {
      const logos = document.querySelectorAll('.logo');
      
      logos.forEach(logo => {
        logo.classList.add('loading');
        
        // Remove loading state after a short delay
        setTimeout(() => {
          logo.classList.remove('loading');
        }, 800);
      });
    },

    setupLogoInteractions: function() {
      const logos = document.querySelectorAll('.logo');
      
      logos.forEach(logo => {
        // Add click handler to navigate home
        utils.addEventListenerSafe(logo, 'click', () => {
          if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            window.location.href = '/';
          } else {
            // Smooth scroll to top if already on home page
            utils.smoothScrollTo(document.body, 0);
          }
        });

        // Add keyboard navigation
        logo.setAttribute('tabindex', '0');
        logo.setAttribute('role', 'button');
        logo.setAttribute('aria-label', 'Northland ALX Homepage');
        
        utils.addEventListenerSafe(logo, 'keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            logo.click();
          }
        });
      });
    },

    setupContextSwitching: function() {
      // Enhanced context switching based on intersection observer
      if ('IntersectionObserver' in window) {
        const logos = document.querySelectorAll('.logo');
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.updateLogoForContext(entry.target);
            }
          });
        }, {
          threshold: 0.5
        });

        logos.forEach(logo => observer.observe(logo));
      }
    },

    updateLogoForContext: function(logo) {
      const section = logo.closest('section, header, footer');
      if (!section) return;

      const hasLightBg = section.classList.contains('bg-white') ||
                        section.classList.contains('bg-gray-50') ||
                        section.classList.contains('bg-gray-100') ||
                        this.isLightBackgroundColor(section);

      if (hasLightBg) {
        logo.style.backgroundImage = 'url(assets/logo-dark.svg)';
      } else {
        logo.style.backgroundImage = 'url(assets/logo-light.svg)';
      }
    },

    isLightBackgroundColor: function(element) {
      const styles = window.getComputedStyle(element);
      const bgColor = styles.backgroundColor;
      
      if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        return true; // Default to light
      }

      const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const [, r, g, b] = match.map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5;
      }
      
      return true;
    }
  };
  const analytics = {
    init: function() {
      this.trackPageView();
      this.bindEventTracking();
    },

    trackPageView: function() {
      // Placeholder for analytics tracking
      console.log('Page view tracked');
    },

    bindEventTracking: function() {
      // Track button clicks
      const buttons = document.querySelectorAll('.button-primary');
      buttons.forEach(button => {
        utils.addEventListenerSafe(button, 'click', () => {
          this.trackEvent('Button Click', button.textContent.trim());
        });
      });

      // Track WhatsApp clicks
      const whatsappButton = document.querySelector('.whatsapp-float');
      utils.addEventListenerSafe(whatsappButton, 'click', () => {
        this.trackEvent('WhatsApp Click', 'Floating Button');
      });
    },

    trackEvent: function(action, label) {
      // Placeholder for event tracking
      console.log('Event tracked:', action, label);
    }
  };

  // Performance Optimization Module
  const performance = {
    init: function() {
      this.lazyLoadImages();
      this.preloadCriticalResources();
    },

    lazyLoadImages: function() {
      const images = document.querySelectorAll('img[loading="lazy"]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src || img.src;
              imageObserver.unobserve(img);
            }
          });
        });

        images.forEach(img => imageObserver.observe(img));
      }
    },

    preloadCriticalResources: function() {
      // Preload critical fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap';
      fontLink.as = 'style';
      document.head.appendChild(fontLink);

      // Preload logo assets
      const logoAssets = [
        'assets/logo-light.svg',
        'assets/logo-dark.svg',
        'assets/favicon.svg'
      ];

      logoAssets.forEach(asset => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = asset;
        link.as = 'image';
        link.type = 'image/svg+xml';
        document.head.appendChild(link);
      });

      // Preload and cache logos in memory
      logoAssets.forEach(asset => {
        const img = new Image();
        img.src = asset;
      });
    }
  };

  // Accessibility Module
  const accessibility = {
    init: function() {
      this.addSkipLinks();
      this.improveKeyboardNavigation();
      this.addARIALabels();
    },

    addSkipLinks: function() {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.textContent = 'Skip to main content';
      skipLink.className = 'skip-link';
      document.body.insertBefore(skipLink, document.body.firstChild);

      utils.addEventListenerSafe(skipLink, 'click', (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content') || document.querySelector('main') || document.querySelector('.content-offset');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView();
        }
      });
    },

    improveKeyboardNavigation: function() {
      // Add focus indicators and improve tab order
      const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
      
      focusableElements.forEach(element => {
        utils.addEventListenerSafe(element, 'focus', () => {
          element.classList.add('focused');
        });
        
        utils.addEventListenerSafe(element, 'blur', () => {
          element.classList.remove('focused');
        });
      });
    },

    addARIALabels: function() {
      // Add ARIA labels where needed
      const logo = document.querySelector('.logo');
      if (logo && !logo.getAttribute('aria-label')) {
        logo.setAttribute('aria-label', 'Northland ALX Logo');
      }

      // Add landmarks
      const header = document.querySelector('header');
      if (header && !header.getAttribute('role')) {
        header.setAttribute('role', 'banner');
      }

      const footer = document.querySelector('footer');
      if (footer && !footer.getAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
      }
    }
  };

  // Main Application
  const app = {
    init: function() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        utils.addEventListenerSafe(document, 'DOMContentLoaded', () => this.start());
      } else {
        this.start();
      }
    },

    start: function() {
      try {
        console.log('🚀 Northland ALX website initialized');
        
        // Initialize modules
        carousel.init();
        navigation.init();
        forms.init();
        logoEnhancer.init();
        analytics.init();
        performance.init();
        accessibility.init();
        
        // Add loaded class to body for CSS animations
        document.body.classList.add('loaded');
        
      } catch (error) {
        console.error('Error initializing application:', error);
      }
    }
  };

  // Error Handling
  window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
  });

  // Initialize the application
  app.init();

})();
