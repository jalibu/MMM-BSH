export type Service = {
  id: string;
  deviceId: string;
  deviceName: string;
};

export interface BatteryLevelService extends Service {
  faults?: any;
}

export interface BinarySwitchService extends Service {
  state?: any;
}

export interface ShutterContactService extends Service {
  state?: { value: string };
}

export interface TemperatureLevelService extends Service {
  state?: any;
}
export interface ValveTappetService extends Service {
  state?: any;
}

export interface AirQualityService extends Service {
  state?: { purity: number; comfortZone: ComfortZone };
}

export type ComfortZone = {
  custom?: boolean;
  maxHumidity?: number;
  maxPurity?: number;
  maxTemperature?: number;
  minHumidity?: number;
  minTemperature?: number;
  name?: string;
};
