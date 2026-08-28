export interface GeofenceTrigger {
  id: string;
  type: string;
  loiteringDelay: number;
  action: Record<string, unknown>;
}

export interface Geofence {
  id: string;
  lat: number;
  lon: number;
  radius: number;
  waitInterval: number;
  triggers: GeofenceTrigger[];
}
