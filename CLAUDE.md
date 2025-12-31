# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a financial education game focused on behavioral finance concepts. The project aims to teach investors about cognitive biases and common psychological patterns that affect investment decision-making through an interactive quiz format.

## Project Structure

The core content is defined in `financial_education_game.json`, which contains:

- **5 Educational Modules:**
  1. Cognitive Biases (loss aversion, sunk cost fallacy, regret aversion, endowment bias)
  2. Information Processing Biases (confirmation bias, framing bias, hindsight bias, self-attribution bias)
  3. Prediction and Trend Biases (recency bias, overconfidence, herd mentality, FOMO, availability bias)
  4. Money Management Biases (mental accounting, anchoring, self-control bias)
  5. Portfolio Management Biases (false diversification, overconfidence in analysis, status quo bias)

- **Question Types:**
  - `multiple-choice`: Single or multiple correct answers
  - `range`: Numeric range selection

- **Gamification System:**
  - Badges for module mastery (90%+ score)
  - Progressive levels from Novice Investor to Investment Master
  - Points-based scoring system

## Content Guidelines

### Quiz Question Structure

Each question includes:
- `id`: Unique identifier (format: `q{module}-{number}`)
- `text`: Scenario-based question text
- `type`: Question type (`multiple-choice` or `range`)
- `options`: Array of answer choices with `id` and `text`
- `correctAnswer`: String or array of correct option IDs
- `points`: Score value (typically 10-20 points)
- `concepts`: Array referencing behavioral finance concepts
- `feedbackCorrect`: Explanation for correct answers (educational, focuses on rational approach)
- `feedbackIncorrect`: Explanation highlighting the bias (non-judgmental, educational tone)

### Educational Approach

The quiz uses a **non-judgmental, educational tone** in feedback:
- Correct feedback explains the rational investment approach
- Incorrect feedback describes the behavioral pattern without criticism
- Uses phrases like "Research shows..." and "Studies indicate..." to present findings objectively
- Avoids making users feel bad about exhibiting common biases
- Emphasizes that these are widespread, natural tendencies

### When Adding New Content

- Maintain scenario-based, realistic investment situations
- Ensure questions test understanding of behavioral patterns, not just knowledge
- Include references to research when describing biases
- Keep feedback balanced: educate without patronizing
- Assign point values proportional to question complexity
- Link questions to defined concepts in the `concepts` object

## Data Format

The JSON structure follows this hierarchy:
```
quiz
├── quizId, title, description
├── modules[]
│   ├── moduleId, title, description
│   └── questions[]
├── concepts{}
│   └── [concept-id]: {name, description, importance}
└── gamification
    ├── badges[]
    └── levels[]
```

## Future Development Areas

This is currently a content-only project. Potential implementation directions:

1. **Web Application**: Interactive quiz interface (React, Vue, or vanilla JS)
2. **Mobile App**: Native or cross-platform mobile implementation
3. **Backend**: User progress tracking, analytics, leaderboards
4. **Content Management**: Admin interface for quiz editing
5. **Analytics**: Tracking which biases are most/least understood

## Scoring System

- Total available points across all modules: ~725 points
- Badge requirements: 90%+ per module
- Level progression:
  - Novice: 0-300
  - Intermediate: 301-700
  - Advanced: 701-1000
  - Master: 1001+

## Data File Standards

- Save all data in parquet format (.parquet) for efficiency, not CSV
- Preserve the educational, non-judgmental tone in all feedback
- Maintain consistency in behavioral finance terminology with the existing concepts dictionary
