/** Cohen PSS-10 — standard 5-point frequency; items 4–5 & 7–8 are reverse-scored. */
export const PSS10_LIKERT_OPTIONS = [
  { emoji: '😊', label: 'Never', score: 0 },
  { emoji: '🙂', label: 'Almost never', score: 1 },
  { emoji: '😐', label: 'Sometimes', score: 2 },
  { emoji: '😟', label: 'Fairly often', score: 3 },
  { emoji: '😰', label: 'Very often', score: 4 },
] as const;

export type Pss10Item = {
  readonly en: string;
  readonly hi: string;
  readonly reverse?: true;
};

export const PSS10_ITEMS: readonly Pss10Item[] = [
  {
    en: 'Upset because of something unexpected?',
    hi: 'अचानक किसी बात से परेशान?',
  },
  {
    en: 'Unable to control important things in your life?',
    hi: 'ज़रूरी चीज़ें काबू में नहीं?',
  },
  {
    en: 'Felt nervous and stressed?',
    hi: 'तनाव और घबराहट?',
  },
  {
    en: 'Felt confident about handling personal problems?',
    hi: 'समस्याएँ सुलझाने में विश्वास?',
    reverse: true,
  },
  {
    en: 'Felt that things were going your way?',
    hi: 'चीज़ें ठीक चल रहीं?',
    reverse: true,
  },
  {
    en: 'Found you could not cope with all you had to do?',
    hi: 'सब नहीं संभाल पा रहे?',
  },
  {
    en: 'Able to control irritations in your life?',
    hi: 'चिड़चिड़ापन काबू में?',
    reverse: true,
  },
  {
    en: 'Felt on top of things?',
    hi: 'सब मैनेज कर रहे हैं?',
    reverse: true,
  },
  {
    en: 'Angered because of things outside your control?',
    hi: 'बेक़ाबू बातों से गुस्सा?',
  },
  {
    en: 'Felt difficulties were piling up too high?',
    hi: 'मुश्किलें बहुत बढ़ गई?',
  },
];

function pss10ItemContribution(raw: number, item: Pss10Item): number {
  const clamped = Math.max(0, Math.min(4, raw));
  return item.reverse ? 4 - clamped : clamped;
}

/** Total perceived stress 0–40 from raw Likert answers (0–4 each). */
export function pss10TotalFromRaw(rawScores: number[]): number {
  if (rawScores.length !== PSS10_ITEMS.length) return NaN;
  return PSS10_ITEMS.reduce(
    (sum, item, i) => sum + pss10ItemContribution(rawScores[i] ?? 0, item),
    0,
  );
}

/** Screening bands (not a diagnosis). */
export function pss10StressLabel(total: number): string {
  if (total <= 13) return 'Low';
  if (total <= 26) return 'Moderate';
  return 'High';
}

/** Same 0–3 scale as PHQ-9; emoji set aligned with GAD-7 mockups */
export const GAD7_LIKERT_OPTIONS = [
  { emoji: '😊', label: 'Not at all', score: 0 },
  { emoji: '🙂', label: 'Several days', score: 1 },
  { emoji: '🙁', label: 'More than half', score: 2 },
  { emoji: '😰', label: 'Nearly every day', score: 3 },
] as const;

export const GAD7_ITEMS = [
  {
    en: 'Feeling nervous, anxious, or on edge',
    hi: 'घबराहट या बेचैनी',
  },
  {
    en: 'Not being able to stop or control worrying',
    hi: 'चिंता रुक नहीं रही',
  },
  {
    en: 'Worrying too much about different things',
    hi: 'अलग-अलग बातों की चिंता',
  },
  {
    en: 'Trouble relaxing',
    hi: 'आराम करने में दिक्कत',
  },
  {
    en: "Being so restless that it's hard to sit still",
    hi: 'बैठ नहीं पा रहे',
  },
  {
    en: 'Becoming easily annoyed or irritable',
    hi: 'जल्दी चिड़चिड़ापन',
  },
  {
    en: 'Feeling afraid, as if something awful might happen',
    hi: 'कुछ बुरा होने का डर',
  },
] as const;

/** GAD-7 total score 0–21 — screening labels (not a diagnosis). */
export function gad7SeverityLabel(total: number): string {
  if (total <= 4) return 'Minimal';
  if (total <= 9) return 'Mild';
  if (total <= 14) return 'Moderate';
  return 'Severe';
}

export const PHQ9_LIKERT_OPTIONS = [
  { emoji: '😊', label: 'Not at all', score: 0 },
  { emoji: '🙂', label: 'Several days', score: 1 },
  { emoji: '😟', label: 'More than half', score: 2 },
  { emoji: '😰', label: 'Nearly every day', score: 3 },
] as const;

export const PHQ9_ITEMS = [
  {
    en: 'Little interest or pleasure in doing things',
    hi: 'काम में रुचि या आनंद कम',
  },
  {
    en: 'Feeling down, depressed, or hopeless',
    hi: 'उदास, निराश महसूस करना',
  },
  {
    en: 'Trouble falling or staying asleep, or sleeping too much',
    hi: 'नींद में परेशानी',
  },
  {
    en: 'Feeling tired or having little energy',
    hi: 'थकान या ऊर्जा कम',
  },
  {
    en: 'Poor appetite or overeating',
    hi: 'भूख कम या ज़्यादा खाना',
  },
  {
    en: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
    hi: 'अपने बारे में बुरा लगना',
  },
  {
    en: 'Trouble concentrating on things',
    hi: 'ध्यान लगाने में दिक़्क़त',
  },
  {
    en: 'Moving or speaking slowly, or being fidgety or restless',
    hi: 'बेचैनी या सुस्ती',
  },
  {
    en: 'Thoughts that you would be better off dead, or of hurting yourself',
    hi: 'खुद को नुकसान के विचार',
  },
] as const;

export const SLEEP_QUALITY_OPTIONS = [
  { id: 'deep', emoji: '😴', label: 'Deep & restful' },
  { id: 'good', emoji: '🙂', label: 'Fairly good' },
  { id: 'average', emoji: '😐', label: 'Average' },
  { id: 'poor', emoji: '😫', label: 'Poor / broken' },
] as const;

export type SleepQualityId = (typeof SLEEP_QUALITY_OPTIONS)[number]['id'];

export const MOOD_CHOICES = [
  { id: 'great', emoji: '😊', label: 'Great' },
  { id: 'good', emoji: '🙂', label: 'Good' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'low', emoji: '😢', label: 'Low' },
  { id: 'rough', emoji: '😭', label: 'Rough' },
] as const;
