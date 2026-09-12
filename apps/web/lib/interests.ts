/**
 * Emoji mapping helper for campus interests.
 */
const EMOJI_MAP: Record<string, string> = {
  'Artificial Intelligence': '🤖',
  'Web Development': '💻',
  'App Development': '📱',
  'Cybersecurity': '🔐',
  'Data Science': '📊',
  'Machine Learning': '🧠',
  'Cloud Computing': '☁️',
  'Blockchain': '⛓️',
  'Competitive Programming': '⚡',
  'Open Source': '🌐',
  'Robotics': '🦾',
  'Startups': '🚀',
  'Entrepreneurship': '💼',
  'Design': '🎨',
  'UI/UX': '📐',
  'Gaming': '🎮',
  'Cricket': '🏏',
  'Football': '⚽',
  'Music': '🎵',
  'Photography': '📸',
  'Public Speaking': '🎤',
  'Debate': '🗣️',
  'Finance & Investing': '📈',
  'Fitness & Health': '🏋️',
  'Content Creation': '📹',
};

export function getInterestEmoji(name: string): string {
  if (EMOJI_MAP[name]) return EMOJI_MAP[name];
  const lower = name.toLowerCase();
  if (lower.includes('ai') || lower.includes('intell')) return '🤖';
  if (lower.includes('web')) return '💻';
  if (lower.includes('app') || lower.includes('mobile')) return '📱';
  if (lower.includes('sec')) return '🔐';
  if (lower.includes('data')) return '📊';
  if (lower.includes('robot')) return '🦾';
  if (lower.includes('design') || lower.includes('ui')) return '🎨';
  if (lower.includes('game')) return '🎮';
  if (lower.includes('music')) return '🎵';
  if (lower.includes('photo')) return '📸';
  return '✨';
}
