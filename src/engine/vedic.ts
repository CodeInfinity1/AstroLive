// Vedic Astrology Engine — Deterministic mock logic based on real Vedic systems
// NOTE: This uses simplified but structurally accurate Vedic astrology calculations.
// In production, this would use a proper Swiss Ephemeris library.

export interface BirthData {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  place: string;
  gender?: 'male' | 'female' | 'other';
}

export interface VedicProfile {
  id: string;
  birthData: BirthData;
  moonSign: ZodiacSign;
  nakshatra: Nakshatra;
  nakshatraPada: number;
  sunSign: ZodiacSign;
  ascendant: ZodiacSign;
  planetaryPositions: PlanetPosition[];
  gunaScore: number; // 0-36 for Ashtakoota
  traits: string[];
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  rulingPlanet: string;
}

export interface PlanetPosition {
  planet: string;
  sign: ZodiacSign;
  degree: number;
  house: number;
}

export interface CompatibilityResult {
  overallScore: number; // 0-100
  gunaScore: number; // 0-36
  maxGuna: number; // 36
  categories: CompatibilityCategory[];
  strengths: string[];
  challenges: string[];
  bondType: string;
  bondDescription: string;
  dailyInsight: string;
  deepInsights: string[];
}

export interface CompatibilityCategory {
  name: string;
  nameHindi: string;
  score: number;
  maxScore: number;
  description: string;
  icon: string;
}

export type ZodiacSign = 
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' 
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type Nakshatra = 
  | 'Ashwini' | 'Bharani' | 'Krittika' | 'Rohini' | 'Mrigashira'
  | 'Ardra' | 'Punarvasu' | 'Pushya' | 'Ashlesha' | 'Magha'
  | 'Purva Phalguni' | 'Uttara Phalguni' | 'Hasta' | 'Chitra' | 'Swati'
  | 'Vishakha' | 'Anuradha' | 'Jyeshtha' | 'Mula' | 'Purva Ashadha'
  | 'Uttara Ashadha' | 'Shravana' | 'Dhanishta' | 'Shatabhisha'
  | 'Purva Bhadrapada' | 'Uttara Bhadrapada' | 'Revati';

const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const NAKSHATRAS: Nakshatra[] = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
  'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
  'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
};

const ZODIAC_ELEMENTS: Record<ZodiacSign, 'Fire' | 'Earth' | 'Air' | 'Water'> = {
  'Aries': 'Fire', 'Taurus': 'Earth', 'Gemini': 'Air', 'Cancer': 'Water',
  'Leo': 'Fire', 'Virgo': 'Earth', 'Libra': 'Air', 'Scorpio': 'Water',
  'Sagittarius': 'Fire', 'Capricorn': 'Earth', 'Aquarius': 'Air', 'Pisces': 'Water'
};

const ZODIAC_RULERS: Record<ZodiacSign, string> = {
  'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
  'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
  'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
};

const NAKSHATRA_RULERS: Record<string, string> = {
  'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun', 'Rohini': 'Moon',
  'Mrigashira': 'Mars', 'Ardra': 'Rahu', 'Punarvasu': 'Jupiter', 'Pushya': 'Saturn',
  'Ashlesha': 'Mercury', 'Magha': 'Ketu', 'Purva Phalguni': 'Venus',
  'Uttara Phalguni': 'Sun', 'Hasta': 'Moon', 'Chitra': 'Mars', 'Swati': 'Rahu',
  'Vishakha': 'Jupiter', 'Anuradha': 'Saturn', 'Jyeshtha': 'Mercury',
  'Mula': 'Ketu', 'Purva Ashadha': 'Venus', 'Uttara Ashadha': 'Sun',
  'Shravana': 'Moon', 'Dhanishta': 'Mars', 'Shatabhisha': 'Rahu',
  'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn', 'Revati': 'Mercury'
};

