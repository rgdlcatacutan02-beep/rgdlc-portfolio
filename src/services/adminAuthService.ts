import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface AdminCredentials {
  username: string;
  passwordHash: string; // Plain or hashed text for simple portal administration
  updatedAt?: string;
}

const STORAGE_KEY = 'rg_portfolio_admin_creds';
const SESSION_KEY = 'rg_portfolio_admin_session';

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  passwordHash: 'admin1234',
  updatedAt: new Date().toISOString(),
};

// Fetch current admin credentials (LocalStorage first, then Firestore fallback)
export async function getAdminCredentials(): Promise<AdminCredentials> {
  // Check localStorage first
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed.username && parsed.passwordHash) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not parse local credentials:', err);
  }

  // Try Firestore
  try {
    const docRef = doc(db, 'portfolio', 'security');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as AdminCredentials;
      if (data.username && data.passwordHash) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Firestore security doc not reachable or unconfigured, using default:', err);
  }

  // Fallback to default
  return DEFAULT_CREDENTIALS;
}

// Verify credentials
export async function verifyAdminCredentials(
  enteredUser: string,
  enteredPass: string
): Promise<{ success: boolean; message?: string }> {
  const current = await getAdminCredentials();
  const userMatches = enteredUser.trim().toLowerCase() === current.username.trim().toLowerCase();
  const passMatches = enteredPass === current.passwordHash;

  if (userMatches && passMatches) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username: current.username, loggedInAt: Date.now() }));
    return { success: true };
  }

  return { success: false, message: 'Invalid username or password. Please try again.' };
}

// Save new credentials
export async function updateAdminCredentials(
  newUsername: string,
  newPassword: string
): Promise<void> {
  const updated: AdminCredentials = {
    username: newUsername.trim(),
    passwordHash: newPassword,
    updatedAt: new Date().toISOString(),
  };

  // Save to localStorage immediately
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username: updated.username, loggedInAt: Date.now() }));

  // Try saving to Firestore if online
  try {
    const docRef = doc(db, 'portfolio', 'security');
    await setDoc(docRef, updated, { merge: true });
  } catch (err) {
    console.warn('Could not sync security update to Firestore, local persistence saved:', err);
  }
}

// Check session
export function getAdminSession(): { username: string } | null {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const parsed = JSON.parse(session);
      return { username: parsed.username || 'admin' };
    }
  } catch {
    return null;
  }
  return null;
}

// Clear session
export function clearAdminSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
