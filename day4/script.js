// 1. Select the elements we need from the HTML
const noteText = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

// 2. Define the storage keys
const DRAFT_KEY = "quicknotes-draft";
const THEME_KEY = "quicknotes-theme";

// 3. Update the character and word counters
function updateCounts() {
  // Read the text entered by the user
  const text = noteText.value;

  // Count characters
  const characterLength = text.length;

  // Update the character counter
  charCount.textContent = `${characterLength} / 200 characters`;

  // Remove spaces from the beginning and end
  const trimmedText = text.trim();

  // Count words, treating empty text as zero words
  const totalWords =
    trimmedText === "" ? 0 : trimmedText.split(/\s+/).length;

  // Update the word counter
  wordCount.textContent = `${totalWords} words`;

  // Apply the correct character-counter styling
  if (characterLength > 200) {
    charCount.classList.add("over");
    charCount.classList.remove("warning");
  } else if (characterLength > 180) {
    charCount.classList.add("warning");
    charCount.classList.remove("over");
  } else {
    charCount.classList.remove("warning");
    charCount.classList.remove("over");
  }
}

// 4. Clear the textarea, counters and saved draft
function clearNote() {
  noteText.value = "";

  updateCounts();

  localStorage.removeItem(DRAFT_KEY);
}

// 5. Update the counters and save the draft when text changes
noteText.addEventListener("input", () => {
  updateCounts();

  localStorage.setItem(DRAFT_KEY, noteText.value);
});

// 6. Clear the draft when the button is clicked
clearBtn.addEventListener("click", clearNote);

// 7. Clear the draft when Escape is pressed in the textarea
noteText.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearNote();
  }
});

// Switch themes when the theme button is clicked
themeToggle.addEventListener("click", () => {
  // Toggle the dark class on the body
  document.body.classList.toggle("dark");

  // Check whether dark mode is now active
  const isDark = document.body.classList.contains("dark");

  // Update the button label and save the selected theme
  if (isDark) {
    themeToggle.textContent = "Light mode";
    localStorage.setItem(THEME_KEY, "dark");
  } else {
    themeToggle.textContent = "Dark mode";
    localStorage.setItem(THEME_KEY, "light");
  }
});

// 8. Restore the saved draft
const savedDraft = localStorage.getItem(DRAFT_KEY);

if (savedDraft !== null) {
  noteText.value = savedDraft;
}

// 9. Restore the saved theme
const savedTheme = localStorage.getItem(THEME_KEY);

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "Light mode";
} else {
  themeToggle.textContent = "Dark mode";
}

// 10. Update the counters using the restored text
updateCounts();