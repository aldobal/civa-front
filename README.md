# 🚌 Fleet Management System - Frontend

## 📋 Descripción

Este proyecto es la implementación del **frontend** de una prueba, desarrollando un sistema completo de gestión de flota de autobuses. La aplicación consume una API REST desarrollada en Spring Boot y proporciona una interfaz moderna y funcional para la administración de buses y marcas.

## 🎯 Objetivos de la Prueba Técnica

### **Backend Implementado:**
✅ API REST de buses con todos los campos requeridos  
✅ Endpoints GET /buses y GET /buses/{id}  
✅ Java 17 + Spring Boot 3  
✅ Base de datos PostgreSQL  
✅ Tabla relacionada para marcas de bus  
✅ **BONUS:** Paginación implementada  
✅ **BONUS:** Seguridad JWT completa  
✅ **BONUS:** CRUD completo (Create, Update, Delete, Activate/Deactivate)  

### **Frontend Implementado:**
✅ React 18 + TypeScript  
✅ Consumo de endpoint /buses con tabla de datos  
✅ Manejo de estado con useState  
✅ Fetching de datos con useEffect  
✅ **BONUS:** Paginación completa  
✅ **BONUS:** Consumo de /buses/{id} para detalles  
✅ **BONUS:** TypeScript en todo el proyecto  
✅ **BONUS:** Sistema de autenticación completo  
✅ **BONUS:** CRUD completo con modales  

## 🚀 Tecnologías Utilizadas

### **Core:**
- **React 18.3** - Biblioteca principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server

### **Estado y Datos:**
- **Redux Toolkit** - Manejo de estado global
- **Axios** - Cliente HTTP con interceptors
- **useState/useEffect** - Estado local y efectos

### **UI/UX:**
- **Tailwind CSS** - Styling utility-first
- **Glassmorphism Design** - Efectos modernos
- **Responsive Design** - Adaptable a todos los dispositivos

### **Routing y Seguridad:**
- **React Router v6** - Navegación SPA
- **JWT Authentication** - Tokens seguros
- **Protected Routes** - Rutas privadas por rol

## 📁 Estructura del Proyecto

```
src/
├── auth/                    # Sistema de autenticación
│   ├── components/         # Componentes de auth
│   ├── models/            # Interfaces de auth
│   ├── pages/             # Sign-in, Sign-up
│   ├── redux/             # Estado global (Redux)
│   └── services/          # Servicios de auth + interceptors
├── fleet/                  # Gestión de flota
│   ├── components/        # Componentes de fleet
│   ├── model/             # Interfaces de buses y marcas
│   ├── pages/             # Fleet, Bus-brands management
│   └── services/          # Servicios de API
├── shared/                # Componentes compartidos
│   ├── components/        # Header, Layout
│   ├── models/            # Interfaces globales
│   └── services/          # BaseService
├── router/                # Configuración de rutas
└── environment/           # Variables de entorno
```

## 🎨 Características Principales

### **🔐 Sistema de Autenticación:**
- Login/Registro con validación
- Roles de usuario (ADMIN/USER)
- JWT tokens con refresh automático
- Rutas protegidas por rol

### **🚌 Gestión de Buses:**
- ✅ **Listar buses** con paginación
- ✅ **Crear nuevo bus** con modal
- ✅ **Editar bus existente**
- ✅ **Activar/Desactivar buses**
- ✅ **Eliminar buses**
- ✅ **Búsqueda y filtros**

### **🏭 Gestión de Marcas:**
- ✅ **CRUD completo de marcas**
- ✅ **Validación de dependencias**
- ✅ **Eliminación forzada con warning**

### **💫 UI/UX Moderna:**
- Diseño glassmorphism con efectos visuales
- Animaciones CSS personalizadas
- Feedback visual en todas las acciones
- Responsive design completo

## 🛠️ Instalación y Configuración

### **Prerrequisitos:**
- Node.js 18+ 
- npm o yarn
- Backend Spring Boot ejecutándose en puerto 8080

