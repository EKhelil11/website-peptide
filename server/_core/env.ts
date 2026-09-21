export function parseBooleanEnv(value: string | undefined) {
  return value?.trim().toLowerCase() === "true";
}

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  shipstationApiKey: process.env.SHIPSTATION_API_KEY ?? "",
  shipstationApiSecret: process.env.SHIPSTATION_API_SECRET ?? "",
  whitcombProcessNowKey: process.env.WHITCOMB_PROCESS_NOW_KEY ?? "",
  liveEmailEnabled: parseBooleanEnv(process.env.ENABLE_LIVE_EMAIL),
  liveShipstationEnabled: parseBooleanEnv(process.env.ENABLE_LIVE_SHIPSTATION),
  liveWhitcombEnabled: parseBooleanEnv(process.env.ENABLE_LIVE_WHITCOMB),
};
