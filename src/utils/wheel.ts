import type { Category, Topic } from '../types/topic';

export interface WheelCategoryMeta {
  category: Category;
  label: string;
  shortLabel: string;
  color: string; // Primary wedge color
  secondaryColor: string; // Gradient end
  textColor: string;
  accentGlow: string;
  icon: string;
}

export const WHEEL_CATEGORIES: WheelCategoryMeta[] = [
  {
    category: 'DSA',
    label: 'Data Structures & Algorithms',
    shortLabel: 'DSA',
    color: '#DD700B', // Frozen Mist - Burnished Amber
    secondaryColor: '#B85806',
    textColor: '#FCF8D8',
    accentGlow: 'rgba(221, 112, 11, 0.6)',
    icon: 'Layers',
  },
  {
    category: 'OOPS',
    label: 'OOPS & Architecture',
    shortLabel: 'OOPS',
    color: '#7C7D75', // Frozen Mist - Mineral Slate
    secondaryColor: '#5E5F57',
    textColor: '#FCF8D8',
    accentGlow: 'rgba(124, 125, 117, 0.6)',
    icon: 'Box',
  },
  {
    category: 'DBMS',
    label: 'Database Systems',
    shortLabel: 'DBMS',
    color: '#ADACA7', // Frozen Mist - Frosted Ash
    secondaryColor: '#8E8D88',
    textColor: '#121316',
    accentGlow: 'rgba(173, 172, 167, 0.6)',
    icon: 'Database',
  },
  {
    category: 'OS',
    label: 'Operating Systems',
    shortLabel: 'OS',
    color: '#D9DADF', // Frozen Mist - Pale Frost Mist
    secondaryColor: '#B5B7BE',
    textColor: '#121316',
    accentGlow: 'rgba(217, 218, 223, 0.6)',
    icon: 'Cpu',
  },
  {
    category: 'NETWORKS',
    label: 'Computer Networks',
    shortLabel: 'Networks',
    color: '#E48222', // Frozen Mist - Bright Ochre
    secondaryColor: '#BE6009',
    textColor: '#FCF8D8',
    accentGlow: 'rgba(228, 130, 34, 0.6)',
    icon: 'Network',
  },
  {
    category: 'SYSTEM_DESIGN',
    label: 'System Design',
    shortLabel: 'Sys Design',
    color: '#696A62', // Frozen Mist - Deep Slate
    secondaryColor: '#4D4E47',
    textColor: '#FCF8D8',
    accentGlow: 'rgba(105, 106, 98, 0.6)',
    icon: 'Server',
  },
  {
    category: 'BEHAVIORAL',
    label: 'HR & Behavioral',
    shortLabel: 'HR & Star',
    color: '#FCF8D8', // Frozen Mist - Warm Pale Cream
    secondaryColor: '#DDD7AC',
    textColor: '#1A1C1E',
    accentGlow: 'rgba(252, 248, 216, 0.6)',
    icon: 'Users',
  },
  {
    category: 'PROJECT_DEFENSE',
    label: 'Project & Resume Defense',
    shortLabel: 'Projects',
    color: '#C2610A', // Frozen Mist - Rich Amber
    secondaryColor: '#994903',
    textColor: '#FCF8D8',
    accentGlow: 'rgba(194, 97, 10, 0.6)',
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
  minRevolutions: number = 5
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

  // Add random spins
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
