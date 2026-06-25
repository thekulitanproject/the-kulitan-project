// kulitan_full_project/frontend/js/utils/audio.js
// this is audio.js

/* ===============================
   AUDIO HANDLER (CLEAN ISOLATION)
================================ */
export function setupAudio(word, playAudioBtn, audioEl) {

  console.log("AUDIO RAW:", word.audio);
  console.log("WORD:", word);
  
  const audioList = word.audio || [];

  const audioSrc =
    audioList.find(a => a.is_primary)?.audio_url ||
    audioList[0]?.audio_url;

  playAudioBtn.style.display = "inline-block";
  playAudioBtn.textContent = "▶";

  audioEl.pause();
  audioEl.removeAttribute("src");
  audioEl.load();

  if (!audioSrc) return;

  audioEl.src = audioSrc;

  playAudioBtn.onclick = async () => {
    try {
      if (audioEl.paused) {
        await audioEl.play();
        playAudioBtn.textContent = "⏸";
      } else {
        audioEl.pause();
        playAudioBtn.textContent = "▶";
      }
    } catch (err) {
      console.log("Audio play failed:", err);
    }
  };

  audioEl.onended = () => {
    playAudioBtn.textContent = "▶";
  };
}


