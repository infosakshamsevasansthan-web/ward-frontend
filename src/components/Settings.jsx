import React, { useState } from 'react';
import { Settings as SettingsIcon, Lock, ShieldCheck, Save, Loader2, KeyRound } from 'lucide-react';
import API from '../api';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const username = localStorage.getItem('username');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return alert("नया पासवर्ड और कन्फर्म पासवर्ड मैच नहीं कर रहे!");
    
    setLoading(true);
    try {
      await API.post('/change-password', {
        username,
        oldPassword: passwords.old,
        newPassword: passwords.new
      });
      alert("पासवर्ड सफलतापूर्वक बदल दिया गया!");
      setPasswords({ old: "", new: "", confirm: "" });
    } catch (err) {
      alert(err.response?.data?.message || "पासवर्ड बदलने में त्रुटि!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-10 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg"><SettingsIcon size={24} /></div>
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">प्रोफाइल सेटिंग्स</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">अपना पासवर्ड सुरक्षित रूप से बदलें</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 text-slate-900"><Lock size={120}/></div>
        
        <form onSubmit={handlePasswordChange} className="max-w-md space-y-8 relative z-10">
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-sm font-black text-indigo-600 uppercase tracking-widest">
              <ShieldCheck size={18}/> सुरक्षा (Security)
            </h3>

            {/* Old Password */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">पुराना पासवर्ड</label>
                <div className="relative">
                   <KeyRound className="absolute left-4 top-4 text-slate-300" size={20}/>
                   <input 
                    type="password" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-indigo-500 font-bold transition-all"
                    value={passwords.old} onChange={(e)=>setPasswords({...passwords, old: e.target.value})}
                   />
                </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">नया पासवर्ड</label>
                <div className="relative">
                   <Lock className="absolute left-4 top-4 text-slate-300" size={20}/>
                   <input 
                    type="password" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold transition-all"
                    value={passwords.new} onChange={(e)=>setPasswords({...passwords, new: e.target.value})}
                   />
                </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">नया पासवर्ड कन्फर्म करें</label>
                <div className="relative">
                   <Lock className="absolute left-4 top-4 text-slate-300" size={20}/>
                   <input 
                    type="password" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold transition-all"
                    value={passwords.confirm} onChange={(e)=>setPasswords({...passwords, confirm: e.target.value})}
                   />
                </div>
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={20}/> पासवर्ड अपडेट करें</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;