import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserProfile, Quest, QuestStatus } from '../types';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trophy, Check, Sparkles, Clock, CalendarDays } from 'lucide-react';

interface AchievementsTabProps {
  profile: UserProfile;
  quests: Quest[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardGold: number;
  conditionLabel: string;
  check: (profile: UserProfile, quests: Quest[]) => boolean;
}

interface DailyAchievement {
  id: string;
  title: string;
  description: string;
  rewardGold: number;
  conditionLabel: string;
  getProgress: (quests: Quest[]) => { current: number; target: number };
  check: (quests: Quest[]) => boolean;
}

// Convert Firebase Timestamp or fallback representation to a JavaScript Date
const convertToDateValue = (val: any): Date | null => {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (val && typeof val === 'object') {
    if (typeof val.toDate === 'function') {
      return val.toDate();
    }
    if (typeof val.seconds === 'number') {
      return new Date(val.seconds * 1000);
    }
  }
  try {
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  } catch (e) {
    // raw fail fallback
  }
  return null;
};

// Check if two dates represent the same local calendar day
const isSameLocalDate = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const getLocalTodayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_habit',
    title: '행동의 첫 걸음',
    description: '하루 루틴을 설정하고 인생의 첫 번째 일정을 완료하세요!',
    rewardGold: 50,
    conditionLabel: '일정 1회 이상 완료',
    check: (profile, quests) => {
      const completed = quests.filter(q => q.status === QuestStatus.COMPLETED);
      return completed.length >= 1;
    }
  },
  {
    id: 'diligent_keeper',
    title: '성실한 스케줄러',
    description: '반려동물을 위해 꾸준히 할 일을 완료해 습관을 다집니다.',
    rewardGold: 150,
    conditionLabel: '일정 5회 이상 완료',
    check: (profile, quests) => {
      const completed = quests.filter(q => q.status === QuestStatus.COMPLETED);
      return completed.length >= 5;
    }
  },
  {
    id: 'baby_steps',
    title: '친구와의 유대',
    description: '계획을 부지런히 세우고 친구와 함께 레벨 3을 달성해보세요.',
    rewardGold: 100,
    conditionLabel: '레벨 3 이상 달성',
    check: (profile) => (profile.level || 1) >= 3
  },
  {
    id: 'legendary_growth',
    title: '위대한 주인의 품격',
    description: '할 일을 마스터하고 반려동물의 잠재력을 깨우쳐 레벨 8에 도달하세요.',
    rewardGold: 300,
    conditionLabel: '레벨 8 이상 달성',
    check: (profile) => (profile.level || 1) >= 8
  },
  {
    id: 'focused_mind',
    title: '고도의 집중 전문가',
    description: '어떤 일이든 깊은 집중력과 책임감을 키운 일정 마스터입니다.',
    rewardGold: 120,
    conditionLabel: '집중 능력치 10 이상',
    check: (profile) => (profile.stats?.focus || 0) >= 10
  },
  {
    id: 'wise_scholar',
    title: '명석한 지성',
    description: '배움과 연구를 꾸준히 하여 지혜가 가득한 주인이 되었습니다.',
    rewardGold: 120,
    conditionLabel: '지식 능력치 10 이상',
    check: (profile) => (profile.stats?.wisdom || 0) >= 10
  }
];

