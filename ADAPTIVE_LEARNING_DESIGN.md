# Adaptive Learning System Design
## Forgiving Streaks + Generative Questions + Weak Area Focus

---

## 🎯 Design Philosophy: "Feel Good, Learn More"

### The Duolingo Principle
- **Never punish** - Always reward
- **Make success easy** - Lower barrier to daily completion
- **Automatic forgiveness** - Earn protection through good behavior
- **Gentle nudges** - Not guilt trips
- **Celebrate everything** - Even small wins

---

## 🔥 Part 1: Forgiving Streak System

### How It Works

#### Earning Streak Freezes
1. **Complete 7 days in a row** → Auto-earn 1 streak freeze
2. **Perfect week (7/7 days)** → Earn 2 freezes (bonus for consistency)
3. **Monthly milestone (30 days)** → Earn 5 freezes (huge reward)
4. **Answer 10 questions in one day** → Earn 1 freeze (reward dedication)

#### Using Streak Freezes (Automatic)
- User misses a day → Streak freeze auto-activates
- **No action needed** - it just works
- Notification: "🛡️ Your streak is protected! You have 2 freezes left."
- Visual: Shield icon over streak flame
- Freezes stack up to **5 maximum** (prevents hoarding)

#### Streak Repair (Premium Forgiveness)
If streak breaks AND no freezes:
- **Option 1: Double-Up Tomorrow** - Answer 6 questions tomorrow (instead of 3)
- **Option 2: Gem Restore** - Spend 2 gems to repair (expensive but possible)
- **Option 3: Weekly Challenge** - Complete special 10-question challenge to restore

#### Visual Design
```
┌─────────────────────────────────┐
│  🔥 47-Day Streak  🛡️ x3       │
│  ─────────────────────────────  │
│  Su Mo Tu We Th Fr Sa           │
│  ✅ ✅ ✅ ✅ ✅ ✅ ⭕  ← Today   │
│                                 │
│  Streak Freezes: 🛡️ 🛡️ 🛡️      │
│  You're protected!              │
└─────────────────────────────────┘
```

#### Psychology
- **Loss Aversion**: "I have 47 days, I can't lose it!"
- **Safety Net**: "But I have 3 freezes, so I'm safe"
- **Reduced Anxiety**: Not stressed about missing one day
- **Continued Engagement**: One missed day doesn't kill motivation

### Daily Requirement (Gentle)

**Minimum to maintain streak: 3 questions**
- Takes ~2-3 minutes
- Very achievable
- Can do more, but not required

**Bonus Incentives:**
- Answer 5 questions: +50 bonus coins
- Answer 10 questions: +150 coins + 1 freeze
- Answer 20 questions: +500 coins + 2 freezes + "Dedicated Learner" badge

### Streak Levels (Milestone Badges)

- 🔥 7 days: **"Week Warrior"** + 500 coins
- 🔥 14 days: **"Fortnight Fighter"** + 1000 coins
- 🔥 30 days: **"Monthly Master"** + 2500 coins + 5 freezes
- 🔥 50 days: **"Halfway Hero"** + special profile badge
- 🔥 100 days: **"Centurion"** + exclusive profile frame
- 🔥 365 days: **"Annual Legend"** + permanent VIP status + real trophy shipped?

### Re-engagement After Break

**If streak breaks despite everything:**
- **No shame** - Positive messaging
- "Welcome back! Your longest streak was 47 days. Ready to beat it? 🚀"
- **Fresh Start Bonus**: 200 coins to come back
- **Comeback Challenge**: "Get 7 days again for bonus rewards"

---

## 🤖 Part 2: LLM Question Generation System

### Architecture Overview

#### 1. Question Templates (Seed Questions)

Each original question becomes a **template** with metadata:

