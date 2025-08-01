import * as LocalAuthentication from "expo-local-authentication";

export class BiometricService {
  static async isBiometricAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  }

  static async authenticate(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access your account",
        fallbackLabel: "Use passcode",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error("Biometric authentication error:", error);
      return false;
    }
  }

  static async getSupportedTypes(): Promise<
    LocalAuthentication.AuthenticationType[]
  > {
    return await LocalAuthentication.supportedAuthenticationTypesAsync();
  }
}
