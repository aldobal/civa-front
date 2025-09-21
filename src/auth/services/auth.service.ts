// src/services/authService.ts
import { AppDispatch } from '../redux/store';
import { setUser, resetUser } from '../redux/states/user'; 
import { SignUpRequest } from '../models/sign-up.request';
import { SignUpResponse } from '../models/sign-up.response';
import { httpClient } from './auth.interceptor';

export const login = (username: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await httpClient.post('/authentication/sign-in', { username, password });
    const { id, username: respUsername, token, roles } = response.data;
    
    // Guardar usuario en Redux con roles del backend
    dispatch(setUser({ id, username: respUsername, token, roles }));
    localStorage.setItem('token', token);
    localStorage.setItem('userRoles', JSON.stringify(roles)); // Backup en localStorage
    
    console.log(`Signed in as ${respUsername} with token ${token}`);
    console.log('User roles:', roles);
    
    // Retornar datos para redirección
    return { roles, username: respUsername };
  } catch (error: any) {
    dispatch(resetUser());
    console.error('Error while signing in:', error);
    throw error;
  }
};

export const register = (signUpRequest: SignUpRequest) => async (dispatch: AppDispatch) => {
  try {
    const response = await httpClient.post<SignUpResponse>('/authentication/sign-up', signUpRequest);
    const { id, username, token, roles } = response.data;
    
    // Guardar usuario en Redux con roles
    dispatch(setUser({ id, username, token, roles }));
    localStorage.setItem('token', token);
    localStorage.setItem('userRoles', JSON.stringify(roles));
    
    console.log('User registered successfully:', response.data);
    console.log(`Signed up as ${username} with token ${token}`);
    console.log('User roles:', roles);
    
    // Retornar datos para redirección
    return response.data;
  } catch (error: any) {
    console.error('Error signing up:', error);
    dispatch(resetUser());
    throw error;
  }
};

export const logout = () => (dispatch: AppDispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRoles');
  dispatch(resetUser());
  console.log('User signed out.');
};
