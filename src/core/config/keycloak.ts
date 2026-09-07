import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8096',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'eduweconnect',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'eduweconnect-frontend',
};

const keycloak = new Keycloak(keycloakConfig);

export const keycloakInitOptions = {
  onLoad: 'check-sso',      // silent SSO check; do NOT force login on every page load
  pkceMethod: 'S256',
  checkLoginIframe: false,  // avoid iframe SSO issues
  enableLogging: import.meta.env.DEV,
  messageReceiveTimeout: 10000,
  flow: 'standard',
};

// Helper: build logout URL with post_logout_redirect_uri + client_id + optional id_token_hint
export function getKeycloakLogoutUrl(redirectUri: string, idTokenHint?: string | null): string {
  const url = new URL(`${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout`);
  url.searchParams.append('client_id', keycloakConfig.clientId);
  url.searchParams.append('post_logout_redirect_uri', redirectUri);
  if (idTokenHint) {
    url.searchParams.append('id_token_hint', idTokenHint);
  }
  return url.toString();
}

// Helper: after logout, prefer redirecting to Keycloak LOGIN page
export async function getPostLogoutRedirectToKeycloakLogin(redirectUriAfterLogin: string): Promise<string> {
  const loginUrl = keycloak.createLoginUrl({ redirectUri: redirectUriAfterLogin });
  return loginUrl;
}

export default keycloak;
