import { PublicClientApplication, Configuration, BrowserCacheLocation } from '@azure/msal-browser';

export const MSAL_CONFIG: Configuration = {
  auth: {
    clientId: 'e26581b7-b8fd-45cf-8610-b87570d1c4d9',
    authority: 'https://login.microsoftonline.com/6b99dd4b-9681-4414-8a12-1beeb67853f9',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
  },
};

export const BC_SCOPES = ['https://api.businesscentral.dynamics.com/user_impersonation'];

export const msalInstance = new PublicClientApplication(MSAL_CONFIG);
