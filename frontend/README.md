# Inventory Management System - Frontend

A modern, responsive inventory management system built with React and Vite, featuring a stunning glassmorphism UI design.

## 🌐 Live Demo

**Production URL:** [https://inventory-management-system-sigma-ten.vercel.app](https://inventory-management-system-sigma-ten.vercel.app)

**Status:** ✅ Fully Deployed and Operational

> 📖 For comprehensive documentation, see [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md)

## 🚀 Features

- **Authentication System**
  - Login and registration pages
  - Mock authentication fallback (works without backend)
  - Protected routes

- **Dashboard**
  - Key metrics overview (total items, low stock alerts, total value)
  - Quick action buttons
  - Responsive stat cards

- **Inventory Management**
  - View all inventory items (table view on desktop, card view on mobile)
  - Search and filter functionality
  - Sortable columns
  - Add new items
  - Edit existing items
  - Delete items with confirmation modal

- **Modern UI/UX**
  - Glassmorphism design with backdrop blur effects
  - Emerald and cyan gradient color scheme
  - Smooth animations and micro-interactions
  - Fully responsive (mobile, tablet, desktop)
  - Toast notifications for user feedback
  - Loading states and skeletons

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS** - Vanilla CSS with CSS custom properties (no frameworks)

## 📦 Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

## 🎨 Design Features

### Color Scheme
- **Primary**: Emerald/Teal gradient (#10b981 → #059669)
- **Secondary**: Cyan/Sky Blue (#0ea5e9 → #0284c7)
- **Success**: Green (#22c55e)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)

### UX Psychology Principles Applied
- **Cognitive Load Reduction**: Clear visual hierarchy, consistent layouts
- **Feedback & Affordance**: Immediate validation, loading states, hover effects
- **Color Psychology**: Green for success, red for danger, blue for trust
- **Fitts's Law**: Large touch targets (min 44x44px)
- **Micro-interactions**: Button animations, card lifts, toast slides

## 🔧 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   │   ├── Button
│   │   ├── Input
│   │   ├── Card
│   │   ├── LoadingSpinner
│   │   └── Toast
│   └── layout/          # Layout components
│       └── Navbar
├── pages/               # Page components
│   ├── Login
│   ├── Register
│   ├── Dashboard
│   ├── InventoryList
│   └── AddEditInventory
├── context/             # React Context providers
│   └── AuthContext
├── services/            # API integration
│   ├── api.js
│   ├── authService.js
│   └── inventoryService.js
├── styles/              # Global styles
│   └── globals.css      # Design system tokens
└── App.jsx              # Main app with routing
```

## 🌐 API Configuration

The app connects to the backend API:

**Production Backend:** `https://inventory-management-system-ax8a.onrender.com/api`

### Environment Variables

1. **Production** (on Vercel):
   ```
   VITE_API_URL=https://inventory-management-system-ax8a.onrender.com/api
   ```

2. **Local Development** (`.env` file):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

The app will display appropriate error messages if the backend is unavailable.

## 📱 Responsive Breakpoints

- **Mobile**: 0-640px
- **Tablet**: 641px-1024px
- **Desktop**: 1025px+

## 🎯 Key Components

### Authentication Context
Manages user authentication state, login/logout functionality, and persists auth tokens.

### Protected Routes
Ensures only authenticated users can access inventory pages.

### Toast Notifications
Global notification system with success, error, warning, and info variants.

### Inventory Table/Cards
Responsive inventory display that switches between table (desktop) and cards (mobile) automatically.

## 🚀 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Changing Colors
Edit the CSS custom properties in `src/styles/globals.css`:

```css
:root {
  --color-primary-500: #yourcolor;
  --color-secondary-500: #yourcolor;
  /* ... */
}
```

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Update navigation in `src/components/layout/Navbar.jsx`

## 🌐 Deployment

**Platform:** Vercel  
**Backend:** Render  
**Status:** Production Ready

### Deployment URLs
- **Frontend:** https://inventory-management-system-sigma-ten.vercel.app
- **Backend API:** https://inventory-management-system-ax8a.onrender.com/api

### Build Configuration
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18.x

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)

## 📚 Documentation

- **Frontend Documentation:** [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md) - Comprehensive technical documentation
- **API Documentation:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Backend API reference
- **Deployment Guide:** [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) - Deployment checklist and instructions

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Created as part of a university MERN Stack Inventory Management System project.

---

**Last Updated:** February 1, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production
