/** Devanagari near-vision chart lines — matches product copy */
export const NEAR_VISION_LINES = [
  { n: 'N48', text: 'ब क ग घ' },
  { n: 'N36', text: 'च छ ज झ ञ' },
  { n: 'N24', text: 'ट ठ ड ढ ण त' },
  { n: 'N18', text: 'थ द ध न प फ ब भ' },
  { n: 'N12', text: 'म य र ल व श ष स ह' },
  { n: 'N8', text: 'क्ष त्र ज्ञ श्र ड़ ढ़ क़ ख़' },
  { n: 'N6', text: 'अ आ इ ई उ ऊ ए ऐ ओ औ अं' },
] as const;

/** Ishihara-style plates: correct digit + four choices */
export const COLOR_PLATES: { correct: number; options: number[] }[] = [
  { correct: 3, options: [3, 5, 8, 6] },
  { correct: 8, options: [8, 5, 2, 9] },
  { correct: 12, options: [12, 13, 15, 18] },
  { correct: 29, options: [29, 28, 70, 20] },
  { correct: 5, options: [5, 2, 3, 8] },
];

/** Symptom questionnaire — combined set from mockups */
export const SYMPTOM_QUESTIONS = [
  'Do you experience blurred or cloudy vision?',
  'Do you have difficulty seeing at night?',
  'Do you see halos around lights?',
  'Do you experience frequent headaches?',
  'Have you noticed gradual vision loss?',
  'Do you have eye pain or redness?',
  'Do colors appear faded or yellowish?',
  'Do you have difficulty reading or close work?',
  'Do you see floaters or flashes of light?',
  'Family history of glaucoma or eye disease?',
] as const;

export const TRIALS_PER_EYE = 10;
export const CONTRAST_STEPS = 9;
