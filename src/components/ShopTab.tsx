import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PET_DATA } from '../constants';
import { ShoppingBag, Coffee, Smile } from 'lucide-react';

interface ShopTabProps {
  profile: UserProfile;
}

interface SnackValue {
  experience?: number;
  stats?: any;
}

interface SnackItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  emoji: string;
  benefit: string;
  onPurchase: (profile: UserProfile) => SnackValue;
}

interface AccessoryItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  emoji: string;
}

const SNACK_ITEMS: SnackItem[] = [
  {
    id: 'sweet_candy',
    name: '달콤 캔디 (Candy)',
    description: '반려동물이 좋아하는 달콤한 캔디입니다.',
    cost: 30,
    emoji: '🍬',
    benefit: '+15 EXP',
    onPurchase: (profile) => ({
      experience: profile.experience + 15
    })
  },
  {
    id: 'delicious_curry',
    name: '행복 카레 (Curry)',
    description: '정성이 지극히 들어간 매콤한 영양 카레입니다.',
    cost: 100,
    emoji: '🍛',
    benefit: '+60 EXP, 집중 +1',
    onPurchase: (profile) => ({
      experience: profile.experience + 60,
      stats: {
        ...profile.stats,
        focus: (profile.stats?.focus || 0) + 1
      }
    })
  },
  {
    id: 'rainbow_cake',
    name: '무지개 조각 케이크',
    description: '눈부신 무지개 빛깔로 장식된 최고급 케이크입니다.',
    cost: 250,
    emoji: '🍰',
    benefit: '+180 EXP, 관계 +2',
    onPurchase: (profile) => ({
      experience: profile.experience + 180,
      stats: {
        ...profile.stats,
        connection: (profile.stats?.connection || 0) + 2
      }
    })
  },
  {
    id: 'growth_elixir',
    name: '신비한 성장 비약',
    description: '신선한 지혜가 담겨 세포를 일깨우는 마법 영약입니다.',
    cost: 500,
    emoji: '🧪',
    benefit: '+400 EXP, 지식 +3, 체력 +3',
    onPurchase: (profile) => ({
      experience: profile.experience + 400,
      stats: {
        ...profile.stats,
        wisdom: (profile.stats?.wisdom || 0) + 3,
        vitality: (profile.stats?.vitality || 0) + 3
      }
    })
  }
];

const ACCESSORY_ITEMS: AccessoryItem[] = [
  {
    id: 'cool_hat',
    name: '멋진 중절모 (Gentleman Hat)',
    description: '클래식하고 멋진 신사 분위기를 주는 품격있는 모자입니다.',
    cost: 150,
    emoji: '🎩'
  },
  {
    id: 'red_ribbon',
    name: '귀여운 빨간 리본 (Red Ribbon)',
    description: '귀여움을 한껏 끌어올리는 새빨간 실크 리본입니다.',
    cost: 100,
    emoji: '🎀'
  },
  {
    id: 'hip_sunglasses',
    name: '힙한 선글라스 (Sunglasses)',
    description: '선선하고 시크하게 꾸며주는 유니크 선글라스입니다.',
    cost: 180,
    emoji: '🕶️'
  },
  {
    id: 'magic_crown',
    name: '영광의 금빛 왕관 (Golden Crown)',
    description: '귀여운 반려동물을 존귀하게 만들어줄 영광의 왕관입니다.',
    cost: 350,
    emoji: '👑'
  },
  {
    id: 'angel_halo',
    name: '빛나는 아우라 (Shining Aura)',
    description: '펫 주위에 눈부시게 빛나는 엔젤 아우라 이펙트입니다.',
    cost: 250,
    emoji: '✨'
  }
];

