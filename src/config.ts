import type { ConfigModule } from './definitions';

export function createConfigModule(plugin: {
  changeApplicationCode(options: { applicationCode: string }): Promise<void>;
  changeMerchantId(options: { merchantId: string }): Promise<void>;
  getApplicationCode(): Promise<{ applicationCode: string }>;
  getMerchantId(): Promise<{ merchantId: string }>;
  getClientId(): Promise<{ clientId: string }>;
  getLanguageCode(): Promise<{ languageCode: string }>;
  getSdkVersion(): Promise<{ sdkVersion: string }>;
}): ConfigModule {
  return {
    changeApplicationCode: (applicationCode) => plugin.changeApplicationCode({ applicationCode }),
    changeMerchantId: (merchantId) => plugin.changeMerchantId({ merchantId }),
    async getApplicationCode() {
      const { applicationCode } = await plugin.getApplicationCode();
      return applicationCode;
    },
    async getMerchantId() {
      const { merchantId } = await plugin.getMerchantId();
      return merchantId;
    },
    async getClientId() {
      const { clientId } = await plugin.getClientId();
      return clientId;
    },
    async getLanguageCode() {
      const { languageCode } = await plugin.getLanguageCode();
      return languageCode;
    },
    async getSdkVersion() {
      const { sdkVersion } = await plugin.getSdkVersion();
      return sdkVersion;
    },
  };
}
