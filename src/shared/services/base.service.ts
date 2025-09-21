// src/services/BaseService.ts
import { AxiosInstance, AxiosError } from 'axios';
import { environment } from '../../environment/enviroment';
import { PageRequest, PageResponse } from '../models/page.model';
import { httpClient } from '../../auth/services/auth.interceptor';

export class BaseService<T> {
  protected instance: AxiosInstance;
  protected basePath: string;
  protected resourceEndpoint: string = '/resources';

  constructor() {
    this.basePath = environment.apiUrl;
    // Usar el httpClient que ya tiene los interceptors configurados
    this.instance = httpClient;
  }

  protected resourcePath(): string {
    return `${this.resourceEndpoint}`;
  }

  protected handleError(error: AxiosError) {
    if (error.response) {
      console.error(
        `Backend returned code ${error.response.status}, body was: ${error.response.data}`
      );
    } else if (error.request) {
      console.error('No response was received:', error.request);
    } else {
      console.error('Error creating the request:', error.message);
    }
    return Promise.reject(new Error('Something bad happened; please try again later.'));
  }

  public async create(item: any): Promise<T> {
    try {
      const response = await this.instance.post<T>(this.resourcePath(), JSON.stringify(item));
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  public async delete(id: any): Promise<any> {
    try {
      const response = await this.instance.delete(`${this.resourcePath()}/${id}`);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  public async update(id: any, item: any): Promise<T> {
    try {
      const response = await this.instance.put<T>(`${this.resourcePath()}/${id}`, JSON.stringify(item));
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  public async getAll(): Promise<T[]> {
    try {
      const response = await this.instance.get<T[]>(this.resourcePath());
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  public async getAllPaginated(params: PageRequest = {}): Promise<PageResponse<T>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

      const url = `${this.resourcePath()}?${queryParams.toString()}`;
      const response = await this.instance.get<PageResponse<T>>(url);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }
}
