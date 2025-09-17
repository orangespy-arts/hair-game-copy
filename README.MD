# Hair Today, Gone Tomorrow 💇‍♂️

A fun drag-and-drop hair styling game where players help a stressed bald man regain his confidence by giving him a new hairstyle!

## 🎮 Game Overview

This is a browser-based HTML5 game where players:
- Drag different hair styles (straight, wavy, curly) and colors (dark, blonde, gray) onto a bald character
- Need to place 15 hair pieces to complete the game
- Enjoy procedural background music and sound effects
- See the character transform from sad to happy when completed

## 🛠️ Technical Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6 modules)
- **Audio**: Web Audio API for procedural sound generation
- **Graphics**: PNG images with CSS transforms and filters
- **No server required** - runs entirely in the browser!

## 🚀 How to Run the Game

⚠️ **IMPORTANT**: You **CANNOT** just double-click `index.html` - you'll get an error!

### Step-by-Step Instructions:

1. **Open Terminal/Command Prompt** in the game folder
2. **Run this command:**
   ```bash
   python3 -m http.server 8000
   ```
3. **Open your browser** and go to: **http://localhost:8000**
4. **Play the game!**

### If Python command doesn't work:
- Try: `python -m http.server 8000`
- Or on Windows: `py -m http.server 8000`

### ❌ What WON'T Work:
- Double-clicking `index.html` ❌
- Opening the file directly in browser ❌

**Why?** The game uses modern JavaScript that requires a web server to work properly.

## 📁 Project Structure

```
hair_today__gone_tomorrow_by_Goldkim/
├── index.html          # Main HTML file
├── script.js           # Game logic and drag/drop functionality
├── audio.js            # Web Audio API sound system
├── style.css           # Game styling and animations
├── README.MD           # This documentation
├── bald_man.png        # Initial character sprite
├── happy_man.png       # Victory character sprite
├── hair_strand.png     # Hair piece sprite (styled with CSS)
├── hair_afro.png       # Additional hair assets
├── hair_combover.png   # Additional hair assets
├── hair_mohawk.png     # Additional hair assets
├── drop.mp3            # Sound effect for placing hair
├── pickup.mp3          # Sound effect for picking up hair
└── success.mp3         # Victory sound effect
```

## 🔧 Git Setup and Submission Instructions

### Initial Setup

1. **Clone the repository** (if not already done):
```bash
git clone [YOUR_REPOSITORY_URL]
cd hair_today__gone_tomorrow_by_Goldkim
```

2. **Initialize git** (if starting fresh):
```bash
git init
git add .
git commit -m "Initial commit: Hair Today Gone Tomorrow game"
```

3. **Add remote repository**:
```bash
git remote add origin [YOUR_REPOSITORY_URL]
```

### Working on Features

1. **Create a new branch** for your work:
```bash
git checkout -b feature/your-feature-name
# Example: git checkout -b feature/add-new-hairstyles
```

2. **Make your changes** and test the game

3. **Stage and commit your changes**:
```bash
git add .
git commit -m "Add: description of your changes"
```

### Submitting Your Work

1. **Push your branch** to the remote repository:
```bash
git push origin feature/your-feature-name
```

2. **Create a Pull Request** on GitHub/GitLab:
   - Go to your repository on the web
   - Click "New Pull Request" or "Merge Request"
   - Select your feature branch to merge into `main`
   - Add a description of what you changed
   - Submit for review

### Alternative: Direct Push to Main (if allowed)
```bash
git checkout main
git add .
git commit -m "Your commit message"
git push origin main
```

## 🎯 Game Features

- **Drag & Drop Interface**: Intuitive hair placement system
- **Multiple Hair Types**: 9 different combinations (3 styles × 3 colors)
- **Visual Feedback**: Hair pieces change appearance when dragged
- **Audio System**: 
  - Procedural background music at 100 BPM
  - Sound effects for pickup, drop, and success
  - Web Audio API generated sounds (no external audio library needed)
- **Win Condition**: Place 15 hair pieces to complete the game
- **Reset Functionality**: Play again button to restart

## 🔊 Audio System Details

The game uses a custom Web Audio API implementation:
- **Background Music**: Procedurally generated arpeggio and click patterns
- **Sound Effects**: Three audio files (pickup.mp3, drop.mp3, success.mp3)
- **Win Sound**: Complex procedural audio with glissando and chimes
- **Browser Compatibility**: Handles audio context unlocking for modern browsers

## 🎨 Styling System

Hair pieces use CSS filters for color variations:
- **Dark Hair**: No filter (original color)
- **Blonde Hair**: Sepia + saturation + hue rotation
- **Gray Hair**: Grayscale + brightness adjustments

Hair styles use CSS transforms:
- **Straight**: Slight rotation (-5deg)
- **Wavy**: Moderate rotation and scale
- **Curly**: Larger rotation and scale

## 🐛 Troubleshooting

### CORS Error / "Cross origin requests" Error
**This is the most common issue!**

❌ **Error message**: `Access to script at 'file:///.../script.js' from origin 'null' has been blocked by CORS policy`

✅ **Solution**: You MUST use a web server (see "How to Run the Game" section above). You cannot just double-click the HTML file.

**Quick fix**:
1. Open Terminal/Command Prompt in the game folder
2. Run: `python3 -m http.server 8000`
3. Open browser to: `http://localhost:8000`

### Audio Not Playing
- Click anywhere on the page first (browser audio policy)
- Check browser console for audio errors
- Ensure audio files are in the same directory

### Drag and Drop Not Working
- Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Check that JavaScript is enabled
- Verify all image files are present

### Game Won't Load
- Check that all files are in the same directory
- Make sure you're using a web server (see CORS error above)
- Check browser developer console for errors (press F12)

## 📚 Learning Objectives

This project demonstrates:
- HTML5 drag and drop API
- ES6 modules and imports
- Web Audio API usage
- CSS transforms and filters
- Event handling in JavaScript
- Game state management
- Responsive design principles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request with a clear description

## 📄 License

This is a student project for educational purposes.

---

**Need Help?** Check the browser developer console (F12) for any error messages, or ask your instructor for assistance!
