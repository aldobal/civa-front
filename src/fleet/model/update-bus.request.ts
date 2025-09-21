// src/fleet/model/update-bus.request.ts
export interface UpdateBusRequest {
  number?: string;
  licensePlate?: string;
  brandId?: number;
  features?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}