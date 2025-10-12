# Frontend Documentation - DegreeAdmin

> **Built by:** Samantha Barnum  
> **Last Updated:** October 12, 2025  
> **Tech Stack:** React, React Router, sessionStorage auth, CSS design tokens with dark mode

## Table of Contents

- [Quick Start](#quick-start)
- [Project Architecture](#project-architecture)
- [Authentication System](#authentication-system)
- [RoutingandNavigation](#routing--navigation)
- [Design System](#design-system)
- [Notification System](#notification-system)
- [Adding New Features](#adding-new-features)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### File Structure

```
src/
├── components/              # Reusable UI components
│   ├── Nav.jsx             # Navigation bar that knows user roles
│   ├── NotificationsBell.jsx  # Notification bell in the header with popup
│   ├── ThemeToggle.jsx     # Switch for light/dark mode, so your eyes don't die
│   └── ProtectedRoute.jsx  # Wrapper for route authentication
│
├── pages/                  # Page components (organized by role)
│   ├── Login.jsx          # Login page
│   │
│   ├── student/           # Pages for students
│   │   ├── StudentDashboard.jsx
│   │   ├── DashboardTiles.jsx
│   │   ├── notifications/
│   │   │   └── StudentNotifications.jsx
│   │   ├── plan/
│   │   │   └── StudentDegreePlan.jsx
│   │   └── requests/
│   │       └── StudentRequests.jsx
│   │
│   ├── faculty/           # Pages for faculty
│   │   ├── FacultyDashboard.jsx
│   │   ├── FacultyTiles.jsx
│   │   ├── approvals/
│   │   │   └── FacultyApprovals.jsx
│   │   └── students/
│   │       └── FacultyAdvisees.jsx
│   │
│   └── admin/             # Pages for admins
│       ├── AdminDashboard.jsx
│       ├── AdminTiles.jsx
│       ├── catalog/
│       │   └── CatalogAdmin.jsx
│       └── users/
│           └── UsersAdmin.jsx
│
├── utils/                 # Helper functions
│   └── validation.js      # Form validation rules
│
├── App.js                 # Main app with routing setup
├── api.js                 # Authanddata functions (mock API layer)
├── notifications.store.js # Shared notification state management
├── styles.css             # Complete design system (heavily commented)
└── index.js               # React entry point
```

---

## Project Architecture

### System Overview

DDegreeAdmin is a **role-based academic management system** with three types of users:

- **Students** - Plan courses, submit requests, check notifications
- **Faculty** - Review requests, manage advisees, give guidance  
- **Admins** - Manage users and the course catalog

### Key Design Choices

**1. Mock API Layer (`api.js`)**

- All data operations go through `api.js`
- Currently uses sessionStorage (for auth) and localStorage (for notifications)
- **Backend switch**: Swap out functions in `api.js` with fetch() calls, UI code stays the same

**2. Shared Notification Store (`notifications.store.js`)**

- Uses React's `useSyncExternalStore` (no need for Context!)
- Single source of truth for NotificationsBell and notification pages
- Keeps everything in sync automatically
- **Backend update**: Change `refreshNotifications()` to fetch data from the API

**3. CSS Design Token System**

- All colors and spacing are set with CSS variables at the top of `styles.css`
- Light mode uses a blue accent, dark mode uses an orange accent
- **Always** use CSS variables for colors — never hardcode them!

---

## Authentication System

### How It Works

1. User goes to the app -> gets sent to /login
2. Login.jsx checks credentials (validation.js)
3. api.js saves user info in sessionStorage: { username, role }
4. User is redirected to /{role} dashboard
5. Nav.jsx reads sessionStorage and shows links based on role
6. ProtectedRoute.jsx protects all signed-in routes
7. Logout clears sessionStorage and takes user back to /login

### Key Files

**`api.js`** - Auth functions

```javascript
getCurrentUser()  // Get the logged-in user or null
login(username, password)  // Log in and save the session
logout()  // End the session
```

**`ProtectedRoute.jsx`** - Route guard

```javascript
// Wraps protected routes
<Route path="/student" element={
  <ProtectedRoute role="student">
    <StudentDashboard />
  </ProtectedRoute>
} />
```

**`validation.js`** - Input validation

- **Username**: Exactly 8 lowercase letters
- **Password**: Exactly 12 chars (1 upper, 1 lower, 1 digit, 1 symbol)

### Demo Credentials

Set up just because it was making me mad.

```javascript
Student:  username: "studentx"  password: "Aa1aaaaaaa!1"
Faculty:  username: "facultyx"  password: "Aa1aaaaaaa!1"
Admin:    username: "adminxyz"  password: "Aa1aaaaaaa!1"
```

### Role Assignment Logic (Mock)

In `api.js` login function:

- Username starts with `'a'` -> admin
- Username starts with `'f'` -> faculty
- All others -> student

---

## RoutingandNavigation

### Route Structure (App.js)

```jsx
<div className="page-rails">
  <Nav />  {/* Shows on ALL pages */}
  <Routes>
    {/* Public */}
    <Route path="/login" element={<Login />} />
    
    {/* Student routes (protected) */}
    <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
    <Route path="/student/plan" element={<ProtectedRoute role="student"><StudentDegreePlan /></ProtectedRoute>} />
    <Route path="/student/requests" element={<ProtectedRoute role="student"><StudentRequests /></ProtectedRoute>} />
    <Route path="/student/notifications" element={<ProtectedRoute role="student"><StudentNotifications /></ProtectedRoute>} />
    
    {/* Faculty routes (protected) */}
    <Route path="/faculty" element={<ProtectedRoute><FacultyDashboard /></ProtectedRoute>} />
    <Route path="/faculty/approvals" element={<ProtectedRoute><Stub title="Approvals" /></ProtectedRoute>} />
    <Route path="/faculty/students" element={<ProtectedRoute><Stub title="Advisees" /></ProtectedRoute>} />
    
    {/* Admin routes (protected) */}
    <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/catalog" element={<ProtectedRoute><Stub title="Catalog" /></ProtectedRoute>} />
    <Route path="/admin/users" element={<ProtectedRoute><Stub title="Users" /></ProtectedRoute>} />
    
    {/* Fallback */}
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
</div>
```

### Navigation Bar (Nav.jsx)

**Role-aware links** - Edit this object to add pages:

```javascript
const byRole = {
  student: [
    { to: "/student", label: "Dashboard" },
    { to: "/student/plan", label: "Degree Plan" },
    { to: "/student/requests", label: "Requests" },
    { to: "/student/notifications", label: "Notifications" },
  ],
  faculty: [
    { to: "/faculty", label: "Dashboard" },
    { to: "/faculty/approvals", label: "Approvals" },
    { to: "/faculty/students", label: "Advisees" },
  ],
  admin: [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/catalog", label: "Catalog" },
    { to: "/admin/users", label: "Users" },
  ],
};
```

**Active page highlight**: Done automatically with `aria-current="page"`, CSS takes care of the styling

---

## Design System

### Everything Lives in `styles.css`

**DO NOT hardcode colors or spacing.** Use CSS variables.

### Core CSS Variables

```css
/* Colors */
--accent          /* Brand color: Light blue / Dark orange */
--accent-soft     /* Soft shade for hover/focus states */
--accent-contrast /* Text color on accent backgrounds */
--surface         /* Cards, inputs, elevated surfaces */
--muted           /* Borders, disabled states */
--fg / --bg       /* Foreground text / Background */

/* Spacing (standard values) */
8px, 12px, 16px, 24px, 32px

/* Border Radius */
6-8px (small buttons/inputs)
10-12px (cards, larger elements)
999px (pills, badges)
```

### Theme System

- **Toggle**: `ThemeToggle.jsx` component in the header  
- **How it works**: Sets `data-theme="dark"` on the `<html>` element  
- **Styling**: CSS uses `:root[data-theme="dark"]` selectors to style things  
- **Persistence**: Stores your preference in localStorage

### Component Classes

```css
/* Layout */
.container        /* Centered container with max width */
.grid             /* Responsive auto-fit grid layout */
.page-rails       /* Main content area centered with side gutters */

/* Components */
.card             /* Elevated content box */
.btn              /* Basic button */
.btn-primary      /* Highlight-colored primary button */
.btn-ghost        /* Transparent button */

/* Forms */
.form-stack       /* Vertical form layout (1 column on mobile, 2 on tablet+) */
.form-field       /* Wrapper for label and input */
.input            /* Text input field */
.select           /* Dropdown menu */

/* Utilities */
.text-accent      /* Text in accent color */
.bg-accent        /* Background in accent color */
.bg-accent-soft   /* Soft, gentle accent background */
```

### Interaction Language

All interactive elements use the same **"halo" focus style**:

- Hover: `box-shadow: 0 0 0 3px var(--accent-soft)` (gentle glow)
- Focus: `box-shadow: 0 0 0 2px var(--accent), 0 0 0 6px var(--accent-soft)` (sharp ring + glow)

---

## Notification System

### Architecture

```
notifications.store.js (single source of truth)
           ↓
    ┌──────┴──────┐
    ↓             ↓
NotificationsBell  StudentNotifications.jsx
(header popover)   (full page)
```

### How It Works

**1. Shared Store** (`notifications.store.js`)

- Uses `useSyncExternalStore`  
- No need for a Context Provider  
- Automatically keeps all consumers in sync

**2. Data Flow**

```javascript
// Components use the hook
const { items, unread, markAllRead, markRead } = useNotifications();

// Store loads from api.js
refreshNotifications()  // Reads from localStorage/API

// Mutations update store and persist
markAllRead()  // Updates store + saves via api.js
markRead(id)   // Updates store + saves via api.js
```

**3. Notification Object Shape**

```javascript
{
  id: number,
  type: string,  // "COOP_REQUEST", "PLAN_CHANGED", etc.
  title: string,
  detail: string,
  when: string,  // "2h ago", "Yesterday", etc.
  unread: boolean,
  href?: string  // Optional navigation target
}
```

### Backend Integration

**Current**: Uses `localStorage` via `api.js`  
**Future**: Update `refreshNotifications()` in `notifications.store.js`:

```javascript
export async function refreshNotifications() {
  const user = getCurrentUser();
  const response = await fetch('/api/notifications');
  const items = await response.json();
  state = { items, unread: computeUnread(items) };
  emit();
}
```

---

## Adding New Features

### 1. Add a New Page

**Step 1: Create the component**

```jsx
// src/pages/student/NewFeature.jsx
export default function NewFeature() {
  return (
    <div className="container">
      <div className="card" style={{ marginTop: 16 }}>
        <h3>New Feature</h3>
        <p>Feature content here</p>
      </div>
    </div>
  );
}
```

**Step 2: Add route in App.js**

```jsx
<Route 
  path="/student/new-feature" 
  element={
    <ProtectedRoute role="student">
      <NewFeature />
    </ProtectedRoute>
  } 
/>
```

**Step 3: Add nav link in Nav.jsx**

```javascript
const byRole = {
  student: [
    { to: "/student", label: "Dashboard" },
    { to: "/student/new-feature", label: "New Feature" }, // <- Add here
  ],
  // ...
};
```

### 2. Add a New User Role

```javascript
// 1. Update api.js login() to recognize new role
if (u.startsWith("n")) role = "newrole";

// 2. Add Nav.jsx links
const byRole = {
  newrole: [
    { to: "/newrole", label: "Dashboard" },
    // ...
  ],
};

// 3. Create folder structure
src/pages/newrole/
  ├── NewRoleDashboard.jsx
  └── ...

// 4. Add routes in App.js
<Route path="/newrole" element={<ProtectedRoute><NewRoleDashboard /></ProtectedRoute>} />

// 5. Update ProtectedRoute.jsx if needed
const userHome = {
  student: "/student",
  faculty: "/faculty",
  admin: "/admin",
  newrole: "/newrole",  // <- Add here
}[user.role];
```

### 3. Use Existing Components

```jsx
// Card with content
<div className="container">
  <div className="card" style={{ marginTop: 16 }}>
    <h3>Card Title</h3>
    <p>Card content</p>
    <button className="btn btn-primary">Action</button>
  </div>
</div>

// Form with validation
<form className="form-stack" onSubmit={handleSubmit}>
  <div className="form-field">
    <label className="form-label" htmlFor="name">Name</label>
    <input id="name" className="input" type="text" required />
  </div>
  <button className="btn btn-primary" type="submit">Submit</button>
</form>

// Responsive grid
<div className="grid">
  <div className="card">Item 1</div>
  <div className="card">Item 2</div>
  <div className="card">Item 3</div>
</div>
```

---

## Common Tasks

### Change Brand Colors

Edit CSS variables in `styles.css`:

```css
:root {
  --accent: #YOUR_COLOR;  /* Light mode */
}
:root[data-theme="dark"] {
  --accent: #YOUR_COLOR;  /* Dark mode */
}
```

### Add Notification Types

**1. Update label mapping** in components with notifications:

```javascript
// In NotificationsBell.jsx and StudentNotifications.jsx
function getNotificationLabel(type) {
  const labels = {
    // ...existing types
    NEW_TYPE: "Label",  // <- Add here
  };
  return labels[type] || "Info";
}
```

**2. Backend will take care of creating notifications of this type**

### Customize Login Page

Edit `Login.jsx`:

- Update `DEMO_CREDENTIALS` object for demo users
- Validation rules are in `validation.js`
- UI components all use global CSS classes

### Debug Authentication Issues

```javascript
// Check current user
console.log(getCurrentUser());

// Check sessionStorage
console.log(sessionStorage.getItem('degreeadmin:user'));

// Verify route protection
// Ensure route is wrapped in <ProtectedRoute> in App.js
```

### Add Form Validation

```javascript
// Create validation function in utils/validation.js
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Use in component
import { isValidEmail } from '../utils/validation';

if (!isValidEmail(email)) {
  setError("Invalid email format");
  return;
}
```

---

## Troubleshooting

### Immediately redirected to /login?

- `ProtectedRoute` isn't detecting user - check `getCurrentUser()`
- Session may have expired - sessionStorage clears on browser close
- Verify user object exists: `sessionStorage.getItem('degreeadmin:user')`

### Styles not applying?

- All styling is in `styles.css` - check class names match exactly
- Don't write inline styles - use existing utility classes if possible
- Check browser console for CSS errors
- Reference `styles.css` comments for proper usage

### Nav links not highlighting?

- Nav.jsx uses pathname matching to set `aria-current="page"`  
- CSS styles `[aria-current="page"]` automatically  
- Make sure the route path matches the link's `to` prop exactly

### Notifications not updating?

- Bell and page use same store, should always match
- Call `refreshNotifications()` after data changes
- Check `notifications.store.js`, state updates trigger re-renders
- Verify `useNotifications()` hook is being used correctly

### Form validation failing?

Check `validation.js` rules:

- **Username**: Exactly 8 lowercase letters (no numbers/symbols)
- **Password**: Exactly 12 chars (1 upper, 1 lower, 1 digit, 1 symbol)
- These are enforced strictly, no flexibility

### Page layout broken?

- Ensure `.page-rails` wrapper exists in App.js
- Check `.container` is being used for page content
- Verify no conflicting inline styles
- All pages should follow same structure (see existing pages)

---

## Important Notes

1. **Check `styles.css` comments** - Every component and pattern is documented
2. **Check this README** - Architecture and common tasks explained here
3. **Check the specific file** - Most files have inline comments explaining logic

---

## Quick Reference

### Key Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `Nav.jsx` | Top navigation (role-aware) | `src/components/` |
| `ProtectedRoute.jsx` | Auth guard for routes | `src/components/` |
| `NotificationsBell.jsx` | Header notification bell | `src/components/` |
| `ThemeToggle.jsx` | Dark/light mode switch | `src/components/` |
| `Login.jsx` | Authentication entry point | `src/pages/` |
| `App.js` | Routing setup | `src/` |

### Key Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `styles.css` | **Entire design system** | Changing colors, spacing, or parts |
| `api.js` | Authanddata stuff | Adding backend integration |
| `notifications.store.js` | Notification state | Updating notification logic |
| `validation.js` | Form validation rules | Adding or changing validation |
| `App.js` | Route definitions | Adding new pages/routes |
| `Nav.jsx` | Navigation links | Adding nav items |

### Component Patterns

```jsx
// Page wrapper
<div className="container">
  <div className="card">...</div>
</div>

// Form
<form className="form-stack" onSubmit={handler}>
  <div className="form-field">
    <label className="form-label">Label</label>
    <input className="input" />
  </div>
</form>

// Button variants
<button className="btn btn-primary">Primary</button>
<button className="btn">Default</button>
<button className="btn btn-ghost">Ghost</button>

// Grid layout
<div className="grid">
  <div className="card">...</div>
  <div className="card">...</div>
</div>
```

### State Management Patterns

```javascript
// Local state (simple)
const [value, setValue] = useState("");

// Shared notification state
const { items, unread, markAllRead } = useNotifications();

// Saved preferences
const [show, setShow] = useState(
  () => localStorage.getItem('key') !== 'false'
);

// Auth state
const user = getCurrentUser();  // from api.js
```

---

## Backend Integration Checklist

When the backend is ready:

### Authentication

- [ ] Replace `api.js` `login()` with `POST /api/auth/login`
- [ ] Replace `getCurrentUser()` with token-based auth
- [ ] Replace `logout()` with `POST /api/auth/logout`
- [ ] Update `ProtectedRoute.jsx` to verify tokens

### Notifications

- [ ] Update `notifications.store.js` `refreshNotifications()`:

```javascript
  const response = await fetch('/api/notifications');
  const items = await response.json();
```

- [ ] Replace `markAllRead()` with `PUT /api/notifications/read-all`
- [ ] Replace `markRead(id)` with `PUT /api/notifications/${id}/read`

### Data Operations

- [ ] Replace all `localStorage` data with API calls
- [ ] Update form submissions to POST to backend
- [ ] Add loading states and error handling
- [ ] Implement proper error boundaries

**Note**: Hopefully, the UI components won't need any changes, just `api.js` and `notifications.store.js` should be updated!
