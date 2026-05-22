import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { PetType } from '../types';
import { PET_DATA } from '../constants';
import PixelEgg, { EggRarity } from './PixelEgg';

interface CharacterSelectionProps {
  onSelect: (petType: PetType, rarity: EggRarity, color: string) => void;
}

const getRandomRarity = (): EggRarity => {
  const rand = Math.random() * 100;
  if (rand < 90) return EggRarity.COMMON;
  if (rand < 95) return EggRarity.PATTERN;
  if (rand < 98) return EggRarity.GOLD;
  return EggRarity.RAINBOW;
};

const getEggName = (element: string) => {
  switch (element) {
    case 'fire':
      return '신비로운 불꽃의 알';
    case 'water':
      return '신비로운 이슬의 알';
    case 'earth':
      return '신비로운 대지의 알';
    case 'wind':
      return '신비로운 구름의 알';
    default:
      return '신비로운 정령의 알';
  }
};

const getEggDescription = (element: string) => {
  switch (element) {
    case 'fire':
      return '🔥 따뜻하고 열정적인 온기가 깊이 깃든 불꽃 속성의 알입니다. 어떤 반려동물이 깨어날지 두근두근 기대되네요!';
    case 'water':
      return '💧 차분하고 맑은 수분의 기운이 활기차게 도는 이슬 속성의 알입니다. 영리하고 다정한 동무가 들어있습니다.';
    case 'earth':
      return '🌱 대지의 넉넉하고 편안한 숨결이 스며있는 대지 속성의 알입니다. 든든하고 포근한 파트너 생명이 숨쉬고 있어요.';
    case 'wind':
      return '🌫️ 부드러우면서도 상쾌한 율동이 전해지는 구름 속성의 알입니다. 자유로운 성품의 귀여운 동무가 잠들어 있습니다.';
    default:
      return '정령의 기운이 포근하게 감싸고 있는 신비로운 알입니다. 정성스럽게 계획을 이행해 단짝을 만나보세요!';
  }
};

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onSelect }) => {
  const [filter, setFilter] = useState<'all' | 'fire' | 'water' | 'earth' | 'wind'>('all');

  const preRolledPets = useMemo(() => {
    return Object.entries(PET_DATA).map(([type, data]) => {
      const rarity = getRandomRarity();
      return {
        type: type as PetType,
        data,
        rarity,
        color: data.color
      };
    });
  }, []);

  const filteredPets = useMemo(() => {
    if (filter === 'all') return preRolledPets;
    return preRolledPets.filter(p => p.data.element === filter);
  }, [filter, preRolledPets]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10 px-4 bg-[#FFF9E6] text-slate-800">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 max-w-xl"
      >
        <span className="text-xs bg-rose-100 border border-rose-400 text-rose-600 font-bold px-2.5 py-1 uppercase rounded-full tracking-widest">
          WELCOME TO PETPLAN!
        </span>
        <h1 className="text-xl md:text-2xl pixel-title mt-3 text-slate-900 leading-tight">
          끌리는 기운을 가진 <span className="text-rose-500">신비로운 알</span> 중 하나를 골라보세요!
        </h1>
        <p className="text-slate-500 font-bold text-xs mt-2 leading-relaxed">
          귀여운 동물들이 알 속에 몸을 웅크리고 있어요. 은혜로운 알을 정중히 입양해 성실한 하루 리듬과 사랑으로 부화시켜 보세요!
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-8 max-w-md w-full px-2">
        {(['all', 'fire', 'water', 'earth', 'wind'] as const).map((elem) => {
          const isSelected = filter === elem;
          const label = elem === 'all' ? '전체 (ALL)' :
                        elem === 'fire' ? '🔥 불꽃 (FIRE)' :
                        elem === 'water' ? '💧 이슬 (WATER)' :
                        elem === 'earth' ? '🌱 대지 (EARTH)' : '🌫️ 구름 (WIND)';
          return (
            <button
              key={elem}
              onClick={() => setFilter(elem)}
              className={`py-1.5 px-3 border-2 font-bold text-xs uppercase tracking-wider transition-all
                ${isSelected
                  ? 'bg-amber-300 border-slate-900 text-slate-900 shadow-[2px_2px_0px_#000]'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 shadow-none'
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl px-2">
        {filteredPets.map((pet, index) => {
          return (
            <motion.button
              key={pet.type}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(1.5, index * 0.04) }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(pet.type, pet.rarity, pet.color)}
              className="bg-white border-4 border-slate-900 p-4 flex items-center gap-4 text-left hover:bg-amber-50/50 transition-colors shadow-[4px_4px_0px_#000] group"
            >
              <div className="w-20 h-20 border-2 border-slate-900 flex items-center justify-center bg-slate-50 shrink-0 group-hover:bg-white transition-colors overflow-hidden">
                <PixelEgg rarity={pet.rarity} color={pet.color} size="sm" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  <h2 className="text-sm font-black text-slate-900 truncate">
                    {getEggName(pet.data.element)}
                  </h2>
                  {pet.rarity !== EggRarity.COMMON && (
                    <span className={`text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider border
                      ${pet.rarity === EggRarity.GOLD ? 'bg-amber-300 border-amber-500' : 
                        pet.rarity === EggRarity.RAINBOW ? 'bg-gradient-to-r from-red-200 via-yellow-200 to-blue-200 border-slate-300' : 'bg-slate-100 border-slate-300'}`}
                    >
                      {pet.rarity}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 font-bold text-xs leading-normal line-clamp-2">
                  {getEggDescription(pet.data.element)}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CharacterSelection;
