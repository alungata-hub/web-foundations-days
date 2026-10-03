let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
  return notes.filter((note) =>
    note.text.toLowerCase().includes(word.toLowerCase()),
  );
}

function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];

  for (let i = 1; i < notes.length; i++) {
    if (notes[i].text.length > longest.text.length) {
      longest = notes[i];
    }
  }

  return longest;
}

function countByCategory() {
  let counts = {};

  for (let note of notes) {
    let category = note.category;

    if (!counts[category]) {
      counts[category] = 1;
    } else {
      counts[category]++;
    }
  }

  return counts;
}

function getSummary() {
  let counts = countByCategory();
  let total = notes.length;
  let noteWord = total === 1 ? "note" : "notes";

  let categoryParts = Object.keys(counts).map((cat) => `${counts[cat]} ${cat}`);
  let categoryString = categoryParts.join(", ");

  return `${total} ${noteWord}: ${categoryString}.`;
}

function isDuplicate(text) {
    let normalizedText = text.trim().toLowerCase();
    
    return notes.some(note => 
        note.text.trim().toLowerCase() === normalizedText
    );
}

function addNote(text, category) {
    let trimmedText = text.trim();
    
    if (trimmedText.length < 1 || trimmedText.length > 200) {
        console.error("Text must be between 1 and 200 characters");
        return false;
    }
    
    if (isDuplicate(trimmedText)) {
        console.error("Duplicate note");
        return false;
    }
    
    if (category !== "personal" && category !== "work" && category !== "study") {
        console.error("Invalid category. Must be 'personal', 'work', or 'study'");
        return false;
    }
    
    let newId = notes.length === 0 ? 1 : Math.max(...notes.map(note => note.id)) + 1;
    
    let newNote = {
        id: newId,
        text: trimmedText,
        category: category
    };
    
    notes.push(newNote);
    
    return true;
}
