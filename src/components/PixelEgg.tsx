import React from 'react';

export enum EggRarity {
  COMMON = 'Common',
  PATTERN = 'Pattern',
  GOLD = 'Gold',
  RAINBOW = 'Rainbow'
}

interface PixelEggProps {
  rarity: EggRarity;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

const PixelEgg: React.FC<PixelEggProps> = ({ rarity, color, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-12 h-16',
    md: 'w-20 h-28',
    lg: 'w-32 h-44'
  };

  const getBackground = () => {
    switch (rarity) {
      case EggRarity.GOLD:
        return 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)';
      case EggRarity.RAINBOW:
        return 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)';
      case EggRarity.PATTERN:
        // Alternating stripes or dots could be done with multiple backgrounds
        return `repeating-linear-gradient(45deg, ${color}, ${color} 10px, #ffffff 10px, #ffffff 20px)`;
      default:
        return color;
    }
  };

  const isGradient = rarity !== EggRarity.COMMON;
  const backgroundStyle = isGradient 
    ? { backgroundImage: getBackground() } 
    : { backgroundColor: color };

  return (
    <div 
      className={`${sizeClasses[size]} relative border-4 border-slate-900 shadow-[4px_4px_0px_rgba(0,0,0,0.2)]`}
      style={{
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        ...backgroundStyle,
        backgroundSize: rarity === EggRarity.RAINBOW ? '200% 200%' : 'auto',
        animation: rarity === EggRarity.RAINBOW ? 'rainbow-flow 3s linear infinite' : 'none'
      }}
    >
      {/* Shine effect */}
      <div 
        className="absolute top-4 left-4 w-4 h-6 bg-white opacity-30 rounded-full"
        style={{ transform: 'rotate(-20deg)' }}
      />
      
      {rarity === EggRarity.GOLD && (
        <div className="absolute inset-0 animate-pulse opacity-50 bg-white/30 rounded-full mix-blend-overlay" />
      )}
      
      <style>{`
        @keyframes rainbow-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default PixelEgg;
