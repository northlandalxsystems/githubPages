# Northland ALX - Student-Founded African Innovation

A modern, accessible, and performance-optimized website for Northland ALX, a student-founded, enterprise-backed IT consultancy creating transformative solutions across Ghana and Africa.

## 👥 About the Founders

**Elton John Kyeremeh** - Founder & CTO  
Product designer and technical innovator with BSc in IT (continuing studies). Focuses on creating scalable solutions for Africa's digital transformation, specializing in IoT compliance, fintech, and agricultural technology.

**Festus Amponsah Yeboah** - Co-Founder & COO  
Operations and marketing strategist with senior experience at Enterprise Insurance Ghana. Drives business development, strategic partnerships, and market expansion across Ghana's enterprise landscape.

## 🚀 Company Vision

Northland ALX represents a unique paradigm in African technology innovation, combining academic research with real-world business experience to create solutions that truly serve Africa's unique needs.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with seamless adaptation across all devices
- **Modern CSS**: CSS custom properties, flexbox, and grid layouts
- **Interactive Carousel**: Touch-enabled product showcase with auto-play functionality
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Performance Optimized**: Lazy loading, debounced events, and optimized assets
- **SEO Ready**: Semantic HTML structure with proper meta tags
- **Form Handling**: Contact and newsletter forms with validation
- **WhatsApp Integration**: Floating action button for direct communication

## 📁 Project Structure

```
githubPages/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Production-grade CSS
├── js/
│   └── main.js            # Modular JavaScript
├── assets/
│   └── favicon.ico        # Website favicon (add your own)
└── README.md              # This file
```

## 🛠 Technologies Used

- **HTML5**: Semantic markup with accessibility in mind
- **CSS3**: Modern features including custom properties and flexbox
- **Vanilla JavaScript**: No dependencies, pure ES6+ modules
- **Tailwind CSS**: Utility-first CSS framework via CDN
- **Google Fonts**: Poppins font family for typography

## 🎨 Logo System

The website includes a sophisticated responsive logo system with two variants:

### Logo Variants
- **Light Logo** (`logo-light.svg`): For dark backgrounds and the hero section
- **Dark Logo** (`logo-dark.svg`): For light backgrounds and sections
- **Favicon** (`favicon.svg`): Simplified version for browser tabs

### Responsive Sizing
- **Extra Large**: 250×85px (special occasions)
- **Large**: 200×68px (hero sections)
- **Medium**: 140×48px (default)
- **Small**: 100×35px (mobile, footer)

### Smart Context Switching
The logo automatically switches between light and dark variants based on:
- Background color detection
- Section classes (`bg-white`, `bg-dark`, etc.)
- Scroll position and navbar state

### CSS Classes
```css
.logo-light    /* Force light variant */
.logo-dark     /* Force dark variant */
.logo-sm       /* Small size */
.logo-md       /* Medium size */
.logo-lg       /* Large size */
.logo-xl       /* Extra large size */
```

## 📱 Responsive Breakpoints

- Mobile: `< 480px`
- Tablet: `481px - 768px`
- Desktop: `> 768px`

## ♿ Accessibility Features

- WCAG 2.1 AA compliance
- Proper heading hierarchy
- Focus indicators
- Keyboard navigation
- Screen reader support
- Skip links
- High contrast ratios

## 🚀 Performance Optimizations

- Minified and optimized CSS
- Lazy loading for images
- Debounced scroll events
- Efficient DOM queries
- Mobile-optimized touch events

## 📊 SEO Optimizations

- Semantic HTML structure
- Meta descriptions and keywords
- Open Graph tags ready
- Structured data markup ready
- Optimized images with alt tags

## 🔧 Setup and Deployment

### Local Development
1. Clone or download the project
2. Open `index.html` in a modern web browser
3. For development with live reload, use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using VS Code Live Server extension
   Right-click index.html > "Open with Live Server"
   ```

### GitHub Pages Deployment
1. Push the code to a GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (usually `main` or `gh-pages`)
4. Your site will be available at `https://username.github.io/repository-name`

### Custom Domain (Optional)
1. Add a `CNAME` file with your domain name
2. Configure DNS records with your domain provider
3. Enable HTTPS in GitHub Pages settings

## 🧪 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Customization Guide

### Adding New Sections
1. Add HTML structure in `index.html`
2. Add corresponding styles in `css/styles.css`
3. Add any interactive functionality in `js/main.js`

### Modifying Colors
Update CSS custom properties in `:root` selector in `styles.css`:
```css
:root {
  --primary-color: #your-color;
  --primary-hover: #your-hover-color;
}
```

### Adding Analytics
Uncomment and configure the analytics module in `main.js`:
```javascript
// Add Google Analytics, Facebook Pixel, etc.
```

## 🔒 Security Considerations

- External links use `rel="noopener noreferrer"`
- Form validation on both client and server side (add server-side validation)
- HTTPS recommended for production
- Content Security Policy recommended

## 📈 Performance Metrics

Target performance scores:
- Lighthouse Performance: 90+
- Lighthouse Accessibility: 95+
- Lighthouse Best Practices: 90+
- Lighthouse SEO: 90+

## 🐛 Known Issues

- None currently reported

## 📞 Support

For technical support or customization requests, contact the Northland ALX team.

## 📄 License

© 2025 Northland ALX. All rights reserved.

---

**Built with ❤️ for Africa's digital transformation**
