import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Trash2, CheckCircle2, ShieldCheck, MapPin, X, Save } from 'lucide-react';
import API from '../api'; // आपकी सेंट्रल API फाइल

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowResult] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', assigned_wards: [] });
  
  const wardOptions = Array.from({ length: 53 }, (_, i) => `वार्ड ${String(i + 1).padStart(2, '0')}`);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) { console.log("Error fetching users"); }
  };

  const handleWardToggle = (ward) => {
    setNewUser(prev => ({
      ...prev,
      assigned_wards: prev.assigned_wards.includes(ward)
        ? prev.assigned_wards.filter(w => w !== ward)
        : [...prev.assigned_wards, ward]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newUser.assigned_wards.length === 0) return alert("कम से कम एक वार्ड चुनें!");
    try {
      await API.post('/users', newUser);
      alert("यूजर सफलतापूर्वक बनाया गया!");
      setNewUser({ username: '', password: '', assigned_wards: [] });
      setShowResult(false);
      fetchUsers();
    } catch (err) { alert("यूजरनाम पहले से मौजूद है!"); }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg"><Users size={24}/></div>
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">यूजर मैनेजमेंट</h2>
            <p className="text-xs font-bold text-slate-400">डाटा एंट्री ऑपरेटरों को प्रबंधित करें</p>
          </div>
        </div>
        <button 
          onClick={() => setShowResult(!showForm)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-black transition-all active:scale-95"
        >
          {showForm ? <><X size={18}/> बंद करें</> : <><UserPlus size={18}/> नया यूजर जोड़ें</>}
        </button>
      </div>

      {/* Add User Form (Floating Card) */}
      {showForm && (
        <div className="mb-10 bg-white p-8 rounded-[3rem] shadow-2xl border-2 border-indigo-50 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600"/> नए ऑपरेटर का विवरण
          </h3>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" placeholder="यूजरनाम (Username)" required
                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-indigo-500 font-bold"
                value={newUser.username} onChange={(e)=>setNewUser({...newUser, username:e.target.value})}
              />
              <input 
                type="password" placeholder="पासवर्ड (Password)" required
                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-indigo-500 font-bold"
                value={newUser.password} onChange={(e)=>setNewUser({...newUser, password:e.target.value})}
              />
            </div>

            {/* Multiple Ward Selection Grid */}
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">वार्ड असाइन करें (वार्ड चुनें)</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-2 p-4 bg-slate-50 rounded-[2rem]">
                {wardOptions.map(ward => (
                  <button
                    key={ward} type="button"
                    onClick={() => handleWardToggle(ward)}
                    className={`py-2 px-1 rounded-xl text-[10px] font-black transition-all border-2
                      ${newUser.assigned_wards.includes(ward) 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'bg-white border-white text-slate-400 hover:border-indigo-200'}`}
                  >
                    {ward.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 flex items-center justify-center gap-3">
              <Save size={20}/> यूजर क्रिएट करें
            </button>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100">
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
            <span className="text-sm font-black uppercase tracking-widest">एक्टिव ऑपरेटर लिस्ट</span>
            <span className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-bold">Total: {users.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b">
                <th className="p-6">ऑपरेटर नाम</th>
                <th className="p-6">असाइन वार्ड्स</th>
                <th className="p-6 text-right">एक्शन</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                        {user.username[0].toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-700">{user.username}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {user.assigned_wards?.map(w => (
                        <span key={w} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black border border-blue-100">
                          {w}
                        </span>
                      )) || 'कोई नहीं'}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-rose-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-xl transition-all">
                      <Trash2 size={20}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
