export interface Bus {
    id: number;
    number: string;
    licensePlate: string;
    brand: string;
    features?: string;
    status: 'ACTIVE' | 'INACTIVE';
}