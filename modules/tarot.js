/**
 * Tarot Module - Jyotisha
 * Expanded 78-Card Tarot Deck (Major & Minor Arcana)
 * Dynamic Procedural SVG card artwork generator
 */

export function getRomanNumeral(num) {
  const roman = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
  return roman[num] || String(num);
}

// 22 hand-crafted Major Arcana Cards
const MAJOR_ARCANA = [
  {
    id: 0,
    name: "The Fool",
    uprightKeywords: ["New beginnings", "Spontaneity", "Faith", "Pure potential"],
    uprightMeaning: "You are standing at the edge of a new adventure. Leap with faith. Trust the universe and embrace the unknown. It is time to let go of fear and start fresh with an open heart.",
    reversedKeywords: ["Recklessness", "Risk-taking", "Holding back", "Disorganization"],
    reversedMeaning: "You may be acting impulsively or rushing into something without planning. Alternatively, fear of the unknown is blocking you from taking a necessary leap of faith.",
    svgDesign: `<circle cx="100" cy="120" r="40" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4,4"/><path d="M70,120 L130,120 M100,90 L100,150" stroke="currentColor" stroke-width="1.5"/><circle cx="100" cy="70" r="10" fill="currentColor"/><circle cx="65" cy="155" r="5" fill="currentColor"/><circle cx="135" cy="155" r="5" fill="currentColor"/>`
  },
  {
    id: 1,
    name: "The Magician",
    uprightKeywords: ["Manifestation", "Willpower", "Resourcefulness", "Skill"],
    uprightMeaning: "You have all the tools, resources, and energy you need to manifest your desires. Align your will with your actions, focus your intent, and create the reality you want.",
    reversedKeywords: ["Manipulation", "Unused talent", "Illusions", "Wasted energy"],
    reversedMeaning: "You are not applying your talents effectively, or you may be feel disconnected from your power. Watch out for deception or misdirection from yourself or others.",
    svgDesign: `<path d="M60,140 Q100,80 140,140 Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M100,70 L100,105" stroke="currentColor" stroke-width="2"/><path d="M90,75 L110,75" stroke="currentColor" stroke-width="1.5"/><circle cx="100" cy="62" r="6" fill="currentColor"/><circle cx="100" cy="130" r="12" fill="none" stroke="currentColor" stroke-width="1.5"/>`
  },
  {
    id: 2,
    name: "The High Priestess",
    uprightKeywords: ["Intuition", "Sacred knowledge", "Divine feminine", "Subconscious"],
    uprightMeaning: "Trust your inner voice. The answers you seek lie within, in your dreams and subconscious. Take time to sit in silence, reflect, and let your intuition guide your path.",
    reversedKeywords: ["Secrets", "Ignored intuition", "Superficiality", "Hidden motives"],
    reversedMeaning: "You are ignoring your intuition or inner guidance in favor of logical or external opinions. Take a step back, meditate, and reconnect with your inner wisdom.",
    svgDesign: `<path d="M70,150 L100,80 L130,150 Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M100,125 A 25,25 0 1,1 100,75 A 25,25 0 1,1 100,125" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="100" cy="100" r="10" fill="currentColor"/>`
  },
  {
    id: 3,
    name: "The Empress",
    uprightKeywords: ["Abundance", "Nature", "Nurturing", "Creativity"],
    uprightMeaning: "A period of growth, creativity, and abundance is blooming. Connect with nature, nurture your body and soul, and allow your creative projects to come to fruition.",
    reversedKeywords: ["Creative block", "Dependence", "Smothering", "Lack of growth"],
    reversedMeaning: "You are facing creative dry spells, feeling stagnant, or neglecting your own self-care. Do not try to control everything; let things grow organically.",
    svgDesign: `<circle cx="100" cy="95" r="30" fill="none" stroke="currentColor" stroke-width="2"/><path d="M100,125 L100,155 M85,140 L115,140" stroke="currentColor" stroke-width="2"/><circle cx="100" cy="95" r="12" fill="currentColor"/><path d="M60,95 H140 M100,55 V135" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2,2"/>`
  },
  {
    id: 4,
    name: "The Emperor",
    uprightKeywords: ["Authority", "Structure", "Solid foundation", "Protection"],
    uprightMeaning: "It is time to bring order, logic, and structure to your life. Take charge of your circumstances, set firm boundaries, and lead with stable, protective authority.",
    reversedKeywords: ["Control freak", "Domination", "Inefficiency", "Rigidity"],
    reversedMeaning: "An authority figure in your life is being overly rigid or controlling. Alternatively, you lack structure and discipline, causing your goals to fall apart.",
    svgDesign: `<rect x="70" y="80" width="60" height="60" fill="none" stroke="currentColor" stroke-width="2"/><path d="M100,50 L100,80 M70,110 L130,110" stroke="currentColor" stroke-width="1.5"/><polygon points="85,60 100,45 115,60" fill="currentColor"/>`
  },
  {
    id: 5,
    name: "The Hierophant",
    uprightKeywords: ["Tradition", "Spiritual wisdom", "Conformity", "Institutions"],
    uprightMeaning: "Seek wisdom from established paths, mentors, or traditional studies. Alignment with shared values or community beliefs will offer guidance and peace.",
    reversedKeywords: ["Rebellion", "Unconventionality", "New methods", "Dogma"],
    reversedMeaning: "It is time to question the status quo. Break free from restrictive traditions, find your own truth, and walk an unconventional spiritual path.",
    svgDesign: `<path d="M100,60 L100,150 M75,80 L125,80 M80,105 L120,105 M85,130 L115,130" stroke="currentColor" stroke-width="2.5"/><circle cx="100" cy="45" r="8" fill="currentColor"/>`
  },
  {
    id: 6,
    name: "The Lovers",
    uprightKeywords: ["Harmony", "Relationships", "Choices", "Alignment of values"],
    uprightMeaning: "You are experiencing deep connection, love, and alignment. This card also calls you to make choices based on your true core values, bringing internal harmony.",
    reversedKeywords: ["Disharmony", "Misalignment", "Bad choices", "Imbalance"],
    reversedMeaning: "There is tension in your relationships or a conflict between your head and heart. Realign with your personal ethics to make the correct decision.",
    svgDesign: `<path d="M100,130 C75,90 60,110 100,145 C140,110 125,90 100,130 Z" fill="currentColor"/><circle cx="85" cy="85" r="18" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="115" cy="85" r="18" fill="none" stroke="currentColor" stroke-width="1.5"/>`
  },
  {
    id: 7,
    name: "The Chariot",
    uprightKeywords: ["Victory", "Willpower", "Determination", "Control"],
    uprightMeaning: "Charge forward with determination and iron willpower. By mastering opposing forces, aligning your emotions with your intent, you will achieve victory.",
    reversedKeywords: ["Lack of direction", "Loss of control", "Aggression", "Obstacles"],
    reversedMeaning: "You are losing control of a situation or feel pulled in opposite directions. Pause, refocus, and regain your direction before moving forward.",
    svgDesign: `<polygon points="70,120 100,70 130,120" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="80" cy="140" r="12" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="120" cy="140" r="12" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="80" y1="140" x2="120" y2="140" stroke="currentColor" stroke-width="2"/>`
  },
  {
    id: 8,
    name: "Strength",
    uprightKeywords: ["Courage", "Inner strength", "Compassion", "Patience"],
    uprightMeaning: "True power does not lie in brute force, but in quiet inner strength, patience, and soft compassion. Calm your fears and tame your wild impulses with love.",
    reversedKeywords: ["Self-doubt", "Weakness", "Raw emotion", "Inadequacy"],
    reversedMeaning: "You are struggling with self-doubt, insecurity, or letting raw, uncontrolled emotions get the better of you. Connect with your inner gentleness.",
    svgDesign: `<path d="M80,100 C80,85 100,85 100,100 C100,115 120,115 120,100 C120,85 140,85 140,100 C140,115 120,130 100,110 C80,130 60,115 80,100 Z" fill="none" stroke="currentColor" stroke-width="2" transform="rotate(-15, 100, 100)"/><circle cx="100" cy="100" r="35" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>`
  },
  {
    id: 9,
    name: "The Hermit",
    uprightKeywords: ["Contemplation", "Inner search", "Solitude", "Guidance"],
    uprightMeaning: "Withdraw from the noise of the external world. Walk your own path in quiet solitude, reflect deeply, and look within for the light of wisdom.",
    reversedKeywords: ["Loneliness", "Isolation", "Paranoia", "Withdrawal"],
    reversedMeaning: "You have isolated yourself too much from support systems, falling into loneliness. Alternatively, you are resisting taking necessary time for self-reflection.",
    svgDesign: `<circle cx="100" cy="80" r="10" fill="none" stroke="currentColor" stroke-width="2"/><line x1="100" y1="90" x2="100" y2="140" stroke="currentColor" stroke-width="2"/><path d="M90,110 L110,105" stroke="currentColor" stroke-width="2"/><circle cx="110" cy="105" r="4" fill="currentColor"/>`
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    uprightKeywords: ["Good luck", "Karma", "Destiny", "Turning point"],
    uprightMeaning: "The wheel is spinning in your favor. Destiny is at play, and change is coming. Embrace the cycles of life and understand that both good and bad times pass.",
    reversedKeywords: ["Bad luck", "Resisting change", "Breaking cycles", "Bad karma"],
    reversedMeaning: "You are experiencing setbacks or bad luck. Understand that these are lessons to help you break toxic, repetitive cycles. Do not resist flow.",
    svgDesign: `<circle cx="100" cy="105" r="40" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="100" cy="105" r="25" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="100" y1="65" x2="100" y2="145" stroke="currentColor" stroke-width="1"/><line x1="60" y1="105" x2="140" y2="105" stroke="currentColor" stroke-width="1"/><line x1="72" y1="77" x2="128" y2="133" stroke="currentColor" stroke-width="1"/><line x1="72" y1="133" x2="128" y2="77" stroke="currentColor" stroke-width="1"/>`
  },
  {
    id: 11,
    name: "Justice",
    uprightKeywords: ["Truth", "Fairness", "Cause and effect", "Accountability"],
    uprightMeaning: "Truth, balance, and cosmic justice are prevailing. Your actions have consequences; act with integrity and honesty. Decisions will be resolved fairly.",
    reversedKeywords: ["Dishonesty", "Unfairness", "Refusal of truth", "Accountability gaps"],
    reversedMeaning: "You are experiencing injustice, or trying to escape the consequences of your choices. Be completely honest with yourself and make amends.",
    svgDesign: `<line x1="70" y1="100" x2="130" y2="100" stroke="currentColor" stroke-width="2"/><line x1="100" y1="70" x2="100" y2="140" stroke="currentColor" stroke-width="2"/><circle cx="70" cy="120" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="130" cy="120" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="70" y1="100" x2="70" y2="110" stroke="currentColor" stroke-width="1"/><line x1="130" y1="100" x2="130" y2="110" stroke="currentColor" stroke-width="1"/>`
  },
  {
    id: 12,
    name: "The Hanged Man",
    uprightKeywords: ["Surrender", "New perspective", "Sacrifice", "Letting go"],
    uprightMeaning: "Pause and suspend action. Surrender your control and look at things from an inverted perspective. A sacrifice now will bring spiritual enlightenment.",
    reversedKeywords: ["Stalling", "Resistance", "Wasted sacrifice", "Ego attachment"],
    reversedMeaning: "You are resisting surrender and desperately trying to control the situation. This resistance is keeping you stagnant. Shift your perspective.",
    svgDesign: `<line x1="100" y1="60" x2="100" y2="120" stroke="currentColor" stroke-width="2"/><line x1="70" y1="75" x2="130" y2="75" stroke="currentColor" stroke-width="2"/><path d="M100,120 L80,100 L100,90" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="100" cy="132" r="6" fill="currentColor"/>`
  },
  {
    id: 13,
    name: "Death",
    uprightKeywords: ["Endings", "Transformation", "Transition", "Letting go"],
    uprightMeaning: "An important phase of your life is ending to make way for a profound rebirth. Do not fear this transition. Let go of the dead weight to let new life emerge.",
    reversedKeywords: ["Resisting change", "Stagnation", "Decay", "Slow transition"],
    reversedMeaning: "You are clinging tightly to the past, preventing your transformation. Stagnation is holding you back. Open your hands and let it die.",
    svgDesign: `<path d="M70,135 Q100,70 135,100" fill="none" stroke="currentColor" stroke-width="3.5"/><line x1="70" y1="135" x2="110" y2="155" stroke="currentColor" stroke-width="2"/><circle cx="135" cy="100" r="5" fill="currentColor"/><line x1="85" y1="110" x2="110" y2="130" stroke="currentColor" stroke-width="1"/>`
  },
  {
    id: 14,
    name: "Temperance",
    uprightKeywords: ["Balance", "Patience", "Alchemy", "Purpose"],
    uprightMeaning: "Bring balance, moderation, and patience to your life. You are blending different aspects of your life harmoniously to create a spiritual alchemy.",
    reversedKeywords: ["Imbalance", "Excess", "Lack of harmony", "Clashing forces"],
    reversedMeaning: "You are experiencing excess, instability, or clashing goals. Take time to restore moderation and balance in your diet, relationships, and work.",
    svgDesign: `<path d="M75,90 L90,140 H110 L125,90 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="70" y1="90" x2="130" y2="90" stroke="currentColor" stroke-width="2"/><path d="M85,115 C100,115 100,125 115,125" stroke="currentColor" stroke-width="1" stroke-dasharray="2,1"/><circle cx="100" cy="65" r="8" fill="currentColor"/>`
  },
  {
    id: 15,
    name: "The Devil",
    uprightKeywords: ["Shadow self", "Attachment", "Addiction", "Materialism"],
    uprightMeaning: "You are facing unhealthy attachments, illusions of entrapment, or your own shadow impulses. The chains holding you are loose; you are free to step away whenever you choose.",
    reversedKeywords: ["Release", "Self-awareness", "Breaking chains", "Restoration"],
    reversedMeaning: "You are becoming aware of your self-defeating habits and toxic relationships. You are ready to break your chains and reclaim your freedom.",
    svgDesign: `<polygon points="100,60 115,90 85,90" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="100" y1="90" x2="100" y2="150" stroke="currentColor" stroke-width="2"/><line x1="75" y1="110" x2="125" y2="110" stroke="currentColor" stroke-width="1.5"/><path d="M85,130 Q100,145 115,130" fill="none" stroke="currentColor" stroke-width="1.5"/>`
  },
  {
    id: 16,
    name: "The Tower",
    uprightKeywords: ["Sudden upheaval", "Chaos", "Revelation", "Rebuilding"],
    uprightMeaning: "A sudden, shocking event is dismantling unstable foundations in your life. While chaotic, this collapse is necessary to reveal the absolute truth and let you rebuild stronger.",
    reversedKeywords: ["Avoiding disaster", "Fear of change", "Looming storm", "Delaying collapse"],
    reversedMeaning: "You are narrowly avoiding a crisis, or resisting a breakdown that is inevitable. Do not try to prop up a falling tower; let it fall so you can build on bedrock.",
    svgDesign: `<rect x="80" y="80" width="40" height="70" fill="none" stroke="currentColor" stroke-width="2"/><line x1="70" y1="75" x2="100" y2="40" stroke="currentColor" stroke-width="1.5"/><line x1="130" y1="75" x2="100" y2="40" stroke="currentColor" stroke-width="1.5"/><path d="M75,55 L90,65 M125,55 L110,65" stroke="currentColor" stroke-width="2"/>`
  },
  {
    id: 17,
    name: "The Star",
    uprightKeywords: ["Hope", "Faith", "Healing", "Spirituality"],
    uprightMeaning: "You are entering a period of deep healing, peace, and spiritual clarity. The storm has passed, and the stars are guiding you. Have hope; you are protected.",
    reversedKeywords: ["Despair", "Lack of faith", "Stagnant healing", "Disconnection"],
    reversedMeaning: "You feel hopeless, discouraged, or spiritually disconnected. Reconnect with nature and remember that the darkness is temporary; your light will return.",
    svgDesign: `<polygon points="100,45 106,62 123,62 109,72 114,89 100,79 86,89 91,72 77,62 94,62" fill="currentColor"/><circle cx="70" cy="110" r="4" fill="currentColor"/><circle cx="130" cy="110" r="4" fill="currentColor"/><circle cx="100" cy="130" r="6" fill="currentColor"/>`
  },
  {
    id: 18,
    name: "The Moon",
    uprightKeywords: ["Illusion", "Anxiety", "Subconscious", "Deception"],
    uprightMeaning: "Things are not as they appear in the moonlight. Beware of illusions, projections, and anxieties. Trust your dreams and navigate through the fog with care.",
    reversedKeywords: ["Clarity", "Overcoming fear", "Exposing lies", "Secrets revealed"],
    reversedMeaning: "The fog is lifting. Lies are exposed, and clarity is returning. You are overcoming your irrational fears and seeing the truth clearly.",
    svgDesign: `<circle cx="100" cy="100" r="35" fill="none" stroke="currentColor" stroke-width="2"/><path d="M100,65 A35,35 0 0,0 135,100 A35,35 0 0,1 100,65" fill="currentColor"/><line x1="80" y1="135" x2="90" y2="120" stroke="currentColor" stroke-width="1.5"/><line x1="120" y1="135" x2="110" y2="120" stroke="currentColor" stroke-width="1.5"/>`
  },
  {
    id: 19,
    name: "The Sun",
    uprightKeywords: ["Success", "Radiance", "Vitality", "Joy"],
    uprightMeaning: "The sun shines upon you! Expect abundant success, physical vitality, joy, and absolute clarity. Your path is fully illuminated, bringing truth and growth.",
    reversedKeywords: ["Temporary gloom", "Depleted energy", "Unrealistic optimism", "Delayed joy"],
    reversedMeaning: "The sun is temporarily blocked by clouds. You are feeling a bit low in energy or facing minor setbacks. Success is still guaranteed, just slightly delayed.",
    svgDesign: `<circle cx="100" cy="100" r="25" fill="currentColor"/><path d="M100,60 V70 M100,130 V140 M60,100 H70 M130,100 H140 M72,72 L79,79 M121,121 L128,128 M72,128 L79,121 M121,72 L128,79" stroke="currentColor" stroke-width="2.5"/>`
  },
  {
    id: 20,
    name: "Judgement",
    uprightKeywords: ["Reckoning", "Awakening", "Calling", "Absolution"],
    uprightMeaning: "You are experiencing a spiritual awakening and hearing your higher calling. It is time to evaluate your past choices, forgive yourself, and step into a new life.",
    reversedKeywords: ["Self-doubt", "Ignoring the call", "Regret", "Indecision"],
    reversedMeaning: "You are ignoring a loud inner calling due to self-doubt or fear of judgment. Do not let past regrets freeze you; answer your path's call.",
    svgDesign: `<polygon points="80,100 100,60 120,100" fill="none" stroke="currentColor" stroke-width="2"/><line x1="100" y1="100" x2="100" y2="150" stroke="currentColor" stroke-width="2"/><path d="M90,120 Q100,125 110,120" stroke="currentColor" stroke-width="1.5"/><circle cx="100" cy="45" r="4" fill="currentColor"/>`
  },
  {
    id: 21,
    name: "The World",
    uprightKeywords: ["Completion", "Integration", "Travel", "Wholeness"],
    uprightMeaning: "Congratulations! You have completed a major cycle, integrating lessons and achieving wholeness. You are in harmony with the cosmos. Prepare for new levels.",
    reversedKeywords: ["Incomplete cycle", "Shortcut seeking", "Lack of closure", "Stagnation"],
    reversedMeaning: "You are close to completing a goal but are trying to cut corners or lack closure. Tie up loose ends to successfully finish this chapter.",
    svgDesign: `<ellipse cx="100" cy="105" rx="35" ry="48" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="100,75 112,105 88,105" fill="currentColor"/><polygon points="100,135 112,105 88,105" fill="none" stroke="currentColor" stroke-width="1.5"/>`
  }
];

