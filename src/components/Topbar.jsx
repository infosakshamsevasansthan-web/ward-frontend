import React from 'react';
import { Bell, UserCircle } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
      <div className="text-gray-600 font-medium">स्वागत है, एडमिन</div>
      <div className="flex items-center gap-4 text-gray-500">
        <Bell className="w-5 h-5 cursor-pointer hover:text-blue-600" />
        <div className="flex items-center gap-2 border-l pl-4 cursor-pointer">
          <UserCircle className="w-8 h-8 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;