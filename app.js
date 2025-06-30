let cards = JSON.parse(localStorage.getItem('flashcards')) || [];
let currentIndex = 0;
let showingAnswer = false;

const cardForm = document.getElementById('cardForm');
const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');

const cardEl = document.getElementById('cardDisplay');
const flipBtn = document.getElementById('flipBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const deleteBtn = document.getElementById('deleteBtn');

function saveCards() {
  localStorage.setItem('flashcards', JSON.stringify(cards));
}

function renderCard() {
  if (cards.length === 0) {
    cardEl.textContent = "No cards available.";
    cardEl.classList.remove('flipped');
    flipBtn.disabled = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    deleteBtn.disabled = true;
    return;
  }

  const currentCard = cards[currentIndex];
  cardEl.textContent = showingAnswer ? currentCard.answer : currentCard.question;
  cardEl.classList.toggle('flipped', showingAnswer);

  flipBtn.disabled = false;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === cards.length - 1;
  deleteBtn.disabled = false;
}

flipBtn.addEventListener('click', () => {
  showingAnswer = !showingAnswer;
  renderCard();
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showingAnswer = false;
    renderCard();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    showingAnswer = false;
    renderCard();
  }
});

deleteBtn.addEventListener('click', () => {
  if (cards.length === 0) return;

  cards.splice(currentIndex, 1);
  if (currentIndex >= cards.length) currentIndex = cards.length - 1;
  showingAnswer = false;
  saveCards();
  renderCard();
});

cardForm.onsubmit = (e) => {
  e.preventDefault();

  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();
  if (!question || !answer) return;

  cards.push({ question, answer });
  saveCards();

  questionInput.value = '';
  answerInput.value = '';


  currentIndex = cards.length - 1;
  showingAnswer = false;
  renderCard();
};


window.addEventListener('DOMContentLoaded', renderCard);
