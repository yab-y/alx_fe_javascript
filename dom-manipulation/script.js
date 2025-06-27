const quotes = [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Tech" },
  { text: "Art is not what you see, but what you make others see.", category: "Art" }
];

let currentCategory = null;

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categoryContainer = document.getElementById("categoryContainer");

// Display random quote
function showRandomQuote() {
  const filteredQuotes = currentCategory
    ? quotes.filter(q => q.category.toLowerCase() === currentCategory.toLowerCase())
    : quotes;

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" - ${filteredQuotes[randomIndex].category}`;
}

// Add new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    textInput.value = "";
    categoryInput.value = "";
    updateCategories();
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}

// Update unique category buttons
function updateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryContainer.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => {
      currentCategory = cat;
      showRandomQuote();
    };
    categoryContainer.appendChild(btn);
  });

  // Add 'All' category
  const allBtn = document.createElement("button");
  allBtn.textContent = "All";
  allBtn.onclick = () => {
    currentCategory = null;
    showRandomQuote();
  };
  categoryContainer.appendChild(allBtn);
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Initial call
updateCategories();
showRandomQuote();
