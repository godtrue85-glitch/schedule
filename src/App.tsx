/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { auth, db, signInWithGoogle, handleFirestoreError, OperationType } from './lib/firebase';
import { UserProfile, PetType, EvolutionStage, Quest, QuestStatus, QuestDifficulty, QuestCategory } from './types';
import { PET_DATA, LEVEL_EXP_BASE, LEVEL_EXP_MULTIPLIER } from './constants';
import CharacterSelection from './components/CharacterSelection';
import CharacterSheet from './components/CharacterSheet';
import QuestItem from './components/QuestItem';
import QuestForm from './components/QuestForm';
import { ShopTab } from './components/ShopTab';
import { CollectionTab } from './components/CollectionTab';
import { AchievementsTab } from './components/AchievementsTab';
import { OptionsTab, AppSettings } from './components/OptionsTab';
import { getTranslation, Language } from './lib/translations';
import { playSound, startMusic, stopMusic } from './lib/sound';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Plus, Swords, X, Settings } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'pet' | 'shop' | 'collection' | 'achievements' | 'options'>('pet');

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('petplan_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          soundEnabled: parsed.soundEnabled ?? true,
          musicEnabled: parsed.musicEnabled ?? false,
          language: parsed.language ?? 'ko',
          hapticEnabled: parsed.hapticEnabled ?? true,
          theme: parsed.theme ?? 'cream',
        };
      } catch {}
    }
    return {
      soundEnabled: true,
      musicEnabled: false,
      language: 'ko',
      hapticEnabled: true,
      theme: 'cream',
    };
  });

  const t = (key: string) => getTranslation(key, settings.language);

  // Setup background music on mount and state change
  useEffect(() => {
    if (user && profile && settings.musicEnabled) {
      startMusic();
    } else {
      stopMusic();
    }
    return () => {
      stopMusic();
    };
  }, [user, profile?.userId, settings.musicEnabled]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playSound('click');
  }, [activeTab]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setQuests([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const profileRef = doc(db, 'userProfiles', user.uid);
    const unsubscribeProfile = onSnapshot(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as any;
        // Migration: If old profile exists without petType, treat as null to force new selection
        if (!data.petType) {
          setProfile(null);
        } else {
          const stats = data.stats || {};
          const petInfo = PET_DATA[data.petType as PetType];
          const defaultStats = petInfo ? petInfo.initialStats : { vitality: 5, wisdom: 5, focus: 5, connection: 5 };

          const migratedStats = {
            vitality: typeof stats.vitality === 'number' && !isNaN(stats.vitality) ? stats.vitality : (typeof stats.strength === 'number' ? stats.strength : defaultStats.vitality),
            wisdom: typeof stats.wisdom === 'number' && !isNaN(stats.wisdom) ? stats.wisdom : (typeof stats.intelligence === 'number' ? stats.intelligence : defaultStats.wisdom),
            focus: typeof stats.focus === 'number' && !isNaN(stats.focus) ? stats.focus : (typeof stats.agility === 'number' ? stats.agility : defaultStats.focus),
            connection: typeof stats.connection === 'number' && !isNaN(stats.connection) ? stats.connection : (typeof stats.charisma === 'number' ? stats.charisma : defaultStats.connection),
          };

          const discoveredList = data.discoveredPets || [];
          if (data.evolutionStage !== EvolutionStage.EGG && !discoveredList.includes(data.petType)) {
            const updatedDiscovered = [...discoveredList, data.petType];
            updateDoc(profileRef, { discoveredPets: updatedDiscovered }).catch((err) => {
              console.error("Discovered pet update failed:", err);
              if (err instanceof Error && err.message.includes('permission')) {
                handleFirestoreError(err, OperationType.UPDATE, `userProfiles/${user.uid}`);
              }
            });
            data.discoveredPets = updatedDiscovered;
          }

          setProfile({
            ...data,
            stats: migratedStats
          } as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Profile Error:", error);
      setLoading(false);
      if (error instanceof Error && error.message.includes('permission')) {
        handleFirestoreError(error, OperationType.GET, `userProfiles/${user.uid}`);
      }
    });

    const questsRef = collection(db, 'userProfiles', user.uid, 'quests');
    const q = query(questsRef, orderBy('createdAt', 'desc'));
    const unsubscribeQuests = onSnapshot(q, (snapshot) => {
      const qList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quest));
      setQuests(qList);
    }, (error) => {
      console.error("Quests Error:", error);
      if (error instanceof Error && error.message.includes('permission')) {
        handleFirestoreError(error, OperationType.LIST, `userProfiles/${user.uid}/quests`);
      }
    });

    return () => {
      unsubscribeProfile();
      unsubscribeQuests();
    };
  }, [user]);

  const getEvolutionStage = (level: number): EvolutionStage => {
    if (level < 5) return EvolutionStage.EGG;
    if (level < 10) return EvolutionStage.HATCHLING;
    if (level < 15) return EvolutionStage.TEEN;
    return EvolutionStage.ADULT;
  };

  const handleSelectPet = async (petType: PetType, rarity: string, color: string) => {
    if (!user) return;
    const data = PET_DATA[petType];
    const initialStage = EvolutionStage.EGG;
    const newProfile: UserProfile = {
      userId: user.uid,
      displayName: user.displayName || 'Hero',
      petType: petType,
      evolutionStage: initialStage,
      eggRarity: rarity,
      eggColor: color,
      level: 1,
      experience: 0,
      maxExperience: LEVEL_EXP_BASE,
      gold: 0,
      stats: { ...data.initialStats },
      avatarUrl: data.stages[initialStage],
      createdAt: new Date(),
    };
    try {
      await setDoc(doc(db, 'userProfiles', user.uid), newProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `userProfiles/${user.uid}`);
    }
    playSound('hatch');
  };

  const handleAddQuest = async (questData: any) => {
    if (!user) return;
    
    // Calculate rewards based on difficulty
    const difficultyMap = {
      [QuestDifficulty.EASY]: { exp: 20, gold: 10 },
      [QuestDifficulty.MEDIUM]: { exp: 50, gold: 25 },
      [QuestDifficulty.HARD]: { exp: 120, gold: 60 },
      [QuestDifficulty.EPIC]: { exp: 300, gold: 150 },
    };
    const rewards = difficultyMap[questData.difficulty as QuestDifficulty];

    // Create the quest with a loading/placeholder description first so the write is instant
    const newQuest = {
      ownerId: user.uid,
      title: questData.title,
      description: '새로운 퀘스트 이야기를 불러오는 중... ⏳',
      difficulty: questData.difficulty,
      category: questData.category,
      status: QuestStatus.ACTIVE,
      rewardExp: rewards.exp,
      rewardGold: rewards.gold,
      createdAt: new Date(),
    };

    let docRef;
    try {
      docRef = await addDoc(collection(db, 'userProfiles', user.uid, 'quests'), newQuest);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `userProfiles/${user.uid}/quests`);
    }

    // Instantly close the modal and sound hatch/success feedback
    setShowForm(false);

    // Fetch flavor text from our Gemini API in the background
    if (docRef) {
      const questId = docRef.id;
      // Start async background task without awaiting it here
      (async () => {
        try {
          const res = await fetch('/api/generate-quest-flavor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              title: questData.title, 
              category: questData.category, 
              difficulty: questData.difficulty 
            }),
          });
          const data = await res.json();
          if (data && data.flavorText) {
            await updateDoc(doc(db, 'userProfiles', user.uid, 'quests', questId), {
              description: data.flavorText
            });
          }
        } catch (e) {
          console.warn("Flavor text failed:", e);
          try {
            await updateDoc(doc(db, 'userProfiles', user.uid, 'quests', questId), {
              description: '당신의 도전을 응원합니다! 성실히 완료하며 펫과 함께 성장하세요.'
            });
          } catch (updateErr) {
            console.error("Failed to set fallback quest description:", updateErr);
          }
        }
      })();
    }
  };

  const handleCompleteQuest = async (questId: string) => {
    if (!user || !profile) return;
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.status === QuestStatus.COMPLETED) return;

    // Update Quest
    const questRef = doc(db, 'userProfiles', user.uid, 'quests', questId);
    try {
      await updateDoc(questRef, {
        status: QuestStatus.COMPLETED,
        completedAt: new Date(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `userProfiles/${user.uid}/quests/${questId}`);
    }

    // Update Profile (EXP, Gold, Stats)
    let newExp = profile.experience + quest.rewardExp;
    let newGold = profile.gold + quest.rewardGold;
    let newLevel = profile.level;
    let newMaxExp = profile.maxExperience;
    let newStats = { ...profile.stats };

    // Stat bonuses based on category
    if (quest.category === QuestCategory.WORK) newStats.focus += 1;
    if (quest.category === QuestCategory.STUDY) newStats.wisdom += 1;
    if (quest.category === QuestCategory.HEALTH) newStats.vitality += 1;
    if (quest.category === QuestCategory.SOCIAL) newStats.connection += 1;
    if (quest.category === QuestCategory.MISC) newStats.vitality += 1;

    // Level up logic
    while (newExp >= newMaxExp) {
      newExp -= newMaxExp;
      newLevel += 1;
      newMaxExp = Math.round(newMaxExp * LEVEL_EXP_MULTIPLIER);
      // Level up stat boost
      newStats.vitality += 1;
      newStats.wisdom += 1;
      newStats.focus += 1;
      newStats.connection += 1;
    }

    const newStage = getEvolutionStage(newLevel);
    const avatarUrl = PET_DATA[profile.petType].stages[newStage];

    const isLeveledUp = newLevel > profile.level;

    try {
      await updateDoc(doc(db, 'userProfiles', user.uid), {
        experience: Math.floor(newExp),
        gold: newGold,
        level: newLevel,
        maxExperience: newMaxExp,
        stats: newStats,
        evolutionStage: newStage,
        avatarUrl: avatarUrl
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `userProfiles/${user.uid}`);
    }

    if (isLeveledUp) {
      playSound('levelup');
    } else {
      playSound('coin');
    }
  };

  const handleDeleteQuest = async (questId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'userProfiles', user.uid, 'quests', questId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `userProfiles/${user.uid}/quests/${questId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF9E6] text-slate-800">
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="w-16 h-16 bg-sky-500 border-4 border-slate-900 shadow-[4px_4px_0_#000] mb-6"
        />
        <p className="pixel-title text-sm animate-pulse uppercase">Loading Game...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF9E6] text-slate-800 p-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, rotate: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
          className="w-24 h-24 bg-amber-400 border-4 border-slate-900 flex items-center justify-center text-4xl mb-6 shadow-[4px_4px_0px_#000]"
        >
          🐣
        </motion.div>
        <h1 className="text-3xl pixel-title mb-4 text-slate-900 text-center leading-normal">PetPlan</h1>
        <p className="text-slate-500 font-bold mb-10 text-center max-w-[280px] text-lg leading-snug">
          YOUR SCHEDULE,<br/>
          THEIR GROWTH.
        </p>
        <p className="text-slate-400 text-sm mb-8 text-center max-w-[240px] leading-relaxed">
          오늘의 할 일을 완료하고<br/>
          귀여운 친구를 성장시켜보세요!
        </p>
        <button 
          onClick={signInWithGoogle}
          className="bg-white text-slate-900 pixel-title py-4 px-8 border-4 border-slate-900 shadow-[6px_6px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center gap-4 text-sm"
        >
          <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="Google" />
          START GROWTH
        </button>
      </div>
    );
  }

  if (!profile) {
    return <CharacterSelection onSelect={handleSelectPet} />;
  }

  const getPetInfo = (type: PetType) => {
    return PET_DATA[type];
  };

  let wrapperClass = "min-h-screen bg-[#FFF9E6] text-slate-800 pb-32 transition-colors duration-200 animate-[fadeIn_0.2s_ease_out]";
  let headerClass = "bg-white border-b-8 border-slate-900 p-4 mb-8 shadow-[0_4px_0_rgba(0,0,0,0.1)] sticky top-0 z-40";
  let coinClass = "bg-white border-2 border-slate-900 px-3 py-1 flex items-center gap-2 shadow-[2px_2px_0px_#000]";
  let headerTitleClass = "text-xl pixel-title text-slate-900";
  let headerSubClass = "text-slate-500 font-bold text-xs tracking-wider uppercase";
  let coinTextClass = "text-sm font-bold text-slate-900";
  let footerClass = "fixed bottom-0 left-0 right-0 bg-white border-t-8 border-slate-900 py-3 px-4 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] transition-colors duration-200";

  if (settings.theme === 'slate') {
    wrapperClass = "min-h-screen bg-[#111827] text-slate-100 pb-32 transition-colors duration-200 animate-[fadeIn_0.2s_ease_out]";
    headerClass = "bg-[#1f2937] border-b-8 border-slate-950 p-4 mb-8 shadow-[0_4px_0_rgba(0,0,0,0.4)] sticky top-0 z-40 shadow-xl";
    coinClass = "bg-[#111827] border-2 border-slate-950 px-3 py-1 flex items-center gap-2 shadow-[2px_2px_0px_#000]";
    headerTitleClass = "text-xl pixel-title text-slate-100";
    headerSubClass = "text-slate-400 font-bold text-xs tracking-wider uppercase";
    coinTextClass = "text-sm font-bold text-slate-100";
    footerClass = "fixed bottom-0 left-0 right-0 bg-[#1f2937] border-t-8 border-slate-950 py-3 px-4 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.3)] transition-colors duration-200";
  } else if (settings.theme === 'retro') {
    wrapperClass = "min-h-screen bg-[#1c0e35] text-[#f8fafc] pb-32 transition-colors duration-200 animate-[fadeIn_0.2s_ease_out] theme-retro";
    headerClass = "bg-[#14082b] border-b-8 border-pink-500 p-4 mb-8 shadow-[0_4px_0_rgba(255,0,127,0.25)] sticky top-0 z-40 relative overflow-hidden";
    coinClass = "bg-[#facc15] border-3 border-slate-900 px-3 py-1.5 flex items-center gap-2 shadow-[2px_2px_0px_#ff007f]";
    headerTitleClass = "text-xl pixel-title text-yellow-300 font-extrabold tracking-widest";
    headerSubClass = "text-cyan-400 font-black text-xs tracking-wider uppercase";
    coinTextClass = "text-sm font-black text-slate-900";
    footerClass = "fixed bottom-0 left-0 right-0 bg-[#14082b] border-t-8 border-cyan-400 py-3 px-4 z-40 shadow-[0_-4px_10px_rgba(0,255,255,0.25)] transition-colors duration-200";
  }

  return (
    <div className={wrapperClass}>
      <header className={headerClass}>
        <div className="max-w-md mx-auto flex justify-between items-center px-1">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000] border-4 ${settings.theme === 'retro' ? 'bg-[#1c0e35] border-pink-500' : 'bg-rose-450 border-slate-900 border-4'}`}>💝</div>
            <div>
              <h1 className={headerTitleClass}>PET<span className={settings.theme === 'retro' ? 'text-pink-500' : 'text-rose-500'}>PLAN</span></h1>
              <p className={headerSubClass}>{t('level')}{profile.level}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className={coinClass}>
              <span className="text-lg">💰</span>
              <span className={coinTextClass}>{profile.gold.toLocaleString()} G</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 flex flex-col gap-8 pb-32 animate-[fadeIn_0.15s_ease_out]">
        {activeTab === 'pet' && (
          <>
            <CharacterSheet user={profile} />

            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-6 bg-slate-900 p-4 border-b-4 border-slate-700 shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                <h2 className="text-sm pixel-title text-white font-normal">{t('daily_routine')}</h2>
                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                  {new Date().toLocaleDateString(settings.language === 'ko' ? 'ko-KR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {quests.map(quest => (
                    <QuestItem 
                      key={quest.id} 
                      quest={quest} 
                      onComplete={handleCompleteQuest} 
                      onDelete={handleDeleteQuest} 
                    />
                  ))}
                </AnimatePresence>
                {quests.length === 0 && (
                  <div className="text-center py-20 bg-white game-card bg-opacity-80">
                    <div className="text-6xl mb-6 text-slate-200">✨</div>
                    <p className="text-slate-400 font-extrabold text-sm uppercase tracking-wider mb-6 px-4">{t('waiting_next_goal')}</p>
                    <button 
                      onClick={() => setShowForm(true)}
                      className="text-rose-500 font-bold uppercase tracking-widest hover:underline text-xs"
                    >
                      {t('create_first_goal')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Logout button at bottom of Pet Tab */}
            <div className="flex justify-center mt-4">
              <button onClick={() => auth.signOut()} className="text-slate-400 font-bold hover:text-rose-500 transition-colors uppercase tracking-widest text-[10px]">
                {t('logout')}
              </button>
            </div>
          </>
        )}

        {activeTab === 'shop' && <ShopTab profile={profile} />}
        {activeTab === 'collection' && <CollectionTab profile={profile} />}
        {activeTab === 'achievements' && <AchievementsTab profile={profile} quests={quests} />}
        {activeTab === 'options' && (
          <OptionsTab 
            profile={profile} 
            settings={settings} 
            onUpdateSettings={(newSets) => setSettings(newSets)} 
          />
        )}
      </main>

      {/* Floating Action Button for Adding Quests - Only visible on Pet tab and pushed up slightly to avoid bottom bar */}
      {activeTab === 'pet' && (
        <div className="fixed bottom-24 right-6 z-50">
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`w-16 h-16 shadow-[4px_4px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center text-4xl border-4 border-slate-900 ${showForm ? 'bg-rose-500 text-white' : 'bg-amber-400 text-slate-800'}`}
          >
            {showForm ? '×' : '+'}
          </button>
        </div>
      )}

      {/* PERSISTENT BOTTOM TAB NAVIGATION */}
      <div className={footerClass}>
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 md:gap-2">
          <button
            onClick={() => setActiveTab('pet')}
            className={`flex flex-col items-center justify-center py-2 border-2 text-xs font-extrabold transition-all
              ${activeTab === 'pet' 
                ? settings.theme === 'retro'
                  ? 'bg-rose-500 border-slate-900 text-white shadow-[2px_2px_0px_#00ffff]'
                  : 'bg-rose-300 border-slate-900 text-slate-900 shadow-[2px_2px_0px_#000]' 
                : settings.theme === 'slate'
                  ? 'bg-transparent border-transparent text-slate-400 hover:text-slate-100'
                  : settings.theme === 'retro'
                    ? 'bg-transparent border-transparent text-[#9d4edd] hover:text-[#00f0ff]'
                    : 'bg-white border-transparent text-slate-400 hover:text-slate-600'
              }`}
          >
            <span className="text-lg">💝</span>
            <span className="text-[10px] md:text-xs truncate">{t('tab_pet')}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center justify-center py-2 border-2 text-xs font-extrabold transition-all
              ${activeTab === 'shop' 
                ? settings.theme === 'retro'
                  ? 'bg-amber-400 border-slate-900 text-slate-900 shadow-[2px_2px_0px_#ff007f]'
                  : 'bg-amber-300 border-slate-900 text-slate-900 shadow-[2px_2px_0px_#000]' 
                : settings.theme === 'slate'
                  ? 'bg-transparent border-transparent text-slate-400 hover:text-slate-100'
                  : settings.theme === 'retro'
                    ? 'bg-transparent border-transparent text-[#9d4edd] hover:text-[#00f0ff]'
                    : 'bg-white border-transparent text-slate-400 hover:text-slate-600'
              }`}
          >
            <span className="text-lg">🛒</span>
            <span className="text-[10px] md:text-xs truncate">{t('tab_shop')}</span>
          </button>

          <button
            onClick={() => setActiveTab('collection')}
            className={`flex flex-col items-center justify-center py-2 border-2 text-xs font-extrabold transition-all
              ${activeTab === 'collection' 
                ? settings.theme === 'retro'
                  ? 'bg-[#00f0ff] border-slate-900 text-slate-950 shadow-[2px_2px_0px_#ff007f]'
                  : 'bg-emerald-300 border-slate-900 text-slate-900 shadow-[2px_2px_0px_#000]' 
                : settings.theme === 'slate'
                  ? 'bg-transparent border-transparent text-slate-400 hover:text-slate-100'
                  : settings.theme === 'retro'
                    ? 'bg-transparent border-transparent text-[#9d4edd] hover:text-[#00f0ff]'
                    : 'bg-white border-transparent text-slate-400 hover:text-slate-600'
              }`}
          >
            <span className="text-lg">📖</span>
            <span className="text-[10px] md:text-xs truncate">{t('tab_collection')}</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex flex-col items-center justify-center py-2 border-2 text-xs font-extrabold transition-all
              ${activeTab === 'achievements' 
                ? settings.theme === 'retro'
                  ? 'bg-[#9d4edd] border-slate-900 text-white shadow-[2px_2px_0px_#00f0ff]'
                  : 'bg-indigo-300 border-slate-900 text-slate-900 shadow-[2px_2px_0px_#000]' 
                : settings.theme === 'slate'
                  ? 'bg-transparent border-transparent text-slate-400 hover:text-slate-100'
                  : settings.theme === 'retro'
                    ? 'bg-transparent border-transparent text-[#9d4edd] hover:text-[#00f0ff]'
                    : 'bg-white border-transparent text-slate-400 hover:text-slate-600'
              }`}
          >
            <span className="text-lg">🏆</span>
            <span className="text-[10px] md:text-xs truncate">{t('tab_achievements')}</span>
          </button>

          <button
            onClick={() => setActiveTab('options')}
            className={`flex flex-col items-center justify-center py-2 border-2 text-xs font-extrabold transition-all
              ${activeTab === 'options' 
                ? settings.theme === 'retro'
                  ? 'bg-[#3a86ff] border-slate-900 text-white shadow-[2px_2px_0px_#ffd166]'
                  : 'bg-sky-300 border-slate-900 text-slate-900 shadow-[2px_2px_0px_#000]' 
                : settings.theme === 'slate'
                  ? 'bg-transparent border-transparent text-slate-400 hover:text-slate-100'
                  : settings.theme === 'retro'
                    ? 'bg-transparent border-transparent text-[#9d4edd] hover:text-[#00f0ff]'
                    : 'bg-white border-transparent text-slate-400 hover:text-slate-600'
              }`}
          >
            <span className="text-lg">⚙️</span>
            <span className="text-[10px] md:text-xs truncate">{t('tab_options')}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl relative">
              <QuestForm 
                onAdd={handleAddQuest} 
                onClose={() => setShowForm(false)} 
                language={settings.language}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
