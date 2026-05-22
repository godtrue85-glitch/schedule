/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let audioCtx: AudioContext | null = null;
let isMusicPlaying = false;
let musicInterval: any = null;

const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
};

export const playSound = (type: 'click' | 'success' | 'coin' | 'levelup' | 'equip' | 'hatch') => {
  const settingsStr = localStorage.getItem('petplan_settings');
  let soundEnabled = true;
  if (settingsStr) {
    try {
      const settings = JSON.parse(settingsStr);
      soundEnabled = settings.soundEnabled ?? true;
    } catch {}
  }
  if (!soundEnabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;
  
  if (type === 'click') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'coin') {
    // Mario Coin sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } else if (type === 'success') {
    // Arpeggio chord
    const frequencies = [261.63, 311.13, 392.00, 523.25]; // C minor 7 / major cozy arpeggio
    frequencies.forEach((f, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + index * 0.06);
      gain.gain.setValueAtTime(0.03, now + index * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + index * 0.06);
      osc.stop(now + index * 0.06 + 0.2);
    });
  } else if (type === 'equip') {
    // Quick double tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.setValueAtTime(700, now + 0.05);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'levelup') {
    // Huge level up arpeggio
    const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    arpeggio.forEach((f, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + index * 0.04);
      gain.gain.setValueAtTime(0.04, now + index * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.04 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + index * 0.04);
      osc.stop(now + index * 0.04 + 0.3);
    });
  } else if (type === 'hatch') {
    // Elegant slide up for hatching a cute egg
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.5);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }
};

export const startMusic = () => {
  const settingsStr = localStorage.getItem('petplan_settings');
  let musicEnabled = false;
  if (settingsStr) {
    try {
      const settings = JSON.parse(settingsStr);
      musicEnabled = settings.musicEnabled ?? false;
    } catch {}
  }
  
  if (!musicEnabled) {
    stopMusic();
    return;
  }
  
  if (isMusicPlaying) return;
  isMusicPlaying = true;
  
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  
  const playNotes = () => {
    const settingsStrInner = localStorage.getItem('petplan_settings');
    let mEnabled = false;
    try {
      mEnabled = settingsStrInner ? JSON.parse(settingsStrInner).musicEnabled : false;
    } catch {}
    if (!mEnabled) {
      stopMusic();
      return;
    }

    const now = ctx.currentTime;
    // Pentatonic scale of G major: G4(392), A4(440), B4(493.88), D5(587.33), E5(659.25), G5(783.99)
    const melody = [392.00, 440.00, 493.88, 587.33, 659.25, 783.99];
    const notesPattern = [0, 2, 3, 5, 4, 3, 2, 1];
    
    notesPattern.forEach((notePos, step) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(melody[notePos], now + step * 0.35);
      gain.gain.setValueAtTime(0.015, now + step * 0.35); // Extremely soft, unobtrusive background volume
      gain.gain.exponentialRampToValueAtTime(0.0001, now + step * 0.35 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + step * 0.35);
      osc.stop(now + step * 0.35 + 0.33);
    });
  };
  
  playNotes();
  musicInterval = setInterval(() => {
    playNotes();
  }, 5000); // repeat every 5 seconds
};

export const stopMusic = () => {
  isMusicPlaying = false;
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
};