// ==========================================================================
// MINOR ARCANA DYNAMIC GENERATOR TEMPLATE
// ==========================================================================

const SUITS = [
  {
    name: "Wands",
    element: "Fire",
    keywords: ["Creativity", "Action", "Inspiration", "Passion"],
    color: "#ffd700",
    theme: "willpower, career ambition, initial sparks, and creative growth",
    svgIcon: `<line x1="90" y1="80" x2="110" y2="220" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="90" cy="80" r="5" fill="currentColor"/><path d="M85,110 L95,115 M105,180 L115,185" stroke="currentColor" stroke-width="1.5"/>`
  },
  {
    name: "Cups",
    element: "Water",
    keywords: ["Emotion", "Relationships", "Intuition", "Love"],
    color: "#00ffff",
    theme: "feelings, empathy, connections, artistic dreams, and healing",
    svgIcon: `<path d="M75,90 L90,150 H110 L125,90 Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M100,150 V200 M80,200 H120" stroke="currentColor" stroke-width="2"/><path d="M75,90 Q100,105 125,90" fill="none" stroke="currentColor" stroke-width="1"/>`
  },
  {
    name: "Swords",
    element: "Air",
    keywords: ["Intellect", "Conflict", "Decisions", "Truth"],
    color: "#ffffff",
    theme: "thoughts, words, power, communication struggles, and mental clarity",
    svgIcon: `<line x1="100" y1="60" x2="100" y2="200" stroke="currentColor" stroke-width="3"/><line x1="85" y1="180" x2="115" y2="180" stroke="currentColor" stroke-width="2.5"/><line x1="100" y1="200" x2="100" y2="230" stroke="currentColor" stroke-width="4"/>`
  },
  {
    name: "Pentacles",
    element: "Earth",
    keywords: ["Material", "Money", "Career", "Security"],
    color: "#ff8c00",
    theme: "practical facts, finance, long stability, bodies, and hard work",
    svgIcon: `<circle cx="100" cy="140" r="40" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="100,110 110,132 134,132 115,148 122,172 100,156 78,172 85,148 66,132 90,132" fill="currentColor"/>`
  }
];

