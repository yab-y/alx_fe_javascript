let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportBtn");
const categoryFilter = document.getElementById("categoryFilter"); // ✅ Explicitly defined

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  const storedFilter = localStorage.getItem("selectedCategory");

  quotes = storedQuotes ? JSON.parse(storedQuotes) : [
    { text: "The only limit is your mind.", category: "Motivation" },
    { text: "Simplicity is the soul of efficiency.", category: "Tech" },
    { text: "Art is not what you see, but what you make others see.", category: "Art" }
  ];
  saveQuotes();

  if (storedFilter) {
    categoryFilter.value = storedFilter;
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function saveLastQuote(quote) {
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
  saveLastQuote(quote);
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories(); // ✅ Update dropdown
    textInput.value = "";
    categoryInput.value = "";
    alert("Quote added!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

function createAddQuoteForm() {
  const container = document.createElement("div");
  container.style.marginTop = "1.5rem";

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
  addBtn.onclick = addQuote;

  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(addBtn);
  document.body.appendChild(container);
}

// ✅ Define and export this function
function populateCategories() {
  const selected = localStorage.getItem("selectedCategory") || "all";
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === selected) option.selected = true;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid format. JSON must be an array.");
      }
    } catch (err) {
      alert("Import failed: " + err.message);
    }
  };
  reader.readAsText(event.target.files[0]);
}

// ✅ Initialization
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportToJsonFile);
window.filterQuotes = filterQuotes; // so it works from HTML onchange

loadQuotes();
createAddQuoteForm();
populateCategories();

const last = sessionStorage.getItem("lastQuote");
if (last) {
  const q = JSON.parse(last);
  quoteDisplay.textContent = `"${q.text}" - ${q.category}`;
} else {
  showRandomQuote();
}
