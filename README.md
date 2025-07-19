# Modern Glassmorphism Clock Application

A beautiful, production-ready clock application with glassmorphism design, dynamic backgrounds, and comprehensive customization options.

## 🌟 Features

### ⏰ Clock Display
- **Real-time updates** with smooth animations
- **Customizable font sizes** (24px - 120px)
- **Multiple font families** (Inter, Roboto, Poppins, Playfair Display, Montserrat)
- **Toggle seconds display** on/off
- **12/24 hour format** switching
- **Configurable positioning** (vertical adjustment)

### 🎨 Background Customization
- **Dynamic image backgrounds** via Pexels API integration
- **6 gradient presets** (Sunset, Ocean, Forest, Purple, Rose, Midnight)
- **Custom gradient colors** with color picker
- **Default nature images** as fallback options
- **Image search functionality** with real-time results
- **Smooth background transitions**

### 📖 Bible Verse Integration
- **Daily inspirational verses** from Bible API
- **Automatic verse rotation**
- **Beautiful card presentation**

### ⚙️ Advanced Settings
- **Comprehensive settings panel** with glassmorphism design
- **Real-time preview** of changes
- **Persistent settings** via localStorage
- **One-click reset** to defaults
- **Responsive design** for all screen sizes

## 🚀 Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Pexels API Configuration
# Get your free API key from: https://www.pexels.com/api/
NEXT_PUBLIC_PEXELS_API_KEY=your_pexels_api_key_here

# Optional: Set custom rate limiting (requests per hour)
NEXT_PUBLIC_PEXELS_RATE_LIMIT=200
```

### 2. Get Pexels API Key

1. Visit [Pexels API](https://www.pexels.com/api/)
2. Sign up for a free account
3. Generate your API key
4. Add it to your `.env.local` file

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

## 🔧 Technical Architecture

### Core Technologies
- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **Pexels API** for background images
- **Bible API** for inspirational content

### Key Components

#### `PexelsService` (`lib/pexels.ts`)
- **API Integration**: Secure Pexels API communication
- **Caching System**: 10-minute cache for performance
- **Rate Limiting**: 1-second delay between requests
- **Error Handling**: Graceful fallback to default images
- **Image Optimization**: High-quality background images (1920x1080+)

#### `BackgroundSelector` (`components/BackgroundSelector.tsx`)
- **Image Grid**: Responsive 2-3 column layout
- **Search Functionality**: Real-time image search with debouncing
- **Loading States**: Skeleton loaders and progress indicators
- **Error Recovery**: Retry mechanisms and fallback options
- **Accessibility**: ARIA labels and keyboard navigation

#### `useBackgroundImages` (`hooks/useBackgroundImages.ts`)
- **State Management**: Loading, error, and data states
- **Search Debouncing**: 500ms delay for optimal UX
- **Cache Management**: Automatic cache invalidation
- **Error Boundaries**: Comprehensive error handling

### Settings Persistence
- **localStorage Integration**: Automatic saving of all settings
- **Backward Compatibility**: Graceful handling of setting migrations
- **Validation**: Input validation and sanitization
- **Default Fallbacks**: Robust default value system

## 🎯 API Integration Details

### Pexels API Features
- **Search Endpoint**: `/v1/search` with query parameters
- **Curated Endpoint**: `/v1/curated` for popular images
- **Image Sizes**: Multiple resolution options (thumbnail to 4K)
- **Metadata**: Photographer credits and alt text
- **Rate Limiting**: 200 requests/hour (configurable)

### Default Images
6 carefully curated nature images serve as fallbacks:
- Mountain landscapes
- Forest scenes
- Ocean views
- Aurora borealis
- Flower fields
- Snow-capped peaks

## 🔒 Security & Performance

### Security Measures
- **Environment Variables**: Secure API key storage
- **Input Validation**: XSS prevention and data sanitization
- **Error Handling**: No sensitive data exposure in errors
- **HTTPS Only**: Secure API communications

### Performance Optimizations
- **Image Caching**: 10-minute cache for API responses
- **Lazy Loading**: Images load on demand
- **Debounced Search**: Reduced API calls
- **Optimized Images**: Compressed Pexels images
- **Background Attachment**: Fixed positioning for smooth scrolling

## 🎨 Design System

### Glassmorphism Elements
- **Backdrop Blur**: `backdrop-blur-xl` effects
- **Transparency**: Semi-transparent backgrounds (`bg-black/90`)
- **Borders**: Subtle white borders (`border-white/10`)
- **Shadows**: Soft drop shadows for depth

### Color Palette
- **Primary**: `#9E7FFF` (Purple)
- **Secondary**: `#38bdf8` (Blue)
- **Accent**: `#f472b6` (Pink)
- **Background**: `#171717` (Dark)
- **Text**: `#FFFFFF` (White)

### Animations
- **Smooth Transitions**: 300-500ms duration
- **Scale Effects**: Hover interactions
- **Fade Animations**: Loading states
- **Background Transitions**: 1000ms for background changes

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px+ (2-column image grid)
- **Tablet**: 768px+ (3-column image grid)
- **Desktop**: 1024px+ (Full feature set)

### Adaptive Features
- **Font Scaling**: Responsive text sizes
- **Grid Layouts**: Flexible column counts
- **Touch Targets**: 44px minimum for mobile
- **Keyboard Navigation**: Full accessibility support

## 🔧 Customization Options

### Clock Settings
- **Font Size**: 24px - 120px slider
- **Font Family**: 5 professional typefaces
- **Time Format**: 12/24 hour toggle
- **Seconds Display**: Show/hide toggle
- **Position**: Vertical adjustment (-200px to +400px)

### Background Options
- **Image Backgrounds**: Pexels API integration
- **Gradient Backgrounds**: 6 presets + custom colors
- **Search Functionality**: Real-time image search
- **Default Fallbacks**: 6 curated nature images

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
Ensure your production environment has:
```bash
NEXT_PUBLIC_PEXELS_API_KEY=your_production_api_key
NEXT_PUBLIC_PEXELS_RATE_LIMIT=200
```

### Static Export (Optional)
The app supports static export for CDN deployment:
```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Credits

- **Pexels**: High-quality background images
- **Bible API**: Inspirational daily verses
- **Shadcn/ui**: Beautiful UI components
- **Tailwind CSS**: Utility-first styling
- **Next.js**: React framework

---

**Built with ❤️ using modern web technologies**
