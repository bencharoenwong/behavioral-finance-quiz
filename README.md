# Behavioral Finance Quiz App

An interactive web application that teaches investors about cognitive biases and behavioral finance concepts through an engaging quiz format.

## Features

- **5 Educational Modules** covering 18 behavioral finance concepts
- **Gamification** with badges, levels, and progress tracking
- **Instant Feedback** with educational explanations for each answer
- **Progress Persistence** using browser localStorage
- **Responsive Design** works on desktop and mobile devices

## Quick Start

### Option 1: Local Development

1. Open a terminal in this directory
2. Start a local web server:
   ```bash
   python3 -m http.server 8000
   ```
3. Open your browser to: `http://localhost:8000`

### Option 2: Deploy to Lovable.dev

1. Go to [lovable.dev](https://lovable.dev)
2. Create a new project
3. Upload these files:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `financial_education_game.json`
4. Deploy and share!

### Option 3: Deploy to GitHub Pages

1. Create a new GitHub repository
2. Push these files to the repository
3. Go to Settings → Pages
4. Select "Deploy from main branch"
5. Your app will be live at `https://[username].github.io/[repo-name]`

## File Structure

```
fin_ed_game/
├── index.html                           # Main HTML structure
├── styles.css                           # All styling and responsive design
├── app.js                               # Quiz logic and state management
├── financial_education_game.json        # Quiz content and questions
├── CLAUDE.md                            # Development guidance
└── README.md                            # This file
```

## How It Works

### Quiz Flow

1. **Welcome Screen** - Introduction to the five modules
2. **Module Selection** - Choose which behavioral finance topic to study
3. **Quiz Questions** - Answer scenario-based questions about investment decisions
4. **Instant Feedback** - Learn about the bias and correct approach
5. **Results** - See your score and concepts covered
6. **Dashboard** - Track overall progress, badges, and levels

### Scoring System

- Each question awards points based on difficulty (10-20 points)
- Module badges earned at 90%+ completion
- Four progressive levels:
  - **Novice Investor** (0-300 points)
  - **Intermediate Investor** (301-700 points)
  - **Advanced Investor** (701-1000 points)
  - **Investment Master** (1001+ points)

### Data Persistence

Progress is automatically saved to browser localStorage, so users can:
- Close and reopen the app without losing progress
- Retake modules to improve scores
- Track long-term learning progress

## Customization

### Adding New Questions

Edit `financial_education_game.json`:

1. Add questions to a module's `questions` array
2. Follow the existing format:
   ```json
   {
     "id": "q1-5",
     "text": "Your scenario here...",
     "type": "multiple-choice",
     "options": [...],
     "correctAnswer": "a",
     "points": 15,
     "concepts": ["bias-name"],
     "feedbackCorrect": "Explanation...",
     "feedbackIncorrect": "Explanation..."
   }
   ```

### Styling Changes

Edit `styles.css` to customize:
- Colors (search for `#667eea` and `#764ba2` for the primary gradient)
- Fonts (update `font-family` in the `body` selector)
- Layout and spacing

### Adding New Modules

1. Add module to `modules` array in JSON
2. Define new concepts in the `concepts` object
3. Create corresponding badge in `gamification.badges`

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- LocalStorage support for progress tracking

## Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with gradients, flexbox, and grid
- **Vanilla JavaScript** - No frameworks required
- **LocalStorage API** - Client-side data persistence

## Educational Approach

The quiz uses research-backed behavioral finance concepts to help investors:
- Recognize common cognitive biases
- Understand how emotions affect investment decisions
- Learn rational approaches to portfolio management
- Develop awareness of psychological patterns

All feedback is non-judgmental and educational, emphasizing that these biases are natural human tendencies studied extensively in behavioral economics.

## License

Educational use - Feel free to modify and adapt for your teaching or learning needs.
