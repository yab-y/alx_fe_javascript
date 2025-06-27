const quotes = [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Tech" },
  { text: "Art is not what you see, but what you make others see.", category: "Art" }
];

let currentCategory = null;

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryContainer = document.getElementById("categoryContainer");

// Show a random quote
function showRandomQuote() {
  const filtered = currentCategory
    ? quotes.filter(q => q.category.toLowerCase() === currentCategory.toLowerCase())
    : quotes;

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
}

// Add a quote to the list
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
    alert("Quote added!");
  } else {
    alert("Both fields are required.");
  }
}

// Create form to add new quote dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.style.marginTop = "20px";

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addBtn);

  document.body.appendChild(formContainer);
}

// Update the category filter buttons
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

  const allBtn = document.createElement("button");
  allBtn.textContent = "All";
  allBtn.onclick = () => {
    currentCategory = null;
    showRandomQuote();
  };
  categoryContainer.appendChild(allBtn);
}

// Initialize
newQuoteBtn.addEventListener("click", showRandomQuote);
createAddQuoteForm();
updateCategories();
showRandomQuote();