### **Pasos de instalación:**

1. **Clonar el repositorio:**
```bash
git clone https://github.com/aldobal/civa-front.git
cd civa-front
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```typescript
// src/environment/enviroment.ts
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080/api/v1'
};
```

4. **Ejecutar en modo desarrollo:**
```bash
npm run dev
```

5. **Abrir en navegador:**
```
http://localhost:5173
```

## 🔑 Credenciales de Prueba

### **Administrador:**
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Rol:** ROLE_ADMIN

### **Usuario Regular:**
- **Usuario:** `user`
- **Contraseña:** `user123`
- **Rol:** ROLE_USER

## 📊 Funcionalidades por Rol

### **👤 Usuario Regular:**
- ✅ Ver dashboard personal (futuro)
- ✅ Visualizar lista de buses (futuro)
- ✅ Ver detalles de buses (futuro)

### **👨‍💼 Administrador:**
- ✅ Gestión completa de buses (CRUD)
- ✅ Gestión completa de marcas (CRUD)
- ✅ Activar/desactivar buses
- ✅ Gestión de usuarios (futuro)

## 🌐 Endpoints Consumidos

### **Autenticación:**
- `POST /authentication/sign-in` - Login
- `POST /authentication/sign-up` - Registro

### **Buses:**
- `GET /buses` - Listar buses (paginado)
- `GET /buses/{id}` - Obtener bus por ID
- `POST /buses` - Crear nuevo bus
- `PUT /buses/{id}` - Actualizar bus
- `PATCH /buses/{id}/activate` - Activar bus
- `PATCH /buses/{id}/deactivate` - Desactivar bus
- `DELETE /buses/{id}` - Eliminar bus

### **Marcas:**
- `GET /bus-brands` - Listar marcas (paginado)
- `POST /bus-brands` - Crear marca
- `PUT /bus-brands/{id}` - Actualizar marca
- `DELETE /bus-brands/{id}` - Eliminar marca
- `GET /bus-brands/{id}/dependencies` - Ver dependencias

## 🎯 Cumplimiento de Requisitos

### **✅ Obligatorios:**
- [x] React 18 ✅
- [x] useState para manejo de estado ✅
- [x] useEffect para fetching ✅
- [x] Consumir endpoint /buses ✅
- [x] Mostrar datos en tabla ✅

### **✅ Opcionales (TODOS IMPLEMENTADOS):**
- [x] Paginación ✅
- [x] Consumir /buses/{id} ✅
- [x] TypeScript ✅
- [x] **BONUS:** Sistema completo de autenticación
- [x] **BONUS:** CRUD completo
- [x] **BONUS:** Roles de usuario
- [x] **BONUS:** UI moderna con Tailwind CSS

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Construcción
npm run build        # Build para producción
npm run preview      # Preview del build

# Linting
npm run lint         # Revisar código con ESLint
```

## 📱 Capturas de Pantalla

### **🔐 Login/Registro:**
- Formularios modernos con validación
- Toggle entre roles de usuario
- Efectos visuales glassmorphism

### **📊 Dashboard:**
- Acciones rápidas según rol
- Navegación intuitiva
- Diseño responsive

### **🚌 Gestión de Buses:**
- Tabla con paginación
- Modales para CRUD
- Botones de acción contextuales

## 🛡️ Seguridad Implementada

- ✅ **JWT Authentication** con tokens seguros
- ✅ **Axios Interceptors** para manejo automático de tokens
- ✅ **Protected Routes** según roles
- ✅ **Error Handling** centralizado
- ✅ **Logout automático** en token expiration

## 🔄 Estado de la Aplicación

### **✅ Completado:**
- Sistema de autenticación completo
- CRUD de buses funcional
- CRUD de marcas funcional
- UI moderna y responsive
- Manejo de errores

### **🔄 En Desarrollo:**
- Gestión de usuarios
- Sistema de reportes
- Funcionalidades adicionales

## 👨‍💻 Autor

**CodAress**
- GitHub: [@CodAress](https://github.com/CodAress)
