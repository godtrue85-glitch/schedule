import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, X } from 'lucide-react';
import { QuestDifficulty, QuestCategory } from '../types';
import { getTranslation, Language } from '../lib/translations';

interface QuestFormProps {
  onAdd: (quest: any) => void;
  onClose: () => void;
  language: Language;
}

const QuestForm: React.FC<QuestFormProps> = ({ onAdd, onClose, language }) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>(QuestDifficulty.MEDIUM);
  const [category, setCategory] = useState<QuestCategory>(QuestCategory.MISC);

  const t = (key: string) => getTranslation(key, language);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, difficulty, category });
    setTitle('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 border-8 border-slate-900 relative max-w-md mx-auto shadow-[12px_12px_0px_rgba(0,0,0,0.2)]"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 font-bold text-2xl">
        ×
      </button>

      <h3 className="text-lg pixel-title text-slate-900 mb-6 uppercase">{t('new_goal')}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('activity_name')}</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={language === 'ko' ? '예: 책독서 30분, 아침 운동' : 'E.g. Clean my desk'} 
            className="w-full bg-slate-50 border-4 border-slate-900 p-3 text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:bg-amber-50 transition-colors text-lg"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('difficulty')}</label>
            <select 
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as QuestDifficulty)}
              className="w-full bg-slate-50 border-4 border-slate-900 p-3 text-slate-800 font-bold focus:outline-none text-md appearance-none"
            >
              <option value={QuestDifficulty.EASY}>
                {language === 'ko' ? '쉬움 (간단하고 가벼운 일)' : 'EASY (QUICK)'}
              </option>
              <option value={QuestDifficulty.MEDIUM}>
                {language === 'ko' ? '보통 (일반적인 일과)' : 'NORMAL (REGULAR)'}
              </option>
              <option value={QuestDifficulty.HARD}>
                {language === 'ko' ? '어려움 (정신적/체력적 도전)' : 'HARD (CHALLENGE)'}
              </option>
              <option value={QuestDifficulty.EPIC}>
                {language === 'ko' ? '전설적 (아주 정성이 필요한 목표)' : 'EPIC (BIG GOAL)'}
              </option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('category')}</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as QuestCategory)}
              className="w-full bg-slate-50 border-4 border-slate-900 p-3 text-slate-800 font-bold focus:outline-none text-md appearance-none"
            >
              <option value={QuestCategory.WORK}>
                {language === 'ko' ? '업무 & 집중 (WORK)' : 'WORK / FOCUS'}
              </option>
              <option value={QuestCategory.STUDY}>
                {language === 'ko' ? '공부 & 학습 (STUDY)' : 'LEARNING'}
              </option>
              <option value={QuestCategory.HEALTH}>
                {language === 'ko' ? '자기관리 & 건강 (HEALTH)' : 'SELF-CARE'}
              </option>
              <option value={QuestCategory.SOCIAL}>
                {language === 'ko' ? '친목 & 대인관계 (SOCIAL)' : 'RELATIONSHIP'}
              </option>
              <option value={QuestCategory.MISC}>
                {language === 'ko' ? '기타 & 일반 (MISC)' : 'GENERAL'}
              </option>
            </select>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-rose-500 text-white pixel-title py-4 px-8 border-4 border-slate-900 shadow-[6px_6px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all text-sm"
        >
          {t('add_goal_btn')}
        </button>
      </form>
    </motion.div>
  );
};

export default QuestForm;
