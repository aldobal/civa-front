import { BaseService } from "../../shared/services/base.service";
import { Bus } from "../model/bus.entite";
import { CreateBusRequest } from "../model/create-bus.request";
import { UpdateBusRequest } from "../model/update-bus.request";
import { PageRequest, PageResponse } from "../../shared/models/page.model";

export class BusesService extends BaseService<Bus> {
  constructor() {
    super();
    this.resourceEndpoint = '/buses';
  }

  // Sobrescribir getAllPaginated - sin transformación, la API ya envía el formato correcto
  public async getAllPaginated(pageRequest: PageRequest): Promise<PageResponse<Bus>> {
    try {
      const params = {
        page: pageRequest.page,
        size: pageRequest.size,
        sortBy: pageRequest.sortBy,
        sortDirection: pageRequest.sortDirection
      };
      
      const response = await this.instance.get(this.resourceEndpoint, { params });
      return response.data; // Sin transformación - la API ya envía el formato correcto
    } catch (error) {
      console.error('Error getting paginated buses:', error);
      throw error;
    }
  }

  // Crear un nuevo bus
  public async create(createBusRequest: CreateBusRequest): Promise<Bus> {
    try {
      const response = await this.instance.post(this.resourceEndpoint, createBusRequest);
      return response.data;
    } catch (error) {
      console.error('Error creating bus:', error);
      throw error;
    }
  }

  // Actualizar un bus
  public async update(busId: number, updateBusRequest: UpdateBusRequest): Promise<Bus> {
    try {
      const response = await this.instance.put(`${this.resourceEndpoint}/${busId}`, updateBusRequest);
      return response.data;
    } catch (error) {
      console.error('Error updating bus:', error);
      throw error;
    }
  }

  // Obtener un bus por ID
  public async getById(busId: number): Promise<Bus> {
    try {
      const response = await this.instance.get(`${this.resourceEndpoint}/${busId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting bus by id:', error);
      throw error;
    }
  }

  // Activar un bus
  public async activate(busId: number): Promise<Bus> {
    try {
      const response = await this.instance.patch(`${this.resourceEndpoint}/${busId}/activate`);
      return response.data;
    } catch (error) {
      console.error('Error activating bus:', error);
      throw error;
    }
  }

  // Desactivar un bus
  public async deactivate(busId: number): Promise<Bus> {
    try {
      const response = await this.instance.patch(`${this.resourceEndpoint}/${busId}/deactivate`);
      return response.data;
    } catch (error) {
      console.error('Error deactivating bus:', error);
      throw error;
    }
  }

  // Eliminar un bus (eliminación lógica)
  public async delete(busId: number): Promise<void> {
    try {
      await this.instance.delete(`${this.resourceEndpoint}/${busId}`);
    } catch (error) {
      console.error('Error deleting bus:', error);
      throw error;
    }
  }
}
