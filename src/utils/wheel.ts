import type { Category, Topic } from '../types/topic';

export interface WheelCategoryMeta {
  category: Category;
  label: string;
  shortLabel: string;
  color: string;
  secondaryColor: string;
  textColor: string;
  accentGlow: string;
  icon: string;
}

/**
 * MK Vision Studio Architectural Wheel Palette
 * Deep tonal obsidian & charcoal wedges with electric mint (#03E29C) and warm bronze accents.
 */
export const WHEEL_CATEGORIES: WheelCategoryMeta[] = [
  {
    category: 'DSA',
    label: 'Data Structures & Algorithms',
    shortLabel: 'DSA',
    color: '#132822', // Deep Studio Emerald
    secondaryColor: '#091512',
    textColor: '#F3F4F6',
    accentGlow: 'rgba(3, 226, 156, 0.45)',
    icon: 'Layers',
  },
  {
    category: 'OOPS',
    label: 'OOPS & Architecture',
    shortLabel: 'OOPS',
    color: '#1A212D', // Deep Steel Charcoal
    secondaryColor: '#0E131A',
    textColor: '#F3F4F6',
    accentGlow: 'rgba(243, 244, 246, 0.25)',
    icon: 'Box',
  },
  {
    category: 'DBMS',
    label: 'Database Systems',
    shortLabel: 'DBMS',
    color: '#1C2723', // Studio Dark Mint
    secondaryColor: '#0D1614',
    textColor: '#F3F4F6',
    accentGlow: 'rgba(3, 226, 156, 0.4)',
    icon: 'Database',
  },
  {
    category: 'OS',
    label: 'Operating Systems',
    shortLabel: 'OS',
    color: '#26221A', // Warm Studio Bronze Dark
    secondaryColor: '#14110C',
    textColor: '#F3F4F6',
    accentGlow: 'rgba(200, 155, 88, 0.45)',
    icon: 'Cpu',
  },
  {
    category: 'NETWORKS',
    label: 'Computer Networks',
    shortLabel: 'Networks',
    color: '#15252A', // Dark Slate Teal
    secondaryColor: '#0A1317',
    textColor: '#F3F4F6',
    accentGlow: 'rgba(3, 226, 156, 0.35)',
    icon: 'Network',
  },
  {
    category: 'SYSTEM_DESIGN',
    label: 'System Design',
    shortLabel: 'Sys Design',
    color: '#183028', // Studio Emerald Forest
    secondaryColor: '#0A1713',
    textColor: '#F3F4F6',
    accentGlow: 'rgba(3, 226, 156, 0.5)',
    icon: 'Server',
  },
  {
    category: 'BEHAVIORAL',
    label: 'HR & Behavioral',
    shortLabel: 'HR & Star',
    color: '#24211D', // Subtle Bronze Charcoal
    secondaryColor: '#12100E',
    textColor: '#F3F4F6',
    accentGlow: 'rgba(200, 155, 88, 0.4)',
    icon: 'Users',
  },
  {
    category: 'PROJECT_DEFENSE',
    label: 'Project & Resume Defense',
    shortLabel: 'Projects',
    color: '#1B1E26', // Charcoal Carbon
    secondaryColor: '#0B0D11',
    textColor: '#F3F4F6',
    accentGlow: 'rgba(243, 244, 246, 0.3)',
    icon: 'ShieldCheck',
  },
];

/**
 * Calculates the exact cumulative rotation angle (in degrees) to bring
 * the specified category slice directly under the fixed TOP pointer (12 o'clock / 0 degrees).
 */
export function calculateRotationToCategory(
  targetCategoryIndex: number,
  currentRotation: number,
  totalSlices: number = WHEEL_CATEGORIES.length,
  minRevolutions: number = 7
): number {
  const sliceAngle = 360 / totalSlices;
  const sliceCenterAngle = targetCategoryIndex * sliceAngle + sliceAngle / 2;
  const targetModAngle = (360 - sliceCenterAngle) % 360;

  // Current normalized angle
  const currentModAngle = ((currentRotation % 360) + 360) % 360;

  // Forward distance in degrees to reach targetModAngle
  let forwardAngle = (targetModAngle - currentModAngle + 360) % 360;
  if (forwardAngle < 45) {
    forwardAngle += 360;
  }

  // Add revolutions to match the deceleration of the roulette sound
  const fullRevs = 360 * minRevolutions;
  return currentRotation + fullRevs + forwardAngle;
}

/**
 * Deterministically pick today's daily challenge topic from an array of topics.
 */
export function getDailyChallengeTopic(topics: Topic[], dateString?: string): Topic | null {
  if (!topics || topics.length === 0) return null;
  const dStr = dateString || new Date().toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < dStr.length; i++) {
    const char = dStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  const index = positiveHash % topics.length;
  return topics[index];
}