```json
{
  "templateId": "loss-aversion-investment-choice",
  "bias": "loss-aversion",
  "difficulty": "medium",
  "structure": {
    "scenarioType": "two-choice-gains-vs-losses",
    "components": {
      "character": "Michael",
      "gainScenario": {
        "optionA": {"type": "probabilistic", "upside": 1500, "probability": 0.5},
        "optionB": {"type": "certain", "upside": 700}
      },
      "lossScenario": {
        "optionC": {"type": "probabilistic", "downside": 1500, "probability": 0.5},
        "optionD": {"type": "certain", "downside": 700}
      }
    }
  },
  "learningObjective": "Recognize inconsistent risk preferences in gains vs losses",
  "correctPattern": "consistent risk preference",
  "incorrectPattern": "risk-averse in gains, risk-seeking in losses",
  "feedbackTemplate": {
    "correct": "Template for explaining rational approach",
    "incorrect": "Template for explaining loss aversion bias"
  }
}
```

#### 2. Generation Pipeline

**Step 1: Select Template**
- Based on user's weak areas
- Based on daily challenge theme
- Random selection from category

**Step 2: Generate Variation**
- LLM prompt with template structure
- Vary: character names, amounts, asset types, context
- Keep: underlying bias test structure

**Step 3: Quality Check**
- Does it test the same bias?
- Are answer choices clear?
- Is feedback appropriate?
- Difficulty calibration

**Step 4: User Delivery**
- Serve to user
- Track performance
- Store for analytics

#### 3. LLM Prompt Engineering

**System Prompt:**
```
You are a behavioral finance educator creating quiz questions.
Generate variations of quiz questions that test specific cognitive biases in investment decisions.

Requirements:
- Maintain the core bias being tested
- Create realistic, engaging scenarios
- Use diverse characters, amounts, and contexts
- Generate 4 clear answer choices
- Provide educational feedback for correct and incorrect answers
- Keep a non-judgmental, research-backed tone

The question should feel fresh but test the exact same bias as the template.
```

**Example Generation Request:**
```
Template Bias: Loss Aversion
Structure: Present two scenarios - gains and losses with identical expected values
User's Interest: Technology stocks
Difficulty: Medium

Generate a new question that tests loss aversion bias but uses:
- Technology stock context
- Different dollar amounts
- Different character name
- Modern scenario (crypto, AI stocks, etc.)

Maintain: The core insight that people are risk-averse for gains but risk-seeking for losses.
```

#### 4. Variation Strategies

**Character Variations:**
- Original: Michael
- Generated: Sarah, James, Lisa, David, Chen, Priya, Ahmed, Maria
- Background: Student, retiree, entrepreneur, professional

**Asset Class Variations:**
- Stocks → Real estate, Crypto, Bonds, Commodities, Options
- ETFs → Individual stocks, Index funds, Mutual funds
- Tech stocks → Healthcare, Energy, Finance, Consumer goods

**Amount Variations:**
- Original: $1,500 / $700
- Generated: $500/$200, $5,000/$2,000, $50,000/$20,000
- Adjust based on user's profile (student vs executive)

**Context Variations:**
- Market conditions: Bull market, bear market, volatile, stable
- Time horizon: Day trading, monthly, annual, retirement
- Emotional state: Confident, anxious, FOMO, fearful

**Difficulty Variations:**
- **Easy**: Obvious bias, clear correct answer
- **Medium**: Typical investor scenario
- **Hard**: Subtle bias, multiple biases at play
- **Expert**: Real-world case study with complex factors

#### 5. Generation Examples

**Template: Loss Aversion**
```
Original Question:
"Michael has $1,500 investment choice between 50% gain or certain $700..."

Generated Variation 1 (Crypto Context):
"Sarah is considering two cryptocurrency investments:
Option A: 50% chance her portfolio gains $3,000, 50% chance no gain
Option B: 100% certain gain of $1,200
Then for losses: [mirror structure]"

Generated Variation 2 (Real Estate):
"David is evaluating two real estate opportunities:
Option A: 50% chance property value increases $50,000, 50% chance no change
Option B: 100% certain appreciation of $20,000
Then for losses: [mirror structure]"

Generated Variation 3 (Options Trading):
"Lisa is choosing between two options strategies:
Option A: 50% probability of $800 profit, 50% probability of $0
Option B: 100% probability of $350 profit
Then for losses: [mirror structure]"
```

#### 6. Storage & Caching

