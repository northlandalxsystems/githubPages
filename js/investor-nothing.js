/**
 * Northland ALX - Nothing OS Investor Page JavaScript
 * Interactive animations and functionality
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    ANIMATION_DELAY: 100,
    INTERSECTION_THRESHOLD: 0.1,
    TYPING_SPEED: 50
  };

  // Utility Functions
  const utils = {
    /**
     * Animate progress bars
     */
    animateProgressBars: function() {
      const progressBars = document.querySelectorAll('.progress-bar');
      progressBars.forEach(bar => {
        const progress = bar.dataset.progress || 100;
        bar.style.setProperty('--progress-width', `${progress}%`);
      });
    },

    /**
     * Animate revenue bars
     */
    animateRevenueBars: function() {
      const revenueBars = document.querySelectorAll('.bar-fill');
      revenueBars.forEach(bar => {
        const revenue = parseFloat(bar.dataset.revenue || 1);
        const maxRevenue = 7; // Maximum revenue for scaling (updated for startup stage)
        const width = (revenue / maxRevenue) * 100;
        bar.style.setProperty('--bar-width', `${width}%`);
      });
    },

    /**
     * Animate chart bars
     */
    animateChartBars: function() {
      const bars = document.querySelectorAll('.bar');
      bars.forEach(bar => {
        const height = bar.dataset.height || 50;
        setTimeout(() => {
          bar.style.height = `${height}%`;
        }, CONFIG.ANIMATION_DELAY);
      });
    },

    /**
     * Create dot matrix animation
     */
    createDotMatrix: function() {
      const matrixRows = document.querySelectorAll('.matrix-row');
      matrixRows.forEach((row, index) => {
        const rowNumber = parseInt(row.dataset.row);
        const dotsCount = Math.floor(Math.random() * 5) + 3;
        
        // Clear existing content
        row.innerHTML = '';
        
        // Create dots
        for (let i = 0; i < dotsCount; i++) {
          const dot = document.createElement('div');
          dot.className = 'matrix-dot';
          dot.style.cssText = `
            width: 8px;
            height: 8px;
            background: ${Math.random() > 0.7 ? '#ff0000' : '#ffffff'};
            border-radius: 50%;
            opacity: ${Math.random() * 0.8 + 0.2};
            animation-delay: ${i * 0.1}s;
          `;
          row.appendChild(dot);
        }
      });
    },

    /**
     * Intersection Observer for animations
     */
    createIntersectionObserver: function() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            
            // Trigger animations based on element class
            if (element.classList.contains('traction-section')) {
              this.animateProgressBars();
            } else if (element.classList.contains('market-section')) {
              this.animateChartBars();
            } else if (element.classList.contains('financials-section')) {
              this.animateRevenueBars();
            }
            
            // Add visible class for CSS animations
            element.classList.add('visible');
          }
        });
      }, {
        threshold: CONFIG.INTERSECTION_THRESHOLD
      });

      // Observe sections
      const sections = document.querySelectorAll('section');
      sections.forEach(section => observer.observe(section));
    },

    /**
     * Add hover effects to cards
     */
    addHoverEffects: function() {
      const cards = document.querySelectorAll('.traction-card, .product-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-8px)';
          this.style.boxShadow = '0 20px 40px rgba(255, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = 'none';
        });
      });
    },

    /**
     * Add typing animation to titles
     */
    addTypingAnimation: function() {
      const title = document.querySelector('.nothing-title');
      if (!title) return;

      const text = title.textContent;
      title.textContent = '';
      title.style.borderRight = '2px solid #ff0000';
      
      let index = 0;
      const typeInterval = setInterval(() => {
        title.textContent += text[index];
        index++;
        
        if (index >= text.length) {
          clearInterval(typeInterval);
          setTimeout(() => {
            title.style.borderRight = 'none';
          }, 1000);
        }
      }, CONFIG.TYPING_SPEED);
    },

    /**
     * Smooth scroll for anchor links
     */
    addSmoothScroll: function() {
      const links = document.querySelectorAll('a[href^="#"]');
      links.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    },

    /**
     * Add parallax effect to hero section
     */
    addParallaxEffect: function() {
      const hero = document.querySelector('.hero-section');
      const dotMatrix = document.querySelector('.dot-matrix');
      
      if (!hero || !dotMatrix) return;

      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.3;
        
        dotMatrix.style.transform = `translateY(-50%) translateX(${parallax}px)`;
      });
    },

    /**
     * Add status indicator animation
     */
    animateStatusIndicator: function() {
      const statusDot = document.querySelector('.status-dot.active');
      if (!statusDot) return;

      setInterval(() => {
        statusDot.style.opacity = '0.3';
        setTimeout(() => {
          statusDot.style.opacity = '1';
        }, 300);
      }, 2000);
    },

    /**
     * Add loading animation
     */
    addLoadingAnimation: function() {
      const body = document.body;
      body.style.opacity = '0';
      body.style.transition = 'opacity 0.6s ease-in-out';
      
      window.addEventListener('load', () => {
        setTimeout(() => {
          body.style.opacity = '1';
        }, 100);
      });
    }
  };

  // Main application
  const InvestorApp = {
    init: function() {
      this.bindEventListeners();
      this.initializeAnimations();
      console.log('🚀 Nothing OS Investor page initialized');
    },

    bindEventListeners: function() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.start());
      } else {
        this.start();
      }
    },

    start: function() {
      try {
        // Initialize all features
        utils.createDotMatrix();
        utils.createIntersectionObserver();
        utils.addHoverEffects();
        utils.addSmoothScroll();
        utils.addParallaxEffect();
        utils.animateStatusIndicator();
        utils.addLoadingAnimation();
        
        // Delay typing animation
        setTimeout(() => {
          utils.addTypingAnimation();
        }, 1000);
        
        console.log('✅ All animations initialized');
      } catch (error) {
        console.error('❌ Error initializing investor page:', error);
      }
    },

    initializeAnimations: function() {
      // Set up CSS custom properties for animations
      const style = document.createElement('style');
      style.textContent = `
        .matrix-dot {
          transition: all 0.3s ease;
        }
        .visible {
          animation: fadeInUp 0.6s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  };

  // Initialize the application
  InvestorApp.init();

})();
