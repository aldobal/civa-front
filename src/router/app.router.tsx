import React from "react";
import { ReactElement } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { PrivateRoute } from "./private.route";
import { AdminRoute } from "./admin.route";
import { Layout } from "../shared/layouts/layout";
import SignIn from "../auth/pages/sign-in";
import SignUp from "../auth/pages/sign-up";
import Home from "../shared/pages/home";
import Fleet from "../fleet/pages/fleet";
import BusBrandsManagement from "../fleet/pages/bus-brands";
import UserDashboard from "../user/pages/dashboard";
import { useSelector } from "react-redux";
import { RootState } from "../auth/redux/store";

export const AppRouter = (): ReactElement => {
  const isLogged = useSelector((state: RootState) =>
    !!state.user.token || !!localStorage.getItem('token')
  );
  
  return (
    <Layout>
      <Routes>
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute canActivate={isLogged} defaultDestination="/sign-in" />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/fleet" element={
            <AdminRoute>
              <Fleet />
            </AdminRoute>
          } />
          <Route path="/admin/bus-brands" element={
            <AdminRoute>
              <BusBrandsManagement />
            </AdminRoute>
          } />
          {/* Rutas placeholder para futuras funcionalidades */}
          <Route path="/admin/users" element={
            <AdminRoute>
              <div className="p-8 text-center text-white">User Management - Coming Soon</div>
            </AdminRoute>
          } />
          <Route path="/admin/reports" element={
            <AdminRoute>
              <div className="p-8 text-center text-white">Reports - Coming Soon</div>
            </AdminRoute>
          } />
          <Route path="/bookings" element={
            <div className="p-8 text-center text-white">My Bookings - Coming Soon</div>
          } />
          <Route path="/routes" element={
            <div className="p-8 text-center text-white">Routes - Coming Soon</div>
          } />
        </Route>
      </Routes>
    </Layout>
  );
};