**Generated Question Database:**
- Store generated questions for reuse
- Tag with user who received it
- Track performance statistics
- Quality rating (user engagement, accuracy)

**Pre-Generation:**
- Generate 100 questions daily during off-peak hours
- Cache by category and difficulty
- Serve from cache for instant delivery
- Replenish cache as questions are used

**Personalization Cache:**
- Generate questions specific to user interests
- If user frequently gets crypto questions right → more crypto scenarios
- If user works in tech → tech company examples
- If user is young → smaller dollar amounts

---

## 🧠 Part 3: Adaptive Learning & Weak Area Focus

### User Profile Model

```json
{
  "userId": "user123",
  "biasProfile": {
    "loss-aversion": {
      "questionsAnswered": 15,
      "correctAnswers": 8,
      "accuracy": 0.53,
      "masteryLevel": "developing",
      "lastTested": "2024-01-15",
      "averageConfidence": 0.65,
      "improvementTrend": "improving"
    },
    "confirmation-bias": {
      "questionsAnswered": 12,
      "correctAnswers": 11,
      "accuracy": 0.92,
      "masteryLevel": "mastered",
      "lastTested": "2024-01-14",
      "averageConfidence": 0.85,
      "improvementTrend": "stable"
    },
    // ... for all 18 biases
  },
  "learningPreferences": {
    "assetClasses": ["crypto", "tech-stocks"],
    "difficultyPreference": "medium",
    "sessionLength": "short",
    "bestTimeOfDay": "evening"
  },
  "streakData": {
    "currentStreak": 47,
    "longestStreak": 52,
    "freezesAvailable": 3,
    "lastActivityDate": "2024-01-15"
  }
}
```

### Mastery Levels

**Per-Bias Mastery:**
1. **Novice** (0-25% accuracy) - "Just learning"
2. **Developing** (26-60% accuracy) - "Getting there"
3. **Competent** (61-79% accuracy) - "Pretty good"
4. **Proficient** (80-89% accuracy) - "Almost there"
5. **Mastered** (90-100% accuracy) - "Expert"

**Visual Representation:**
```
Loss Aversion:        ████████░░░░  53% Developing
Confirmation Bias:    ████████████  92% Mastered
Recency Bias:         ██████░░░░░░  42% Developing
```

### Adaptive Question Selection Algorithm

```python
def select_next_questions(user_profile, num_questions=3):
    """
    Select personalized questions for daily challenge
    """

    # 1. Identify weak areas (accuracy < 70%)
    weak_biases = [
        bias for bias, stats in user_profile.biasProfile.items()
        if stats.accuracy < 0.7 and stats.questionsAnswered >= 3
    ]

    # 2. Identify untested biases
    untested_biases = [
        bias for bias, stats in user_profile.biasProfile.items()
        if stats.questionsAnswered < 3
    ]

    # 3. Spaced repetition - resurface old mistakes
    due_for_review = get_questions_due_for_review(user_profile)

    # 4. Selection strategy
    questions = []

    # Priority 1: Review old mistakes (40% of daily questions)
    if due_for_review:
        questions.append(select_from_review_queue(due_for_review))

    # Priority 2: Focus on weak areas (40% of daily questions)
    if weak_biases:
        weak_bias = random.choice(weak_biases)
        questions.append(generate_question(weak_bias, user_profile))

    # Priority 3: Explore new areas (20% of daily questions)
    if untested_biases:
        new_bias = random.choice(untested_biases)
        questions.append(generate_question(new_bias, user_profile))
    else:
        # Or challenge mastered areas to maintain
        mastered = [b for b, s in user_profile.biasProfile.items() if s.accuracy > 0.85]
        if mastered:
            questions.append(generate_question(random.choice(mastered), user_profile))

    return questions
```

### Spaced Repetition System

**When user gets question wrong:**
1. **Immediate** - Show correct answer with explanation
2. **1 day later** - Same question resurfaces in daily challenge
3. **3 days later** - If correct on day 1, test again
4. **7 days later** - If correct on day 3, test again
5. **30 days later** - Final reinforcement test

**When user gets question right:**
- If first attempt: Mark as "known"
- If after review: Mark as "learned"
- If multiple times correct: Mark as "mastered"

