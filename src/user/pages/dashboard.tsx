import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../auth/redux/store';

const UserDashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse pointer-events-none" style={{animationDelay: '2s'}}></div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-6">
        {/* Header */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">User Dashboard</h1>
              <p className="text-gray-300">Welcome back, {user.username}!</p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/20 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">User Access</h3>
                <p className="text-gray-300 text-sm">Standard user privileges</p>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/20 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Account Active</h3>
                <p className="text-gray-300 text-sm">Your account is verified</p>
              </div>
            </div>
          </div>

          {/* Features Card */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500/20 p-3 rounded-full">
                <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Available Features</h3>
                <p className="text-gray-300 text-sm">Access your allowed modules</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notice for Users */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-6 mt-6">
          <div className="text-center">
            <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">User Dashboard</h3>
            <p className="text-gray-300 mb-4">
              This is your user dashboard. As a standard user, you have access to basic features and functionalities.
            </p>
            <p className="text-blue-300 text-sm">
              Your role: <span className="font-semibold">{user.roles?.join(', ') || 'User'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;