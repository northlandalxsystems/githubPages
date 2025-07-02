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

  // Products Module - Enhanced Immersive Functionality
  const products = {
    grid: null,
    cards: [],
    filterButtons: [],
    viewToggleButtons: [],
    searchInput: null,
    currentFilter: 'all',
    currentView: 'grid',
    modal: null,

    init: function() {
      this.grid = document.querySelector('.products-grid');
      this.cards = Array.from(document.querySelectorAll('.product-card'));
      this.filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
      this.viewToggleButtons = Array.from(document.querySelectorAll('.view-toggle'));

      if (!this.grid || this.cards.length === 0) {
        console.warn('Products section elements not found');
        return;
      }

      this.createSearchInput();
      this.createModal();
      this.bindEvents();
      this.initializeCards();
    },

    createSearchInput: function() {
      // Add search input to the products section
      const headerDiv = document.querySelector('#products .text-center.mb-12');
      if (headerDiv) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'max-w-md mx-auto mt-6';
        searchContainer.innerHTML = `
          <div class="relative">
            <input type="text" 
                   id="product-search" 
                   placeholder="Search solutions..." 
                   class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300">
            <svg class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        `;
        headerDiv.appendChild(searchContainer);
        this.searchInput = searchContainer.querySelector('#product-search');
      }
    },

    createModal: function() {
      // Create modal for product details
      const modalHTML = `
        <div id="product-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
          <div class="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 id="modal-title" class="text-2xl font-bold text-gray-900"></h3>
              <button id="modal-close" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div id="modal-content" class="p-6">
              <!-- Dynamic content will be inserted here -->
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      this.modal = document.getElementById('product-modal');
    },

    bindEvents: function() {
      // Category filter events
      this.filterButtons.forEach(button => {
        utils.addEventListenerSafe(button, 'click', (e) => {
          e.preventDefault();
          const category = button.dataset.category;
          this.filterProducts(category);
          this.updateActiveFilter(button);
        });
      });

      // View toggle events
      this.viewToggleButtons.forEach(button => {
        utils.addEventListenerSafe(button, 'click', (e) => {
          e.preventDefault();
          const view = button.dataset.view;
          this.toggleView(view);
          this.updateActiveViewToggle(button);
        });
      });

      // Search functionality
      if (this.searchInput) {
        utils.addEventListenerSafe(this.searchInput, 'input', utils.debounce((e) => {
          this.searchProducts(e.target.value);
        }, 300));
      }

      // Product card interactions
      this.cards.forEach(card => {
        const learnMoreBtn = card.querySelector('.btn-primary');
        const demoBtn = card.querySelector('.btn-secondary');

        if (learnMoreBtn) {
          utils.addEventListenerSafe(learnMoreBtn, 'click', (e) => {
            e.preventDefault();
            this.showProductDetails(card);
          });
        }

        if (demoBtn) {
          utils.addEventListenerSafe(demoBtn, 'click', (e) => {
            e.preventDefault();
            this.handleDemoAction(card);
          });
        }

        // Card hover analytics
        utils.addEventListenerSafe(card, 'mouseenter', () => {
          this.trackCardInteraction(card, 'hover');
        });
      });

      // Modal events
      if (this.modal) {
        const closeBtn = this.modal.querySelector('#modal-close');
        utils.addEventListenerSafe(closeBtn, 'click', () => this.closeModal());
        utils.addEventListenerSafe(this.modal, 'click', (e) => {
          if (e.target === this.modal) this.closeModal();
        });

        // Keyboard accessibility
        utils.addEventListenerSafe(document, 'keydown', (e) => {
          if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
            this.closeModal();
          }
        });
      }
    },

    initializeCards: function() {
      // Initialize all cards as visible
      this.cards.forEach(card => {
        card.classList.add('visible');
        card.style.transition = 'all 0.3s ease';
      });
    },

    filterProducts: function(category) {
      this.currentFilter = category;
      
      this.cards.forEach(card => {
        const cardCategory = card.dataset.category;
        const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase() : '';
        
        const matchesCategory = category === 'all' || cardCategory === category;
        const matchesSearch = this.matchesSearchTerm(card, searchTerm);
        
        if (matchesCategory && matchesSearch) {
          this.showCard(card);
        } else {
          this.hideCard(card);
        }
      });

      this.updateResultsCount();
    },

    searchProducts: function(searchTerm) {
      const term = searchTerm.toLowerCase();
      
      this.cards.forEach(card => {
        const cardCategory = card.dataset.category;
        const matchesCategory = this.currentFilter === 'all' || cardCategory === this.currentFilter;
        const matchesSearch = this.matchesSearchTerm(card, term);
        
        if (matchesCategory && matchesSearch) {
          this.showCard(card);
        } else {
          this.hideCard(card);
        }
      });

      this.updateResultsCount();
    },

    matchesSearchTerm: function(card, searchTerm) {
      if (!searchTerm) return true;
      
      const title = card.querySelector('.product-title').textContent.toLowerCase();
      const description = card.querySelector('.product-description').textContent.toLowerCase();
      const techBadges = Array.from(card.querySelectorAll('.tech-badge'))
        .map(badge => badge.textContent.toLowerCase()).join(' ');
      
      return title.includes(searchTerm) || 
             description.includes(searchTerm) || 
             techBadges.includes(searchTerm);
    },

    showCard: function(card) {
      card.classList.remove('hidden');
      card.classList.add('visible');
      card.style.display = 'block';
      
      // Animate in
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      }, 10);
    },

    hideCard: function(card) {
      card.classList.remove('visible');
      card.classList.add('hidden');
      card.style.opacity = '0';
      card.style.transform = 'scale(0.8)';
      
      // Hide after animation
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    },

    updateActiveFilter: function(activeButton) {
      this.filterButtons.forEach(btn => btn.classList.remove('active'));
      activeButton.classList.add('active');
    },

    updateActiveViewToggle: function(activeButton) {
      this.viewToggleButtons.forEach(btn => btn.classList.remove('active'));
      activeButton.classList.add('active');
    },

    toggleView: function(view) {
      this.currentView = view;
      
      if (view === 'carousel') {
        this.enableCarouselView();
      } else {
        this.enableGridView();
      }
    },

    enableCarouselView: function() {
      this.grid.classList.add('carousel-mode');
      this.grid.style.display = 'flex';
      this.grid.style.overflow = 'hidden';
      this.grid.style.scrollBehavior = 'smooth';
      
      // Add carousel navigation if not exists
      this.addCarouselNavigation();
    },

    enableGridView: function() {
      this.grid.classList.remove('carousel-mode');
      this.grid.style.display = 'grid';
      this.grid.style.overflow = 'visible';
      
      // Remove carousel navigation
      this.removeCarouselNavigation();
    },

    addCarouselNavigation: function() {
      if (this.grid.parentElement.querySelector('.carousel-navigation')) return;
      
      const navigation = document.createElement('div');
      navigation.className = 'carousel-navigation flex justify-center mt-6 gap-4';
      navigation.innerHTML = `
        <button class="carousel-prev bg-primary text-white p-3 rounded-full hover:bg-primary-hover transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button class="carousel-next bg-primary text-white p-3 rounded-full hover:bg-primary-hover transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      `;
      
      this.grid.parentElement.appendChild(navigation);
      
      // Bind carousel navigation events
      const prevBtn = navigation.querySelector('.carousel-prev');
      const nextBtn = navigation.querySelector('.carousel-next');
      
      utils.addEventListenerSafe(prevBtn, 'click', () => this.carouselPrev());
      utils.addEventListenerSafe(nextBtn, 'click', () => this.carouselNext());
    },

    removeCarouselNavigation: function() {
      const navigation = this.grid.parentElement.querySelector('.carousel-navigation');
      if (navigation) {
        navigation.remove();
      }
    },

    carouselPrev: function() {
      this.grid.scrollBy({ left: -400, behavior: 'smooth' });
    },

    carouselNext: function() {
      this.grid.scrollBy({ left: 400, behavior: 'smooth' });
    },

    updateResultsCount: function() {
      const visibleCards = this.cards.filter(card => !card.classList.contains('hidden'));
      const existingCounter = document.querySelector('.results-counter');
      
      if (existingCounter) {
        existingCounter.remove();
      }
      
      // Add results counter
      const filterContainer = document.querySelector('#products .flex.justify-center.mb-8');
      if (filterContainer) {
        const counter = document.createElement('div');
        counter.className = 'results-counter text-center text-gray-600 mt-4';
        counter.textContent = `Showing ${visibleCards.length} of ${this.cards.length} solutions`;
        filterContainer.appendChild(counter);
      }
    },

    showProductDetails: function(card) {
      const title = card.querySelector('.product-title').textContent;
      const description = card.querySelector('.product-description').textContent;
      const techStack = Array.from(card.querySelectorAll('.tech-badge')).map(badge => badge.textContent);
      const status = card.querySelector('.product-status').textContent;
      const metrics = Array.from(card.querySelectorAll('.metric')).map(metric => ({
        value: metric.querySelector('.metric-value').textContent,
        label: metric.querySelector('.metric-label').textContent
      }));

      const modalContent = this.modal.querySelector('#modal-content');
      const modalTitle = this.modal.querySelector('#modal-title');
      
      modalTitle.textContent = title;
      modalContent.innerHTML = this.generateProductDetailsHTML(title, description, techStack, status, metrics);
      
      this.modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      // Focus management for accessibility
      this.modal.querySelector('#modal-close').focus();
    },

    generateProductDetailsHTML: function(title, description, techStack, status, metrics) {
      return `
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${this.getStatusClasses(status)}">
              ${status}
            </span>
            <div class="flex flex-wrap gap-2">
              ${techStack.map(tech => `<span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">${tech}</span>`).join('')}
            </div>
          </div>
          
          <div class="prose max-w-none">
            <p class="text-gray-600 text-lg leading-relaxed">${description}</p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-${metrics.length} gap-4">
            ${metrics.map(metric => `
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-primary">${metric.value}</div>
                <div class="text-sm text-gray-600">${metric.label}</div>
              </div>
            `).join('')}
          </div>
          
          <div class="border-t pt-6">
            <h4 class="font-semibold text-lg mb-4">Key Features</h4>
            <div class="grid md:grid-cols-2 gap-4">
              ${this.generateFeaturesList(title)}
            </div>
          </div>
          
          <div class="flex gap-4 pt-6">
            <button class="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors">
              Request Demo
            </button>
            <button class="flex-1 border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors">
              Learn More
            </button>
          </div>
        </div>
      `;
    },

    generateFeaturesList: function(title) {
      const features = {
        'GoldBod Systems': [
          'Real-time IoT gold tracking',
          'Blockchain compliance verification',
          'DeFi integration',
          'Automated reporting'
        ],
        'GIMTS': [
          'Gold-backed digital transfers',
          'Investment portfolio management',
          'Multi-currency support',
          'Enterprise-grade security'
        ],
        'CTAP': [
          'Unified university applications',
          'Student data management',
          'Analytics dashboard',
          'Multi-institution support'
        ],
        'Email-to-Email Transfers': [
          'Peer-to-peer transfers',
          'Email-based authentication',
          'Bank-level encryption',
          'Cross-platform compatibility'
        ],
        'North Warehousing': [
          'AI-powered matching',
          'Real-time availability',
          'Logistics optimization',
          'Multi-location support'
        ],
        'IoT Compliance Module': [
          'Real-time monitoring',
          'Automated compliance checks',
          'Custom rule engine',
          'Integration APIs'
        ],
        'Agric/Cocoa Traceability': [
          'Farm-to-market tracking',
          'IoT sensor integration',
          'Sustainability metrics',
          'Farmer portal'
        ],
        'Odoo Leather eCommerce': [
          'Integrated inventory',
          'Payment processing',
          'Order management',
          'Vendor marketplace'
        ],
        'School Fees Auto Reminder': [
          'Automated notifications',
          'Payment tracking',
          'Parent portal',
          'Institution dashboard'
        ]
      };

      const productFeatures = features[title] || ['Advanced functionality', 'User-friendly interface', 'Scalable architecture', 'Expert support'];
      
      return productFeatures.map(feature => `
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-gray-700">${feature}</span>
        </div>
      `).join('');
    },

    getStatusClasses: function(status) {
      const statusMap = {
        'Live': 'bg-green-100 text-green-800',
        'Beta': 'bg-blue-100 text-blue-800',
        'Development': 'bg-purple-100 text-purple-800'
      };
      return statusMap[status] || 'bg-gray-100 text-gray-800';
    },

    closeModal: function() {
      this.modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    },

    handleDemoAction: function(card) {
      const title = card.querySelector('.product-title').textContent;
      const status = card.querySelector('.product-status').textContent;
      
      if (status === 'Live') {
        // For live products, show demo
        this.showDemo(title);
      } else if (status === 'Beta') {
        // For beta products, request access
        this.requestAccess(title);
      } else {
        // For development products, join waitlist
        this.joinWaitlist(title);
      }
    },

    showDemo: function(productName) {
      // This could open a demo modal or redirect to a demo page
      console.log(`Opening demo for ${productName}`);
      // Implementation would depend on actual demo requirements
    },

    requestAccess: function(productName) {
      console.log(`Requesting access for ${productName}`);
      // Implementation for beta access requests
    },

    joinWaitlist: function(productName) {
      console.log(`Joining waitlist for ${productName}`);
      // Implementation for waitlist functionality
    },

    trackCardInteraction: function(card, interaction) {
      const title = card.querySelector('.product-title').textContent;
      console.log(`Product interaction: ${interaction} on ${title}`);
      // Analytics tracking would go here
    }
  };

  // Dark Mode Functionality
  const darkMode = {
    init: function() {
      this.toggle = document.getElementById('themeToggle');
      this.currentTheme = localStorage.getItem('theme') || 'light';
      
      // Set initial theme
      this.setTheme(this.currentTheme);
      
      // Add event listener
      if (this.toggle) {
        this.toggle.addEventListener('click', () => this.toggleTheme());
      }
    },

    setTheme: function(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      this.currentTheme = theme;
    },

    toggleTheme: function() {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
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
        darkMode.init();
        carousel.init();
        navigation.init();
        forms.init();
        products.init(); // Initialize immersive products module
        logoEnhancer.init();
        analytics.init();
        performance.init();
        accessibility.init();
        darkMode.init(); // Initialize dark mode functionality
        
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
