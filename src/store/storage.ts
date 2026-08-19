import type { BirthData, VedicProfile, CompatibilityResult } from '../engine/vedic';
import { generateProfile, calculateCompatibility } from '../engine/vedic';

const STORAGE_KEYS = {
  USER_PROFILE: 'nakshatra_user_profile',
  BONDS: 'nakshatra_bonds',
  ONBOARDED: 'nakshatra_onboarded',
  PREMIUM: 'nakshatra_premium',
  COMPATIBILITY_COUNT: 'nakshatra_compat_count',
  PENDING_INVITE: 'nakshatra_pending_invite',
  PURCHASED_REPORTS: 'nakshatra_purchased_reports',
};

export interface Bond {
  id: string;
  profile: VedicProfile;
  compatibility: CompatibilityResult;
  createdAt: string;
  label: 'partner' | 'friend' | 'family' | 'colleague' | 'crush' | 'other';
}

export function saveUserProfile(profile: VedicProfile): void {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

export function getUserProfile(): VedicProfile | null {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
}

export function saveBond(bond: Bond): void {
  const bonds = getBonds();
  const existingIndex = bonds.findIndex(b => b.id === bond.id);
  if (existingIndex >= 0) {
    bonds[existingIndex] = bond;
  } else {
    bonds.push(bond);
  }
  localStorage.setItem(STORAGE_KEYS.BONDS, JSON.stringify(bonds));
}

export function getBonds(): Bond[] {
  const data = localStorage.getItem(STORAGE_KEYS.BONDS);
  return data ? JSON.parse(data) : [];
}

export function getBondById(id: string): Bond | undefined {
  return getBonds().find(b => b.id === id);
}

export function setOnboarded(value: boolean): void {
  localStorage.setItem(STORAGE_KEYS.ONBOARDED, JSON.stringify(value));
}

export function isOnboarded(): boolean {
  const data = localStorage.getItem(STORAGE_KEYS.ONBOARDED);
  return data ? JSON.parse(data) : false;
}

export function setPremium(value: boolean): void {
  localStorage.setItem(STORAGE_KEYS.PREMIUM, JSON.stringify(value));
}

export function isPremium(): boolean {
  const data = localStorage.getItem(STORAGE_KEYS.PREMIUM);
  return data ? JSON.parse(data) : false;
}

export function getCompatibilityCount(): number {
  const data = localStorage.getItem(STORAGE_KEYS.COMPATIBILITY_COUNT);
  return data ? JSON.parse(data) : 0;
}

export function incrementCompatibilityCount(): number {
  const count = getCompatibilityCount() + 1;
  localStorage.setItem(STORAGE_KEYS.COMPATIBILITY_COUNT, JSON.stringify(count));
  return count;
}

export function setPendingInvite(data: BirthData): void {
  sessionStorage.setItem(STORAGE_KEYS.PENDING_INVITE, JSON.stringify(data));
}

export function consumePendingInvite(): BirthData | null {
  const data = sessionStorage.getItem(STORAGE_KEYS.PENDING_INVITE);
  if (!data) return null;
  sessionStorage.removeItem(STORAGE_KEYS.PENDING_INVITE);
  return JSON.parse(data) as BirthData;
}

export function peekPendingInvite(): BirthData | null {
  const data = sessionStorage.getItem(STORAGE_KEYS.PENDING_INVITE);
  return data ? (JSON.parse(data) as BirthData) : null;
}

export type ReportType = 'couple' | 'family';

export function getPurchasedReports(): ReportType[] {
  const data = localStorage.getItem(STORAGE_KEYS.PURCHASED_REPORTS);
  return data ? JSON.parse(data) : [];
}

export function purchaseReport(type: ReportType): void {
  const reports = getPurchasedReports();
  if (!reports.includes(type)) {
    reports.push(type);
    localStorage.setItem(STORAGE_KEYS.PURCHASED_REPORTS, JSON.stringify(reports));
  }
}

export function hasPurchasedReport(type: ReportType): boolean {
  return getPurchasedReports().includes(type);
}

export function findOrCreateBond(
  userProfile: VedicProfile,
  otherBirth: BirthData,
  label: Bond['label'] = 'other',
  options?: { countTowardLimit?: boolean }
): Bond {
  const otherProfile = generateProfile(otherBirth);
  const existing = getBonds().find(
    (b) => b.profile.id === otherProfile.id || (
      b.profile.birthData.name === otherBirth.name &&
      b.profile.birthData.date === otherBirth.date
    )
  );
  if (existing) return existing;

  const bond: Bond = {
    id: `bond_${Date.now()}`,
    profile: otherProfile,
    compatibility: calculateCompatibility(userProfile, otherProfile),
    createdAt: new Date().toISOString(),
    label,
  };
  saveBond(bond);
  if (options?.countTowardLimit !== false) {
    incrementCompatibilityCount();
  }
  return bond;
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

// Generate deterministic seeded data for demo bonds
export function generateDemoBonds(userProfile: VedicProfile): Bond[] {
  const demoContacts: BirthData[] = [
    { name: 'Priya', date: '1997-03-15', time: '08:30', place: 'Mumbai', gender: 'female' },
    { name: 'Arjun', date: '1995-11-22', time: '14:15', place: 'Delhi', gender: 'male' },
    { name: 'Meera', date: '1998-07-08', time: '06:00', place: 'Bangalore', gender: 'female' },
  ];
  
  return demoContacts.map((contact, i) => {
    const profile = generateProfile(contact);
    const compatibility = calculateCompatibility(userProfile, profile);
    return {
      id: `bond_demo_${i}`,
      profile,
      compatibility,
      createdAt: new Date(Date.now() - (i + 1) * 86400000 * 3).toISOString(),
      label: (['partner', 'friend', 'family'] as const)[i],
    };
  });
}
