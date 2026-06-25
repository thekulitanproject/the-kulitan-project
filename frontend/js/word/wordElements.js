// kulitan_full_project/frontend/js/word/wordElements.js

export function getWordElements() {
  return {
    kulitanContainer: document.getElementById("kulitanContainer"),

    romanizedEl: document.getElementById("romanized"),
    pronunciationEl: document.getElementById("textPronunciation"),

    speechEl: document.getElementById("speech"),

    meaningEl: document.getElementById("meaning"),
    examplesEl: document.getElementById("examples"),

    dialectRegionEl: document.getElementById("dialectRegion"),
    formalityEl: document.getElementById("formalityLevel"),
    etymologyEl: document.getElementById("etymology"),
    usageNotesEl: document.getElementById("usageNotes"),

    playAudioBtn: document.getElementById("playAudio"),
    audioEl: document.getElementById("audio"),

    // optional extra UI hooks if you expand later
    tagsEl: document.getElementById("tags"),
    meaningsListEl: document.getElementById("meaningList"),
    audioListEl: document.getElementById("audioList")
  };
}

export function getElements() {
  return getWordElements();
}


