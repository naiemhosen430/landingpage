const AUTH_STORAGE_KEY = "zanestore_auth";

export interface PersistedAuthState {
  user: any | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export function loadAuthState(): Partial<PersistedAuthState> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as PersistedAuthState;
    return {
      user: parsed.user ?? null,
      token: parsed.token ?? null,
      refreshToken: parsed.refreshToken ?? null,
      isAuthenticated: !!parsed.token,
    };
  } catch (error) {
    console.error("Failed to load auth state", error);
    return {};
  }
}

export function saveAuthState(state: PersistedAuthState) {
  if (typeof window === "undefined") return;

  try {
    if (!state.token) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    );
  } catch (error) {
    console.error("Failed to save auth state", error);
  }
}

export function clearAuthState() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear auth state", error);
  }
}
