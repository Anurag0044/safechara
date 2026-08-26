// import { BleManager, Device } from 'react-native-ble-plx';

// Mocking the BLE Manager for Expo Go compatibility
export class MockBleManager {
  startDeviceScan(uuids: string[] | null, options: any, listener: (error: Error | null, device: any) => void) {
    // Simulate finding a device after 2 seconds
    setTimeout(() => {
      listener(null, {
        id: '00:11:22:33:44:55',
        name: 'SafeChara Sensor V1',
        localName: 'SafeChara Sensor',
        rssi: -45,
      });
    }, 2000);
  }

  stopDeviceScan() {
    console.log('Stopped scanning');
  }

  async connectToDevice(deviceId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: deviceId,
          name: 'SafeChara Sensor V1',
          isConnected: () => Promise.resolve(true),
        });
      }, 1500);
    });
  }
}

export const bleManager = new MockBleManager();