**Visual Feedback:**
"🔄 You got this wrong 3 days ago. Let's see if you remember now!"
"✅ Great! You've now answered this correctly 3 times. Moving to long-term memory."

### Progressive Difficulty

**Within Each Bias:**
- Level 1: Obvious examples, clear bias
- Level 2: Typical scenarios
- Level 3: Subtle bias manifestation
- Level 4: Multiple biases interacting
- Level 5: Real-world complexity

**Difficulty Ladder:**
- Start at Level 1 for new bias
- After 3 correct → Move to Level 2
- After 5 correct at Level 2 → Move to Level 3
- One wrong answer → Stay at current level
- Two wrong in row → Drop one level (gentle)

### Daily Challenge Composition

**Intelligent Mix:**
```
Daily Challenge (3 questions):
├─ Question 1: WEAK AREA (Loss Aversion - your weak spot)
├─ Question 2: REVIEW (You got this wrong 3 days ago)
└─ Question 3: NEW/MASTERED (Explore or maintain)

Bonus Questions (optional):
├─ Question 4-6: More practice on weak areas
└─ Question 7-10: Challenge questions (hard mode, 2x points)
```

### Personalized Insights

**Weekly Report:**
```
📊 This Week's Progress

🎯 Focused Areas:
- Loss Aversion: 45% → 67% (+22%) 📈
- Recency Bias: 38% → 41% (+3%)

🏆 Mastered This Week:
- Framing Bias (92% accuracy)

⚠️ Needs Attention:
- Overconfidence Bias (33% accuracy)
- Anchoring Bias (41% accuracy)

💡 Recommendation:
This week, we'll focus on Overconfidence Bias with
personalized scenarios about tech stock investments
(your area of interest).
```

**Monthly Bias Report:**
```
📈 January Behavioral Finance Report

Your Investor Profile: "Analytical but Overconfident"

Strengths:
✅ Information Processing (91% mastery)
✅ Money Management (87% mastery)

Growth Areas:
⚠️ Prediction Biases (54% mastery)
⚠️ Cognitive Biases (61% mastery)

Pattern Detected:
You excel at analyzing information but tend to
overestimate prediction accuracy. This is common
among analytical investors. Focus on calibration.

This Month's Growth: +23% overall accuracy
Streak Achievement: 30 days! 🔥
Questions Answered: 124
```

---

## 🔧 Technical Implementation

### API Endpoints

```javascript
// Get personalized daily challenge
GET /api/daily-challenge
Response: {
  questions: [Question, Question, Question],
  focusArea: "loss-aversion",
  reasoning: "Your weakest area (53% accuracy)"
}

// Submit answer and get feedback
POST /api/submit-answer
Body: {
  questionId: "q123",
  userAnswer: ["a", "c"],
  timeSpent: 45 // seconds
}
Response: {
  correct: true,
  points: 15,
  feedback: "Great job! Here's why...",
  biasUpdates: { "loss-aversion": { accuracy: 0.55 } },
  streakStatus: { current: 48, freezes: 3 }
}

// Generate new question
POST /api/generate-question
Body: {
  bias: "confirmation-bias",
  difficulty: "medium",
  userContext: { interests: ["crypto"], level: 15 }
}
Response: {
  question: { /* generated question */ },
  estimatedDifficulty: 0.65,
  generationSource: "llm-gpt4"
}

// Get user insights
GET /api/insights
Response: {
  weakAreas: ["overconfidence-bias", "anchoring-bias"],
  strongAreas: ["confirmation-bias", "framing-bias"],
  recommendedFocus: "overconfidence-bias",
  weeklyReport: { /* stats */ }
}
```

### LLM Integration Options

**Option 1: OpenAI GPT-4**
- Best quality
- $0.03 per question generated
- Use for premium users or pre-generation

**Option 2: Claude (Anthropic)**
- Great quality
- Good at following templates
- Similar pricing

**Option 3: OpenRouter**
- Cost-effective
- Use cheaper models for bulk generation
- Reserve expensive models for quality checks

