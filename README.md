# DegreeAdmin

Academic planning system to help students select majors/minors and plan their course requirements.

## Team Setup Instructions

## Prerequisites
* Node.js (version 18 or higher)
* npm (version 9.0.0 or higher)
* Git
* Code editor (VS Code recommended)
* Modern web browser (Chrome, Firefox, Safari, Edge)

## Scripts

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Clear cache and restart (if needed)
rm -rf node_modules package-lock.json && npm install && npm start
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/degree-admin.git
   cd degree-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   App will open at `http://localhost:3000`

4. **Create your branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Team Workflow


### Before Working
1. Pull latest changes: `git pull origin main`
2. Create your branch: `git checkout -b feature/your-feature`
3. Work on your changes
4. Test locally: `npm start`

### Submitting Changes
1. Add changes: `git add .`
2. Commit: `git commit -m "Add login screen component"`
3. Push: `git push origin feature/your-feature`
4. Create Pull Request on GitHub
5. Wait for team review before merging

## Project Structure
```
src/
├── components/     # Reusable components
├── pages/         # Main page components
├── styles/        # CSS files
├── utils/         # Helper functions
└── App.js         # Main app component
```

## Features To Build
- [ ] Major/minor selection
- [ ] Course requirements display  
- [ ] Faculty and schedule information
- [ ] Graduation timeline calculator
- [ ] Login/authentication (future)
- [ ] User profiles (future)

🛠️ **Tech Stack**
* [React](https://react.dev/) - Frontend framework
* [Create React App](https://create-react-app.dev/) - Build tooling
* [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) - Styling
* [JavaScript ES6+](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Programming language

📚 **Documentation**
* [React Documentation](https://react.dev/learn)
* [Create React App Documentation](https://create-react-app.dev/docs/getting-started)
* [MDN Web Docs](https://developer.mozilla.org/en-US/) - HTML, CSS, JavaScript reference
* [Git Documentation](https://git-scm.com/doc)

## Available Scripts
- `npm start` - Development server
- `npm test` - Run tests
- `npm run build` - Production build
- `npm run eject` - Eject from Create React App (don't do this unless necessary)

## Team Members
- Aiden Cox
- Luke Dawson
- Evan Timmons
- Samantha Barnum

