import {
  setCredentialFeature
} from "./chunk-A5TI2FW3.js";
import {
  CredentialsProviderError
} from "./chunk-2LFJGUP7.js";
import "./chunk-PLDDJCW6.js";

// ../../node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@aws-sdk/credential-provider-node/node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromTokenFile.js
import { readFileSync } from "fs";

// ../../node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@aws-sdk/credential-provider-node/node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromWebToken.js
var fromWebToken = (init) => async (awsIdentityProperties) => {
  init.logger?.debug("@aws-sdk/credential-provider-web-identity - fromWebToken");
  const { roleArn, roleSessionName, webIdentityToken, providerId, policyArns, policy, durationSeconds } = init;
  let { roleAssumerWithWebIdentity } = init;
  if (!roleAssumerWithWebIdentity) {
    const { getDefaultRoleAssumerWithWebIdentity } = await import("./sts-Q65NM65C.js");
    roleAssumerWithWebIdentity = getDefaultRoleAssumerWithWebIdentity({
      ...init.clientConfig,
      credentialProviderLogger: init.logger,
      parentClientConfig: {
        ...awsIdentityProperties?.callerClientConfig,
        ...init.parentClientConfig
      }
    }, init.clientPlugins);
  }
  return roleAssumerWithWebIdentity({
    RoleArn: roleArn,
    RoleSessionName: roleSessionName ?? `aws-sdk-js-session-${Date.now()}`,
    WebIdentityToken: webIdentityToken,
    ProviderId: providerId,
    PolicyArns: policyArns,
    Policy: policy,
    DurationSeconds: durationSeconds
  });
};

// ../../node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@aws-sdk/credential-provider-node/node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromTokenFile.js
var ENV_TOKEN_FILE = "AWS_WEB_IDENTITY_TOKEN_FILE";
var ENV_ROLE_ARN = "AWS_ROLE_ARN";
var ENV_ROLE_SESSION_NAME = "AWS_ROLE_SESSION_NAME";
var fromTokenFile = (init = {}) => async () => {
  init.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
  const webIdentityTokenFile = init?.webIdentityTokenFile ?? process.env[ENV_TOKEN_FILE];
  const roleArn = init?.roleArn ?? process.env[ENV_ROLE_ARN];
  const roleSessionName = init?.roleSessionName ?? process.env[ENV_ROLE_SESSION_NAME];
  if (!webIdentityTokenFile || !roleArn) {
    throw new CredentialsProviderError("Web identity configuration not specified", {
      logger: init.logger
    });
  }
  const credentials = await fromWebToken({
    ...init,
    webIdentityToken: readFileSync(webIdentityTokenFile, { encoding: "ascii" }),
    roleArn,
    roleSessionName
  })();
  if (webIdentityTokenFile === process.env[ENV_TOKEN_FILE]) {
    setCredentialFeature(credentials, "CREDENTIALS_ENV_VARS_STS_WEB_ID_TOKEN", "h");
  }
  return credentials;
};
export {
  fromTokenFile,
  fromWebToken
};
//# sourceMappingURL=dist-es-P6UNWROG.js.map