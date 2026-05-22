import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Clock, Laptop, Brain, Smile, Users, Coffee } from 'lucide-react';
import { Quest, QuestCategory, QuestStatus } from '../types';

interface QuestItemProps {
  quest: Quest;
  onComplete: (questId: string) => void;
  onDelete: (questId: string) => void;
}

const categoryIcons = {
  [QuestCategory.WORK]: <Laptop className="w-5 h-5 text-indigo-500" />,
  [QuestCategory.STUDY]: <Brain className="w-5 h-5 text-blue-500" />,
  [QuestCategory.HEALTH]: <Smile className="w-5 h-5 text-emerald-500" />,
  [QuestCategory.SOCIAL]: <Users className="w-5 h-5 text-pink-500" />,
  [QuestCategory.MISC]: <Coffee className="w-5 h-5 text-amber-600" />,
};

const difficultyColors = {
  Easy: 'bg-green-500/10 text-green-500 border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Hard: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  Epic: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const QuestItem: React.FC<QuestItemProps> = ({ quest, onComplete, onDelete }) => {
  const isCompleted = quest.status === QuestStatus.COMPLETED;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white p-4 border-4 border-slate-900 shadow-[6px_6px_0px_rgba(0,0,0,0.1)] flex items-center gap-4 group transition-colors ${isCompleted ? 'opacity-50 grayscale' : 'hover:bg-amber-50 active:translate-x-1 active:translate-y-1 active:shadow-none'}`}
    >
      <div className={`w-12 h-12 border-2 border-slate-900 flex items-center justify-center text-xl shrink-0 ${isCompleted ? 'bg-slate-100' : 'bg-slate-50 shadow-inner'}`}>
        {categoryIcons[quest.category]}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={`font-bold text-slate-900 text-lg tracking-tight leading-tight mb-0.5 truncate ${isCompleted ? 'line-through' : ''}`}>
          {quest.title}
        </h4>
        <div className="flex items-center gap-2">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">
            {isCompleted ? 'COMPLETED ✨' : `+${quest.rewardExp}xp`}
          </p>
          {!isCompleted && (
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
          )}
          {!isCompleted && (
            <p className="text-amber-500 font-bold text-xs">
              {quest.rewardGold}g
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button 
          onClick={() => !isCompleted && onComplete(quest.id)}
          className={`w-12 h-12 border-2 flex items-center justify-center transition-all active:scale-90 shadow-[4px_4px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5
            ${isCompleted 
              ? 'bg-green-500 border-slate-900 text-white' 
              : 'border-slate-900 bg-white hover:bg-green-100'
            }`}
        >
          <span className={`pixel-title text-[11px] ${isCompleted ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'}`}>DONE</span>
        </button>
      </div>
    </motion.div>
  );
};

export default QuestItem;
