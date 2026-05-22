import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { UserProfile, PetType, EvolutionStage } from '../types';
import { PET_DATA } from '../constants';
import PixelEgg, { EggRarity } from './PixelEgg';
import { BookOpen, Flame, Droplet, Leaf, Wind } from 'lucide-react';

interface CollectionTabProps {
  profile: UserProfile;
}

const elementNamesKOR = {
  fire: '불꽃 (FIRE)',
  water: '이슬 (WATER)',
  earth: '대지 (EARTH)',
  wind: '구름 (WIND)',
};

const elementClasses = {
  fire: 'bg-rose-50 border-rose-200 text-rose-700',
  water: 'bg-sky-50 border-sky-200 text-sky-700',
  earth: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  wind: 'bg-purple-50 border-purple-200 text-purple-700',
};

const elementIcons = {
  fire: <Flame className="w-4 h-4 text-rose-500 shrink-0" />,
  water: <Droplet className="w-4 h-4 text-sky-500 shrink-0" />,
  earth: <Leaf className="w-4 h-4 text-emerald-500 shrink-0" />,
  wind: <Wind className="w-4 h-4 text-purple-500 shrink-0" />,
};

const stageNamesKOR = {
  [EvolutionStage.EGG]: '알 (EGG)',
  [EvolutionStage.HATCHLING]: '아기 (BABY)',
  [EvolutionStage.TEEN]: '소년 (TEEN)',
  [EvolutionStage.ADULT]: '성체 (ADULT)',
};

const stageRequirements = {
  [EvolutionStage.EGG]: '레벨 1 이상',
  [EvolutionStage.HATCHLING]: '레벨 5 이상',
  [EvolutionStage.TEEN]: '레벨 10 이상',
  [EvolutionStage.ADULT]: '레벨 15 이상',
};

