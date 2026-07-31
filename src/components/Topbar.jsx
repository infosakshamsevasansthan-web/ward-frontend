import React from 'react';
import { Bell, UserCircle, Menu, User, ChevronDown } from 'lucide-react';

const Topbar = ({ toggleSidebar }) => {
  // लोकल स्टोरेज से लॉगिन जानकारी निकालें
  const username = localStorage.getItem('username') || "User";
  const role = localStorage.getItem('role');

  // रोल को हिंदी में दिखाने के लिए
  const roleHindi = role === 'admin' ? 'प्रशासक (Admin)' : 'ऑपरेटर (Operator)';

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[100] shadow-sm shadow-slate-200/20">
      
      {/* बायीं तरफ: मोबाइल बटन और स्वागत संदेश */}
      <div className="flex items-center gap-4">
        {/* मोबाइल हैमबर्गर बटन (सिर्फ मोबाइल पर दिखेगा) */}
        <button 
          onClick={toggleSidebar}
          className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all md:hidden shadow-sm border border-slate-100"
        >
          <Menu size={22} />
        </button>
        
        {/* डेस्कटॉप संदेश */}
        <div className="hidden md:block">
            <h2 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-0.5">नगर निगम मुजफ्फरपुर</h2>
            <p className="text-slate-800 font-black italic text-lg leading-none">
              स्वागत है, <span className="text-blue-600">{username}</span>
            </p>
        </div>

        {/* मोबाइल पर छोटा स्वागत */}
        <div className="md:hidden">
             <p className="text-xs font-black text-slate-800 leading-none capitalize">{username}</p>
             <span className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">{role}</span>
        </div>
      </div>

      {/* दायीं तरफ: नोटिफिकेशन और प्रोफाइल */}
      <div className="flex items-center gap-4 md:gap-8">
        
        {/* नोटिफिकेशन बेल */}
        <button className="relative p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group">
            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
        
        {/* प्रोफाइल सेक्शन */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-800 leading-none mb-1 uppercase tracking-tighter">
              {username}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">
                <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
                {roleHindi}
            </div>
          </div>
          
          <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-slate-50 to-slate-200 rounded-[1.2rem] flex items-center justify-center text-slate-400 border-2 border-white shadow-xl shadow-slate-200 group-hover:border-blue-200 transition-all overflow-hidden">
                <User size={24} />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Topbar;