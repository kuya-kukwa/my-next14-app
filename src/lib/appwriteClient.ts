import { Client, Account } from 'appwrite';
import { getToken, isTokenExpired, clearToken } from './session';

export function getAppwriteBrowser() {
  if (typeof window === 'undefined') {
    throw new Error('Appwrite browser SDK must run in the browser');
  }
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  if (!endpoint || !project) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_ENDPOINT or NEXT_PUBLIC_APPWRITE_PROJECT_ID');
  }
  
  const client = new Client().setEndpoint(endpoint).setProject(project);
  
  // Authenticate with JWT if available and not expired
  const jwt = getToken();
  if (jwt) {
    // Check if token is expired before using it
    if (isTokenExpired()) {
      // Clear expired token to prevent errors
      clearToken();
      console.warn('[Auth] Expired JWT token cleared');
    } else {
      // Token is valid, set it on the client
      client.setJWT(jwt);
    }
  }
  
  return { client, account: new Account(client) };
}