const ZODIAC_TRAITS: Record<ZodiacSign, string[]> = {
  'Aries': ['Bold Leader', 'Independent Spirit', 'Quick Decision Maker', 'Passionate Initiator'],
  'Taurus': ['Steadfast Guardian', 'Sensory Appreciator', 'Patient Builder', 'Loyal Companion'],
  'Gemini': ['Curious Mind', 'Versatile Communicator', 'Quick Wit', 'Social Connector'],
  'Cancer': ['Emotional Intuitive', 'Nurturing Protector', 'Deep Empath', 'Memory Keeper'],
  'Leo': ['Natural Performer', 'Generous Heart', 'Creative Force', 'Confident Inspirer'],
  'Virgo': ['Analytical Perfectionist', 'Practical Helper', 'Detail Observer', 'Quiet Achiever'],
  'Libra': ['Harmony Seeker', 'Aesthetic Eye', 'Fair Mediator', 'Social Grace'],
  'Scorpio': ['Intense Transformer', 'Psychological Depth', 'Unwavering Focus', 'Truth Seeker'],
  'Sagittarius': ['Freedom Explorer', 'Philosophical Mind', 'Optimistic Adventurer', 'Truth Speaker'],
  'Capricorn': ['Ambitious Strategist', 'Disciplined Achiever', 'Responsible Leader', 'Long-term Thinker'],
  'Aquarius': ['Visionary Rebel', 'Humanitarian Heart', 'Independent Thinker', 'Innovation Driver'],
  'Pisces': ['Creative Dreamer', 'Compassionate Soul', 'Spiritual Intuitive', 'Emotional Artist']
};

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

