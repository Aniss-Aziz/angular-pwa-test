interface Navigator {
  bluetooth: {
    requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
  };
  contacts: {
    select(
      properties: string[],
      options: { multiple: boolean }
    ): Promise<any[]>;
  };
  connection: any;
}

interface RequestDeviceOptions {
  filters?: BluetoothRequestDeviceFilter[];
  optionalServices?: BluetoothServiceUUID[];
  acceptAllDevices?: boolean;
}

interface BluetoothRequestDeviceFilter {
  services?: BluetoothServiceUUID[];
  name?: string;
  namePrefix?: string;
}

type BluetoothServiceUUID = number | string;

interface BluetoothDevice {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
}

interface BluetoothRemoteGATTServer {
  device: BluetoothDevice;
  connected: boolean;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(
    service: BluetoothServiceUUID
  ): Promise<BluetoothRemoteGATTService>;
}

interface BluetoothRemoteGATTService {
  getCharacteristic(
    characteristic: BluetoothCharacteristicUUID
  ): Promise<BluetoothRemoteGATTCharacteristic>;
}

type BluetoothCharacteristicUUID = number | string;

interface BluetoothRemoteGATTCharacteristic {
  readValue(): Promise<DataView>;
}
