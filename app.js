// Enhanced Quiz Application with Streaks & Adaptive Learning
const app = {
    quizData: null,
    currentModule: null,
    currentQuestionIndex: 0,
    selectedAnswers: [],
    moduleScores: {},
    totalScore: 0,
    earnedBadges: [],

    // NEW: Streak and adaptive learning data
    streakData: {
        currentStreak: 0,
        longestStreak: 0,
        freezesAvailable: 0,
        lastActivityDate: null,
        streakHistory: [], // Array of dates
        questionsToday: 0,
        dailyGoal: 3 // Minimum for streak
    },

    // NEW: Bias mastery tracking
    biasProfile: {},

    // NEW: Daily challenge
    dailyChallenge: {
        questions: [],
        completed: false,
        date: null
    },

    // NEW: Question history for spaced repetition
    questionHistory: [],
    reviewQueue: [],

    // Initialize the application
    async init() {
        try {
            const response = await fetch('financial_education_game.json');
            this.quizData = await response.json();
            this.loadProgress();
            this.initializeBiasProfile();
            this.checkDailyStreak();
            this.generateDailyChallenge();
            this.updateProgressBar();
            this.showStart();
        } catch (error) {
            console.error('Error loading quiz data:', error);
            alert('Failed to load quiz data. Please refresh the page.');
        }
    },

    // Initialize bias profile if not exists
    initializeBiasProfile() {
        const allBiases = Object.keys(this.quizData.concepts);
        allBiases.forEach(biasId => {
            if (!this.biasProfile[biasId]) {
                this.biasProfile[biasId] = {
                    questionsAnswered: 0,
                    correctAnswers: 0,
                    accuracy: 0,
                    masteryLevel: 'novice',
                    lastTested: null,
                    improvementTrend: 'new',
                    recentAccuracy: [] // Last 10 answers
                };
            }
        });
    },

    // Check and update daily streak
    checkDailyStreak() {
        const today = new Date().toDateString();
        const lastDate = this.streakData.lastActivityDate;

        if (!lastDate) {
            // First time user
            this.streakData.currentStreak = 0;
            this.streakData.questionsToday = 0;
            return;
        }

        const lastActivityDate = new Date(lastDate);
        const todayDate = new Date(today);
        const diffTime = todayDate - lastActivityDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            // Same day - just continue
            return;
        } else if (diffDays === 1) {
            // Yesterday - check if daily goal was met
            if (this.streakData.questionsToday >= this.streakData.dailyGoal) {
                // Streak continues!
                this.streakData.currentStreak++;
                this.checkStreakMilestones();
            } else {
                // Missed goal - check for freeze
                if (this.streakData.freezesAvailable > 0) {
                    // Auto-use freeze
                    this.streakData.freezesAvailable--;
                    this.showNotification('🛡️ Streak Protected!',
                        `Your streak freeze was used. You have ${this.streakData.freezesAvailable} left.`,
                        'success');
                    this.streakData.currentStreak++;
                } else {
                    // Streak broken :(
                    this.handleStreakBreak();
                }
            }
            // Reset for today
            this.streakData.questionsToday = 0;
        } else if (diffDays > 1) {
            // Multiple days missed - check freezes
            const freezesNeeded = diffDays - 1;
            if (this.streakData.freezesAvailable >= freezesNeeded) {
                // Use multiple freezes
                this.streakData.freezesAvailable -= freezesNeeded;
                this.streakData.currentStreak += diffDays;
                this.showNotification('🛡️ Multiple Freezes Used',
                    `${freezesNeeded} streak freezes were used. You have ${this.streakData.freezesAvailable} left.`,
                    'success');
            } else {
                // Not enough freezes - streak broken
                this.handleStreakBreak();
            }
            this.streakData.questionsToday = 0;
        }
    },

    // Handle streak break
    handleStreakBreak() {
        const oldStreak = this.streakData.currentStreak;
        if (oldStreak > this.streakData.longestStreak) {
            this.streakData.longestStreak = oldStreak;
        }

        this.streakData.currentStreak = 0;
        this.streakData.questionsToday = 0;

        if (oldStreak >= 7) {
            this.showNotification('Streak Ended',
                `Your ${oldStreak}-day streak ended. But don't worry - start fresh today! 💪`,
                'info');
        }
    },

    // Check streak milestones and award freezes
    checkStreakMilestones() {
        const streak = this.streakData.currentStreak;
        const coins = this.getCurrency('coins');

        // Award freezes at milestones
        if (streak === 7) {
            this.awardFreeze(1, '7-day streak!');
            this.addCurrency('coins', 500);
            this.awardBadge('week-warrior', 'Week Warrior', 'Completed 7-day streak!');
        } else if (streak === 30) {
            this.awardFreeze(5, '30-day streak!');
            this.addCurrency('coins', 2500);
            this.awardBadge('monthly-master', 'Monthly Master', 'Completed 30-day streak!');
        } else if (streak === 100) {
            this.awardFreeze(10, '100-day streak!');
            this.addCurrency('coins', 10000);
            this.awardBadge('centurion', 'Centurion', 'Completed 100-day streak!');
        } else if (streak % 7 === 0 && streak > 0) {
            // Every week, award 1 freeze
            this.awardFreeze(1, 'Perfect week!');
        }

        // Update longest streak
        if (streak > this.streakData.longestStreak) {
            this.streakData.longestStreak = streak;
        }
    },

    // Award streak freeze
    awardFreeze(count, reason) {
        const maxFreezes = 5;
        const before = this.streakData.freezesAvailable;
        this.streakData.freezesAvailable = Math.min(maxFreezes, this.streakData.freezesAvailable + count);
        const actual = this.streakData.freezesAvailable - before;

        if (actual > 0) {
            this.showNotification('🛡️ Streak Freeze Earned!',
                `You earned ${actual} streak freeze${actual > 1 ? 's' : ''} for ${reason}`,
                'success');
        }
    },

    // Award badge
    awardBadge(id, name, description) {
        if (!this.earnedBadges.find(b => b.id === id)) {
            this.earnedBadges.push({ id, name, description, earnedAt: new Date() });
            this.showNotification('🏆 Badge Unlocked!',
                `${name}: ${description}`,
                'success');
        }
    },

    // Generate daily challenge
    generateDailyChallenge() {
        const today = new Date().toDateString();

        // Check if already generated today
        if (this.dailyChallenge.date === today && this.dailyChallenge.questions.length > 0) {
            return;
        }

        // Generate new daily challenge
        const questions = this.selectAdaptiveQuestions(3);

        this.dailyChallenge = {
            questions: questions,
            completed: false,
            date: today
        };

        this.saveProgress();
    },

    // Select questions adaptively based on weak areas
    selectAdaptiveQuestions(count) {
        const allQuestions = [];
        this.quizData.modules.forEach(module => {
            module.questions.forEach(q => {
                allQuestions.push({ ...q, moduleId: module.moduleId });
            });
        });

        // Get weak areas (accuracy < 70% and at least 3 attempts)
        const weakBiases = Object.keys(this.biasProfile).filter(biasId => {
            const profile = this.biasProfile[biasId];
            return profile.questionsAnswered >= 3 && profile.accuracy < 0.7;
        });

        // Get untested biases
        const untestedBiases = Object.keys(this.biasProfile).filter(biasId => {
            return this.biasProfile[biasId].questionsAnswered < 3;
        });

        // Get questions for review (wrong in the past)
        const reviewQuestions = this.getQuestionsForReview();

        const selected = [];

        // Priority 1: Review question (40% - 1 question if count=3)
        if (reviewQuestions.length > 0 && selected.length < count) {
            const reviewQ = reviewQuestions[Math.floor(Math.random() * reviewQuestions.length)];
            const question = allQuestions.find(q => q.id === reviewQ.questionId);
            if (question && !selected.find(q => q.id === question.id)) {
                selected.push({ ...question, isReview: true });
            }
        }

        // Priority 2: Weak area question (40% - 1 question)
        if (weakBiases.length > 0 && selected.length < count) {
            const weakBias = weakBiases[Math.floor(Math.random() * weakBiases.length)];
            const weakQuestions = allQuestions.filter(q =>
                q.concepts && q.concepts.includes(weakBias) &&
                !selected.find(sq => sq.id === q.id)
            );
            if (weakQuestions.length > 0) {
                const weakQ = weakQuestions[Math.floor(Math.random() * weakQuestions.length)];
                selected.push({ ...weakQ, isWeakArea: true, targetBias: weakBias });
            }
        }

        // Priority 3: New/exploration (20% - remaining)
        while (selected.length < count) {
            if (untestedBiases.length > 0) {
                const newBias = untestedBiases[Math.floor(Math.random() * untestedBiases.length)];
                const newQuestions = allQuestions.filter(q =>
                    q.concepts && q.concepts.includes(newBias) &&
                    !selected.find(sq => sq.id === q.id)
                );
                if (newQuestions.length > 0) {
                    const newQ = newQuestions[Math.floor(Math.random() * newQuestions.length)];
                    selected.push({ ...newQ, isNew: true });
                    continue;
                }
            }

            // Fallback: random question
            const randomQ = allQuestions[Math.floor(Math.random() * allQuestions.length)];
            if (!selected.find(q => q.id === randomQ.id)) {
                selected.push(randomQ);
            }
        }

        return selected;
    },

    // Get questions due for review (spaced repetition)
    getQuestionsForReview() {
        const today = new Date();
        return this.reviewQueue.filter(item => {
            const reviewDate = new Date(item.nextReviewDate);
            return reviewDate <= today;
        });
    },

    // Record answer and update bias profile
    recordAnswer(question, isCorrect, timeSpent) {
        const today = new Date();

        // Update question history
        this.questionHistory.push({
            questionId: question.id,
            correct: isCorrect,
            timestamp: today,
            timeSpent: timeSpent
        });

        // Update bias profile
        question.concepts.forEach(biasId => {
            if (this.biasProfile[biasId]) {
                const profile = this.biasProfile[biasId];
                profile.questionsAnswered++;
                if (isCorrect) profile.correctAnswers++;
                profile.accuracy = profile.correctAnswers / profile.questionsAnswered;
                profile.lastTested = today;

                // Track recent accuracy (last 10)
                profile.recentAccuracy.push(isCorrect ? 1 : 0);
                if (profile.recentAccuracy.length > 10) {
                    profile.recentAccuracy.shift();
                }

                // Update mastery level
                profile.masteryLevel = this.calculateMasteryLevel(profile.accuracy);

                // Update trend
                if (profile.questionsAnswered >= 10) {
                    const recent = profile.recentAccuracy.slice(-5).reduce((a,b) => a+b, 0) / 5;
                    const older = profile.recentAccuracy.slice(0, 5).reduce((a,b) => a+b, 0) / 5;
                    if (recent > older + 0.1) profile.improvementTrend = 'improving';
                    else if (recent < older - 0.1) profile.improvementTrend = 'declining';
                    else profile.improvementTrend = 'stable';
                }
            }
        });

        // Add to review queue if wrong
        if (!isCorrect) {
            this.addToReviewQueue(question.id, 1); // Review in 1 day
        }

        // Update streak data
        this.streakData.questionsToday++;
        this.streakData.lastActivityDate = today.toDateString();

        // Check for freeze earning (10 questions in one day)
        if (this.streakData.questionsToday === 10) {
            this.awardFreeze(1, 'answering 10 questions today!');
        }

        this.saveProgress();
    },

    // Calculate mastery level
    calculateMasteryLevel(accuracy) {
        if (accuracy >= 0.90) return 'mastered';
        if (accuracy >= 0.80) return 'proficient';
        if (accuracy >= 0.61) return 'competent';
        if (accuracy >= 0.26) return 'developing';
        return 'novice';
    },

    // Add question to review queue
    addToReviewQueue(questionId, daysUntilReview) {
        const reviewDate = new Date();
        reviewDate.setDate(reviewDate.getDate() + daysUntilReview);

        // Remove if already in queue
        this.reviewQueue = this.reviewQueue.filter(item => item.questionId !== questionId);

        // Add with new review date
        this.reviewQueue.push({
            questionId: questionId,
            nextReviewDate: reviewDate.toDateString(),
            reviewCount: 0
        });
    },

    // Currency system
    currency: {
        coins: 0,
        gems: 0,
        xp: 0
    },

    addCurrency(type, amount) {
        if (!this.currency[type]) this.currency[type] = 0;
        this.currency[type] += amount;
        this.saveProgress();

        // Show notification for significant gains
        if (amount >= 100) {
            this.showNotification(`+${amount} ${type}!`, '', 'success');
        }
    },

    getCurrency(type) {
        return this.currency[type] || 0;
    },

    // Show notification
    showNotification(title, message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-title">${title}</div>
            ${message ? `<div class="notification-message">${message}</div>` : ''}
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    },

    // Save progress to localStorage
    saveProgress() {
        const progress = {
            moduleScores: this.moduleScores,
            totalScore: this.totalScore,
            earnedBadges: this.earnedBadges,
            streakData: this.streakData,
            biasProfile: this.biasProfile,
            dailyChallenge: this.dailyChallenge,
            questionHistory: this.questionHistory.slice(-100), // Keep last 100
            reviewQueue: this.reviewQueue,
            currency: this.currency
        };
        localStorage.setItem('quizProgress', JSON.stringify(progress));
    },

    // Load progress from localStorage
    loadProgress() {
        const saved = localStorage.getItem('quizProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.moduleScores = progress.moduleScores || {};
            this.totalScore = progress.totalScore || 0;
            this.earnedBadges = progress.earnedBadges || [];
            this.streakData = progress.streakData || this.streakData;
            this.biasProfile = progress.biasProfile || {};
            this.dailyChallenge = progress.dailyChallenge || this.dailyChallenge;
            this.questionHistory = progress.questionHistory || [];
            this.reviewQueue = progress.reviewQueue || [];
            this.currency = progress.currency || { coins: 0, gems: 0, xp: 0 };
        }
    },

    // Update progress bar
    updateProgressBar() {
        const level = this.getCurrentLevel();
        const nextLevel = this.getNextLevel();

        document.getElementById('currentLevel').textContent = level.name;
        document.getElementById('currentScore').textContent = `${this.totalScore} points`;

        // Calculate progress to next level
        let progressPercent = 0;
        if (nextLevel) {
            const currentMin = level.minimumScore;
            const nextMin = nextLevel.minimumScore;
            const range = nextMin - currentMin;
            const current = this.totalScore - currentMin;
            progressPercent = Math.min(100, (current / range) * 100);
        } else {
            progressPercent = 100;
        }

        document.getElementById('progressFill').style.width = `${progressPercent}%`;

        // Update streak display if exists
        this.updateStreakDisplay();
    },

    // Update streak display
    updateStreakDisplay() {
        const streakEl = document.getElementById('streakDisplay');
        if (streakEl) {
            const streak = this.streakData.currentStreak;
            const freezes = this.streakData.freezesAvailable;
            const questionsToday = this.streakData.questionsToday;
            const goal = this.streakData.dailyGoal;

            let streakHTML = '';
            if (streak > 0) {
                streakHTML = `
                    <div class="streak-info">
                        <span class="streak-flame">🔥 ${streak} day${streak !== 1 ? 's' : ''}</span>
                        ${freezes > 0 ? `<span class="streak-freezes">🛡️ ×${freezes}</span>` : ''}
                    </div>
                    <div class="streak-progress-text">${questionsToday}/${goal} questions today</div>
                `;
            } else {
                streakHTML = `
                    <div class="streak-info">
                        <span class="streak-start">Start your streak! 🚀</span>
                    </div>
                    <div class="streak-progress-text">${questionsToday}/${goal} questions today</div>
                `;
            }

            streakEl.innerHTML = streakHTML;
        }
    },

    // Get current level based on score
    getCurrentLevel() {
        const levels = this.quizData.gamification.levels;
        for (let i = levels.length - 1; i >= 0; i--) {
            if (this.totalScore >= levels[i].minimumScore) {
                if (levels[i].maximumScore === null || this.totalScore <= levels[i].maximumScore) {
                    return levels[i];
                }
            }
        }
        return levels[0];
    },

    // Get next level
    getNextLevel() {
        const levels = this.quizData.gamification.levels;
        const currentLevel = this.getCurrentLevel();
        const currentIndex = levels.findIndex(l => l.id === currentLevel.id);
        return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
    },

    // Screen Management
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    },

    showStart() {
        this.showScreen('startScreen');
        this.updateStreakDisplay();
    },

    showModuleSelection() {
        this.showScreen('moduleScreen');
        this.renderModuleList();
    },

    showDashboard() {
        this.showScreen('dashboardScreen');
        this.renderDashboard();
    },

    // NEW: Show daily challenge
    showDailyChallenge() {
        this.showScreen('dailyChallengeScreen');
        this.renderDailyChallenge();
    },

    // NEW: Render daily challenge
    renderDailyChallenge() {
        const container = document.getElementById('dailyChallengeContainer');
        if (!container) return;

        const challenge = this.dailyChallenge;

        if (challenge.completed) {
            container.innerHTML = `
                <div class="challenge-completed">
                    <h2>✅ Today's Challenge Complete!</h2>
                    <p>Great job! Come back tomorrow for a new challenge.</p>
                    <p>Current streak: 🔥 ${this.streakData.currentStreak} days</p>
                    <button class="btn btn-primary" onclick="app.showModuleSelection()">
                        Practice More
                    </button>
                </div>
            `;
            return;
        }

        let html = '<h2>Today\'s Challenge</h2>';
        html += `<p class="challenge-description">Complete these ${challenge.questions.length} questions to maintain your streak!</p>`;

        html += '<div class="challenge-questions">';
        challenge.questions.forEach((q, index) => {
            let badge = '';
            if (q.isReview) badge = '<span class="question-badge review">Review</span>';
            else if (q.isWeakArea) badge = '<span class="question-badge weak">Weak Area</span>';
            else if (q.isNew) badge = '<span class="question-badge new">New</span>';

            html += `
                <div class="challenge-question-item" onclick="app.startDailyChallengeQuestion(${index})">
                    <span class="question-number">Question ${index + 1}</span>
                    ${badge}
                    <span class="question-arrow">→</span>
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    },

    // Start daily challenge question
    startDailyChallengeQuestion(index) {
        this.currentModule = {
            title: "Daily Challenge",
            description: "Personalized questions based on your learning",
            questions: this.dailyChallenge.questions
        };
        this.currentQuestionIndex = index;
        this.selectedAnswers = [];
        this.showScreen('quizScreen');
        this.renderQuestion();
    },

    // Render module selection
    renderModuleList() {
        const container = document.getElementById('moduleList');
        container.innerHTML = '';

        this.quizData.modules.forEach((module, index) => {
            const card = document.createElement('div');
            card.className = 'module-card';

            const isCompleted = this.moduleScores[module.moduleId] !== undefined;
            if (isCompleted) {
                card.classList.add('completed');
            }

            const score = this.moduleScores[module.moduleId] || 0;
            const totalPoints = module.questions.reduce((sum, q) => sum + q.points, 0);
            const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

            card.innerHTML = `
                <h3>${module.title}</h3>
                <p>${module.description}</p>
                <div class="module-stats">
                    <span>${module.questions.length} questions</span>
                    ${isCompleted ? `<span>${percentage}% complete</span>` : ''}
                </div>
                ${percentage >= 90 ? '<div class="module-badge">🏆 Mastered</div>' : ''}
            `;

            card.onclick = () => this.startModule(module.moduleId);
            container.appendChild(card);
        });
    },

    // Start a module
    startModule(moduleId) {
        this.currentModule = this.quizData.modules.find(m => m.moduleId === moduleId);
        this.currentQuestionIndex = 0;
        this.selectedAnswers = [];
        this.showScreen('quizScreen');
        this.renderQuestion();
    },

    // Render current question
    renderQuestion() {
        const question = this.currentModule.questions[this.currentQuestionIndex];

        document.getElementById('moduleTitle').textContent = this.currentModule.title;
        document.getElementById('moduleDescription').textContent = this.currentModule.description;
        document.getElementById('questionNumber').textContent =
            `Question ${this.currentQuestionIndex + 1} of ${this.currentModule.questions.length}`;
        document.getElementById('questionText').textContent = question.text;

        // Show question context if from daily challenge
        let contextHTML = '';
        if (question.isReview) {
            contextHTML = '<div class="question-context">🔄 You got this wrong before - let\'s review!</div>';
        } else if (question.isWeakArea) {
            const biasName = this.quizData.concepts[question.targetBias]?.name || 'this bias';
            contextHTML = `<div class="question-context">⚠️ Practicing ${biasName} (your weak area)</div>`;
        } else if (question.isNew) {
            contextHTML = '<div class="question-context">✨ Exploring a new concept!</div>';
        }

        const contextContainer = document.getElementById('questionContext');
        if (contextContainer) {
            contextContainer.innerHTML = contextHTML;
        }

        // Render options
        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';

        const isMultipleChoice = Array.isArray(question.correctAnswer);
        const inputType = isMultipleChoice ? 'checkbox' : 'radio';

        // Add instruction text
        const instructionDiv = document.createElement('div');
        instructionDiv.className = 'answer-instruction';
        instructionDiv.innerHTML = isMultipleChoice
            ? '☑️ <strong>Select all that apply</strong>'
            : '⭕ <strong>Select one answer</strong>';
        container.appendChild(instructionDiv);

        question.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.innerHTML = `
                <input type="${inputType}" name="answer" value="${option.id}" id="option-${option.id}">
                <label for="option-${option.id}" class="option-text">${option.text}</label>
            `;

            optionDiv.onclick = (e) => {
                if (e.target.tagName !== 'INPUT') {
                    const input = optionDiv.querySelector('input');
                    if (inputType === 'radio') {
                        document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
                        input.checked = true;
                        optionDiv.classList.add('selected');
                    } else {
                        input.checked = !input.checked;
                        optionDiv.classList.toggle('selected');
                    }
                }
            };

            const input = optionDiv.querySelector('input');
            input.onchange = () => {
                if (inputType === 'checkbox') {
                    optionDiv.classList.toggle('selected', input.checked);
                } else {
                    document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
                    if (input.checked) {
                        optionDiv.classList.add('selected');
                    }
                }
            };

            container.appendChild(optionDiv);
        });

        // Reset feedback card
        document.getElementById('feedbackCard').style.display = 'none';
        document.getElementById('submitAnswer').style.display = 'block';

        // Track start time for answer duration
        this.questionStartTime = Date.now();
    },

    // Submit answer
    submitAnswer() {
        const question = this.currentModule.questions[this.currentQuestionIndex];
        const selectedInputs = document.querySelectorAll('input[name="answer"]:checked');

        if (selectedInputs.length === 0) {
            alert('Please select an answer before submitting.');
            return;
        }

        const userAnswers = Array.from(selectedInputs).map(input => input.value);
        const correctAnswer = Array.isArray(question.correctAnswer)
            ? question.correctAnswer
            : [question.correctAnswer];

        // Check if answer is correct
        const isCorrect = this.arraysEqual(userAnswers.sort(), correctAnswer.sort());

        // Calculate time spent
        const timeSpent = Math.floor((Date.now() - this.questionStartTime) / 1000);

        // Record answer in adaptive learning system
        this.recordAnswer(question, isCorrect, timeSpent);

        // Award points and coins
        if (isCorrect) {
            this.addCurrency('coins', question.points);
            this.addCurrency('xp', question.points * 2);
        } else {
            // Consolation coins
            this.addCurrency('coins', Math.floor(question.points / 3));
        }

        // Store result
        this.selectedAnswers.push({
            questionId: question.id,
            userAnswers: userAnswers,
            isCorrect: isCorrect,
            points: isCorrect ? question.points : 0
        });

        // Show feedback
        this.showFeedback(isCorrect, question);

        // Hide submit button
        document.getElementById('submitAnswer').style.display = 'none';

        // Mark options as correct/incorrect
        document.querySelectorAll('.option').forEach(optionDiv => {
            const input = optionDiv.querySelector('input');
            const optionId = input.value;

            if (correctAnswer.includes(optionId)) {
                optionDiv.classList.add('correct');
            } else if (userAnswers.includes(optionId)) {
                optionDiv.classList.add('incorrect');
            }

            input.disabled = true;
            optionDiv.style.cursor = 'default';
        });

        // Update streak display
        this.updateStreakDisplay();
    },

    // Show feedback
    showFeedback(isCorrect, question) {
        const feedbackCard = document.getElementById('feedbackCard');
        const feedbackContent = document.getElementById('feedbackContent');

        feedbackCard.className = 'feedback-card';
        feedbackCard.classList.add(isCorrect ? 'correct' : 'incorrect');

        const feedbackText = isCorrect ? question.feedbackCorrect : question.feedbackIncorrect;
        const coins = isCorrect ? question.points : Math.floor(question.points / 3);
        const resultText = isCorrect
            ? `<strong>✓ Correct!</strong> (+${question.points} coins, +${question.points * 2} XP)<br><br>`
            : `<strong>Not quite right.</strong> (+${coins} coins for trying)<br><br>`;

        feedbackContent.innerHTML = resultText + feedbackText;
        feedbackCard.style.display = 'block';
    },

    // Move to next question
    nextQuestion() {
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < this.currentModule.questions.length) {
            this.renderQuestion();
        } else {
            this.showModuleResults();
        }
    },

    // Show module results
    showModuleResults() {
        const moduleScore = this.selectedAnswers.reduce((sum, answer) => sum + answer.points, 0);
        const totalPoints = this.currentModule.questions.reduce((sum, q) => sum + q.points, 0);
        const percentage = Math.round((moduleScore / totalPoints) * 100);

        // Update scores
        const previousScore = this.moduleScores[this.currentModule.moduleId] || 0;
        this.moduleScores[this.currentModule.moduleId] = moduleScore;
        this.totalScore = this.totalScore - previousScore + moduleScore;

        // Check for badges
        const newBadge = this.checkForBadge(this.currentModule.moduleId, percentage);

        // Save progress
        this.saveProgress();
        this.updateProgressBar();

        // Show results screen
        this.showScreen('resultsScreen');
        document.getElementById('moduleScore').textContent = moduleScore;

        // Show badge if earned
        const badgeDisplay = document.getElementById('badgeEarned');
        if (newBadge) {
            badgeDisplay.style.display = 'block';
            badgeDisplay.querySelector('.badge-name').textContent = newBadge.name;
        } else {
            badgeDisplay.style.display = 'none';
        }

        // Show concepts summary
        this.renderConceptsSummary();
    },

    // Check for earned badges
    checkForBadge(moduleId, percentage) {
        const badges = this.quizData.gamification.badges;

        for (const badge of badges) {
            // Check if already earned
            if (this.earnedBadges.find(b => b.id === badge.id)) {
                continue;
            }

            // Check module-specific badges
            if (badge.requirements.moduleId === moduleId && percentage >= badge.requirements.minimumScore) {
                this.earnedBadges.push({
                    id: badge.id,
                    name: badge.name,
                    description: badge.description
                });
                return badge;
            }

            // Check overall badge
            if (badge.requirements.allModules) {
                const allModuleScores = Object.values(this.moduleScores);
                if (allModuleScores.length === this.quizData.modules.length) {
                    const totalEarned = allModuleScores.reduce((sum, score) => sum + score, 0);
                    const totalPossible = this.quizData.modules.reduce((sum, module) =>
                        sum + module.questions.reduce((qSum, q) => qSum + q.points, 0), 0);
                    const overallPercentage = Math.round((totalEarned / totalPossible) * 100);

                    if (overallPercentage >= badge.requirements.minimumScore) {
                        this.earnedBadges.push({
                            id: badge.id,
                            name: badge.name,
                            description: badge.description
                        });
                        return badge;
                    }
                }
            }
        }

        return null;
    },

    // Render concepts summary
    renderConceptsSummary() {
        const container = document.getElementById('conceptsSummary');
        const conceptsInModule = new Set();

        this.currentModule.questions.forEach(q => {
            q.concepts.forEach(concept => conceptsInModule.add(concept));
        });

        if (conceptsInModule.size === 0) {
            container.innerHTML = '';
            return;
        }

        let html = '<h3>Concepts Covered</h3>';
        conceptsInModule.forEach(conceptId => {
            const concept = this.quizData.concepts[conceptId];
            const profile = this.biasProfile[conceptId];
            if (concept && profile) {
                const masteryBadge = this.getMasteryBadge(profile.masteryLevel);
                html += `
                    <div class="concept-item">
                        <div class="concept-name">${concept.name} ${masteryBadge}</div>
                        <div class="concept-description">${concept.description}</div>
                        <div class="concept-stats">Accuracy: ${Math.round(profile.accuracy * 100)}% (${profile.questionsAnswered} attempts)</div>
                    </div>
                `;
            }
        });

        container.innerHTML = html;
    },

    // Get mastery badge emoji
    getMasteryBadge(level) {
        const badges = {
            'novice': '🌱',
            'developing': '📈',
            'competent': '⭐',
            'proficient': '🏅',
            'mastered': '🏆'
        };
        return badges[level] || '';
    },

    // Render dashboard
    renderDashboard() {
        // Update stats
        const level = this.getCurrentLevel();
        document.getElementById('totalScore').textContent = this.getCurrency('coins');
        document.getElementById('levelDisplay').textContent = level.name.replace(' Investor', '');
        document.getElementById('badgesEarned').textContent = this.earnedBadges.length;

        // Render bias mastery
        this.renderBiasMastery();

        // Render module progress
        const progressList = document.getElementById('moduleProgressList');
        progressList.innerHTML = '';

        this.quizData.modules.forEach(module => {
            const score = this.moduleScores[module.moduleId] || 0;
            const totalPoints = module.questions.reduce((sum, q) => sum + q.points, 0);
            const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

            const item = document.createElement('div');
            item.className = 'module-progress-item';
            item.innerHTML = `
                <div class="module-progress-header">
                    <span class="module-progress-title">${module.title}</span>
                    <span class="module-progress-score">${score}/${totalPoints} points (${percentage}%)</span>
                </div>
                <div class="module-progress-bar">
                    <div class="module-progress-fill" style="width: ${percentage}%"></div>
                </div>
            `;
            progressList.appendChild(item);
        });

        // Render badges
        const badgesList = document.getElementById('badgesList');
        badgesList.innerHTML = '';

        this.quizData.gamification.badges.forEach(badge => {
            const isEarned = this.earnedBadges.find(b => b.id === badge.id);
            const item = document.createElement('div');
            item.className = `badge-item ${isEarned ? 'earned' : ''}`;
            item.innerHTML = `
                <div class="badge-icon">🏆</div>
                <div class="badge-title">${badge.name}</div>
                <div class="badge-desc">${badge.description}</div>
            `;
            badgesList.appendChild(item);
        });
    },

    // NEW: Render bias mastery chart
    renderBiasMastery() {
        const container = document.getElementById('biasMasteryChart');
        if (!container) return;

        let html = '<h3>Your Bias Mastery Profile</h3>';
        html += '<div class="bias-mastery-list">';

        const biases = Object.entries(this.biasProfile)
            .filter(([id, profile]) => profile.questionsAnswered > 0)
            .sort((a, b) => a[1].accuracy - b[1].accuracy); // Sort by accuracy (weak first)

        if (biases.length === 0) {
            html += '<p>Start answering questions to see your mastery profile!</p>';
        } else {
            biases.forEach(([biasId, profile]) => {
                const concept = this.quizData.concepts[biasId];
                if (!concept) return;

                const accuracy = Math.round(profile.accuracy * 100);
                const masteryBadge = this.getMasteryBadge(profile.masteryLevel);
                const trendEmoji = profile.improvementTrend === 'improving' ? '📈' :
                                   profile.improvementTrend === 'declining' ? '📉' : '➡️';

                html += `
                    <div class="bias-mastery-item">
                        <div class="bias-mastery-header">
                            <span class="bias-name">${concept.name} ${masteryBadge}</span>
                            <span class="bias-accuracy">${accuracy}% ${trendEmoji}</span>
                        </div>
                        <div class="bias-mastery-bar">
                            <div class="bias-mastery-fill mastery-${profile.masteryLevel}"
                                 style="width: ${accuracy}%"></div>
                        </div>
                        <div class="bias-attempts">${profile.questionsAnswered} questions • ${profile.masteryLevel}</div>
                    </div>
                `;
            });
        }

        html += '</div>';
        container.innerHTML = html;
    },

    // Utility: Compare arrays
    arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
