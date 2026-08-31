/**
 * Numerology Module - Jyotisha
 * Contains calculations for Life Path, Destiny, Soul Urge, and Personality numbers.
 */

const LETTER_VALUES = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9
};

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

// Reduce a number to a single digit, preserving Master Numbers (11, 22, 33)
export function reduceNumber(num, preserveMaster = true) {
  let current = num;
  while (current > 9) {
    if (preserveMaster && (current === 11 || current === 22 || current === 33)) {
      break;
    }
    current = String(current)
      .split('')
      .map(Number)
      .reduce((sum, digit) => sum + digit, 0);
  }
  return current;
}

// Calculate Life Path Number based on birth date (YYYY-MM-DD)
export function calculateLifePath(dobString) {
  if (!dobString) return null;
  const parts = dobString.split('-');
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  const reducedYear = reduceNumber(year, false);
  const reducedMonth = reduceNumber(month, false);
  const reducedDay = reduceNumber(day, false);

  const total = reducedYear + reducedMonth + reducedDay;
  const finalNum = reduceNumber(total, true);

  return {
    value: finalNum,
    breakdown: `${reducedMonth} (Month) + ${reducedDay} (Day) + ${reducedYear} (Year) = ${total} ➔ ${finalNum}`
  };
}

// Calculate Destiny, Soul Urge, and Personality Numbers from Full Name
export function calculateNameNumerology(fullName) {
  if (!fullName) return null;
  const sanitized = fullName.toLowerCase().replace(/[^a-z]/g, '');
  
  let destinySum = 0;
  let soulUrgeSum = 0;
  let personalitySum = 0;

  const letterDetails = [];

  for (let i = 0; i < sanitized.length; i++) {
    const char = sanitized[i];
    const val = LETTER_VALUES[char] || 0;
    destinySum += val;

    const isVowel = VOWELS.includes(char);
    if (isVowel) {
      soulUrgeSum += val;
    } else {
      personalitySum += val;
    }

    letterDetails.push({ char, val, type: isVowel ? 'vowel' : 'consonant' });
  }

  const destinyVal = reduceNumber(destinySum, true);
  const soulUrgeVal = reduceNumber(soulUrgeSum, true);
  const personalityVal = reduceNumber(personalitySum, true);

  return {
    destiny: {
      value: destinyVal,
      breakdown: `Sum of all letters (${destinySum}) ➔ ${destinyVal}`
    },
    soulUrge: {
      value: soulUrgeVal,
      breakdown: `Sum of vowels (${soulUrgeSum}) ➔ ${soulUrgeVal}`
    },
    personality: {
      value: personalityVal,
      breakdown: `Sum of consonants (${personalitySum}) ➔ ${personalityVal}`
    },
    letters: letterDetails
  };
}

