// Human Body Explorer - Main JavaScript

// ========== DARK MODE ==========
function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeButton(theme);
}

function updateThemeButton(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeButton(next);
}

// Initialize theme immediately to avoid flash
initTheme();

// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ========== SEARCH ==========
  const searchInput = document.getElementById('searchInput');
  const systemsGrid = document.getElementById('systemsGrid');

  if (searchInput && systemsGrid) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      systemsGrid.querySelectorAll('.system-card').forEach(card => {
        const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
        const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
        const match = !query || keywords.includes(query) || title.includes(query) || desc.includes(query);
        card.style.display = match ? 'flex' : 'none';
      });
    });
  }

  // ========== OBJECTIVE QUIZ ==========
  document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', function () {
      const parent = this.closest('.quiz-card');
      if (parent.classList.contains('answered')) return;
      parent.classList.add('answered');

      const options = parent.querySelectorAll('.quiz-option');
      const feedback = parent.querySelector('.quiz-feedback');
      const isCorrect = this.dataset.correct === 'true';

      options.forEach(opt => {
        opt.style.pointerEvents = 'none';
        if (opt.dataset.correct === 'true') opt.classList.add('correct');
      });

      if (!isCorrect) this.classList.add('wrong');

      if (feedback) {
        feedback.style.display = 'block';
        feedback.textContent = isCorrect
          ? '✅ Correct! Well done.'
          : '❌ Not quite. The correct answer is highlighted in green.';
        feedback.style.color = isCorrect ? 'var(--success)' : 'var(--danger)';
      }
    });
  });

  // ========== SUBJECTIVE - Show model answer ==========
  document.querySelectorAll('.show-answer-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = this.closest('.quiz-card, .practice-card');
      const model = card.querySelector('.model-answer');
      if (model) {
        model.classList.toggle('show');
        this.textContent = model.classList.contains('show') ? 'Hide Model Answer' : 'Show Model Answer';
      }
    });
  });

  // ========== TABS ==========
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const parent = this.closest('section') || this.closest('.container') || document;
      const target = this.dataset.tab;

      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      parent.querySelectorAll('.tab-content').forEach(c => {
        c.classList.toggle('active', c.id === target);
      });
    });
  });

  // ========== ORAL TEST ==========
  initOralTest();
});

// Oral test questions
const oralQuestions = [
  { q: "What is the main function of the nervous system?", a: "It controls body activities and allows communication between the brain and the rest of the body." },
  { q: "Name the three main parts of the nervous system.", a: "Brain, spinal cord, and nerves." },
  { q: "What does the heart do?", a: "It pumps blood around the body, carrying oxygen and nutrients to cells." },
  { q: "How many chambers does the human heart have?", a: "Four chambers." },
  { q: "What is the main job of the respiratory system?", a: "To take in oxygen and remove carbon dioxide from the body." },
  { q: "Where does gas exchange happen in the lungs?", a: "In the alveoli (tiny air sacs)." },
  { q: "Where does digestion begin?", a: "In the mouth." },
  { q: "What is the approximate length of the small intestine?", a: "About 6 to 7 meters." },
  { q: "How many bones does an adult human usually have?", a: "206 bones." },
  { q: "Why do babies have more bones than adults?", a: "Some bones fuse together as the child grows." },
  { q: "Name the three types of muscle.", a: "Skeletal muscle, smooth muscle, and cardiac muscle." },
  { q: "Which muscle type makes up the heart?", a: "Cardiac muscle." },
  { q: "How do muscles usually work together?", a: "In pairs — when one contracts, the other relaxes." },
  { q: "What protects the brain?", a: "The skull (cranium)." },
  { q: "What is the diaphragm used for?", a: "It is a muscle that helps the lungs expand and contract during breathing." }
];

function initOralTest() {
  const questionEl = document.getElementById('oralQuestion');
  const answerEl = document.getElementById('oralAnswer');
  const progressEl = document.getElementById('oralProgress');
  const nextBtn = document.getElementById('oralNext');
  const showBtn = document.getElementById('oralShow');
  const startBtn = document.getElementById('oralStart');

  if (!questionEl) return;

  let current = 0;
  let shuffled = [];

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function showQuestion() {
    if (current >= shuffled.length) {
      questionEl.textContent = "🎉 You finished all questions! Great practice.";
      if (answerEl) answerEl.style.display = 'none';
      if (showBtn) showBtn.style.display = 'none';
      if (nextBtn) nextBtn.textContent = 'Restart';
      if (progressEl) progressEl.textContent = `Completed ${shuffled.length} questions`;
      return;
    }
    questionEl.textContent = shuffled[current].q;
    if (answerEl) {
      answerEl.textContent = shuffled[current].a;
      answerEl.style.display = 'none';
    }
    if (showBtn) {
      showBtn.style.display = 'inline-flex';
      showBtn.textContent = 'Show Answer';
    }
    if (nextBtn) nextBtn.textContent = 'Next Question';
    if (progressEl) progressEl.textContent = `Question ${current + 1} of ${shuffled.length}`;
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      shuffled = shuffle(oralQuestions);
      current = 0;
      startBtn.style.display = 'none';
      const controls = document.getElementById('oralControls');
      if (controls) controls.style.display = 'flex';
      showQuestion();
    });
  }

  if (showBtn) {
    showBtn.addEventListener('click', () => {
      if (answerEl.style.display === 'none') {
        answerEl.style.display = 'block';
        showBtn.textContent = 'Hide Answer';
      } else {
        answerEl.style.display = 'none';
        showBtn.textContent = 'Show Answer';
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (nextBtn.textContent === 'Restart') {
        shuffled = shuffle(oralQuestions);
        current = 0;
        showQuestion();
        return;
      }
      current++;
      showQuestion();
    });
  }
}
