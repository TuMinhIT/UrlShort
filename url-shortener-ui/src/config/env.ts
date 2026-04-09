const fallbackApiBaseUrl = "http://localhost:5000";
// const fallbackApiBaseUrl = "https://localhost:44323";

export const appEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? fallbackApiBaseUrl,
};

export function getBackendOrigin() {
  try {
    return new URL(appEnv.apiBaseUrl, window.location.href).origin;
  } catch {
    return window.location.origin;
  }
}