// Numerology Readings database
export const NUMEROLOGY_READINGS = {
  1: {
    title: "The Pioneer & Leader",
    summary: "Symbolizes creation, independence, and pioneering spirit.",
    description: "You possess a powerful drive to lead and initiate. You are highly self-reliant, original, and filled with creative potential. You thrive when working independently and are naturally motivated to achieve. The challenge for a 1 is to avoid becoming overly self-centered or aggressive, channeling your intense drive instead into uplifting leadership and innovation.",
    career: "Entrepreneurship, management, engineering, creative design, or any role where you can run the show.",
    love: "Thrives with partners who respect your independence. Best matches: 3, 5, and 9."
  },
  2: {
    title: "The Diplomat & Peacemaker",
    summary: "Symbolizes cooperation, harmony, sensitivity, and balance.",
    description: "Your strength lies in your ability to cooperate, empathize, and bring peace to challenging situations. You are highly sensitive, intuitive, and detail-oriented. You work beautifully behind the scenes to keep things running smoothly. The challenge for a 2 is to avoid over-sensitivity, indecisiveness, and sacrificing your own needs to please others.",
    career: "Mediation, counseling, art, administration, public relations, and social work.",
    love: "Extremely romantic and dedicated. Best matches: 2, 4, 6, and 8."
  },
  3: {
    title: "The Creative & Expressive",
    summary: "Symbolizes creative expression, communication, and social connection.",
    description: "You are a radiant source of joy, humor, and self-expression. You possess a strong creative spark, whether in writing, art, speech, or music. You love socializing and lift the energy of any room you enter. The challenge for a 3 is maintaining focus and avoiding superficiality or scattered energy.",
    career: "Writing, acting, design, sales, marketing, public speaking, or entertainment.",
    love: "Brings fun and excitement to relationships. Best matches: 1, 5, and 7."
  },
  4: {
    title: "The Builder & Practical Worker",
    summary: "Symbolizes stability, structure, hard work, and reliability.",
    description: "You are the foundation of any endeavor. You value order, justice, and systematic thinking. You are incredibly loyal, grounded, and practical. Your dedication to your goals makes you capable of building long-lasting structures or systems. The challenge for a 4 is avoiding rigid thinking, stubborness, and a tendency to overwork.",
    career: "Architecture, banking, project management, law, accounting, or physical engineering.",
    love: "Loyal and supportive, seeking long-term security. Best matches: 2, 6, 7, and 8."
  },
  5: {
    title: "The Adventurer & Change Maker",
    summary: "Symbolizes freedom, adaptability, curiosity, and versatile talent.",
    description: "You are a free spirit who thrives on change, travel, and sensory experience. You are highly adaptable, quick-witted, and multi-talented. You love exploring new ideas, cultures, and philosophies. The challenge for a 5 is avoiding impulsivity, restlessness, and sensory overindulgence.",
    career: "Travel blogging, journalism, sales, consulting, events management, or translation.",
    love: "Needs excitement and space to explore. Best matches: 1, 3, and 7."
  },
  6: {
    title: "The Nurturer & Caregiver",
    summary: "Symbolizes responsibility, love, healing, and domestic harmony.",
    description: "You are naturally compassionate, protective, and service-oriented. You have a deep love for family, home, and community, and you seek to create beauty and comfort wherever you go. You are an excellent listener and advisor. The challenge for a 6 is finding boundaries to avoid taking on the weight of everyone else's problems.",
    career: "Teaching, medicine, counseling, interior design, hospitality, or community leadership.",
    love: "Deeply loyal, loving, and family-oriented. Best matches: 2, 4, 8, and 9."
  },
  7: {
    title: "The Seeker & Philosopher",
    summary: "Symbolizes analysis, spiritual search, intellect, and solitude.",
    description: "You are a deep thinker and a spiritual seeker. You love analyzing facts, solving mysteries, and uncovering underlying truths. You need solitude to recharge your batteries and process your deep thoughts. The challenge for a 7 is to avoid becoming emotionally detached, cynical, or suspicious of others.",
    career: "Scientific research, data analysis, astrology, psychology, coding, or theology.",
    love: "Prefers deep, intellectual and spiritual connections. Best matches: 3, 5, and 7."
  },
  8: {
    title: "The Powerhouse & Achiever",
    summary: "Symbolizes material success, authority, ambition, and karma.",
    description: "You are a natural executive with a great understanding of material success, finance, and organizational power. You have strong willpower and the capacity to manifest large-scale goals. You understand the balance between material gains and spiritual alignment. The challenge for an 8 is avoiding greed, control issues, or using force over others.",
    career: "Finance, real estate, politics, executive leadership, entrepreneurship, or law.",
    love: "Values strong, ambitious, and supportive partners. Best matches: 2, 4, 6, and 8."
  },
  9: {
    title: "The Humanitarian & Visionary",
    summary: "Symbolizes compassion, completion, artistic genius, and global concern.",
    description: "You are a selfless idealist with a deep desire to help the world. You are highly artistic, empathetic, and possess an open, global mindset. You are nearing the completion of a spiritual cycle and feel a deep pull towards healing and teaching. The challenge for a 9 is to avoid carrying the grief of the world and learning to let go of the past.",
    career: "Philanthropy, international relations, fine arts, healing arts, environmental protection.",
    love: "Deeply emotional and idealistic in love. Best matches: 1, 6, and 9."
  },
  11: {
    title: "Master Teacher & Intuitive (Master Number 11)",
    summary: "Symbolizes spiritual illumination, high intuition, and inspiration.",
    description: "As a Master Number 11, you are a channel for spiritual insight and high-vibrational energy. You are extremely intuitive, sensitive, and visionary. You are here to inspire others with your presence and insights. The challenge for an 11 is managing nervous tension, anxiety, and learning to ground your intense psychic sensitivity.",
    career: "Coaching, spiritual counseling, writing, psychic arts, innovation, or public advocacy.",
    love: "Deeply spiritual and empathetic, needs a grounded partner. Best matches: 2, 6, and 9."
  },
  22: {
    title: "Master Builder & Architect (Master Number 22)",
    summary: "Symbolizes manifesting large-scale dreams into material reality.",
    description: "As a Master Number 22, you possess the spiritual intuition of the 11 combined with the practical, grounded nature of the 4. You have the unique capacity to design and execute massive projects that benefit humanity. The challenge for a 22 is overcoming self-doubt and avoiding the trap of thinking too small.",
    career: "Large-scale entrepreneurship, urban planning, engineering, international business, or philanthropy.",
    love: "Needs a solid, reliable partner who can handle your large ambitions. Best matches: 4, 8, and 22."
  },
  33: {
    title: "Master Healer & Guide (Master Number 33)",
    summary: "Symbolizes universal love, spiritual elevation, and selfless service.",
    description: "As a Master Number 33, you represent the highest spiritual frequency of love and nurturing. You are here to teach, heal, and lead humanity towards compassion and understanding. You feel a massive responsibility for others. The challenge for a 33 is learning when to give and when to protect your own energy.",
    career: "Counseling, therapy, high-level teaching, humanitarian leadership, or artistic healing.",
    love: "Extremely loving and protective, seeks deep soul alignment. Best matches: 6, 9, and 33."
  }
};
