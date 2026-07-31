import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  FileBarChart, 
  Settings, 
  LogOut, 
  Users, 
  X, 
  MapPin,
  ClipboardList
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // रोल और यूजर का नाम लोकल स्टोरेज से लें
  const role = localStorage.getItem('role'); // 'admin' या 'user'

  // --- डायनामिक मेनू आइटम्स ---
  const menuItems = [
  // डैशबोर्ड सिर्फ एडमिन को दिखेगा
  { name: 'डैशबोर्ड', icon: <LayoutDashboard size={20}/>, path: '/dashboard', roles: ['admin'] },
  
  { name: 'डाटा कलेक्शन', icon: <Database size={20}/>, path: '/data-collection', roles: ['admin', 'user'] },
  
  // एडमिन मेनू
  { name: 'यूजर मैनेजमेंट', icon: <Users size={20}/>, path: '/users', roles: ['admin'] },
  { name: 'एडमिन रिपोर्ट्स', icon: <ClipboardList size={20}/>, path: '/reports', roles: ['admin'] },
  
  // यूजर मेनू
  { name: 'मेरी रिपोर्ट', icon: <FileBarChart size={20}/>, path: '/user-report', roles: ['user'] },
  
  { name: 'सेटिंग्स', icon: <Settings size={20}/>, path: '/settings', roles: ['user', 'admin'] },
];

  // रोल के हिसाब से मेनू फ़िल्टर करना
  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
  if (window.confirm("क्या आप लॉगआउट करना चाहते हैं?")) {
    // 1. लोकल स्टोरेज साफ़ करें
    localStorage.clear();
    
    // 2. navigate की जगह window.location.href का इस्तेमाल करें
    // इससे पूरा ऐप रिफ्रेश होगा और कचरा साफ हो जाएगा
    window.location.href = "/"; 
  }
};

  return (
    <>
      {/* मोबाइल पर पीछे का काला साया (Overlay) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] md:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* मुख्य साइडबार बॉडी */}
      <aside className={`fixed md:static inset-y-0 left-0 w-72 bg-[#0f172a] text-white z-[200] transform transition-transform duration-300 ease-in-out border-r border-slate-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        <div className="flex flex-col h-full">
          
          {/* Logo Section */}
          <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                <MapPin className="text-white" size={24}/>
              </div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic">
                Ward <span className="text-blue-500">Sync</span>
              </h1>
            </div>
            {/* मोबाइल क्लोज बटन */}
            <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white p-1">
              <X size={24}/>
            </button>
          </div>

          {/* User Profile Info (Side) */}
          <div className="px-6 py-4 bg-slate-800/30">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">लॉगिन रोल</p>
             <p className="text-sm font-bold text-blue-400 uppercase">{role === 'admin' ? '🛡️ Administrator' : '👷 Field Operator'}</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {filteredMenu.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && toggleSidebar()}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-200 group
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
                >
                  <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm uppercase tracking-widest font-black">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Logout Section */}
          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl font-black text-rose-400 hover:bg-rose-500/10 transition-all group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform"/>
              <span className="text-sm uppercase tracking-widest">लॉगआउट</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;