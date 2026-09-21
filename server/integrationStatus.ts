import { ENV } from "./_core/env";

export type IntegrationSecrets = {
  resendApiKey?: string;
  shipstationApiKey?: string;
  shipstationApiSecret?: string;
  whitcombProcessNowKey?: string;
  liveEmailEnabled?: boolean;
  liveShipstationEnabled?: boolean;
  liveWhitcombEnabled?: boolean;
};

export function evaluateIntegrationStatus(secrets: IntegrationSecrets) {
  const emailCredentialsPresent = Boolean(secrets.resendApiKey?.trim());
  const shipstationCredentialsPresent = Boolean(
    secrets.shipstationApiKey?.trim() && secrets.shipstationApiSecret?.trim(),
  );
  const whitcombCredentialsPresent = Boolean(secrets.whitcombProcessNowKey?.trim());
  const emailConfigured = emailCredentialsPresent && secrets.liveEmailEnabled === true;
  const shipstationConfigured =
    shipstationCredentialsPresent && secrets.liveShipstationEnabled === true;
  const whitcombConfigured =
    whitcombCredentialsPresent && secrets.liveWhitcombEnabled === true;

  return {
    email: {
      credentialsPresent: emailCredentialsPresent,
      approved: secrets.liveEmailEnabled === true,
      configured: emailConfigured,
      message: emailConfigured
        ? "Transactional email is configured and approved for live use."
        : emailCredentialsPresent
          ? "Transactional email is disabled pending owner approval."
          : "Transactional email is disabled pending Resend authorization.",
    },
    shipstation: {
      credentialsPresent: shipstationCredentialsPresent,
      approved: secrets.liveShipstationEnabled === true,
      configured: shipstationConfigured,
      message: shipstationConfigured
        ? "ShipStation fulfillment is configured and approved for live use."
        : shipstationCredentialsPresent
          ? "ShipStation fulfillment is disabled pending owner approval."
          : "ShipStation fulfillment is disabled pending reauthorization.",
    },
    whitcomb: {
      credentialsPresent: whitcombCredentialsPresent,
      approved: secrets.liveWhitcombEnabled === true,
      configured: whitcombConfigured,
      message: whitcombConfigured
        ? "Whitcomb hosted card checkout is configured and approved for live use."
        : whitcombCredentialsPresent
          ? "Whitcomb hosted card checkout is disabled pending owner approval."
          : "Whitcomb hosted card checkout is disabled pending activation.",
    },
  } as const;
}

export function getIntegrationStatus() {
  return evaluateIntegrationStatus({
    resendApiKey: ENV.resendApiKey,
    shipstationApiKey: ENV.shipstationApiKey,
    shipstationApiSecret: ENV.shipstationApiSecret,
    whitcombProcessNowKey: ENV.whitcombProcessNowKey,
    liveEmailEnabled: ENV.liveEmailEnabled,
    liveShipstationEnabled: ENV.liveShipstationEnabled,
    liveWhitcombEnabled: ENV.liveWhitcombEnabled,
  });
}

export function isEmailConfigured() {
  return getIntegrationStatus().email.configured;
}

export function isShipStationConfigured() {
  return getIntegrationStatus().shipstation.configured;
}

export function isWhitcombConfigured() {
  return getIntegrationStatus().whitcomb.configured;
}