// Deterministic hash from birth data
function hashBirthData(data: BirthData): number {
  const str = `${data.date}-${data.time}-${data.place}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Seeded random number generator
function seededRandom(seed: number, index: number = 0): number {
  const x = Math.sin(seed + index * 9301) * 10000;
  return x - Math.floor(x);
}

export function generateProfile(data: BirthData): VedicProfile {
  const hash = hashBirthData(data);
  
  // Calculate moon sign from date (simplified — uses month + day deterministically)
  const dateParts = data.date.split('-').map(Number);
  const month = dateParts[1] || 1;
  const day = dateParts[2] || 1;
  
  // Vedic sidereal correction (~23 degrees behind tropical)
  // Simplified: shift by ~1 sign from Western
  const solarIndex = Math.floor(((month - 1) * 30 + day - 21 + 360) % 360 / 30);
  const sunSignIndex = ((solarIndex % 12) + 12) % 12;
  
  // Moon sign derived from hash (in real Vedic astrology, requires exact moon position)
  const moonSignIndex = (hash % 12);
  
  // Ascendant from time of birth
  const timeParts = (data.time || '12:00').split(':').map(Number);
  const hours = timeParts[0] || 12;
  const ascIndex = ((Math.floor(hours / 2) + sunSignIndex) % 12);
  
  // Nakshatra (27 nakshatras mapped to moon position)
  const nakshatraIndex = hash % 27;
  const nakshatraPada = (hash % 4) + 1;
  
  const moonSign = ZODIAC_SIGNS[moonSignIndex];
  const sunSign = ZODIAC_SIGNS[sunSignIndex];
  const ascendant = ZODIAC_SIGNS[ascIndex];
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  
  // Generate planetary positions
  const planetaryPositions: PlanetPosition[] = PLANETS.map((planet, i) => ({
    planet,
    sign: ZODIAC_SIGNS[(hash + i * 3) % 12],
    degree: Math.floor(seededRandom(hash, i) * 30),
    house: ((hash + i * 2) % 12) + 1,
  }));
  
  // Guna score for self (used in matching)
  const gunaScore = 18 + (hash % 19); // 18-36 range
  
  const id = `profile_${hash}`;
  
  return {
    id,
    birthData: data,
    moonSign,
    nakshatra,
    nakshatraPada,
    sunSign,
    ascendant,
    planetaryPositions,
    gunaScore,
    traits: ZODIAC_TRAITS[moonSign],
    element: ZODIAC_ELEMENTS[moonSign],
    rulingPlanet: ZODIAC_RULERS[moonSign],
  };
}

export function calculateCompatibility(profile1: VedicProfile, profile2: VedicProfile): CompatibilityResult {
  const combinedHash = hashBirthData(profile1.birthData) + hashBirthData(profile2.birthData);
  
  // Ashtakoota Guna Milan — 8 categories
  // Real system: Varna(1), Vashya(2), Tara(3), Yoni(4), Graha Maitri(5), Gana(3), Bhakoot(7), Nadi(8) = 36 max
  
  const categories: CompatibilityCategory[] = [
    {
      name: 'Varna',
      nameHindi: 'वर्ण',
      maxScore: 1,
      score: seededRandom(combinedHash, 1) > 0.4 ? 1 : 0,
      description: 'Spiritual compatibility and ego levels',
      icon: '🕉️',
    },
    {
      name: 'Vashya',
      nameHindi: 'वश्य',
      maxScore: 2,
      score: Math.floor(seededRandom(combinedHash, 2) * 3),
      description: 'Mutual attraction and dominance patterns',
      icon: '🧲',
    },
    {
      name: 'Tara',
      nameHindi: 'तारा',
      maxScore: 3,
      score: Math.floor(seededRandom(combinedHash, 3) * 4),
      description: 'Birth star compatibility and destiny alignment',
      icon: '⭐',
    },
    {
      name: 'Yoni',
      nameHindi: 'योनि',
      maxScore: 4,
      score: Math.floor(seededRandom(combinedHash, 4) * 5),
      description: 'Physical and intimate compatibility',
      icon: '🌊',
    },
    {
      name: 'Graha Maitri',
      nameHindi: 'ग्रह मैत्री',
      maxScore: 5,
      score: Math.floor(seededRandom(combinedHash, 5) * 6),
      description: 'Mental and intellectual compatibility',
      icon: '🧠',
    },
    {
      name: 'Gana',
      nameHindi: 'गण',
      maxScore: 6,
      score: Math.floor(seededRandom(combinedHash, 6) * 7),
      description: 'Temperament and behavioral harmony',
      icon: '🎭',
    },
    {
      name: 'Bhakoot',
      nameHindi: 'भकूट',
      maxScore: 7,
      score: Math.floor(seededRandom(combinedHash, 7) * 8),
      description: 'Emotional compatibility and love',
      icon: '💛',
    },
    {
      name: 'Nadi',
      nameHindi: 'नाडी',
      maxScore: 8,
      score: Math.floor(seededRandom(combinedHash, 8) * 9),
      description: 'Health compatibility and genetic harmony',
      icon: '🧬',
    },
  ];
  
  const gunaScore = categories.reduce((sum, c) => sum + c.score, 0);
  const maxGuna = 36;
  const overallScore = Math.round((gunaScore / maxGuna) * 100);
  
  // Bond type based on score
  let bondType: string;
  let bondDescription: string;
  if (overallScore >= 80) {
    bondType = 'Celestial Bond';
    bondDescription = 'An extraordinarily rare alignment. Your cosmic energies resonate at the deepest level — this is a connection written in the stars.';
  } else if (overallScore >= 65) {
    bondType = 'Cosmic Harmony';
    bondDescription = 'A beautifully aligned connection with strong foundations. Your energies complement each other naturally and create mutual growth.';
  } else if (overallScore >= 50) {
    bondType = 'Growing Bond';
    bondDescription = 'A connection with both strengths and growth areas. With awareness and effort, this bond can deepen into something powerful.';
  } else if (overallScore >= 35) {
    bondType = 'Dynamic Tension';
    bondDescription = 'A connection that thrives on creative friction. Your differences can become your greatest teachers if navigated with care.';
  } else {
    bondType = 'Karmic Lesson';
    bondDescription = 'A challenging but deeply transformative connection. This bond exists to teach both of you important life lessons.';
  }
  
  // Generate strengths and challenges
  const strengthPool = [
    `Your ${profile1.birthData.name}'s ${profile1.element} energy harmonizes with ${profile2.birthData.name}'s ${profile2.element} nature`,
    `${profile1.nakshatra} and ${profile2.nakshatra} create a powerful emotional resonance`,
    'Deep mutual understanding in communication styles',
    'Strong alignment in long-term goals and values',
    'Natural emotional attunement and empathy',
    'Complementary problem-solving approaches',
    'Shared appreciation for growth and learning',
    'Strong physical and energetic compatibility',
  ];
  
  const challengePool = [
    `${profile1.rulingPlanet} and ${profile2.rulingPlanet} can create occasional power dynamics`,
    'Different approaches to handling conflict may need attention',
    'Emotional processing speeds may differ — patience is key',
    'Decision-making styles could benefit from compromise',
    'Energy levels may fluctuate at different times',
    'Communication under stress needs conscious effort',
  ];
  
  const strengths = strengthPool
    .filter((_, i) => seededRandom(combinedHash, 20 + i) > 0.45)
    .slice(0, 3);
  
  const challenges = challengePool
    .filter((_, i) => seededRandom(combinedHash, 30 + i) > 0.5)
    .slice(0, 2);

  if (strengths.length === 0) strengths.push(strengthPool[0]);
  if (challenges.length === 0) challenges.push(challengePool[0]);
  
  // Daily insight based on current date
  const today = new Date();
  const dayHash = today.getDate() + today.getMonth() * 31 + combinedHash;
  const dailyInsights = [
    `Communication flows easily today between ${profile1.moonSign} and ${profile2.moonSign}. Share what's on your mind.`,
    `Today's lunar energy amplifies the emotional bond. Small gestures of care will resonate deeply.`,
    `A creative collaboration opportunity arises. Your combined ${profile1.element} and ${profile2.element} energies are especially potent.`,
    `Mercury's transit brings clarity to any unresolved conversations. It's a good day for honest dialogue.`,
    `Venus blesses your connection today. Prioritize quality time and shared experiences.`,
    `Today's planetary alignment encourages independence within your bond. Pursue individual goals while supporting each other.`,
    `The stars highlight your complementary strengths today. Lean into what each of you does best.`,
  ];
  
  const dailyInsight = dailyInsights[dayHash % dailyInsights.length];
  
  const deepInsights = [
    `The ${profile1.nakshatra}-${profile2.nakshatra} axis reveals a past-life karmic connection that continues to evolve in this lifetime.`,
    `Your Graha Maitri (planetary friendship) indicates a meeting of minds that deepens over time — intellectual compatibility is a cornerstone of this bond.`,
    `The Bhakoot alignment suggests complementary emotional needs — where one partner seeks security, the other provides adventure, creating balance.`,
    `Nadi compatibility indicates strong physical and energetic resonance. Your bodies and energies naturally synchronize.`,
    `The Gana alignment reveals matched temperaments — you process emotions at similar speeds, reducing friction in daily life.`,
  ];
  
  return {
    overallScore,
    gunaScore,
    maxGuna,
    categories,
    strengths,
    challenges,
    bondType,
    bondDescription,
    dailyInsight,
    deepInsights,
  };
}