const RANKS = [
  {
    name: "Ace",
    uprightCore: "A new spark or potential has arrived. It represents a pure, unmanifested gift matching the element.",
    reversedCore: "A delay in starting, blocked inspiration, or wasted potential. Check where you are leaking energy.",
    uprightKeywords: ["New opportunity", "Potential", "Inspiration", "Inception"],
    reversedKeywords: ["Missed chance", "Lack of motivation", "Delay", "Blocked flow"]
  },
  {
    name: "Two",
    uprightCore: "Decisions, balancing forces, or planning. You are juggling dualities and aligning resources.",
    reversedCore: "Overwhelm, bad planning, or feeling split in half. You are struggling to handle details.",
    uprightKeywords: ["Balance", "Decision", "Planning", "Dual choices"],
    reversedKeywords: ["Imbalance", "Disorganization", "Split focus", "Overwhelm"]
  },
  {
    name: "Three",
    uprightCore: "Growth, collaboration, and initial progress. Plans are beginning to bear fruit.",
    reversedCore: "Delays, failed partnerships, or structural frustration. Realign your foundations.",
    uprightKeywords: ["Collaboration", "Expansion", "Progress", "Teamwork"],
    reversedKeywords: ["Delays", "Miscommunication", "Lack of progress", "Isolation"]
  },
  {
    name: "Four",
    uprightCore: "Stability, structure, or rest. You have built a safe harbor, but avoid stagnation.",
    reversedCore: "Rigidity, transition struggles, or breaking free from restrictions. Time to open up.",
    uprightKeywords: ["Stability", "Security", "Rest", "Consolidation"],
    reversedKeywords: ["Instability", "Rigidity", "Restlessness", "Stagnation"]
  },
  {
    name: "Five",
    uprightCore: "Conflict, loss, or hardship. A challenging threshold that tests your adaptability.",
    reversedCore: "Recovery, reconciliation, or ending struggles. The worst of the storm is over.",
    uprightKeywords: ["Conflict", "Loss", "Hardship", "Disagreement"],
    reversedKeywords: ["Recovery", "Forgiveness", "Ending conflict", "Resolution"]
  },
  {
    name: "Six",
    uprightCore: "Victory, harmony, or looking back. You are experiencing mutual support or community success.",
    reversedCore: "Lack of recognition, self-doubt, or dwelling excessively on past memories.",
    uprightKeywords: ["Victory", "Harmony", "Generosity", "Validation"],
    reversedKeywords: ["Ego clash", "Dwelling on past", "Lack of support", "Self-doubt"]
  },
  {
    name: "Seven",
    uprightCore: "Defense, perseverance, and standoffs. Have courage and protect your boundaries.",
    reversedCore: "Surrender, feeling overwhelmed, or exhaustion. Step back and pick your battles.",
    uprightKeywords: ["Perseverance", "Defense", "Boundaries", "Courage"],
    reversedKeywords: ["Exhaustion", "Overwhelm", "Compromise", "Giving up"]
  },
  {
    name: "Eight",
    uprightCore: "Rapid action, focus, or skill development. You are directing high energy efficiently.",
    reversedCore: "Restlessness, confusion, or busywork. Stop scattering your energy in multiple directions.",
    uprightKeywords: ["Swift action", "Focus", "Skill mastery", "Efficiency"],
    reversedKeywords: ["Restlessness", "Delays", "Wasted effort", "Scattered focus"]
  },
  {
    name: "Nine",
    uprightCore: "Resilience, integration, or self-reliance. You are reaching the completion of a solo cycle.",
    reversedCore: "Paranoia, fatigue, or defensive loops. You are carrying worries that aren't yours.",
    uprightKeywords: ["Resilience", "Independence", "Preparation", "Self-reliance"],
    reversedKeywords: ["Defensiveness", "Fatigue", "Paranoia", "Inner blocks"]
  },
  {
    name: "Ten",
    uprightCore: "Completion, legacy, or heavy burdens. You are closing a long chapter of growth.",
    reversedCore: "Releasing weight, structural collapse, or beginning a transition. Let go of the cargo.",
    uprightKeywords: ["Completion", "Burdens", "Legacy", "Culmination"],
    reversedKeywords: ["Release", "Collapse", "New cycle", "Overextended"]
  },
  {
    name: "Page",
    uprightCore: "A messenger of learning, news, and curiosity. Approach issues with a fresh, youthful mind.",
    reversedCore: "Immaturity, gossip, or delayed messages. Avoid rushing into opinions without study.",
    uprightKeywords: ["Curiosity", "Youthful spark", "New ideas", "Messages"],
    reversedKeywords: ["Immaturity", "Gossip", "Delayed news", "Defensiveness"]
  },
  {
    name: "Knight",
    uprightCore: "The pursuit of goals, fast travel, or active defense. Drive forward with focused execution.",
    reversedCore: "Impulsiveness, exhaustion, or heading in the wrong direction. Pull the reins.",
    uprightKeywords: ["Pursuit", "Action", "Energy", "Determination"],
    reversedKeywords: ["Impulsiveness", "Restlessness", "Exhaustion", "Misdirection"]
  },
  {
    name: "Queen",
    uprightCore: "Emotional mastery, comfort, and nurturing authority. Lead with depth, patience, and intuition.",
    reversedCore: "Control issues, emotional manipulation, or burnout. Remember to nurture yourself.",
    uprightKeywords: ["Mastery", "Nurturing", "Intuition", "Self-awareness"],
    reversedKeywords: ["Burnout", "Control issues", "Manipulation", "Coldness"]
  },
  {
    name: "King",
    uprightCore: "Intellectual control, stability, and executive power. You lead others with authority.",
    reversedCore: "Tyranny, rigidity, or abuse of power. You must restore balance and compassion.",
    uprightKeywords: ["Executive power", "Control", "Stability", "Wisdom"],
    reversedKeywords: ["Tyranny", "Rigidity", "Power abuse", "Weakness"]
  }
];

