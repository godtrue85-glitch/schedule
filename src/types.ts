export enum PetType {
  MALTESE = 'Maltese',
  HUSKY = 'Husky',
  CORGI = 'Corgi',
  SCOTTISH_FOLD = 'Scottish Fold',
  PERSIAN = 'Persian Cat',
  SIAMESE = 'Siamese Cat',
  FERRET = 'Ferret',
  HAMSTER = 'Hamster',
  HEDGEHOG = 'Hedgehog',
  RABBIT = 'Rabbit',
  RED_PANDA = 'Red Panda',
  FENNEC_FOX = 'Fennec Fox',
  BEAR = 'Bear',
  LION = 'Lion',
  TIGER = 'Tiger',
  OTTER = 'Otter',
  ALPACA = 'Alpaca',
  PANDA = 'Panda',
  PENGUIN = 'Penguin',
  KOALA = 'Koala'
}

export enum EvolutionStage {
  EGG = '알 (EGG)',
  HATCHLING = '아기 (BABY)',
  TEEN = '소년 (TEEN)',
  ADULT = '성체 (ADULT)'
}

export enum QuestDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  EPIC = 'Epic'
}

export enum QuestCategory {
  WORK = 'Work',
  STUDY = 'Study',
  HEALTH = 'Health',
  SOCIAL = 'Social',
  MISC = 'Misc'
}

export enum QuestStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  FAILED = 'Failed'
}

export interface UserStats {
  vitality: number;
  wisdom: number;
  focus: number;
  connection: number;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  petType: PetType;
  evolutionStage: EvolutionStage;
  eggRarity?: string;
  eggColor?: string;
  level: number;
  experience: number;
  maxExperience: number;
  gold: number;
  stats: UserStats;
  avatarUrl?: string;
  equippedAccessory?: string;
  ownedAccessories?: string[];
  discoveredPets?: string[];
  claimedAchievements?: string[];
  dailyClaimedDate?: string;
  claimedDailyAchievements?: string[];
  createdAt: Date;
}

export interface Quest {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  category: QuestCategory;
  status: QuestStatus;
  rewardExp: number;
  rewardGold: number;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
}
