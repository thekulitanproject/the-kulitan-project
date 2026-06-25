import { searchWords, getWords } from "../fetchWords.js";

const list = document.getElementById("list");
const search = document.getElementById("search");

search.addEventListener("input", async e => {
  const results = await searchWords(e.target.value);
  renderList(results);
});

function renderList(words) {
  list.innerHTML = "";
  words.forEach(w => {
    const item = document.createElement("a");
    item.href = "word.html?id=" + w.id;
    item.innerText = w.romanized;
    list.appendChild(item);
  });
}
