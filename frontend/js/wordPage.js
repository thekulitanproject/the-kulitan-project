// frontend/js/wordPage.js

async function fetchWord(id) {
  try {
    const response = await fetch(`/api/words/${id}`);
    if (!response.ok) throw new Error("Word not found");

    const word = await response.json();

    document.getElementById("kulitan").innerHTML =
      `<img src="${word.kulitan}" alt="${word.romanized}">`;

    document.getElementById("romanized").textContent = word.romanized;
    document.getElementById("meaning").textContent = word.meaning;

  } catch (err) {
    console.error(err);
  }
}
