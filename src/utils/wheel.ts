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
    color: '#367D8A', // Primary Teal
    secondaryColor: '#285F6B',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(54, 125, 138, 0.45)',
    icon: 'Layers',
  },
  {
    category: 'OOPS',
    label: 'OOPS & Architecture',
    shortLabel: 'OOPS',
    color: '#285F6B', // Secondary Teal
    secondaryColor: '#133336',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(40, 95, 107, 0.45)',
    icon: 'Box',
  },
  {
    category: 'DBMS',
    label: 'Database Systems',
    shortLabel: 'DBMS',
    color: '#1E4E57', // Deep Mid Teal
    secondaryColor: '#133336',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(30, 78, 87, 0.45)',
    icon: 'Database',
  },
  {
    category: 'OS',
    label: 'Operating Systems',
    shortLabel: 'OS',
    color: '#3E8C9A', // Luminous Teal
    secondaryColor: '#285F6B',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(62, 140, 154, 0.45)',
    icon: 'Cpu',
  },
  {
    category: 'NETWORKS',
    label: 'Computer Networks',
    shortLabel: 'Networks',
    color: '#235661', // Rich Teal
    secondaryColor: '#163B42',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(35, 86, 97, 0.45)',
    icon: 'Network',
  },
  {
    category: 'SYSTEM_DESIGN',
    label: 'System Design',
    shortLabel: 'Sys Design',
    color: '#367D8A', // Primary Teal
    secondaryColor: '#1E4E57',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(54, 125, 138, 0.45)',
    icon: 'Server',
  },
  {
    category: 'BEHAVIORAL',
    label: 'HR & Behavioral',
    shortLabel: 'HR & Star',
    color: '#285F6B', // Secondary Teal
    secondaryColor: '#1A434B',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(40, 95, 107, 0.45)',
    icon: 'Users',
  },
  {
    category: 'PROJECT_DEFENSE',
    label: 'Project & Resume Defense',
    shortLabel: 'Projects',
    color: '#133336', // Deep Teal
    secondaryColor: '#0A1D20',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(19, 51, 54, 0.45)',
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

  // Add revolutions to match the 7.08s deceleration of the roulette sound
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