export function getZodiacSymbol(sign: ZodiacSign): string {
  return ZODIAC_SYMBOLS[sign] || '✦';
}

export function getZodiacElement(sign: ZodiacSign): string {
  return ZODIAC_ELEMENTS[sign];
}

export function getNakshatraRuler(nakshatra: string): string {
  return NAKSHATRA_RULERS[nakshatra] || 'Unknown';
}

export function getDailyForecast(profile: VedicProfile): string {
  const today = new Date();
  const dayHash = today.getDate() + today.getMonth() * 31 + hashBirthData(profile.birthData);
  
  const forecasts = [
    `Your ${profile.nakshatra} energy is amplified today. Trust your instincts in professional decisions.`,
    `Moon transiting through a supportive house today. Emotional clarity comes easily — use it for important conversations.`,
    `${profile.rulingPlanet} receives a positive aspect today. Creative projects will flow effortlessly.`,
    `Today's energy favors introspection for ${profile.moonSign}. Journaling or meditation will reveal valuable insights.`,
    `A social opportunity aligns with your ${profile.element} nature today. New connections could be meaningful.`,
    `Financial decisions are favored by today's planetary alignment. Trust your ${profile.moonSign} intuition.`,
    `Your ${profile.nakshatra} ruler ${getNakshatraRuler(profile.nakshatra)} is strong today. Leadership moments await.`,
  ];
  
  return forecasts[dayHash % forecasts.length];
}