// Generates cards dynamically combining Suit and Rank
function getMinorArcanaCard(id) {
  const minorId = id - 22; // 0 to 55
  const suitIdx = Math.floor(minorId / 14); // 0 to 3
  const rankIdx = minorId % 14; // 0 to 13

  const suit = SUITS[suitIdx];
  const rank = RANKS[rankIdx];

  const uprightKeywords = [...rank.uprightKeywords, ...suit.keywords];
  const reversedKeywords = [...rank.reversedKeywords, ...suit.keywords];

  const uprightMeaning = `The ${rank.name} of ${suit.name} represents a period of ${rank.uprightKeywords[0].toLowerCase()} in your life, closely aligned with your ${suit.theme}. ${rank.uprightCore}`;
  const reversedMeaning = `The ${rank.name} of ${suit.name} in reverse warns of ${rank.reversedKeywords[0].toLowerCase()} and blocks in your ${suit.theme}. ${rank.reversedCore}`;

  return {
    id,
    name: `${rank.name} of ${suit.name}`,
    uprightKeywords,
    uprightMeaning,
    reversedKeywords,
    reversedMeaning,
    svgDesign: suit.svgIcon // procedurally rendered suit badge
  };
}

// Generate the complete 78 card deck
export function getFullDeck() {
  const deck = [...MAJOR_ARCANA];
  for (let i = 22; i < 78; i++) {
    deck.push(getMinorArcanaCard(i));
  }
  return deck;
}

// Shuffle helper for full 78 deck
export function shuffleDeck() {
  const deck = getFullDeck();
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Draw cards helper (randomly assigning Upright / Reversed)
export function drawCards(count = 1) {
  const shuffled = shuffleDeck();
  const drawn = [];
  
  for (let i = 0; i < count; i++) {
    const card = shuffled[i];
    const isReversed = Math.random() < 0.35; // 35% chance of being reversed
    drawn.push({
      ...card,
      isReversed,
      currentTitle: card.name + (isReversed ? " (Reversed)" : " (Upright)"),
      keywords: isReversed ? card.reversedKeywords : card.uprightKeywords,
      meaning: isReversed ? card.reversedMeaning : card.uprightMeaning
    });
  }
  
  return drawn;
}