const DAILY_ACHIEVEMENTS: DailyAchievement[] = [
  {
    id: 'daily_create_1',
    title: '하루 일정의 출발',
    description: '오늘 새로 실천할 목표 일정을 최소 1개 올려 신나게 출발해 보세요!',
    rewardGold: 20,
    conditionLabel: '오늘 등록한 일정 1개 이상',
    getProgress: (quests) => {
      const today = new Date();
      const count = quests.filter(q => {
        const qDate = convertToDateValue(q.createdAt);
        return qDate ? isSameLocalDate(qDate, today) : false;
      }).length;
      return { current: count, target: 1 };
    },
    check: (quests) => {
      const today = new Date();
      const count = quests.filter(q => {
        const qDate = convertToDateValue(q.createdAt);
        return qDate ? isSameLocalDate(qDate, today) : false;
      }).length;
      return count >= 1;
    }
  },
  {
    id: 'daily_complete_1',
    title: '귀중한 첫 단추',
    description: '오늘 계획한 가볍고 소소한 일정을 1개 이상 완료하여 활기찬 시동을 켜보세요.',
    rewardGold: 30,
    conditionLabel: '오늘 완료한 일정 1개 이상',
    getProgress: (quests) => {
      const today = new Date();
      const count = quests.filter(q => {
        if (q.status !== QuestStatus.COMPLETED) return false;
        const qDate = convertToDateValue(q.completedAt);
        return qDate ? isSameLocalDate(qDate, today) : false;
      }).length;
      return { current: count, target: 1 };
    },
    check: (quests) => {
      const today = new Date();
      const count = quests.filter(q => {
        if (q.status !== QuestStatus.COMPLETED) return false;
        const qDate = convertToDateValue(q.completedAt);
        return qDate ? isSameLocalDate(qDate, today) : false;
      }).length;
      return count >= 1;
    }
  },
  {
    id: 'daily_complete_3',
    title: '삼세번의 성취 습관',
    description: '포기하지 않고 오늘 일정을 3개 이상 완료하며 단짝 반려동물에게 성실함을 가르쳐주세요.',
    rewardGold: 60,
    conditionLabel: '오늘 완료한 일정 3개 이상',
    getProgress: (quests) => {
      const today = new Date();
      const count = quests.filter(q => {
        if (q.status !== QuestStatus.COMPLETED) return false;
        const qDate = convertToDateValue(q.completedAt);
        return qDate ? isSameLocalDate(qDate, today) : false;
      }).length;
      return { current: count, target: 3 };
    },
    check: (quests) => {
      const today = new Date();
      const count = quests.filter(q => {
        if (q.status !== QuestStatus.COMPLETED) return false;
        const qDate = convertToDateValue(q.completedAt);
        return qDate ? isSameLocalDate(qDate, today) : false;
      }).length;
      return count >= 3;
    }
  },
  {
    id: 'daily_complete_5',
    title: '완벽으로 장식한 하루',
    description: '오늘 5개 이상의 계획을 힘차게 완수하고, 귀엽고 사랑스러운 펫과 깊은 유대감을 보상받으세요.',
    rewardGold: 120,
    conditionLabel: '오늘 완료한 일정 5개 이상',
    getProgress: (quests) => {
      const today = new Date();
      const count = quests.filter(q => {
        if (q.status !== QuestStatus.COMPLETED) return false;
        const qDate = convertToDateValue(q.completedAt);
        return qDate ? isSameLocalDate(qDate, today) : false;
      }).length;
      return { current: count, target: 5 };
    },
    check: (quests) => {
      const today = new Date();
      const count = quests.filter(q => {
        if (q.status !== QuestStatus.COMPLETED) return false;
        const qDate = convertToDateValue(q.completedAt);
        return qDate ? isSameLocalDate(qDate, today) : false;
      }).length;
      return count >= 5;
    }
  }
];

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ profile, quests }) => {
  const [activeSubTab, setActiveSubTab] = useState<'lifetime' | 'daily'>('lifetime');
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Update timer display till midnight
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}시간 ${mins}분 후 초기화`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, []);

  // Standard claimed accomplishments
  const claimedList: string[] = profile.claimedAchievements || [];

  // Daily reset checking on claiming / rendering
  const todayStr = getLocalTodayString();
  const isDailyClaimed = (achId: string) => {
    if (profile.dailyClaimedDate !== todayStr) return false;
    return (profile.claimedDailyAchievements || []).includes(achId);
  };

  // Completed counts for standard achievements metrics
  const completedCount = quests.filter(q => q.status === QuestStatus.COMPLETED).length;

  // Claim handler for one-time achievements
  const handleClaim = async (achievement: Achievement) => {
    if (claimingId) return;
    setClaimingId(achievement.id);

    try {
      const userRef = doc(db, 'userProfiles', profile.userId);
      const newGold = (profile.gold || 0) + achievement.rewardGold;

      await updateDoc(userRef, {
        gold: newGold,
        claimedAchievements: arrayUnion(achievement.id)
      });

      setClaimMessage(`축하합니다! '${achievement.title}' 업적 보상 +${achievement.rewardGold} G 획득! 🎉`);
      setTimeout(() => setClaimMessage(null), 3000);
    } catch (err) {
      console.error('Claim failed:', err);
    } finally {
      setClaimingId(null);
    }
  };

  // Claim handler for daily resetting achievements
  const handleClaimDaily = async (achievement: DailyAchievement) => {
    if (claimingId) return;
    setClaimingId(achievement.id);

    try {
      const userRef = doc(db, 'userProfiles', profile.userId);
      const newGold = (profile.gold || 0) + achievement.rewardGold;

      const isCurrentDay = profile.dailyClaimedDate === todayStr;
      const updatedClaimedList = isCurrentDay 
        ? [...(profile.claimedDailyAchievements || []), achievement.id]
        : [achievement.id];

      await updateDoc(userRef, {
        gold: newGold,
        dailyClaimedDate: todayStr,
        claimedDailyAchievements: updatedClaimedList
      });

      setClaimMessage(`축하합니다! 일일 업적 '${achievement.title}' 보상 +${achievement.rewardGold} G 획득! 🎉`);
      setTimeout(() => setClaimMessage(null), 3000);
    } catch (err) {
      console.error('Claim daily achievement failed:', err);
    } finally {
      setClaimingId(null);
    }
  };

  // Get progress percentage and descriptive strings for visual bars
  const getStandardProgress = (achId: string) => {
    let current = 0;
    let target = 1;
    if (achId === 'first_habit') {
      current = completedCount;
      target = 1;
    } else if (achId === 'diligent_keeper') {
      current = completedCount;
      target = 5;
    } else if (achId === 'baby_steps') {
      current = profile.level || 1;
      target = 3;
    } else if (achId === 'legendary_growth') {
      current = profile.level || 1;
      target = 8;
    } else if (achId === 'focused_mind') {
      current = profile.stats?.focus || 0;
      target = 10;
    } else if (achId === 'wise_scholar') {
      current = profile.stats?.wisdom || 0;
      target = 10;
    }
    const ratio = Math.min(Number(current), target) / target;
    return {
      current: current,
      target: target,
      percent: `${Math.round(ratio * 100)}%`
    };
  };

  // Filter and metrics for daily statistics
  const dailyCreatedStatistics = DAILY_ACHIEVEMENTS[0].getProgress(quests).current;
  const dailyCompletedStatistics = DAILY_ACHIEVEMENTS[1].getProgress(quests).current;

  // Let's count how many daily achievements are claimed today
  let claimedDailyCount = 0;
  if (profile.dailyClaimedDate === todayStr && profile.claimedDailyAchievements) {
    claimedDailyCount = profile.claimedDailyAchievements.length;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Header Banner */}
      <div className="bg-slate-900 border-b-4 border-slate-700 p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] flex justify-between items-center">
        <h2 className="text-sm pixel-title text-white uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          ACHIEVEMENTS
        </h2>
        <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
          {activeSubTab === 'lifetime' 
            ? `특별 업적: ${claimedList.length} / ${ACHIEVEMENTS.length}`
            : `일일 업적: ${claimedDailyCount} / ${DAILY_ACHIEVEMENTS.length}`
          }
        </span>
      </div>

      {/* Subcategory Switcher Button Tabs */}
      <div className="flex border-4 border-slate-900 bg-slate-100 p-1 gap-2 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => setActiveSubTab('lifetime')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 font-extrabold text-xs tracking-wider transition-all
            ${activeSubTab === 'lifetime'
              ? 'bg-amber-400 border-slate-900 text-slate-950 shadow-[2px_2px_0px_rgba(0,0,0,0.15)] translate-x-[-1px] translate-y-[-1px]'
              : 'bg-white border-transparent text-slate-500 hover:text-slate-800'
            }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          일회성 특별 업적
        </button>
        <button
          onClick={() => setActiveSubTab('daily')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 font-extrabold text-xs tracking-wider transition-all
            ${activeSubTab === 'daily'
              ? 'bg-rose-500 border-slate-900 text-white shadow-[2px_2px_0px_rgba(0,0,0,0.15)] translate-x-[-1px] translate-y-[-1px]'
              : 'bg-white border-transparent text-slate-500 hover:text-slate-800'
            }`}
        >
          <Clock className="w-3.5 h-3.5" />
          일일 성취 업적
        </button>
      </div>

      {/* Success Notifications Banner */}
      {claimMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-4 border-amber-500 p-3 text-xs text-amber-800 font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.1)] flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-500 animate-bounce shrink-0" />
          <span>{claimMessage}</span>
        </motion.div>
      )}

      {/* Dynamic Category Guides */}
      {activeSubTab === 'lifetime' ? (
        <p className="text-slate-500 font-bold text-xs leading-relaxed px-1">
          반려동물 육성과 일정 달성을 통해 <span className="text-slate-950 font-extrabold">일생 동안 한 번만 완료할 수 있는 특별 훈장</span>입니다. 높은 골드 보상으로 펫 성장을 응원합니다!
        </p>
      ) : (
        <div className="bg-rose-50 border-2 border-rose-200 p-3 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex flex-col gap-0.5">
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              <span className="text-rose-600 font-extrabold">매일 자정에 새롭게 초기화되는 일일 성취</span>입니다.
            </p>
            <span className="text-[10px] text-slate-400 font-medium">소소하게 일정을 계획하고 습관을 이행하며 매일 골드 주머니를 묵직하게 채워보세요!</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-black shrink-0 whitespace-nowrap bg-white px-2 py-1 border border-rose-300 rounded self-start md:self-auto">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}</span>
          </div>
        </div>
      )}

      {/* Category Progress Stats Dashboard (Only visible on Daily tabs for gamification) */}
      {activeSubTab === 'daily' && (
        <div className="grid grid-cols-2 gap-3 bg-slate-50 border-2 border-slate-200 p-3 rounded-md">
          <div className="text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">오늘 등록된 일정</div>
            <div className="text-lg font-black text-slate-800 mt-1">{dailyCreatedStatistics} 개</div>
          </div>
          <div className="text-center border-l-2 border-slate-200">
            <div className="text-[10px] text-slate-400 font-bold uppercase">오늘 완료된 일정</div>
            <div className="text-lg font-black text-rose-500 mt-1">{dailyCompletedStatistics} 개</div>
          </div>
        </div>
      )}

      {/* Achievement Item List Container */}
      <div className="space-y-4">
        {/* Render Lifetime Special Achievements */}
        {activeSubTab === 'lifetime' && ACHIEVEMENTS.map((ach) => {
          const isCompleted = ach.check(profile, quests);
          const isClaimed = claimedList.includes(ach.id);
          const canClaim = isCompleted && !isClaimed;
          const prog = getStandardProgress(ach.id);

          return (
            <motion.div
              key={ach.id}
              whileHover={{ scale: 1.01 }}
              className={`bg-white border-4 p-4 shadow-[6px_6px_0px_rgba(0,0,0,0.1)] flex items-center gap-4 transition-colors
                ${isClaimed 
                  ? 'border-slate-300 bg-slate-50 opacity-70' 
                  : isCompleted 
                    ? 'border-amber-400 bg-amber-50/20' 
                    : 'border-slate-900 bg-white'
                }`}
            >
              {/* Badge Icon */}
              <div className={`w-14 h-14 border-2 border-slate-900 flex items-center justify-center text-3xl shrink-0 shadow-inner rounded-md
                ${isClaimed 
                  ? 'bg-slate-200 text-slate-400' 
                  : isCompleted 
                    ? 'bg-amber-300 animate-pulse text-amber-700' 
                    : 'bg-slate-100 text-slate-300'
                }`}
              >
                {isClaimed ? '🏆' : isCompleted ? '🎁' : '🔒'}
              </div>

              {/* Title, description & visual progress bar container */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{ach.title}</h3>
                  <span className="text-[11px] font-extrabold text-amber-600 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded leading-none shrink-0">
                    +{ach.rewardGold} G
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-medium mt-1 leading-normal">{ach.description}</p>
                
                {/* Visual Progress Bar and Text */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span>{ach.conditionLabel}</span>
                    <span>{prog.current} / {prog.target} ({prog.percent})</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 border border-slate-300 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isClaimed ? 'bg-slate-400' : 'bg-amber-400'}`}
                      style={{ width: prog.percent }}
                    />
                  </div>
                </div>
              </div>

              {/* Reward Claim Actions Button */}
              <div className="shrink-0">
                {isClaimed ? (
                  <div className="bg-emerald-100 p-1.5 rounded-full border border-emerald-500">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                ) : (
                  <button
                    disabled={!canClaim || claimingId === ach.id}
                    onClick={() => handleClaim(ach)}
                    className={`py-2 px-3 border-2 font-bold uppercase tracking-wider text-xs shadow-[2px_2px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all
                      ${!canClaim 
                        ? 'bg-slate-100 border-slate-300 text-slate-300 cursor-not-allowed shadow-none translate-x-0 translate-y-0' 
                        : 'bg-amber-300 border-slate-900 text-slate-900 hover:bg-amber-200'
                      }`}
                  >
                    {claimingId === ach.id ? '수령..' : isCompleted ? '받기' : '잠금'}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Render New Daily Resetting Achievements */}
        {activeSubTab === 'daily' && DAILY_ACHIEVEMENTS.map((ach) => {
          const isCompleted = ach.check(quests);
          const isClaimed = isDailyClaimed(ach.id);
          const canClaim = isCompleted && !isClaimed;
          
          const progMetrics = ach.getProgress(quests);
          const ratio = Math.min(progMetrics.current, progMetrics.target) / progMetrics.target;
          const progressPercent = `${Math.round(ratio * 100)}%`;

          return (
            <motion.div
              key={ach.id}
              whileHover={{ scale: 1.01 }}
              className={`bg-white border-4 p-4 shadow-[6px_6px_0px_rgba(0,0,0,0.1)] flex items-center gap-4 transition-colors
                ${isClaimed 
                  ? 'border-slate-300 bg-slate-50 opacity-70' 
                  : isCompleted 
                    ? 'border-rose-400 bg-rose-50/20' 
                    : 'border-slate-900 bg-white'
                }`}
            >
              {/* Badge Icon */}
              <div className={`w-14 h-14 border-2 border-slate-900 flex items-center justify-center text-3xl shrink-0 shadow-inner rounded-md
                ${isClaimed 
                  ? 'bg-slate-200 text-slate-400' 
                  : isCompleted 
                    ? 'bg-rose-400 animate-pulse text-rose-700' 
                    : 'bg-slate-100 text-slate-300'
                }`}
              >
                {isClaimed ? '✅' : isCompleted ? '🎁' : '⏰'}
              </div>

              {/* Title, description & visual progress bar container */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{ach.title}</h3>
                  <span className="text-[11px] font-extrabold text-rose-600 bg-rose-50 border border-rose-300 px-1.5 py-0.5 rounded leading-none shrink-0">
                    +{ach.rewardGold} G
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-medium mt-1 leading-normal">{ach.description}</p>
                
                {/* Visual Progress Bar and Text */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span>{ach.conditionLabel}</span>
                    <span>{progMetrics.current} / {progMetrics.target} ({progressPercent})</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 border border-slate-300 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isClaimed ? 'bg-slate-400' : 'bg-rose-500'}`}
                      style={{ width: progressPercent }}
                    />
                  </div>
                </div>
              </div>

              {/* Reward Claim Actions Button */}
              <div className="shrink-0">
                {isClaimed ? (
                  <div className="bg-rose-100 p-1.5 rounded-full border border-rose-500">
                    <Check className="w-4 h-4 text-rose-600" />
                  </div>
                ) : (
                  <button
                    disabled={!canClaim || claimingId === ach.id}
                    onClick={() => handleClaimDaily(ach)}
                    className={`py-2 px-3 border-2 font-bold uppercase tracking-wider text-xs shadow-[2px_2px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all
                      ${!canClaim 
                        ? 'bg-slate-100 border-slate-300 text-slate-300 cursor-not-allowed shadow-none translate-x-0 translate-y-0' 
                        : 'bg-rose-500 border-slate-900 text-white hover:bg-rose-400'
                      }`}
                  >
                    {claimingId === ach.id ? '수령..' : isCompleted ? '받기' : '미달성'}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
