let quotes = [];
let currentCategory = null;

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryContainer = document.getElementById("categoryContainer");

// 🔁 Load quotes from local storage or default set
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The only limit is your mind.", category: "Motivation" },
      { text: "Simplicity is the soul of efficiency.", category: "Tech" },
      { text: "Art is not what you see, but what you make others see.", category: "Art" }
    ];
    saveQuotes();
  }
}

// 💾 Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// 📌 Save last viewed quote to sessionStorage
function saveLastQuote(quote) {
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// 🎯 Display random quote (filtered by category)
function showRandomQuote() {
  const filtered = currentCategory
    ? quotes.filter(q => q.category.toLowerCase() === currentCategory.toLowerCase())
    : quotes;

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
  saveLastQuote(randomQuote);
}

// ➕ Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    updateCategories();
    textInput.value = "";
    categoryInput.value = "";
    alert("Quote added!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// 🧱 Create the form for adding new quotes
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

// 🧩 Update category filter buttons
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

// 💾 Export quotes to JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.click();
  URL.revokeObjectURL(url);
}

// 📂 Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        updateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid format. JSON must be an array of quotes.");
      }
    } catch (err) {
      alert("Error parsing JSON: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// 📁 Create Import/Export buttons and file input
function createImportExportUI() {
  const container = document.createElement("div");
  container.style.marginTop = "20px";

  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = ".json";
  importInput.addEventListener("change", importFromJsonFile);

  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export Quotes";
  exportBtn.addEventListener("click", exportToJsonFile);

  container.appendChild(importInput);
  container.appendChild(exportBtn);
  document.body.appendChild(container);
}

// 🟢 Initialization
newQuoteBtn.addEventListener("click", showRandomQuote);

loadQuotes();
createAddQuoteForm();
createImportExportUI();
updateCategories();

// Show last viewed quote if available
const last = sessionStorage.getItem("lastQuote");
if (last) {
  const q = JSON.parse(last);
  quoteDisplay.textContent = `"${q.text}" - ${q.category}`;
} else {
  showRandomQuote();
}

