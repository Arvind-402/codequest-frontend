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
    color: '#8B5CF6', // Electric Violet
    secondaryColor: '#6D28D9',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(139, 92, 246, 0.6)',
    icon: 'Layers',
  },
  {
    category: 'OOPS',
    label: 'OOPS & Architecture',
    shortLabel: 'OOPS',
    color: '#3B82F6', // Cobalt Blue
    secondaryColor: '#1D4ED8',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(59, 130, 246, 0.6)',
    icon: 'Box',
  },
  {
    category: 'DBMS',
    label: 'Database Systems',
    shortLabel: 'DBMS',
    color: '#06B6D4', // Vibrant Cyan
    secondaryColor: '#0891B2',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(6, 182, 212, 0.6)',
    icon: 'Database',
  },
  {
    category: 'OS',
    label: 'Operating Systems',
    shortLabel: 'OS',
    color: '#10B981', // Restrained Emerald
    secondaryColor: '#059669',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(16, 185, 129, 0.6)',
    icon: 'Cpu',
  },
  {
    category: 'NETWORKS',
    label: 'Computer Networks',
    shortLabel: 'Networks',
    color: '#F59E0B', // Amber
    secondaryColor: '#D97706',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(245, 158, 11, 0.6)',
    icon: 'Network',
  },
  {
    category: 'SYSTEM_DESIGN',
    label: 'System Design',
    shortLabel: 'Sys Design',
    color: '#EC4899', // Pink / Magenta
    secondaryColor: '#BE185D',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(236, 72, 153, 0.6)',
    icon: 'Server',
  },
  {
    category: 'BEHAVIORAL',
    label: 'HR & Behavioral',
    shortLabel: 'HR & Star',
    color: '#14B8A6', // Teal
    secondaryColor: '#0F766E',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(20, 184, 166, 0.6)',
    icon: 'Users',
  },
  {
    category: 'PROJECT_DEFENSE',
    label: 'Project & Resume Defense',
    shortLabel: 'Projects',
    color: '#E11D48', // Crimson Rose
    secondaryColor: '#9F1239',
    textColor: '#FFFFFF',
    accentGlow: 'rgba(225, 29, 72, 0.6)',
    icon: 'ShieldCheck',
  },
];

/**
 * Calculates the exact cumulative rotation angle (in degrees) to bring
 * the specified category slice directly under the fixed TOP pointer (12 o'clock / 0 degrees).
 *
 * Slices are arranged clockwise starting from 12 o'clock (0 degrees).
 * Slice i occupies [i * sliceAngle, (i + 1) * sliceAngle].
 * The center of slice i is (i + 0.5) * sliceAngle.
 * When rotated clockwise by R degrees, the new angle of slice center is (center + R) % 360.
 * To align with the top pointer (0 / 360 degrees), we want (center + R) % 360 = 0,
 * meaning R % 360 = (360 - center) % 360.
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
    forwardAngle += 360; // ensure satisfying movement
  }

  // Add random spins (5 to 7 full revolutions)
  const fullRevs = 360 * minRevolutions;
  return currentRotation + fullRevs + forwardAngle;
}

/**
 * Deterministically pick today's daily challenge topic from an array of topics
 * based on the user's local date string (e.g., "2026-10-25").
 * Reopening on the same day always produces the exact same challenge!
 */
export function getDailyChallengeTopic(topics: Topic[], dateString: string): Topic | null {
  if (!topics || topics.length === 0) return null;
  // Simple deterministic hash of dateString
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const positiveHash = Math.abs(hash);
  const index = positiveHash % topics.length;
  return topics[index];
}
