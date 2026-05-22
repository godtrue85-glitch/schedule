/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { getTranslation, Language } from '../lib/translations';
import { playSound, startMusic, stopMusic } from '../lib/sound';
import { Volume2, VolumeX, Music, Languages, Palette, Info, Smartphone, Check, HelpCircle, Heart, Power } from 'lucide-react';

export interface AppSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  language: Language;
  hapticEnabled: boolean;
  theme: 'cream' | 'slate' | 'retro';
}

interface OptionsTabProps {
  profile: UserProfile;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const OptionsTab: React.FC<OptionsTabProps> = ({ profile, settings, onUpdateSettings }) => {
  const [saveToast, setSaveToast] = useState(false);
  const lang = settings.language;

  const t = (key: string) => getTranslation(key, lang);

  const handleSoundToggle = (enabled: boolean) => {
    const updated = { ...settings, soundEnabled: enabled };
    onUpdateSettings(updated);
    if (enabled) {
      setTimeout(() => playSound('click'), 50);
    }
    showSavedToast();
  };

  const handleMusicToggle = (enabled: boolean) => {
    const updated = { ...settings, musicEnabled: enabled };
    onUpdateSettings(updated);
    
    // Save to localStorage immediately so startMusic() reads the updated value
    localStorage.setItem('petplan_settings', JSON.stringify(updated));
    
    if (enabled) {
      startMusic();
    } else {
      stopMusic();
    }
    playSound('click');
    showSavedToast();
  };

  const handleLanguageToggle = (selectedLang: Language) => {
    const updated = { ...settings, language: selectedLang };
    onUpdateSettings(updated);
    playSound('click');
    showSavedToast();
  };

  const handleHapticToggle = (enabled: boolean) => {
    const updated = { ...settings, hapticEnabled: enabled };
    onUpdateSettings(updated);
    if (enabled && typeof navigator.vibrate === 'function') {
      navigator.vibrate([100]);
    }
    playSound('click');
    showSavedToast();
  };

  const handleThemeChange = (selectedTheme: 'cream' | 'slate' | 'retro') => {
    const updated = { ...settings, theme: selectedTheme };
    onUpdateSettings(updated);
    playSound('click');
    showSavedToast();
  };

  const showSavedToast = () => {
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
    }, 1800);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title block */}
      <div className="bg-slate-900 border-b-4 border-slate-700 p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] flex justify-between items-center">
        <h2 className="text-sm pixel-title text-white uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-4 h-4 text-sky-400" />
          {t('settings_title')}
        </h2>
        <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
          v1.2.0
        </span>
      </div>

      {/* Main Settings Body */}
      <div className="bg-white border-4 border-slate-900 p-5 shadow-[4px_4px_0px_#000] relative overflow-hidden">
        
        {/* Save feedback indicator */}
        {saveToast && (
          <div className="absolute top-2 right-2 bg-emerald-500 border-2 border-slate-900 text-white font-bold text-xs px-2.5 py-1 z-10 shadow-[2px_2px_0px_#000] animate-bounce">
            ✨ {t('save_changes')}
          </div>
        )}

        <h3 className="text-[11px] font-black tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Smartphone className="w-3.5 h-3.5 text-slate-400" />
          {t('settings_general')}
        </h3>

        <div className="space-y-5">
          {/* Sound choice */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-rose-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                {t('sound_effects')}
              </h4>
              <p className="text-[10px] text-slate-400 font-black uppercase mt-0.5 tracking-wider">CHIPTUNE BEVERAGE & CHEERS</p>
            </div>
            <div className="flex border-4 border-slate-900 overflow-hidden shadow-[2px_2px_0px_#000] shrink-0">
              <button
                onClick={() => handleSoundToggle(true)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${settings.soundEnabled ? 'bg-rose-400 text-slate-900' : 'bg-slate-100 text-slate-400'}`}
              >
                {t('on')}
              </button>
              <button
                onClick={() => handleSoundToggle(false)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all border-l-4 border-slate-900 ${!settings.soundEnabled ? 'bg-slate-400 text-white' : 'bg-slate-100 text-slate-400'}`}
              >
                {t('off')}
              </button>
            </div>
          </div>

          {/* Music choice */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-sky-500" />
                {t('bg_music')}
              </h4>
              <p className="text-[10px] text-slate-400 font-black uppercase mt-0.5 tracking-wider">AMBIENT CHIPTUNE CHORD LOOP</p>
            </div>
            <div className="flex border-4 border-slate-900 overflow-hidden shadow-[2px_2px_0px_#000] shrink-0">
              <button
                onClick={() => handleMusicToggle(true)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${settings.musicEnabled ? 'bg-sky-400 text-slate-900' : 'bg-slate-100 text-slate-400'}`}
              >
                {t('on')}
              </button>
              <button
                onClick={() => handleMusicToggle(false)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all border-l-4 border-slate-900 ${!settings.musicEnabled ? 'bg-slate-400 text-white' : 'bg-slate-100 text-slate-400'}`}
              >
                {t('off')}
              </button>
            </div>
          </div>

          {/* Haptics Choice */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-amber-500" />
                {t('haptic')}
              </h4>
              <p className="text-[10px] text-slate-400 font-black uppercase mt-0.5 tracking-wider">TACTILE SCREEN SHAKE & SHIVER</p>
            </div>
            <div className="flex border-4 border-slate-900 overflow-hidden shadow-[2px_2px_0px_#000] shrink-0">
              <button
                onClick={() => handleHapticToggle(true)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${settings.hapticEnabled ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-400'}`}
              >
                {t('on')}
              </button>
              <button
                onClick={() => handleHapticToggle(false)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all border-l-4 border-slate-900 ${!settings.hapticEnabled ? 'bg-slate-400 text-white' : 'bg-slate-100 text-slate-400'}`}
              >
                {t('off')}
              </button>
            </div>
          </div>

          {/* Language choice */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-emerald-500" />
                {t('language')}
              </h4>
              <p className="text-[10px] text-slate-400 font-black uppercase mt-0.5 tracking-wider">KOREAN / ENGLISH LOCALE</p>
            </div>
            <div className="flex border-4 border-slate-900 overflow-hidden shadow-[2px_2px_0px_#000] shrink-0">
              <button
                onClick={() => handleLanguageToggle('ko')}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${settings.language === 'ko' ? 'bg-emerald-400 text-slate-900' : 'bg-slate-100 text-slate-400'}`}
              >
                한국어
              </button>
              <button
                onClick={() => handleLanguageToggle('en')}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all border-l-4 border-slate-900 ${settings.language === 'en' ? 'bg-emerald-400 text-slate-900' : 'bg-slate-100 text-slate-400'}`}
              >
                ENG
              </button>
            </div>
          </div>

          {/* Theme choice */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2">
              <Palette className="w-4 h-4 text-indigo-500" />
              {t('theme')}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleThemeChange('cream')}
                className={`border-2 py-2 px-1 text-[11px] font-black uppercase tracking-wider transition-all text-center
                  ${settings.theme === 'cream'
                    ? 'bg-amber-100 border-slate-900 text-slate-900 shadow-[2px_2px_0px_#000]'
                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
              >
                🍦 {settings.language === 'ko' ? '크림' : 'Cream'}
              </button>
              <button
                onClick={() => handleThemeChange('slate')}
                className={`border-2 py-2 px-1 text-[11px] font-black uppercase tracking-wider transition-all text-center
                  ${settings.theme === 'slate'
                    ? 'bg-slate-850 border-slate-900 text-indigo-600 font-bold bg-indigo-50 shadow-[2px_2px_0px_#000]'
                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
              >
                🌚 {settings.language === 'ko' ? '슬레이트' : 'Slate'}
              </button>
              <button
                onClick={() => handleThemeChange('retro')}
                className={`border-2 py-2 px-1 text-[11px] font-black uppercase tracking-wider transition-all text-center
                  ${settings.theme === 'retro'
                    ? 'bg-green-100 border-slate-900 text-emerald-800 shadow-[2px_2px_0px_#000]'
                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
              >
                📟 {settings.language === 'ko' ? '레트로' : 'Retro'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info board */}
      <div className="bg-slate-900 border-4 border-slate-900 text-[#00ff22] font-mono p-5 shadow-[4px_4px_0px_#000] relative">
        <div className="absolute top-2 right-4 text-[9px] text-emerald-800 tracking-widest font-black uppercase animate-pulse">
          ENGINE: ONLINE
        </div>
        <h3 className="text-xs font-black tracking-widest text-[#00ff22] uppercase mb-3 flex items-center gap-1.5 border-b border-emerald-950 pb-2">
          <Info className="w-3.5 h-3.5" />
          {t('settings_info')}
        </h3>

        <div className="space-y-1.5 text-xs text-emerald-300">
          <div className="flex justify-between gap-2">
            <span>&gt; {t('player_id')}:</span>
            <span className="text-white truncate max-w-[180px]">{profile.userId}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span>&gt; {t('sync_status')}:</span>
            <span className="text-emerald-400 font-black">{t('sync_live')}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span>&gt; CREATED_AT:</span>
            <span className="text-white">
              {profile.createdAt ? new Date((profile.createdAt as any).seconds ? (profile.createdAt as any).seconds * 1000 : profile.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between gap-2 border-t border-emerald-950 pt-2 mt-2 leading-relaxed">
            <span>&gt; DEVELOPERS:</span>
            <span className="text-white flex items-center gap-1">Pretendard, Lucide & Antigravity <Heart className="w-3 h-3 text-red-500 inline fill-red-500 animate-pulse" /></span>
          </div>
        </div>
      </div>
    </div>
  );
};
