import { PublicClientApplication, Configuration, BrowserCacheLocation } from '@azure/msal-browser';
import { environment } from '../environments/environment';

export const MSAL_CONFIG: Configuration = {
  auth: {
    clientId: environment.microsoft.clientId,
    authority: `https://login.microsoftonline.com/${environment.microsoft.tenantId}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
  },
};

export const BC_SCOPES = environment.businessCentral.scopes;

export const msalInstance = new PublicClientApplication(MSAL_CONFIG);
