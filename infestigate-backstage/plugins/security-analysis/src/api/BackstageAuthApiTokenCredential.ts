import { OAuthApi } from '@backstage/core-plugin-api';
import {
  TokenCredential,
  GetTokenOptions,
  AccessToken
} from '@azure/core-auth';

export class BackstageAuthApiTokenCredential implements TokenCredential {
  constructor(private authApi: OAuthApi) {
  }

  async getToken(scopes: string | string[], _: GetTokenOptions): Promise<AccessToken | null> {
    const token = await this.authApi.getAccessToken(scopes);
    return {
      token: token,
      expiresOnTimestamp: (Date.now() / 1000) + 10
    };
  }
}