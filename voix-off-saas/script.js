// UI hooks
const themeSelect = document.getElementById('themeSelect');
const textInput = document.getElementById('textInput');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const chatWindow = document.getElementById('chatWindow');
const playerWrap = document.getElementById('playerWrap');
const audioPlayer = document.getElementById('audioPlayer');
const downloadBtn = document.getElementById('downloadBtn');
const voiceSelect = document.getElementById('voiceSelect');
const speedRange = document.getElementById('speedRange');

// theme
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
}
themeSelect.addEventListener('change', e => applyTheme(e.target.value));
applyTheme(themeSelect.value);

// small helper to append bubble
function appendBubble(text, who='user'){
  const d = document.createElement('div');
  d.className = `bubble ${who}`;
  d.textContent = text;
  chatWindow.appendChild(d);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return d;
}

// Clear
clearBtn.addEventListener('click', () => {
  textInput.value = '';
});

// Simulate generate (temp)
// Replace this function with a fetch() to your backend that calls ElevenLabs
async function generateVoice(text){
  // --- Demo simulation: create a TTS using Web Speech API (client-side) for preview only ---
  // This does NOT replace ElevenLabs server audio; it's just to preview in browser.
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      return reject('Synthèse vocale non disponible dans ce navigateur.');
    }
    const utter = new SpeechSynthesisUtterance(text);
    // map voice choice to lang/voice hints (best-effort)
    utter.rate = parseFloat(speedRange.value);
    if (voiceSelect.value === 'female') utter.pitch = 1.2;
    if (voiceSelect.value === 'male') utter.pitch = 0.8;

    // play to preview (no file)
    speechSynthesis.speak(utter);
    // we return null to indicate no downloadable file (in real mode, backend returns MP3 URL or blob)
    setTimeout(() => resolve(null), Math.min(4000, text.length * 40));
  });
}

// Handler
generateBtn.addEventListener('click', async () => {
  const text = textInput.value.trim();
  if (!text) {
    alert('Écris d’abord ton texte.');
    return;
  }

  // add user bubble
  appendBubble(text, 'user');

  // show a temporary AI bubble with loader
  const aiBubble = appendBubble('Génération en cours...', 'ai');

  // disable UI
  generateBtn.disabled = true;
  generateBtn.textContent = 'Génération...';

  try {
    // ********** ICI : remplacer par appel fetch au backend **********
    // Ex. :
    // const resp = await fetch('https://ton-backend.example.com/generate', {
    //   method:'POST', headers:{'Content-Type':'application/json'},
    //   body: JSON.stringify({ text, voice: voiceSelect.value, speed: speedRange.value })
    // });
    // const { audioUrl } = await resp.json();
    //
    // Puis set audioPlayer.src = audioUrl et afficher playerWrap

    const result = await generateVoice(text); // simulation
    // si result est une URL (depuis backend)
    if (result && typeof result === 'string') {
      aiBubble.textContent = 'Génération terminée ✔️';
      audioPlayer.src = result;
      downloadBtn.href = result;
      playerWrap.hidden = false;
    } else {
      aiBubble.textContent = 'Lecture locale (prévisualisation) — pour fichier téléchargeable, connecte le backend.';
      playerWrap.hidden = true;
    }

  } catch (err) {
    aiBubble.textContent = 'Erreur : ' + (err.message || err);
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Générer la voix';
  }
});
