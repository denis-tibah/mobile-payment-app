import { useState, useEffect } from "react";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

const useDeviceFingerprint = () => {
  const [deviceFingerprint, setDeviceFingerprint] = useState<string | null>(
    null
  );
  const [deviceProperties, setDeviceProperties] = useState<{
    type: string | null;
    name: string | null;
  }>({
    type: "",
    name: "",
  });

  useEffect(() => {
    const getDeviceFingerprint = () => {
      const uniqueId = Constants.deviceId || Constants.installationId; // Unique ID for the device
      const systemName = Device.osName; // OS name
      const systemVersion = Device.osVersion; // OS version
      const brand = Device.brand; // Device brand
      const model = Device.modelName; // Device model
      const buildId = Constants.manifest?.revisionId || "Unknown"; // Build ID (if available)

      // Platform-specific considerations
      const platform = Platform.OS; // "ios" or "android"
      const platformVersion = Platform.Version; // Platform version (number or string)

      const fingerprint = `${uniqueId}-${systemName}-${systemVersion}-${brand}-${model}-${buildId}-${platform}-${platformVersion}`;
      setDeviceFingerprint(fingerprint);
      setDeviceProperties({
        type: systemName,
        name: brand,
      });
    };

    getDeviceFingerprint();
  }, []);

  return {
    deviceFingerprint,
    type: deviceProperties.type,
    name: deviceProperties.name,
  };
};

export default useDeviceFingerprint;