**Cost Optimization:**
- Generate in batches (100 questions at once)
- Cache generated questions
- Use cheaper models for variations, expensive for validation
- Target: <$0.01 per user per day

### Data Storage

**User Progress (PostgreSQL/Supabase):**
```sql
CREATE TABLE user_bias_stats (
  user_id UUID,
  bias_id VARCHAR(50),
  questions_answered INT,
  correct_answers INT,
  accuracy DECIMAL,
  mastery_level VARCHAR(20),
  last_tested TIMESTAMP,
  improvement_trend VARCHAR(20)
);

CREATE TABLE user_streaks (
  user_id UUID PRIMARY KEY,
  current_streak INT,
  longest_streak INT,
  freezes_available INT,
  last_activity_date DATE,
  total_questions_answered INT
);

CREATE TABLE question_history (
  id UUID PRIMARY KEY,
  user_id UUID,
  question_id VARCHAR(100),
  template_id VARCHAR(100),
  correct BOOLEAN,
  time_spent INT,
  confidence DECIMAL,
  answered_at TIMESTAMP
);

CREATE TABLE spaced_repetition_queue (
  user_id UUID,
  question_id VARCHAR(100),
  next_review_date DATE,
  review_count INT,
  difficulty DECIMAL
);
```

**Generated Questions (Cache):**
```javascript
// Redis for fast access
const questionCache = {
  'loss-aversion:medium:crypto': [q1, q2, q3, ...],
  'confirmation-bias:hard:tech': [q1, q2, ...],
  // Pre-generated, ready to serve
}
```

---

## 🚀 Implementation Phases

### Phase 1: Forgiving Streaks (Week 1)
- [x] Streak tracking with calendar view
- [x] Auto-earn freezes (7 days = 1 freeze)
- [x] Auto-use freezes on missed days
- [x] Streak repair options
- [x] Milestone badges

### Phase 2: Basic Adaptive Learning (Week 2)
- [x] Track accuracy per bias
- [x] Calculate mastery levels
- [x] Simple weak area identification
- [x] Prioritize weak areas in daily challenge
- [x] Basic progress visualization

### Phase 3: LLM Question Generation (Week 3)
- [x] Convert existing questions to templates
- [x] LLM integration (OpenAI/Claude)
- [x] Generate variations of seed questions
- [x] Quality validation
- [x] Question caching system

### Phase 4: Spaced Repetition (Week 4)
- [x] Track wrong answers
- [x] Schedule review questions
- [x] Implement forgetting curve algorithm
- [x] Mix review into daily challenges
- [x] Progress tracking on reviews

### Phase 5: Advanced Personalization (Week 5)
- [x] User interest profiling
- [x] Context-aware generation
- [x] Progressive difficulty
- [x] Weekly/monthly reports
- [x] Insight notifications

---

## 📊 Success Metrics

### Engagement
- **Streak distribution**: Target 40% of users with 7+ day streaks
- **Daily completion rate**: Target 60% of active users complete daily challenge
- **Freeze usage**: Track how often auto-used (should be common = system works)

### Learning Effectiveness
- **Accuracy improvement**: Average +20% improvement after 30 days
- **Mastery progression**: Users master 2-3 biases per month
- **Review success rate**: 70%+ correct on spaced repetition reviews

### System Health
- **Question variety**: Users see <10% repeated questions in 30 days
- **Generation quality**: >90% of generated questions accepted by users
- **Personalization accuracy**: Weak area focus leads to +15% faster improvement

---

## 💡 The Magic Formula

```
Forgiving Streaks + Fresh Content + Personalized Focus =
Habit Formation + Continuous Learning + Mastery
```

**User Experience:**
1. **Easy daily win** (3 questions, forgiving streaks)
2. **Always something new** (generative questions)
3. **Visible progress** (mastery levels improving)
4. **Feels personalized** (targets YOUR weak spots)
5. **Never feels punishing** (freeze system)

Result: **Users keep coming back because it feels rewarding, not demanding.**

---

Ready to implement? I'd start with **Phase 1 + Phase 2** together (forgiving streaks + basic adaptive learning) as they're the foundation for everything else.