export function getBondDailyInsight(profile1: VedicProfile, profile2: VedicProfile): string {
  const combinedHash = hashBirthData(profile1.birthData) + hashBirthData(profile2.birthData);
  const today = new Date();
  const dayHash = today.getDate() + today.getMonth() * 31 + combinedHash;
  const dailyInsights = [
    `Communication flows easily today between ${profile1.moonSign} and ${profile2.moonSign}. Share what's on your mind.`,
    `Today's lunar energy amplifies the emotional bond. Small gestures of care will resonate deeply.`,
    `A creative collaboration opportunity arises. Your combined ${profile1.element} and ${profile2.element} energies are especially potent.`,
    `Mercury's transit brings clarity to any unresolved conversations. It's a good day for honest dialogue.`,
    `Venus blesses your connection today. Prioritize quality time and shared experiences.`,
    `Today's planetary alignment encourages independence within your bond. Pursue individual goals while supporting each other.`,
    `The stars highlight your complementary strengths today. Lean into what each of you does best.`,
  ];
  return dailyInsights[dayHash % dailyInsights.length];
}

export interface BondTimelineDay {
  dateLabel: string;
  isoDate: string;
  title: string;
  note: string;
  tone: 'auspicious' | 'steady' | 'sensitive';
}

export function getBondTimeline(profile1: VedicProfile, profile2: VedicProfile, days: number = 7): BondTimelineDay[] {
  const combinedHash = hashBirthData(profile1.birthData) + hashBirthData(profile2.birthData);
  const titles = [
    { title: 'Open conversation', tone: 'auspicious' as const, note: 'A light transit favors honest talk without defensiveness.' },
    { title: 'Shared focus', tone: 'steady' as const, note: 'Good day for a joint plan — errands, travel, or a decision.' },
    { title: 'Give space', tone: 'sensitive' as const, note: 'Energy runs independently. Support without crowding.' },
    { title: 'Warmth returns', tone: 'auspicious' as const, note: 'Small affection lands larger than usual. Make time together.' },
    { title: 'Practical alignment', tone: 'steady' as const, note: 'Money, logistics, and household rhythm are easier to sort.' },
    { title: 'Watch tone', tone: 'sensitive' as const, note: 'Misreads are more likely. Pause before reacting.' },
    { title: 'Creative spark', tone: 'auspicious' as const, note: `${profile1.element} and ${profile2.element} mix well for a new idea or outing.` },
  ];

  const out: BondTimelineDay[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const pick = titles[(combinedHash + d.getDate() + i * 3) % titles.length];
    out.push({
      dateLabel: i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      isoDate: d.toISOString().split('T')[0],
      title: pick.title,
      note: pick.note,
      tone: pick.tone,
    });
  }
  return out;
}

export function getWeeklyTheme(profile: VedicProfile): string {
  const today = new Date();
  const weekHash = Math.floor(today.getDate() / 7) + today.getMonth() * 4 + hashBirthData(profile.birthData);
  
  const themes = [
    'Inner Transformation',
    'Creative Expansion',
    'Relationship Deepening',
    'Career Momentum',
    'Spiritual Growth',
    'Financial Clarity',
    'Emotional Healing',
    'Bold New Beginnings',
  ];
  
  return themes[weekHash % themes.length];
}
