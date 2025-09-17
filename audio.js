let audioContext;
const audioBuffers = new Map();
let isInitialized = false;
let bgOscillators = [];
let bgGain;
let bgIntervalId;

export function initAudio() {
    if (isInitialized) return;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        isInitialized = true;
        // A user gesture is required to start audio on some browsers.
        // We handle this by starting the context on the first interaction.
        const unlockAudio = () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            document.body.removeEventListener('click', unlockAudio);
            document.body.removeEventListener('touchend', unlockAudio);
        };
        document.body.addEventListener('click', unlockAudio);
        document.body.addEventListener('touchend', unlockAudio);
    } catch (e) {
        console.error("Web Audio API is not supported in this browser");
    }
}

export async function loadSound(name, url) {
    if (!audioContext || audioBuffers.has(name)) return;
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBuffers.set(name, audioBuffer);
    } catch (e) {
        console.error(`Error loading sound: ${name}`, e);
    }
}

export function playSound(name) {
    if (!audioContext || !audioBuffers.has(name)) return;
    
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffers.get(name);
    source.connect(audioContext.destination);
    source.start(0);
}

/* start a playful background loop around given BPM (100 default) */
export function startBackgroundMusic(bpm = 100) {
    if (!audioContext) initAudio();
    stopBackgroundMusic();
    const beatMs = (60 / bpm) * 1000;
    bgGain = audioContext.createGain();
    bgGain.gain.value = 0.06;
    bgGain.connect(audioContext.destination);

    // simple percussive click using oscillator envelope
    const playClick = () => {
        const o = audioContext.createOscillator();
        const g = audioContext.createGain();
        o.type = 'square';
        o.frequency.value = 800;
        g.gain.setValueAtTime(0.0001, audioContext.currentTime);
        g.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.18);
        o.connect(g);
        g.connect(bgGain);
        o.start();
        o.stop(audioContext.currentTime + 0.2);
    };

    // light melodic arpeggio for upbeat feel
    const playArp = () => {
        const freqs = [440, 523.25, 659.25]; // A4 C5 E5
        freqs.forEach((f, i) => {
            const o = audioContext.createOscillator();
            const g = audioContext.createGain();
            o.type = 'sine';
            o.frequency.value = f;
            g.gain.value = 0.0;
            o.connect(g);
            g.connect(bgGain);
            const t = audioContext.currentTime + (i * 0.04);
            g.gain.setValueAtTime(0.0001, t);
            g.gain.linearRampToValueAtTime(0.08, t + 0.06);
            g.gain.linearRampToValueAtTime(0.0001, t + 0.5);
            o.start(t);
            o.stop(t + 0.6);
        });
    };

    playArp();
    playClick();
    bgIntervalId = setInterval(() => {
        playClick();
        playArp();
    }, beatMs);
}

export function stopBackgroundMusic() {
    if (bgIntervalId) {
        clearInterval(bgIntervalId);
        bgIntervalId = null;
    }
    if (bgGain) {
        try { bgGain.disconnect(); } catch(e) {}
        bgGain = null;
    }
}

/* richer success sound built with oscillators and noise burst */
export function playWinSound() {
    if (!audioContext) initAudio();
    const now = audioContext.currentTime;
    const master = audioContext.createGain();
    master.gain.value = 0.12;
    master.connect(audioContext.destination);

    // upward gliss
    const o1 = audioContext.createOscillator();
    o1.type = 'sawtooth';
    o1.frequency.setValueAtTime(440, now);
    o1.frequency.exponentialRampToValueAtTime(1760, now + 0.6);
    const g1 = audioContext.createGain();
    g1.gain.setValueAtTime(0.0001, now);
    g1.gain.exponentialRampToValueAtTime(0.5, now + 0.08);
    g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    o1.connect(g1);
    g1.connect(master);
    o1.start(now);
    o1.stop(now + 1.0);

    // sparkle chimes
    [880, 1320, 1760].forEach((freq, i) => {
        const o = audioContext.createOscillator();
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, now + 0.08 + i * 0.06);
        const g = audioContext.createGain();
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.25, now + 0.12 + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
        o.connect(g);
        g.connect(master);
        o.start(now + 0.08 + i * 0.06);
        o.stop(now + 1.0);
    });
}