export const ShopTab: React.FC<ShopTabProps> = ({ profile }) => {
  const [activeCategory, setActiveCategory] = useState<'snacks' | 'accessories'>('snacks');
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const LEVEL_EXP_MULTIPLIER = 1.5;

  const handleBuySnack = async (item: SnackItem) => {
    if (profile.gold < item.cost) {
      alert('골드가 부족합니다! 할 일을 완료하여 더 많은 골드를 모아보세요.');
      return;
    }

    setBuyingId(item.id);
    try {
      const diff = item.onPurchase(profile);
      let newExp = diff.experience !== undefined ? diff.experience : profile.experience;
      let newGold = profile.gold - item.cost;
      let newLevel = profile.level;
      let newMaxExp = profile.maxExperience;
      let newStats = { ...profile.stats, ...(diff.stats || {}) };

      while (newExp >= newMaxExp) {
        newExp -= newMaxExp;
        newLevel += 1;
        newMaxExp = Math.round(newMaxExp * LEVEL_EXP_MULTIPLIER);
        newStats.vitality = (newStats.vitality || 0) + 1;
        newStats.wisdom = (newStats.wisdom || 0) + 1;
        newStats.focus = (newStats.focus || 0) + 1;
        newStats.connection = (newStats.connection || 0) + 1;
      }

      const getEvolutionStage = (lvl: number) => {
        if (lvl < 5) return '알 (EGG)';
        if (lvl < 10) return '아기 (BABY)';
        if (lvl < 15) return '소년 (TEEN)';
        return '성체 (ADULT)';
      };

      const newStage = getEvolutionStage(newLevel);
      const petTypeInfo = PET_DATA[profile.petType];
      const avatarUrl = petTypeInfo.stages[newStage] || profile.avatarUrl;

      const userRef = doc(db, 'userProfiles', profile.userId);
      await updateDoc(userRef, {
        experience: Math.floor(newExp),
        gold: newGold,
        level: newLevel,
        maxExperience: newMaxExp,
        stats: newStats,
        evolutionStage: newStage,
        avatarUrl: avatarUrl
      });

      setSuccessMessage(`${item.name}을(를) 성공적으로 구매하여 사용했습니다! 🎉`);
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err) {
      console.error('Snack purchase failed:', err);
    } finally {
      setBuyingId(null);
    }
  };

  const handleBuyAccessory = async (item: AccessoryItem) => {
    if (profile.gold < item.cost) {
      alert('골드가 부족합니다! 할 일을 마쳐 더 많은 골드를 확보해보세요.');
      return;
    }

    setBuyingId(item.id);
    try {
      const newGold = profile.gold - item.cost;
      const ownedList = profile.ownedAccessories || [];
      const updatedOwned = [...ownedList, item.id];

      const userRef = doc(db, 'userProfiles', profile.userId);
      await updateDoc(userRef, {
        gold: newGold,
        ownedAccessories: updatedOwned,
        equippedAccessory: item.id // Equip directly on purchase
      });

      setSuccessMessage(`${item.name} 장식을 성공적으로 구매하여 장착했습니다! 🎀`);
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err) {
      console.error('Accessory purchase failed:', err);
    } finally {
      setBuyingId(null);
    }
  };

  const handleToggleEquip = async (itemId: string, isCurrentlyEquipped: boolean) => {
    try {
      const userRef = doc(db, 'userProfiles', profile.userId);
      await updateDoc(userRef, {
        equippedAccessory: isCurrentlyEquipped ? "" : itemId
      });
      setSuccessMessage(isCurrentlyEquipped ? '장식 착용을 해제했습니다.' : '장식을 예쁘게 착용했습니다! ✨');
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err) {
      console.error('Equip toggle failed:', err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 border-b-4 border-slate-700 p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] flex justify-between items-center">
        <h2 className="text-sm pixel-title text-white uppercase tracking-wider flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-rose-400" />
          PET SHOP
        </h2>
        <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
          GOLD: {profile.gold.toLocaleString()} G
        </span>
      </div>

      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 border-4 border-green-600 p-3 text-xs text-green-800 font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
        >
          {successMessage}
        </motion.div>
      )}

      {/* Category Tabs */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setActiveCategory('snacks')}
          className={`py-2 px-4 border-2 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2
            ${activeCategory === 'snacks' 
              ? 'bg-amber-300 border-slate-900 text-slate-900 shadow-[2px_2px_0px_#000]' 
              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
        >
          <Coffee className="w-4 h-4" />
          간식 (Snacks)
        </button>
        <button
          onClick={() => setActiveCategory('accessories')}
          className={`py-2 px-4 border-2 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2
            ${activeCategory === 'accessories' 
              ? 'bg-amber-300 border-slate-900 text-slate-900 shadow-[2px_2px_0px_#000]' 
              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
        >
          <Smile className="w-4 h-4" />
          악세사리 (Accessories)
        </button>
      </div>

      <p className="text-slate-500 font-bold text-xs leading-relaxed px-1">
        {activeCategory === 'snacks' 
          ? '모은 골드로 반려동물을 위한 영양 간식을 구매해보세요. 추가 소중한 경험치(EXP)와 스탯을 획득합니다!'
          : '반려동물을 특별하게 꾸밀 수 있는 개성만점 장식들입니다. 구매한 장식품은 언제든 꼈다 뺐다 할 수 있습니다!'
        }
      </p>

      <div className="space-y-4">
        {activeCategory === 'snacks' && SNACK_ITEMS.map((item) => {
          const canAfford = profile.gold >= item.cost;
          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.01 }}
              className={`bg-white border-4 border-slate-900 p-4 shadow-[6px_6px_0px_rgba(0,0,0,0.1)] flex items-center gap-4 ${!canAfford ? 'bg-slate-50' : ''}`}
            >
              <div className="w-14 h-14 bg-amber-50 border-2 border-slate-900 flex items-center justify-center text-3xl shadow-inner shrink-0 animate-[pulse_3s_infinite]">
                {item.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{item.name}</h3>
                  <span className="text-rose-500 font-bold text-xs shrink-0 flex items-center gap-0.5">
                    {item.cost} G
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-medium mt-0.5 leading-tight">{item.description}</p>
                
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-amber-100 border border-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase rounded">
                    효과: {item.benefit}
                  </span>
                </div>
              </div>

              <button
                disabled={!canAfford || buyingId === item.id}
                onClick={() => handleBuySnack(item)}
                className={`py-2 px-3 border-2 font-bold uppercase tracking-wider text-xs shadow-[2px_2px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all
                  ${!canAfford 
                    ? 'bg-slate-200 border-slate-400 text-slate-400 cursor-not-allowed shadow-none translate-x-0 translate-y-0' 
                    : 'bg-rose-400 border-slate-900 text-slate-900 hover:bg-rose-300'
                  }`}
              >
                {buyingId === item.id ? '준비..' : '구매'}
              </button>
            </motion.div>
          );
        })}

        {activeCategory === 'accessories' && ACCESSORY_ITEMS.map((item) => {
          const ownedList = profile.ownedAccessories || [];
          const isOwned = ownedList.includes(item.id);
          const isEquipped = profile.equippedAccessory === item.id;
          const canAfford = profile.gold >= item.cost;

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.01 }}
              className={`bg-white border-4 border-slate-900 p-4 shadow-[6px_6px_0px_rgba(0,0,0,0.1)] flex items-center gap-4 ${isOwned ? 'bg-amber-50/10' : !canAfford ? 'bg-slate-50' : ''}`}
            >
              <div className="w-14 h-14 bg-amber-50 border-2 border-slate-900 flex items-center justify-center text-3xl shadow-inner shrink-0 relative">
                {item.emoji}
                {isEquipped && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] font-bold px-1 py-0.5 rounded border border-slate-900 shadow-[1px_1px_0px_#000]">
                    착용
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{item.name}</h3>
                  {!isOwned && (
                    <span className="text-rose-500 font-bold text-xs shrink-0 flex items-center gap-0.5">
                      {item.cost} G
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-xs font-medium mt-0.5 leading-tight">{item.description}</p>
                
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] font-bold uppercase rounded px-1.5 py-0.5 border
                    ${isEquipped 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                      : isOwned 
                        ? 'bg-slate-100 text-slate-600 border-slate-300' 
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}
                  >
                    {isEquipped ? '착용 중' : isOwned ? '보유 중' : '미보유 악세사리'}
                  </span>
                </div>
              </div>

              {isOwned ? (
                <button
                  onClick={() => handleToggleEquip(item.id, isEquipped)}
                  className={`py-2 px-3 border-2 font-bold uppercase tracking-wider text-xs shadow-[2px_2px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all
                    ${isEquipped 
                      ? 'bg-slate-300 border-slate-900 text-slate-800 hover:bg-slate-200' 
                      : 'bg-emerald-400 border-slate-900 text-slate-900 hover:bg-emerald-300'
                    }`}
                >
                  {isEquipped ? '해제' : '장착'}
                </button>
              ) : (
                <button
                  disabled={!canAfford || buyingId === item.id}
                  onClick={() => handleBuyAccessory(item)}
                  className={`py-2 px-3 border-2 font-bold uppercase tracking-wider text-xs shadow-[2px_2px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all
                    ${!canAfford 
                      ? 'bg-slate-200 border-slate-400 text-slate-400 cursor-not-allowed shadow-none translate-x-0 translate-y-0' 
                      : 'bg-rose-400 border-slate-900 text-slate-900 hover:bg-rose-300'
                    }`}
                >
                  {buyingId === item.id ? '준비..' : '구매'}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
