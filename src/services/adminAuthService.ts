export interface AdminCredentials {
  username: string;
  passwordHash: string; // SHA-256 hex string
  updatedAt?: string;
}

const STORAGE_KEY = 'rg_portfolio_admin_creds';
const SESSION_KEY = 'rg_portfolio_admin_session';

// SHA-256 hash of default initial password ('admin1234')
const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  passwordHash: 'ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270',
  updatedAt: new Date().toISOString(),
};

/**
 * Standard SHA-256 cryptographic hash using browser Web Crypto API
 */
export async function sha256(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const hashBuf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Fetch current admin credentials from localStorage
export async function getAdminCredentials(): Promise<AdminCredentials> {
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

  return DEFAULT_CREDENTIALS;
}

// Verify credentials against stored cryptographic hash
export async function verifyAdminCredentials(
  enteredUser: string,
  enteredPass: string
): Promise<{ success: boolean; message?: string }> {
  const current = await getAdminCredentials();
  const userMatches = enteredUser.trim().toLowerCase() === current.username.trim().toLowerCase();
  
  const enteredHash = await sha256(enteredPass);
  // Match either modern SHA-256 hash or upgrade legacy plaintext
  const passMatches = (enteredHash === current.passwordHash) || (enteredPass === current.passwordHash);

  if (userMatches && passMatches) {
    // Seamless upgrade to SHA-256 if user had a plaintext stored password
    if (enteredPass === current.passwordHash) {
      await updateAdminCredentials(current.username, enteredPass);
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username: current.username, loggedInAt: Date.now() }));
    return { success: true };
  }

  return { success: false, message: 'Invalid username or password. Please try again.' };
}

// Save new credentials locally with cryptographic SHA-256 hashing
export async function updateAdminCredentials(
  newUsername: string,
  newPassword: string
): Promise<void> {
  const hashed = await sha256(newPassword);
  const updated: AdminCredentials = {
    username: newUsername.trim(),
    passwordHash: hashed,
    updatedAt: new Date().toISOString(),
  };

  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username: updated.username, loggedInAt: Date.now() }));
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
