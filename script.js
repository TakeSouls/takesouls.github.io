// Fetch the data from data.md
fetch('data.md')
  .then(response => response.text())
  .then(parseMarkdown);

function parseMarkdown(data) {
  const grid = document.getElementById('grid');
  const sections = data.split('## ').slice(1); // Split by each day's note

  const dailyNotes = sections.map(section => {
    const lines = section.trim().split('\n');
    const title = lines[0].trim(); // Keep the original title format
    const timeMatch = lines.find(line => line.startsWith('Hours Productive:'));
    const timeValue = timeMatch?.split(':')[1]?.trim() || "NaN"; // Extract the value or default to NaN
    const tasks = lines.slice(1).filter(line => line.startsWith('-')).map(line => line.substring(1).trim()); // Remove "-"
    return { title, timeValue, tasks };
  });

  // Generate grid squares
  dailyNotes.forEach(note => {
    const square = document.createElement('div');
    const formattedDate = formatDateForSquare(note.title); // Properly formatted date
    const color = determineColor(note.timeValue); // Determine the square color

    square.className = `square`;
    square.style.backgroundColor = color; // Set the background color dynamically
    square.innerText = formattedDate;
    square.addEventListener('click', () => showNoteModal(note, color));
    grid.appendChild(square);
  });
}

function formatDateForSquare(title) {
  const [_dayOfWeek, month, day, year] = title.split(/,?\s+/);
  const months = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  };
  return `${months[month]}-${String(day.replace(/\D/g, '')).padStart(2, '0')}-${year}`;
}

function determineColor(value) {
  if (isValidColor(value)) {
    return value;
  }

  const hours = parseFloat(value);
  if (!isNaN(hours)) {
    return hours >= 10 ? '#28a745' : '#dc3545'; // Green for >= 10, Red otherwise
  }

  return '#6c757d'; // Default to grey for NaN
}

function isValidColor(color) {
  const s = new Option().style;
  s.color = color;
  return s.color !== '';
}

function showNoteModal(note, color) {
  const modal = document.getElementById('note-modal');
  const noteTitle = document.getElementById('note-title');
  const noteTime = document.getElementById('note-time');
  const noteTasks = document.getElementById('note-tasks');

  noteTitle.innerText = note.title;
  // We only show note.timeValue if it is NaN or a number. not "purple"
  const hours = parseFloat(note.timeValue);
  if (!isNaN(hours)) {
    noteTime.innerText = `Hours Productive: ${hours}`;
  } else {
    noteTime.innerText = ''; // Clear it if it's not a valid number
  }

  noteTasks.innerHTML = note.tasks.map(task => `<li>${task}</li>`).join('');

  const modalContent = document.querySelector('.modal-content');
  modalContent.style.backgroundColor = color;

  modal.style.display = 'flex';
}

// Ensure the close button and modal close properly
const modal = document.getElementById('note-modal');
modal.addEventListener('click', (e) => {
  if (e.target === modal || e.target.id === 'close-modal') {
    modal.style.display = 'none';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.style.display = 'none';
  }
});
