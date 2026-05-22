import { PetType, EvolutionStage } from './types';

export const PET_DATA: Record<string, {
  name: string;
  element: 'fire' | 'water' | 'earth' | 'wind';
  color: string;
  description: string;
  stages: Record<EvolutionStage, string>;
  initialStats: { vitality: number; wisdom: number; focus: number; connection: number; };
}> = {
  [PetType.MALTESE]: {
    name: '하얀 도화지 말티즈 (Maltese)',
    element: 'water',
    color: '#38BDF8',
    description: '눈처럼 하얗고 귀여운 소형견으로 사람을 너무 좋아하는 사랑스러운 단짝 친구입니다.',
    stages: {
      [EvolutionStage.EGG]: '💧',
      [EvolutionStage.HATCHLING]: '🐶',
      [EvolutionStage.TEEN]: '🐶🐾',
      [EvolutionStage.ADULT]: '🐕',
    },
    initialStats: { vitality: 5, wisdom: 6, focus: 5, connection: 10 }
  },
  [PetType.HUSKY]: {
    name: '용감무쌍 시베리안 허스키 (Husky)',
    element: 'fire',
    color: '#F43F5E',
    description: '늠름한 눈동자 뒤에 활기를 숨겨둔 멋진 사막여우와 같은 강인한 탐험견입니다.',
    stages: {
      [EvolutionStage.EGG]: '🔥',
      [EvolutionStage.HATCHLING]: '🐺',
      [EvolutionStage.TEEN]: '🦊🐾',
      [EvolutionStage.ADULT]: '🐕‍🦺',
    },
    initialStats: { vitality: 10, wisdom: 5, focus: 6, connection: 5 }
  },
  [PetType.CORGI]: {
    name: '식빵 엉덩이 웰시코기 (Corgi)',
    element: 'water',
    color: '#0EA5E9',
    description: '짧은 다리로 쫑긋쫑긋 걷는 치명적인 귀여움의 소유자로, 넘치는 열정을 가지고 있습니다.',
    stages: {
      [EvolutionStage.EGG]: '💧',
      [EvolutionStage.HATCHLING]: '🐾',
      [EvolutionStage.TEEN]: '🐶',
      [EvolutionStage.ADULT]: '🦮',
    },
    initialStats: { vitality: 7, wisdom: 4, focus: 5, connection: 10 }
  },
  [PetType.SCOTTISH_FOLD]: {
    name: '귀가 접힌 스코티시 폴드 (Scottish Fold)',
    element: 'water',
    color: '#60A5FA',
    description: '귀여운 접힌 귀와 크고 둥근 눈이 매력적이며, 차분하면서도 애교 가득한 정 많은 냥이입니다.',
    stages: {
      [EvolutionStage.EGG]: '💧',
      [EvolutionStage.HATCHLING]: '😺',
      [EvolutionStage.TEEN]: '🐱',
      [EvolutionStage.ADULT]: '🐈',
    },
    initialStats: { vitality: 6, wisdom: 8, focus: 4, connection: 8 }
  },
  [PetType.PERSIAN]: {
    name: '우아한 페르시안 고양이 (Persian Cat)',
    element: 'wind',
    color: '#C084FC',
    description: '부드러운 하얀 털을 가졌으며, 우아하고 귀족적인 눈빛으로 조용히 곁을 지키는 솜사탕 친구입니다.',
    stages: {
      [EvolutionStage.EGG]: '🌫️',
      [EvolutionStage.HATCHLING]: '🐱',
      [EvolutionStage.TEEN]: '🐈',
      [EvolutionStage.ADULT]: '🦁',
    },
    initialStats: { vitality: 4, wisdom: 10, focus: 6, connection: 6 }
  },
  [PetType.SIAMESE]: {
    name: '수다쟁이 샴 고양이 (Siamese Cat)',
    element: 'water',
    color: '#06B6D4',
    description: '검은 장화와 귀여운 마스크를 쓴 고양이로, 호기심이 엄청나고 주인과 교감하는 것을 좋아합니다.',
    stages: {
      [EvolutionStage.EGG]: '💧',
      [EvolutionStage.HATCHLING]: '🐈',
      [EvolutionStage.TEEN]: '😼',
      [EvolutionStage.ADULT]: '🐈‍⬛',
    },
    initialStats: { vitality: 5, wisdom: 7, focus: 6, connection: 8 }
  },
  [PetType.FERRET]: {
    name: '장난꾸러기 긴허리 페럿 (Ferret)',
    element: 'wind',
    color: '#E9D5FF',
    description: '작은 구멍도 쏙쏙 잘 헤엄치듯 빠져나가는 장난기 가득하고 유연한 가을 바람 같은 친구입니다.',
    stages: {
      [EvolutionStage.EGG]: '🌫️',
      [EvolutionStage.HATCHLING]: '🐭',
      [EvolutionStage.TEEN]: '🐹',
      [EvolutionStage.ADULT]: '🦦',
    },
    initialStats: { vitality: 6, wisdom: 4, focus: 10, connection: 6 }
  },
  [PetType.HAMSTER]: {
    name: '볼때기 가득 골든 햄스터 (Hamster)',
    element: 'earth',
    color: '#4ADE80',
    description: '볼 주머니 가득 해바라기씨를 넣은 채 쳇바퀴를 굴리는 작고 앙증맞은 대지의 파수꾼입니다.',
    stages: {
      [EvolutionStage.EGG]: '🌱',
      [EvolutionStage.HATCHLING]: '🐭',
      [EvolutionStage.TEEN]: '🐹',
      [EvolutionStage.ADULT]: '🐿️',
    },
    initialStats: { vitality: 4, wisdom: 6, focus: 10, connection: 6 }
  },
  [PetType.HEDGEHOG]: {
    name: '가시 방패 고슴도치 (Hedgehog)',
    element: 'earth',
    color: '#22C55E',
    description: '부끄러우면 몸을 동그랗게 밤송이처럼 말지만, 친해지면 여린 배를 깜찍하게 보여줍니다.',
    stages: {
      [EvolutionStage.EGG]: '🌱',
      [EvolutionStage.HATCHLING]: '🐭',
      [EvolutionStage.TEEN]: '🦔',
      [EvolutionStage.ADULT]: '🦔🌵',
    },
    initialStats: { vitality: 8, wisdom: 6, focus: 8, connection: 4 }
  },
  [PetType.RABBIT]: {
    name: '별나라 토끼 (Rabbit)',
    element: 'wind',
    color: '#A855F7',
    description: '귀를 쫑긋거리며 가벼운 점프로 구름 위를 날아다닐 것같이 기운찬 행운의 토끼입니다.',
    stages: {
      [EvolutionStage.EGG]: '🌫️',
      [EvolutionStage.HATCHLING]: '🐇',
      [EvolutionStage.TEEN]: '🐰',
      [EvolutionStage.ADULT]: '🐇🌟',
    },
    initialStats: { vitality: 5, wisdom: 5, focus: 8, connection: 8 }
  },
  [PetType.RED_PANDA]: {
    name: '앙증폭발 레서판다 (Red Panda)',
    element: 'fire',
    color: '#FB923C',
    description: '경쟁적인 귀여움으로 적을 놀래켜 항복하게 만드는 신비롭고 사랑스런 위협 사냥꾼입니다.',
    stages: {
      [EvolutionStage.EGG]: '🔥',
      [EvolutionStage.HATCHLING]: '🐾',
      [EvolutionStage.TEEN]: '🦊',
      [EvolutionStage.ADULT]: '🦝',
    },
    initialStats: { vitality: 6, wisdom: 5, focus: 5, connection: 10 }
  },
  [PetType.FENNEC_FOX]: {
    name: '바람의 귀 사막여우 (Fennec Fox)',
    element: 'wind',
    color: '#D946EF',
    description: '커다란 귀로 세상 만물의 고민을 다 들어주는 지혜롭고 영리한 사막에서 온 바람의 정령입니다.',
    stages: {
      [EvolutionStage.EGG]: '🌫️',
      [EvolutionStage.HATCHLING]: '🦊',
      [EvolutionStage.TEEN]: '🐺',
      [EvolutionStage.ADULT]: '🦊✨',
    },
    initialStats: { vitality: 5, wisdom: 9, focus: 7, connection: 5 }
  },
  [PetType.BEAR]: {
    name: '둥글둥글 아기곰 (Bear)',
    element: 'earth',
    color: '#10B981',
    description: '포근하고 듬직해서 언제든 폭 안겨 머리를 기댈 수 있는 산속 가을 같은 듬직한 곰 친구입니다.',
    stages: {
      [EvolutionStage.EGG]: '🌱',
      [EvolutionStage.HATCHLING]: '🧸',
      [EvolutionStage.TEEN]: '🐻',
      [EvolutionStage.ADULT]: '🐻🍯',
    },
    initialStats: { vitality: 10, wisdom: 4, focus: 7, connection: 5 }
  },
  [PetType.LION]: {
    name: '정글의 왕 아기사자 (Lion)',
    element: 'fire',
    color: '#F97316',
    description: '비록 지금은 초식 동물 같은 아기사자이지만 성체가 되면 뜨겁고 찬란한 가랑기를 소유하게 됩니다.',
    stages: {
      [EvolutionStage.EGG]: '🔥',
      [EvolutionStage.HATCHLING]: '🦁',
      [EvolutionStage.TEEN]: '🦁🔥',
      [EvolutionStage.ADULT]: '🦁👑',
    },
    initialStats: { vitality: 8, wisdom: 5, focus: 6, connection: 7 }
  },
  [PetType.TIGER]: {
    name: '호랑무늬 아기호랑이 (Tiger)',
    element: 'fire',
    color: '#EF4444',
    description: '카리스마 줄무늬로 어떤 몬스터든 기가 죽게 하며, 주인을 위해 앞장설 든든한 수호수입니다.',
    stages: {
      [EvolutionStage.EGG]: '🔥',
      [EvolutionStage.HATCHLING]: '🐯',
      [EvolutionStage.TEEN]: '🐅',
      [EvolutionStage.ADULT]: '🐯⚡',
    },
    initialStats: { vitality: 9, wisdom: 5, focus: 8, connection: 4 }
  },
  [PetType.OTTER]: {
    name: '뽀짝 물갈퀴 수달 (Otter)',
    element: 'water',
    color: '#2563EB',
    description: '물 위를 둥둥 떠다니며 조개를 꼭 가슴에 품고 다닐 정도로 수수하고 귀여운 물의 탐험가입니다.',
    stages: {
      [EvolutionStage.EGG]: '💧',
      [EvolutionStage.HATCHLING]: '🦦',
      [EvolutionStage.TEEN]: '🦦🌊',
      [EvolutionStage.ADULT]: '🦦🐚',
    },
    initialStats: { vitality: 6, wisdom: 6, focus: 6, connection: 8 }
  },
  [PetType.ALPACA]: {
    name: '풍성한 솜털 알파카 (Alpaca)',
    element: 'wind',
    color: '#EC4899',
    description: '구름이 실체화한 듯 보송보송한 고산지대의 인싸 동물로, 마주하면 절로 미소가 지어집니다.',
    stages: {
      [EvolutionStage.EGG]: '🌫️',
      [EvolutionStage.HATCHLING]: '🐑',
      [EvolutionStage.TEEN]: '🦙',
      [EvolutionStage.ADULT]: '🦙☁️',
    },
    initialStats: { vitality: 5, wisdom: 5, focus: 5, connection: 11 }
  },
  [PetType.PANDA]: {
    name: '뒹굴뒹굴 자이언트 판다 (Panda)',
    element: 'earth',
    color: '#16A34A',
    description: '대나무를 아주 맛있게 먹고 데굴데굴 구르며 치유의 에너지를 마구 발산하는 포근한 대지속 판다입니다.',
    stages: {
      [EvolutionStage.EGG]: '🌱',
      [EvolutionStage.HATCHLING]: '🐼',
      [EvolutionStage.TEEN]: '🐼🎍',
      [EvolutionStage.ADULT]: '🐼🎋',
    },
    initialStats: { vitality: 10, wisdom: 5, focus: 5, connection: 6 }
  },
  [PetType.PENGUIN]: {
    name: '디뚱 뒤뚱 아기펭귄 (Penguin)',
    element: 'water',
    color: '#3B82F6',
    description: '추운 극지방에서도 얼음을 미끄럼 타며 활발하게 살아가는 겨울 바다의 지치지 않는 귀염둥이입니다.',
    stages: {
      [EvolutionStage.EGG]: '💧',
      [EvolutionStage.HATCHLING]: '🐧',
      [EvolutionStage.TEEN]: '🐧❄️',
      [EvolutionStage.ADULT]: '🐧👑',
    },
    initialStats: { vitality: 7, wisdom: 6, focus: 7, connection: 6 }
  },
  [PetType.KOALA]: {
    name: '유칼립투스 단짝 코알라 (Koala)',
    element: 'earth',
    color: '#84CC16',
    description: '나무를 꼭 붙잡아 떨어지지 않는 엄청난 악력의 아늑한 귀여움을 가졌으며 조용하고 느긋합니다.',
    stages: {
      [EvolutionStage.EGG]: '🌱',
      [EvolutionStage.HATCHLING]: '🐨',
      [EvolutionStage.TEEN]: '🐨🌿',
      [EvolutionStage.ADULT]: '🐨🌳',
    },
    initialStats: { vitality: 6, wisdom: 5, focus: 9, connection: 6 }
  }
};

export const LEVEL_EXP_BASE = 100;
export const LEVEL_EXP_MULTIPLIER = 1.5;
