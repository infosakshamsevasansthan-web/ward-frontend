import React, { useState } from 'react';
import { User, Lock, Loader2, LogIn, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Central API file

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // बैकएंड API कॉल
      const response = await API.post('/login', formData);
      
      const { token, role, username, assigned_wards } = response.data;

      // लोकल स्टोरेज में डेटा सुरक्षित करें
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);
      localStorage.setItem('wards', JSON.stringify(assigned_wards || []));

      // रोल के हिसाब से नेविगेशन
      if (role === 'admin') {
        navigate('/dashboard'); // एडमिन डैशबोर्ड पर जाएगा
      } else {
        navigate('/data-collection'); // ऑपरेटर सीधा डेटा कलेक्शन पर जाएगा
      }
      
      // पेज को रिफ्रेश करें ताकि App.jsx नए रोल को पहचान सके
      window.location.reload();

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'सर्वर से संपर्क नहीं हो पाया! कृपया इंटरनेट चेक करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-10 border border-white/20 backdrop-blur-sm">
        
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200 rotate-3 hover:rotate-0 transition-transform duration-300">
            <LogIn className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">वार्ड <span className="text-blue-600">Sync</span></h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Data Collection Portal</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl text-[11px] font-black border border-rose-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-7">
          
          {/* Username Input with Floating Label Logic */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              name="username"
              required
              placeholder=" "
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="peer w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700"
            />
            <label className="absolute left-11 top-4 text-slate-400 font-bold pointer-events-none transition-all duration-200 
              peer-focus:-top-3 peer-focus:left-4 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-2 peer-focus:font-black
              peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:font-black">
              उपयोगकर्ता नाम
            </label>
          </div>

          {/* Password Input with Floating Label Logic */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="password"
              name="password"
              required
              placeholder=" "
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="peer w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700"
            />
            <label className="absolute left-11 top-4 text-slate-400 font-bold pointer-events-none transition-all duration-200 
              peer-focus:-top-3 peer-focus:left-4 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-2 peer-focus:font-black
              peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:font-black">
              पासवर्ड
            </label>
          </div>

          {/* Login Button with Loading State */}
          <button
            disabled={loading}
            type="submit"
            className="group w-full bg-slate-900 hover:bg-black text-white font-black py-5 px-4 rounded-[1.5rem] shadow-2xl transition-all active:scale-95 flex items-center justify-center disabled:opacity-70 mt-4 overflow-hidden relative"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="uppercase tracking-widest text-xs">प्रमाणित किया जा रहा है...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 uppercase tracking-[0.2em] text-xs">
                <span>प्रवेश करें (Login)</span>
              </div>
            )}
          </button>
        </form>

        <p className="text-center mt-10 text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">
          Muzaffarpur Municipal Corporation
        </p>
      </div>
    </div>
  );
};

export default LoginPage;