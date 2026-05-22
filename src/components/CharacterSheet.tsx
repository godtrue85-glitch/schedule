import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, EvolutionStage } from '../types';
import { PET_DATA } from '../constants';
import PixelEgg, { EggRarity } from './PixelEgg';

interface CharacterSheetProps {
  user: UserProfile;
}

const ACCESSORIES_CONFIG: Record<string, { displayEmoji: string; className: string }> = {
  cool_hat: { displayEmoji: '🎩', className: 'absolute top-0.5 left-1/2 -translate-x-1/2 text-2xl select-none filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] z-10' },
  red_ribbon: { displayEmoji: '🎀', className: 'absolute bottom-1 right-1 text-2xl select-none filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] z-10' },
  hip_sunglasses: { displayEmoji: '🕶️', className: 'absolute top-[34%] left-1/2 -translate-x-1/2 text-[20px] select-none filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] z-10' },
  magic_crown: { displayEmoji: '👑', className: 'absolute -top-1 left-1/2 -translate-x-1/2 text-2xl select-none filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] z-10' },
  angel_halo: { displayEmoji: '✨', className: 'absolute top-0 left-1/2 -translate-x-1/2 text-2xl select-none text-amber-300 filter drop-shadow-[0_0_4px_#eab308] z-10' }
};

const CharacterSheet: React.FC<CharacterSheetProps> = ({ user }) => {
  const maxExp = user.maxExperience || 100;
  const currentExp = user.experience || 0;
  const rawPercentage = (currentExp / maxExp) * 100;
  const expPercentage = isNaN(rawPercentage) ? 0 : Math.min(100, Math.max(0, rawPercentage));
  const petInfo = PET_DATA[user.petType];
  const isEgg = user.evolutionStage === EvolutionStage.EGG;

  return (
    <div className="bg-white p-6 border-4 border-slate-900 shadow-[6px_6px_0px_rgba(0,0,0,0.1)] flex flex-col items-center">
      <div className="flex w-full gap-4 items-center mb-6">
        <div className="relative shrink-0">
          <div className="relative w-24 h-24 bg-slate-50 border-2 border-slate-900 flex items-center justify-center overflow-hidden shadow-inner">
            {isEgg ? (
              <PixelEgg 
                rarity={(user.eggRarity as EggRarity) || EggRarity.COMMON} 
                color={user.eggColor || '#slate-400'} 
                size="sm" 
              />
            ) : (
              <img 
                src={user.avatarUrl} 
                alt={user.displayName} 
                className="w-full h-full object-contain p-2 image-pixelated"
                referrerPolicy="no-referrer"
              />
            )}

            {/* Accessory Overlay */}
            {user.equippedAccessory && ACCESSORIES_CONFIG[user.equippedAccessory] && (
              <span className={ACCESSORIES_CONFIG[user.equippedAccessory].className}>
                {ACCESSORIES_CONFIG[user.equippedAccessory].displayEmoji}
              </span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white w-8 h-8 flex items-center justify-center font-bold text-xs border-2 border-slate-900 shadow-[2px_2px_0px_#000]">
            {user.level || 1}
          </div>
        </div>
        
        <div className="flex-1 min-w-0 text-left">
          <h2 className="text-lg pixel-title text-slate-900 mb-1 truncate">{user.displayName}</h2>
          <div className="inline-block bg-amber-400 border-2 border-slate-900 px-2.5 py-0.5 text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-1">
            {user.evolutionStage}
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tight truncate">{petInfo?.name || 'Unknown'}</p>
        </div>
      </div>

      <div className="w-full mb-6 px-1">
        <div className="flex justify-between mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>EXPERIENCE</span>
          <span>{currentExp} / {maxExp}</span>
        </div>
        <div className="h-4 bg-slate-100 border-2 border-slate-900 overflow-hidden p-[2px]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${expPercentage}%` }}
            className="h-full bg-amber-300 border-r-2 border-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 w-full">
        <StatItem label="체력" value={user.stats?.vitality} color="text-rose-500" />
        <StatItem label="지식" value={user.stats?.wisdom} color="text-sky-500" />
        <StatItem label="집중" value={user.stats?.focus} color="text-emerald-500" />
        <StatItem label="관계" value={user.stats?.connection} color="text-amber-500" />
      </div>
    </div>
  );
};

const StatItem = ({ label, value, color }: { label: string, value: number | undefined, color: string }) => {
  const displayValue = value === undefined || value === null || isNaN(value) ? 0 : value;
  return (
    <div className="bg-slate-50 border border-slate-900 p-1.5 flex flex-col items-center">
      <span className={`text-[10px] font-bold uppercase tracking-widest ${color} mb-0.5`}>{label}</span>
      <span className="text-sm font-black text-slate-900">{displayValue}</span>
    </div>
  );
};

export default CharacterSheet;
