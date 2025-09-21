// src/fleet/model/create-bus.request.ts
export interface CreateBusRequest {
  number: string;
  licensePlate: string;
  brandId: number;
  features: string;
  status?: 'ACTIVE' | 'INACTIVE'; // Opcional, por defecto ACTIVE
}