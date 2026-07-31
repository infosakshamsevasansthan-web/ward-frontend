import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, Plus, CheckCircle2, AlertCircle, 
  ChevronRight, MapPin, Send, XCircle, PartyPopper
} from 'lucide-react';
import SelectBox from '../components/SelectBox';
import API from "../api";

const DataCollection = () => {
  const navigate = useNavigate();
  
  // --- रोल और असाइन वार्ड्स की जानकारी लोकल स्टोरेज से लें ---
  const userRole = localStorage.getItem('role'); // 'admin' या 'user'
  const assignedWardsRaw = localStorage.getItem('wards'); 
  const assignedWards = assignedWardsRaw ? JSON.parse(assignedWardsRaw) : [];

  // --- States ---
  const [selectedWard, setSelectedWard] = useState(localStorage.getItem('currentWard') || "");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState({ show: false, type: '', message: '', pendingList: [] });

  const [sectionStatus, setSectionStatus] = useState({
    1: 'pending', 2: 'pending', 3: 'pending', 4: 'pending', 
    5: 'pending', 6: 'pending', 7: 'pending', 8: 'pending', 9: 'pending'
  });

  // --- वार्ड लिस्ट लॉजिक (Logic Updated) ---
  const wardOptions = userRole === 'admin' 
    ? Array.from({ length: 53 }, (_, i) => `वार्ड ${String(i + 1).padStart(2, '0')}`) // एडमिन को सब दिखेगा
    : assignedWards; // यूजर को सिर्फ असाइन वार्ड दिखेंगे

  const anubhags = [
    { id: 1, name: "अनुभाग-1: स्थिति एवं विकास का इतिहास", path: "/anubhag1" },
    { id: 2, name: "अनुभाग-2: नगर का स्थान विवरण एवं जलवायु", path: "/anubhag2" },
    { id: 3, name: "अनुभाग-3: नागरिक एवं अन्य सुविधाएं", path: "/anubhag3" },
    { id: 4, name: "अनुभाग-4: शैक्षणिक सुविधाएं", path: "/anubhag4" },
    { id: 5, name: "अनुभाग-5: सामाजिक, मनोरंजन एवं सांस्कृतिक सुविधाएं", path: "/anubhag5" },
    { id: 6, name: "अनुभाग-6: उद्योग एवं बैंकिंग सुविधाएं", path: "/anubhag6" },
    { id: 7, name: "अनुभाग-7: चिकित्सा सुविधाएं", path: "/anubhag7" },
    { id: 8, name: "अनुभाग-8: झुग्गी बस्तियों में सुविधाएं", path: "/anubhag8" },
    { id: 9, name: "अनुभाग-9: टिप्पणियां एवं अवलोकन", path: "/anubhag9" },
  ];

  useEffect(() => {
    const fetchAllStatuses = async () => {
      if (!selectedWard) return;
      try {
        const res = await API.get(
  `/get-ward-status/${selectedWard}`
);
        if (res.data) setSectionStatus(res.data);
      } catch (err) {
        setSectionStatus({ 1:'pending', 2:'pending', 3:'pending', 4:'pending', 5:'pending', 6:'pending', 7:'pending', 8:'pending', 9:'pending' });
      }
    };
    fetchAllStatuses();
  }, [selectedWard]);

  const handleWardChange = (val) => {
    setSelectedWard(val);
    localStorage.setItem('currentWard', val);
    setShowResult({ show: false, type: '', message: '', pendingList: [] });
  };

  const handleFinalSubmit = async () => {
    const pending = anubhags.filter(sec => sectionStatus[sec.id] !== 'complete');
    if (pending.length > 0) {
      setShowResult({
        show: true,
        type: 'error',
        message: 'आपका फॉर्म अभी अधूरा है!',
        pendingList: pending.map(p => p.name)
      });
    } else {
      setLoading(true);
      try {
        await API.post(
  "/final-submit",
  {
    ward_no: selectedWard
  }
);
        setShowResult({
          show: true,
          type: 'success',
          message: `बधाई हो! ${selectedWard} का पूरा डेटा सफलतापूर्वक सबमिट हो गया है।`,
          pendingList: []
        });
      } catch (err) {
        alert("सबमिट करने में समस्या आई!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 px-4 relative min-h-screen">
      
      {/* Result Card Overlay */}
      {showResult.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md p-8 rounded-[3rem] shadow-2xl bg-white transform animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-4">
              {showResult.type === 'success' ? (
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PartyPopper size={40} />
                </div>
              ) : (
                <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle size={40} />
                </div>
              )}
              <h3 className={`text-2xl font-black ${showResult.type === 'success' ? 'text-green-600' : 'text-rose-600'}`}>
                {showResult.message}
              </h3>
              {showResult.pendingList.length > 0 && (
                <div className="text-left bg-rose-50 p-6 rounded-3xl space-y-2 mt-4">
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">बाकी अनुभागों को पूरा करें:</p>
                  {showResult.pendingList.map((name, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-700 italic">
                      <div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div> {name}
                    </div>
                  ))}
                </div>
              )}
              <button 
                onClick={() => setShowResult({ ...showResult, show: false })}
                className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all"
              >
                {showResult.type === 'success' ? 'ठीक है' : 'वापस जाएँ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
          <Database className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">डाटा कलेक्शन हब</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            {userRole === 'admin' ? "प्रशासक मोड (All Wards)" : "ऑपरेटर मोड (Assigned Wards Only)"}
          </p>
        </div>
      </div>

      {/* Ward Selection Card */}
      <div className="bg-white p-6 rounded-[35px] shadow-xl border-2 border-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 px-4 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-2xl shadow-lg">
           Auth Mode: {userRole}
        </div>
        <SelectBox 
          label={userRole === 'admin' ? "वार्ड चुनें (प्रशासक)" : "अपना असाइन किया गया वार्ड चुनें"}
          value={selectedWard}
          options={wardOptions} 
          onChange={handleWardChange}
        />
        {userRole !== 'admin' && wardOptions.length === 0 && (
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl text-[11px] font-bold border border-amber-100 flex items-center gap-2">
                <AlertCircle size={14}/> आपको अभी तक कोई वार्ड असाइन नहीं किया गया है। एडमिन से संपर्क करें।
            </div>
        )}
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {anubhags.map((sec) => {
          const isComplete = sectionStatus[sec.id] === 'complete';
          return (
            <div 
              key={sec.id}
              className={`bg-white rounded-[2rem] shadow-sm border-l-[10px] transition-all duration-300
                ${!selectedWard ? 'opacity-50 grayscale pointer-events-none' : 'hover:shadow-lg hover:-translate-y-1 cursor-pointer'}
                ${isComplete ? 'border-l-green-500' : 'border-l-rose-500'}`}
              onClick={() => navigate(sec.path)}
            >
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-2xl shadow-md ${isComplete ? 'bg-green-500 text-white' : 'bg-blue-600 text-white shadow-blue-100'}`}>
                    {isComplete ? <CheckCircle2 size={24} /> : <Plus size={24} />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section 0{sec.id}</p>
                    <h3 className="font-black text-slate-700 text-lg leading-tight">{sec.name.split(':')[1]}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest
                    ${isComplete ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600 animate-pulse'}`}>
                    {isComplete ? 'Complete' : 'Pending'}
                   </div>
                   <ChevronRight className="text-slate-300" size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FINAL SUBMIT BUTTON */}
      {selectedWard && (
        <div className="pt-10 pb-10">
          <button 
            onClick={handleFinalSubmit}
            disabled={loading}
            className={`w-full py-6 rounded-[2.5rem] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4
              ${Object.values(sectionStatus).every(s => s === 'complete') 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-200' 
                : 'bg-slate-800 text-white shadow-slate-300 hover:bg-slate-900'}`}
          >
            {loading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : (
              <>
                <Send size={24} /> 
                <span>वार्ड {selectedWard} का डेटा फाइनल सबमिट करें</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DataCollection;
