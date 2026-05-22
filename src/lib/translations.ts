/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'ko' | 'en';

export const translations: Record<Language, Record<string, string>> = {
  ko: {
    // Nav Tabs
    tab_pet: '펫',
    tab_shop: '상점',
    tab_collection: '도감',
    tab_achievements: '업적',
    tab_options: '설정',

    // Main Header
    level: 'LV.',
    logout: '모험 종료 (로그아웃)',
    loading_game: '게임을 불러오는 중...',

    // Pet Tab / Character Sheet
    daily_routine: '일일 계획 루틴',
    create_first_goal: '첫 번째 일정 등록하기',
    waiting_next_goal: '펫이 다음 일정을 조용히 기다리는 중입니다.',
    experience: '경험치',
    vitality: '체력',
    wisdom: '지식',
    focus: '집중',
    connection: '관계',

    // Add Quest Modal
    new_goal: '새로운 일정 등록',
    activity_name: '일정 내용 (예: 독서 30분, 운동)',
    activity_placeholder: '일정 제목 입력...',
    difficulty: '난이도',
    category: '카테고리',
    add_goal_btn: '일정 등록하기',
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
    epic: '전설적',
    work: '업무',
    study: '공부',
    health: '건강',
    social: '친목',
    misc: '기타',

    // Shop Tab
    pet_shop: '펫 상점',
    purchase_effect: '효과',
    buy_capsule: '구입',
    equipped: '착용',
    equip: '장착',
    unequip: '해제',
    insufficient_gold: '골드가 부족함',
    bought: '보유함',

    // Collection Tab
    pet_book: '반려동물 도감',
    active_pet: '동반 중',
    discovered_pets: '발견된 펫',
    locked_element: '속성 잠금 (LOCKED)',
    partner: '현재 파트너 (ACTIVE)',
    initial_stats: '초기 능력치',
    growth_stages: '성장 단계',
    stage_egg: '알 (EGG)',
    stage_baby: '아기 (BABY)',
    stage_teen: '소년 (TEEN)',
    stage_adult: '성체 (ADULT)',
    stage_req: '진입 조건: 레벨',
    stage_not_reached: '아직 이 성장 단계에 진입하지 못해 모습을 볼 수 없습니다.',
    stage_current: '현재 성장 상태입니다. 당신의 책임감의 결실을 기뻐하십시오.',
    stage_completed: '성장을 완료한 소중한 기억입니다.',
    stage_locked: '정성을 쏟아 다음 성장 단계로 인도해보세요!',

    // Achievements Tab
    achievements: '특별 업적',
    trophies: '업적 트로피',
    claim_reward: '보상령 획득',
    claimed: '축 완료',

    // Options/Settings Tab
    settings_title: '게임 옵션 설정',
    settings_general: '일반 설정 (GENERAL)',
    sound_effects: '효과음 (SFX)',
    bg_music: '배경음악 (MUSIC)',
    haptic: '햅틱 진동 효과',
    language: '언어 (LANGUAGE)',
    theme: '테마 선택 (THEME)',
    on: '켜짐 (ON)',
    off: '꺼짐 (OFF)',
    theme_cream: '따뜻한 크림 (CREAM)',
    theme_slate: '차분한 차콜 (CHARCOAL)',
    theme_retro: '클래식 레트로 (RETRO)',
    settings_info: '시스템 정보 (INFO)',
    player_id: '플레이어 ID',
    sync_status: '서버동기화 상태',
    sync_live: '연결정상 (LIVE)',
    developer: '개발 정보',
    save_changes: '설정 저장 완료',

    // Toasts/Sounds
    toast_buy: '물품이 귀여운 가방에 추가되었습니다! 💰',
    toast_equip: '액세서리를 단장했습니다! ✨',
    toast_level_up: '빛나는 지혜와 함께 레벨이 상승했습니다! 🎉',
  },
  en: {
    // Nav Tabs
    tab_pet: 'Pet',
    tab_shop: 'Shop',
    tab_collection: 'Book',
    tab_achievements: 'Trophy',
    tab_options: 'Options',

    // Main Header
    level: 'LV.',
    logout: 'EXIT ADVENTURE (LOGOUT)',
    loading_game: 'Loading Game...',

    // Pet Tab / Character Sheet
    daily_routine: 'DAILY ROUTINE',
    create_first_goal: 'Create First Goal',
    waiting_next_goal: 'Your friend is waiting for your next goal!',
    experience: 'EXPERIENCE',
    vitality: 'Health',
    wisdom: 'Knowledge',
    focus: 'Focus',
    connection: 'Relationship',

    // Add Quest Modal
    new_goal: 'NEW GOAL',
    activity_name: 'ACTIVITY NAME',
    activity_placeholder: 'Enter activity title...',
    difficulty: 'DIFFICULTY',
    category: 'CATEGORY',
    add_goal_btn: 'ADD GOAL TO LIST',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    epic: 'Epic',
    work: 'Work',
    study: 'Study',
    health: 'Health',
    social: 'Social',
    misc: 'Misc',

    // Shop Tab
    pet_shop: 'PET SHOP',
    purchase_effect: 'Benefit',
    buy_capsule: 'Purchase',
    equipped: 'Equipped',
    equip: 'Equip',
    unequip: 'Remove',
    insufficient_gold: 'NO GOLD',
    bought: 'Owned',

    // Collection Tab
    pet_book: 'PET BOOK',
    active_pet: 'ACTIVE',
    discovered_pets: 'Discovered',
    locked_element: 'ELEMENT LOCKED',
    partner: 'ACTIVE PARTNER',
    initial_stats: 'INITIAL STATS',
    growth_stages: 'EVOLUTION STAGES',
    stage_egg: 'Egg',
    stage_baby: 'Hatchling',
    stage_teen: 'Teen',
    stage_adult: 'Adult',
    stage_req: 'Requires level',
    stage_not_reached: 'This evolution stage has not been reached yet.',
    stage_current: 'Currently in this stage. Rejoice at the fruit of your responsibility!',
    stage_completed: 'A beautiful memory of completed growth.',
    stage_locked: 'Pour focus to cultivate and guide to the next evolution stage!',

    // Achievements Tab
    achievements: 'ACHIEVEMENTS',
    trophies: 'TROPHIES',
    claim_reward: 'Claim Reward',
    claimed: 'Claimed',

    // Options/Settings Tab
    settings_title: 'SETTINGS',
    settings_general: 'GENERAL SETTINGS',
    sound_effects: 'Sound Effects (SFX)',
    bg_music: 'Background Music (MUSIC)',
    haptic: 'Tactile Shake (Haptic)',
    language: 'Language',
    theme: 'Color Theme',
    on: 'ON',
    off: 'OFF',
    theme_cream: 'Warm Cream',
    theme_slate: 'Dark Charcoal',
    theme_retro: 'Classic Retro',
    settings_info: 'SYSTEM INFO',
    player_id: 'Player ID',
    sync_status: 'Sync Server Status',
    sync_live: 'CONNECTED (LIVE)',
    developer: 'Developer Info',
    save_changes: 'Settings Saved',

    // Toasts/Sounds
    toast_buy: 'Item added to your inventory! 💰',
    toast_equip: 'Equipped item! ✨',
    toast_level_up: 'Level increased with shining wisdom! 🎉',
  }
};

export const getTranslation = (key: string, lang: Language): string => {
  return translations[lang]?.[key] ?? translations['en']?.[key] ?? key;
};