export const CollectionTab: React.FC<CollectionTabProps> = ({ profile }) => {
  const [selectedType, setSelectedType] = useState<PetType>(profile.petType);
  const [elementFilter, setElementFilter] = useState<'all' | 'fire' | 'water' | 'earth' | 'wind'>('all');

  // Filter the list of 20 pets based on element selection
  const petList = useMemo(() => {
    return Object.entries(PET_DATA).map(([type, data]) => ({
      type: type as PetType,
      data,
    }));
  }, []);

  const filteredPets = useMemo(() => {
    if (elementFilter === 'all') return petList;
    return petList.filter(p => p.data.element === elementFilter);
  }, [elementFilter, petList]);

  const activePetInfo = PET_DATA[selectedType] || PET_DATA[PetType.MALTESE];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 border-b-4 border-slate-700 p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] flex justify-between items-center">
        <h2 className="text-sm pixel-title text-white uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          PET BOOK
        </h2>
        <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
          ACTIVE: {
            (profile.discoveredPets && profile.discoveredPets.includes(profile.petType)) || profile.evolutionStage !== EvolutionStage.EGG
              ? (PET_DATA[profile.petType]?.name.split(' (')[0] || 'Unknown')
              : '???'
          }
        </span>
      </div>

      <p className="text-slate-500 font-bold text-xs leading-relaxed px-1">
        PetPlan의 신비로운 <span className="text-rose-500">20가지 반려동물</span>을 만나보세요! 속성을 선택해 도감을 탐색하며 성장 조건을 연구할 수 있습니다.
      </p>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
        {(['all', 'fire', 'water', 'earth', 'wind'] as const).map((elem) => {
          const isSelected = elementFilter === elem;
          const label = elem === 'all' ? '전체' :
                        elem === 'fire' ? '🔥 불꽃' :
                        elem === 'water' ? '💧 이슬' :
                        elem === 'earth' ? '🌱 대지' : '🌫️ 구름';
          return (
            <button
              key={elem}
              onClick={() => setElementFilter(elem)}
              className={`py-1 px-2.5 border-2 font-bold text-xs uppercase tracking-wider transition-all
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

      {/* Select Pet Row Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-[190px] overflow-y-auto border-2 border-slate-200 p-2 bg-slate-50 rounded shadow-inner">
        {filteredPets.map(({ type, data }) => {
          const isSelected = selectedType === type;
          const isUserOwns = profile.petType === type;
          const isDiscovered = 
            (profile.discoveredPets && profile.discoveredPets.includes(type)) ||
            (profile.petType === type && profile.evolutionStage !== EvolutionStage.EGG);

          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`p-2 border-2 text-xs font-bold text-center flex flex-col items-center justify-between gap-1.5 transition-all min-h-[75px]
                ${isSelected 
                  ? 'bg-amber-300 border-slate-900 text-slate-900 shadow-[2px_2px_0px_#000]' 
                  : isDiscovered
                    ? 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 shadow-none'
                    : 'bg-slate-100/60 border-slate-200 border-dashed text-slate-400 hover:bg-slate-100 shadow-none'
                }`}
            >
              <div className="flex items-center gap-1 justify-center">
                {isDiscovered ? elementIcons[data.element] : <span className="text-slate-400 font-bold text-xs">❓</span>}
                {isUserOwns && <span className="text-xs text-rose-500">✨</span>}
              </div>
              <span className="truncate w-full text-[11px] font-black">
                {isDiscovered ? data.name.split(' (')[0] : '???'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Breed Detail Panel */}
      {activePetInfo && (() => {
        const isDiscovered = 
          (profile.discoveredPets && profile.discoveredPets.includes(selectedType)) ||
          (profile.petType === selectedType);

        const isCurrentlyActiveBreed = profile.petType === selectedType;

        const isEggAndUnhatched = 
          profile.petType === selectedType && 
          profile.evolutionStage === EvolutionStage.EGG &&
          !(profile.discoveredPets && profile.discoveredPets.includes(selectedType));

        const isStageVisible = (stage: EvolutionStage) => {
          if (stage === EvolutionStage.EGG) {
            return isDiscovered;
          }
          if (profile.discoveredPets && profile.discoveredPets.includes(selectedType)) {
            return true;
          }
          if (profile.petType === selectedType) {
            const currentStage = profile.evolutionStage;
            if (currentStage === EvolutionStage.EGG) return false;
            if (currentStage === EvolutionStage.HATCHLING) {
              return stage === EvolutionStage.HATCHLING;
            }
            if (currentStage === EvolutionStage.TEEN) {
              return stage === EvolutionStage.HATCHLING || stage === EvolutionStage.TEEN;
            }
            if (currentStage === EvolutionStage.ADULT) {
              return true;
            }
          }
          return false;
        };

        return (
          <div className="bg-white border-4 border-slate-900 p-5 shadow-[6px_6px_0px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base">{isCurrentlyActiveBreed ? '💖' : '📖'}</span>
                  <h3 className="font-extrabold text-slate-900 text-md">
                    {isEggAndUnhatched ? '???' : isDiscovered ? activePetInfo.name : '??? (미지의 반려동물)'}
                  </h3>
                  {isEggAndUnhatched ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 border rounded uppercase bg-slate-100 border-slate-300 text-slate-400">
                      속성 대기 (PENDING)
                    </span>
                  ) : isDiscovered ? (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 border rounded uppercase ${elementClasses[activePetInfo.element]}`}>
                      {elementNamesKOR[activePetInfo.element]}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 border rounded uppercase bg-slate-100 border-slate-300 text-slate-400">
                      속성 잠금 (LOCKED)
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-xs mt-1.5 font-medium leading-relaxed max-w-lg">
                  {isEggAndUnhatched 
                    ? '아직 알에서 부화하지 않은 신비로운 반려동물입니다! 오늘의 일정(독서, 운동, 공부 등)을 성실히 완료하여 EXP와 신뢰감을 쌓으면 곧 건강히 깨어날 것입니다.'
                    : isDiscovered 
                      ? activePetInfo.description 
                      : '아직 이 속성의 펫과 인연을 맺지 못했습니다. 새로운 알을 입양하고 성체로 키워 도감을 채워보세요!'}
                </p>
              </div>
              {isCurrentlyActiveBreed && (
                <span className="bg-emerald-100 border-2 border-emerald-500 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded shadow-[1px_1px_0px_rgba(0,0,0,0.15)] shrink-0">
                  현재 파트너 (ACTIVE)
                </span>
              )}
            </div>

            {/* Stats Section */}
            <div className="bg-slate-50 border border-slate-200 p-3 mb-6">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">초기 능력치 (INITIAL STATS)</h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-[10px] font-extrabold text-rose-500">체력</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">
                    {isDiscovered && !isEggAndUnhatched ? activePetInfo.initialStats.vitality : '?'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-sky-500">지식</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">
                    {isDiscovered && !isEggAndUnhatched ? activePetInfo.initialStats.wisdom : '?'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-emerald-500">집중</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">
                    {isDiscovered && !isEggAndUnhatched ? activePetInfo.initialStats.focus : '?'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-amber-500">관계</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">
                    {isDiscovered && !isEggAndUnhatched ? activePetInfo.initialStats.connection : '?'}
                  </div>
                </div>
              </div>
            </div>

            {/* Stages Timeline Grid */}
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">성장 단계 (EVOLUTION STAGES)</h4>
            <div className="space-y-3">
              {Object.entries(activePetInfo.stages).map(([stage, visualVal]) => {
                const evStage = stage as EvolutionStage;
                const isUserStage = isCurrentlyActiveBreed && profile.evolutionStage === evStage;
                const isEgg = evStage === EvolutionStage.EGG;
                const visible = isStageVisible(evStage);

                return (
                  <div 
                    key={evStage}
                    className={`flex gap-4 items-center p-3 border-2 transition-colors
                      ${isUserStage 
                        ? 'border-rose-400 bg-rose-50/50' 
                        : 'border-slate-100 bg-slate-50/20'
                      }`}
                  >
                    {/* Visual Container */}
                    <div className="w-12 h-12 bg-white border border-slate-300 flex items-center justify-center shrink-0 overflow-hidden shadow-inner p-1">
                      {!visible ? (
                        <span className="text-xl font-bold text-slate-300 select-none">❓</span>
                      ) : isEgg ? (
                        <PixelEgg 
                          rarity={(isCurrentlyActiveBreed ? profile.eggRarity : EggRarity.COMMON) as EggRarity || EggRarity.COMMON} 
                          color={activePetInfo.color} 
                          size="sm" 
                        />
                      ) : (visualVal.startsWith('/') || visualVal.startsWith('http')) ? (
                        <img 
                          src={visualVal} 
                          alt={stageNamesKOR[evStage]} 
                          className="w-full h-full object-contain image-pixelated"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-2xl select-none filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]">
                          {visualVal}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800">
                          {visible ? stageNamesKOR[evStage] : '???'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {stageRequirements[evStage]}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
                        {!visible ? (
                          '아직 이 성장 단계에 진입하지 못해 모습을 볼 수 없습니다.'
                        ) : isUserStage ? (
                          '우리 단짝이 힘차게 활동 중인 소중한 현재 성장 단계입니다! 🥰' 
                        ) : (
                          `${isEggAndUnhatched ? '???' : activePetInfo.name.split(' (')[0]} 종의 전형적인 발달 상태를 보여줍니다.`
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
