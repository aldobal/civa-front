import { BaseService } from "../../shared/services/base.service";
import { BusBrand, BusBrandDependencies } from "../model/bus-brand.model";
import { CreateBusBrandRequest } from "../model/create-bus-brand.request";
import { PageRequest, PageResponse } from "../../shared/models/page.model";

export class BusBrandsService extends BaseService<BusBrand> {
  constructor() {
    super();
    this.resourceEndpoint = '/bus-brands';
  }

  // Obtener todas las marcas de bus (para formularios)
  public async getAllBrands(): Promise<BusBrand[]> {
    try {
      const response = await this.instance.get(`${this.resourceEndpoint}`, {
        params: {
          page: 0,
          size: 100, // Obtener hasta 100 marcas
          sortBy: 'name',
          sortDirection: 'asc'
        }
      });
      return response.data.content;
    } catch (error) {
      console.error('Error getting all bus brands:', error);
      throw error;
    }
  }

  // Crear una nueva marca de bus
  public async create(createBusBrandRequest: CreateBusBrandRequest): Promise<BusBrand> {
    try {
      const response = await this.instance.post(this.resourceEndpoint, createBusBrandRequest);
      return response.data;
    } catch (error) {
      console.error('Error creating bus brand:', error);
      throw error;
    }
  }

  // Actualizar una marca de bus (implementar cuando esté disponible el endpoint)
  public async update(brandId: number, updateBusBrandRequest: CreateBusBrandRequest): Promise<BusBrand> {
    try {
      const response = await this.instance.put(`${this.resourceEndpoint}/${brandId}`, updateBusBrandRequest);
      return response.data;
    } catch (error) {
      console.error('Error updating bus brand:', error);
      throw error;
    }
  }

  // Buscar marcas de buses por nombre con paginación
  public async searchByName(name: string, pageRequest: PageRequest): Promise<PageResponse<BusBrand>> {
    try {
      const params = {
        name,
        page: pageRequest.page,
        size: pageRequest.size,
        sortBy: pageRequest.sortBy,
        sortDirection: pageRequest.sortDirection
      };
      
      const response = await this.instance.get(`${this.resourceEndpoint}/search`, { params });
      return response.data;
    } catch (error) {
      console.error('Error searching bus brands:', error);
      throw error;
    }
  }

  // Obtener dependencias de una marca de bus
  public async getDependencies(brandId: number): Promise<BusBrandDependencies> {
    try {
      const response = await this.instance.get(`${this.resourceEndpoint}/${brandId}/dependencies`);
      return response.data;
    } catch (error) {
      console.error('Error getting bus brand dependencies:', error);
      throw error;
    }
  }

  // Eliminar una marca de bus (con validación de dependencias)
  public async delete(brandId: number): Promise<void> {
    try {
      await this.instance.delete(`${this.resourceEndpoint}/${brandId}`);
    } catch (error) {
      console.error('Error deleting bus brand:', error);
      throw error;
    }
  }

  // Forzar eliminación de una marca de bus (elimina marca y buses asociados)
  public async forceDelete(brandId: number): Promise<void> {
    try {
      await this.instance.delete(`${this.resourceEndpoint}/${brandId}/force`);
    } catch (error) {
      console.error('Error force deleting bus brand:', error);
      throw error;
    }
  }
}
