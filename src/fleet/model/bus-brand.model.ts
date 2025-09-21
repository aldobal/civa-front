// src/fleet/model/bus-brand.model.ts
export interface BusBrand {
  id: number;
  name: string;
}

export interface BusBrandDependencies {
  busBrandId: number;
  brandName: string;
  activeBusesCount: number;
  inactiveBusesCount: number;
  totalBusesCount: number;
  canBeDeleted: boolean;
}