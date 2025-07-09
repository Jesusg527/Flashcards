let cards = JSON.parse(localStorage.getItem('flashcards')) || [];
let currentIndex = 0;
let showingAnswer = false;
let filteredCards = [...cards];
let editing = false;

const cardForm = document.getElementById('cardForm');
const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');
const searchInput = document.getElementById('searchInput');

const cardEl = document.getElementById('cardDisplay');
const flipBtn = document.getElementById('flipBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const deleteBtn = document.getElementById('deleteBtn');
const editBtn = document.getElementById('editBtn');

function saveCards() {
  localStorage.setItem('flashcards', JSON.stringify(cards));
}

function renderCard() {
  if (filteredCards.length === 0) {
    cardEl.textContent = "No matching cards.";
    cardEl.classList.remove('flipped');
    flipBtn.disabled = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    deleteBtn.disabled = true;
    editBtn.disabled = true;
    return;
  }

  const currentCard = filteredCards[currentIndex];
  cardEl.textContent = showingAnswer ? currentCard.answer : currentCard.question;
  cardEl.classList.toggle('flipped', showingAnswer);

  flipBtn.disabled = false;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === filteredCards.length - 1;
  deleteBtn.disabled = false;
  editBtn.disabled = false;
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
  if (currentIndex < filteredCards.length - 1) {
    currentIndex++;
    showingAnswer = false;
    renderCard();
  }
});

deleteBtn.addEventListener('click', () => {
  if (filteredCards.length === 0) return;
  const cardToDelete = filteredCards[currentIndex];
  const originalIndex = cards.findIndex(c => c.question === cardToDelete.question && c.answer === cardToDelete.answer);
  if (originalIndex !== -1) cards.splice(originalIndex, 1);

  filteredCards = [...cards];
  if (currentIndex >= filteredCards.length) currentIndex = filteredCards.length - 1;
  showingAnswer = false;
  saveCards();
  renderCard();
});

editBtn.addEventListener('click', () => {
  if (filteredCards.length === 0) return;
  const currentCard = filteredCards[currentIndex];
  questionInput.value = currentCard.question;
  answerInput.value = currentCard.answer;
  editing = true;
});

cardForm.onsubmit = (e) => {
  e.preventDefault();

  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();
  if (!question || !answer) return;

  if (editing) {
    const cardToEdit = filteredCards[currentIndex];
    const originalIndex = cards.findIndex(c => c.question === cardToEdit.question && c.answer === cardToEdit.answer);
    if (originalIndex !== -1) {
      cards[originalIndex] = { question, answer };
    }
    editing = false;
  } else {
    cards.push({ question, answer });
  }

  saveCards();
  filteredCards = [...cards];
  questionInput.value = '';
  answerInput.value = '';
  currentIndex = filteredCards.length - 1;
  showingAnswer = false;
  renderCard();
};

searchInput.addEventListener('input', () => {
  const term = searchInput.value.trim().toLowerCase();
  filteredCards = cards.filter(card =>
    card.question.toLowerCase().includes(term) ||
    card.answer.toLowerCase().includes(term)
  );
  currentIndex = 0;
  showingAnswer = false;
  renderCard();
});

window.addEventListener('DOMContentLoaded', renderCard);