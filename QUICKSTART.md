# Quick Start Guide - Production Schedule Viewer

## Prerequisites
- **Node.js** (version 16 or higher) - Download from https://nodejs.org/
- **Git** - Download from https://git-scm.com/
- A web browser (Chrome, Firefox, Edge, Safari)

## Setup Instructions

### Step 1: Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type `terminal`, press Enter
- **Linux**: Press `Ctrl + Alt + T`

### Step 2: Clone the Repository
Copy and paste these commands one at a time:

```bash
git clone https://github.com/MattCornock/Origins.git
cd Origins
git checkout claude/production-schedule-viewer-017pKn9TcyG2o9i6WppPe6Eg
```

### Step 3: Install Dependencies
This will download all required packages (takes 1-2 minutes):

```bash
npm install
```

### Step 4: Start the Application
```bash
npm run dev
```

You should see:
```
VITE v5.4.21  ready in XXX ms
➜  Local:   http://localhost:3000/
```

### Step 5: Open in Browser
Open your web browser and go to:
```
http://localhost:3000
```

## Using the Application

### Upload Your Data
1. Click "Choose File"
2. Select your factPlan CSV or Excel file
3. The data will load automatically

### Navigate the Views
- **Schedule View**: Interactive Gantt chart
- **Analytics**: Performance metrics and charts
- **Optimization Insights**: Recommendations

### Test with Sample Data
A sample file is included: `sample-data.csv` (30 records)
Use this to test the application before loading your full dataset.

## Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "git: command not found"
- Install Git from https://git-scm.com/
- Restart your terminal after installation

### Port 3000 Already in Use
Stop any other applications using port 3000, or edit `vite.config.js` to use a different port (e.g., 3001)

### Cannot Access in Browser
- Make sure the dev server is running (you should see "VITE ready" message)
- Try http://127.0.0.1:3000/ instead
- Check your firewall settings

## Stopping the Application
Press `Ctrl + C` in the terminal where the server is running

## Production Build
To create a production build:
```bash
npm run build
```
The built files will be in the `dist` folder.

## Need Help?
Check the main README.md file for detailed documentation.
