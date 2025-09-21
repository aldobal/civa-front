import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../auth/redux/store";
import { setUser } from "../auth/redux/states/user";

type PrivateRoutesProps = {
  canActivate: boolean,
  defaultDestination: string
}

export const PrivateRoute = ({ canActivate, defaultDestination }: PrivateRoutesProps): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Si hay token en localStorage pero no hay usuario en Redux, restaurar desde localStorage
    const token = localStorage.getItem('token');
    const userRoles = localStorage.getItem('userRoles');
    
    if (token && !user.token) {
      try {
        const roles = userRoles ? JSON.parse(userRoles) : ['ROLE_USER'];
        
        // Restaurar usuario básico desde localStorage
        // Nota: En un entorno real, harías una llamada al backend para obtener la info completa del usuario
        dispatch(setUser({ 
          id: 0, // Placeholder - idealmente obtener del backend
          username: 'user', // Placeholder - idealmente obtener del backend
          token, 
          roles 
        }));
      } catch (error) {
        console.error('Error restoring user from localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userRoles');
      }
    }
  }, [dispatch, user.token]);

  return canActivate ? <Outlet /> : <Navigate to={defaultDestination} />
}