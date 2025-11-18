import { Client, Account } from 'appwrite';

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
  return { client, account: new Account(client) };
}
