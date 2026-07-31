import React, { useState, useEffect } from 'react';
import { 
  Users, LayoutDashboard, CheckCircle, Clock, 
  ChevronDown, ChevronUp, AlertCircle, Loader2 
} from 'lucide-react';
import API from '../api';

const Dashboard = () => {
  const [expandedWard, setExpandedWard] = useState(null);
  const [wardSummary, setWardSummary] = useState({});
  const [loading, setLoading] = useState(true);
  
  // लाइव स्टैट्स के लिए स्टेट
  const [liveStats, setLiveStats] = useState({
    totalWards: 49,
    totalUsers: 0,
    completeCount: 0,
    pendingCount: 49
  });

  const sections = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const wards = Array.from({ length: 53 }, (_, i) => `वार्ड ${String(i + 1).padStart(2, '0')}`);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // एक साथ दोनों API कॉल करें (Stats और Table Summary)
      const [statsRes, summaryRes] = await Promise.all([
        API.get('/admin/dashboard-stats'),
        API.get('/admin/all-wards-summary')
      ]);

      setLiveStats(statsRes.data);
      setWardSummary(summaryRes.data);
    } catch (err) {
      console.error("डेटा लोड करने में विफल:", err);
    } finally {
      setLoading(false);
    }
  };

  // अब स्टैट्स ऐरे को लाइव डेटा से कनेक्ट करें
  const stats = [
    { label: "कुल वार्ड", value: liveStats.totalWards, icon: <LayoutDashboard />, color: "bg-blue-500" },
    { label: "कुल यूज़र्स", value: liveStats.totalUsers, icon: <Users />, color: "bg-purple-500" },
    { label: "पूर्ण वार्ड", value: liveStats.completeCount, icon: <CheckCircle />, color: "bg-green-500" },
    { label: "लंबित वार्ड", value: liveStats.pendingCount, icon: <Clock />, color: "bg-red-500" },
  ];

  const toggleWard = (wardNo) => {
    setExpandedWard(expandedWard === wardNo ? null : wardNo);
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">डेटाबेस से कनेक्ट हो रहा है...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic border-l-4 border-blue-600 pl-4">मुख्य डैशबोर्ड सारांश</h1>
        <button onClick={fetchAllData} className="bg-white p-2 rounded-xl shadow-sm border text-blue-600 hover:bg-blue-50 transition-all">
             <span className="text-[10px] font-black uppercase">Refresh Data</span>
        </button>
      </div>
      
      {/* 4 लाइव स्टैट्स कार्ड्स */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white flex items-center gap-5 transition-all hover:-translate-y-1">
            <div className={`${s.color} p-4 rounded-2xl text-white shadow-lg`}>
                {React.cloneElement(s.icon, { size: 24 })}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-3xl font-black text-slate-800">{String(s.value).padStart(2, '0')}</p>
            </div>
          </div>
        ))}
      </div>

      {/* समरी टेबल */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <div className="p-7 bg-[#0f172a] text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="font-black uppercase tracking-[0.2em] text-xs">वार्ड-वार प्रविष्टि रिपोर्ट</h3>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-5 border-b text-center">SL</th>
                <th className="p-5 border-b text-left">Ward Number</th>
                {sections.map(s => <th key={s} className="p-5 border-b text-center">ANB-{s}</th>)}
              </tr>
            </thead>
            <tbody>
              {wards.map((ward, idx) => {
                const wardData = wardSummary[ward] || {};
                const isSelected = expandedWard === ward;
                return (
                  <React.Fragment key={ward}>
                    <tr 
                      onClick={() => toggleWard(ward)}
                      className={`cursor-pointer transition-all border-b border-slate-50 hover:bg-indigo-50/30 ${isSelected ? 'bg-indigo-50/50' : ''}`}
                    >
                      <td className="p-5 text-center text-[10px] font-bold text-slate-300">{idx + 1}</td>
                      <td className="p-5 font-black text-slate-700 text-sm">
                        <div className="flex items-center gap-3">
                            <div className={`p-1 rounded-md transition-transform ${isSelected ? 'bg-indigo-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                                <ChevronDown size={12}/>
                            </div>
                            {ward}
                        </div>
                      </td>
                      {sections.map(sec => {
                        const status = wardData[sec]?.status;
                        return (
                          <td key={sec} className="p-5 text-center">
                            {status === 'complete' ? (
                              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle size={14} /></div>
                            ) : status === 'pending' ? (
                              <div className="w-6 h-6 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto animate-pulse"><AlertCircle size={14} /></div>
                            ) : (
                              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full mx-auto"></div>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* एक्सपैंड होने वाला हिस्सा */}
                    {isSelected && (
                      <tr>
                        <td colSpan={11} className="p-0 bg-slate-50/30">
                          <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-top-4 duration-500">
                             {sections.map(sec => (
                               <div key={sec} className="group bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:border-blue-200">
                                  <div className="flex justify-between items-center mb-5 border-b border-slate-50 pb-3">
                                     <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">अनुभाग {sec}</h4>
                                     <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-inner ${wardData[sec]?.status === 'complete' ? 'bg-green-500 text-white' : 'bg-rose-500 text-white'}`}>
                                       {wardData[sec]?.status || 'Incomplete'}
                                     </span>
                                  </div>
                                  <div className="bg-slate-50 p-4 rounded-2xl h-40 overflow-y-auto custom-scrollbar shadow-inner border border-slate-100">
                                     {wardData[sec]?.data ? (
                                       <div className="text-[11px] font-bold text-slate-500 space-y-1">
                                           {Object.entries(wardData[sec].data).map(([key, val]) => (
                                               <div key={key} className="flex justify-between gap-2 border-b border-white/50 py-1">
                                                   <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                                                   <span className="text-slate-700 text-right">{typeof val === 'object' ? 'Table Data' : val}</span>
                                               </div>
                                           ))}
                                       </div>
                                     ) : (
                                       <p className="text-[10px] text-slate-300 italic text-center mt-12">कोई डेटा उपलब्ध नहीं</p>
                                     )}
                                  </div>
                               </div>
                             ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
