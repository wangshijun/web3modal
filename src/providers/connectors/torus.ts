import { IAbstractConnectorOptions } from "../../helpers";

interface NetworkParams {
  host:
    | "mainnet"
    | "rinkeby"
    | "ropsten"
    | "kovan"
    | "goerli"
    | "localhost"
    | "matic"
    | string;
  chainId?: number;
  networkName?: string;
}

interface VerifierStatus {
  google?: boolean;
  facebook?: boolean;
  reddit?: boolean;
  twitch?: boolean;
  discord?: boolean;
}

interface LoginParams {
  verifier?: "google" | "facebook" | "twitch" | "reddit" | "discord";
}

export interface IOptions {
  enableLogging?: boolean;
  buttonPosition?: string;
  buildEnv?: string;
  showTorusButton?: boolean;
  enabledVerifiers?: VerifierStatus;
}

export interface ITorusConnectorOptions extends IAbstractConnectorOptions {
  config?: IOptions;
  loginParams?: LoginParams;
  networkParams?: NetworkParams;
}

// Supports Torus package versions 0.2.*
const ConnectToTorus = async (Torus: any, opts: ITorusConnectorOptions) => {
  return new Promise(async (resolve, reject) => {
    try {
      // defaults
      let buttonPosition = "bottom-left";
      let buildEnv = "production";
      let enableLogging = true;
      let showTorusButton = false;
      let enabledVerifiers = {};
      let network: NetworkParams = { host: "mainnet" };
      let defaultVerifier = undefined;

      // parsing to Torus interfaces
      network =
        opts.networkParams || opts.network
          ? { host: opts.network, ...opts.networkParams }
          : network;

      if (opts.config) {
        buttonPosition = opts.config.buttonPosition || buttonPosition;
        buildEnv = opts.config.buildEnv || buildEnv;
        enableLogging = opts.config.enableLogging || enableLogging;
        showTorusButton = opts.config.showTorusButton || showTorusButton;
        enabledVerifiers = opts.config.enabledVerifiers || enabledVerifiers;
      }

      const torus = new Torus({
        buttonPosition: buttonPosition
      });
      await torus.init({
        buildEnv: buildEnv,
        enableLogging: enableLogging,
        network: network,
        showTorusButton: showTorusButton,
        enabledVerifiers: enabledVerifiers
      });

      if (opts.loginParams) {
        defaultVerifier = opts.loginParams.verifier;
      }
      await torus.login({ verifier: defaultVerifier });
      const provider = torus.provider;
      provider.torus = torus;
      resolve(provider);
    } catch (err) {
      reject(err);
    }
  });
};

export default ConnectToTorus;
