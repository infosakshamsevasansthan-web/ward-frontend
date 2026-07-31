import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, AlertCircle, CheckCircle2, CloudRain } from 'lucide-react';
import API from '../api';

const Anubhag2 = () => {
  const navigate = useNavigate();
  const ward = localStorage.getItem('currentWard');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // --- Form State ---
  const [fields, setFields] = useState({
    // मुख्यालय और दूरी (Name and Distance)
    state_hq: { name: "", dist: "" },
    dist_hq: { name: "", dist: "" },
    subdist_hq: { name: "", dist: "" },
    nearest_1lakh: { name: "", dist: "" },
    nearest_5lakh: { name: "", dist: "" },
    railway: { name: "", dist: "" },
    bus: { name: "", dist: "" },
    // जलवायु (Climate)
    avg_rain: "", max_temp: "", min_temp: ""
  });

  // --- डेटा लोड करने का लॉजिक (Fetch Logic) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(
  `/get-ward-data/${ward}/2`
);
        if (res.data && res.data.data) {
          setFields(res.data.data);
          setSaveStatus(res.data.status);
        }
      } catch (err) { console.log("New record session"); }
    };
    if (ward) fetchData();
  }, [ward]);

  // --- वैलिडेशन (Validation) ---
  const checkIsComplete = () => {
    const hqFilled = Object.values(fields).every(item => {
      if (typeof item === 'object') return item.name.trim() !== "" && item.dist.trim() !== "";
      return item.trim() !== "";
    });
    return hqFilled;
  };

  // --- सेव फंक्शन (Save Function) ---
  const handleSave = async () => {
  if (!ward) return alert("कृपया पहले वार्ड चुनें!");
  setLoading(true);

  const isComplete = checkIsComplete();
  const currentStatus = isComplete ? "complete" : "pending";

  try {
    await API.post("/save-ward-data", {
      ward_no: ward,
      section_no: 2,
      data: fields,
      status: currentStatus,
    });

    setSaveStatus(currentStatus);
    alert(
      isComplete
        ? "अनुभाग-2 पूर्ण सुरक्षित!"
        : "डेटा सुरक्षित हुआ (अभी कुछ जानकारी बाकी है)"
    );

    navigate("/data-collection");
  } catch (err) {
    alert("सर्वर एरर: डेटा सुरक्षित नहीं हो सका");
  } finally {
    setLoading(false);
  }
};
  const rows = [
    { label: "2.1 राज्य मुख्यालय", key: "state_hq" },
    { label: "2.2 जिला मुख्यालय", key: "dist_hq" },
    { label: "2.3 उप जिला / तहसील / विकास खंड मुख्यालय", key: "subdist_hq" },
    { label: "2.4 एक लाख+ जनसंख्या वाला निकटतम नगर", key: "nearest_1lakh" },
    { label: "2.5 पाँच लाख+ जनसंख्या वाला निकटतम नगर", key: "nearest_5lakh" },
    { label: "2.6 निकटतम रेलवे स्टेशन", key: "railway" },
    { label: "2.7 निकटतम बस मार्ग", key: "bus" },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button onClick={() => navigate('/data-collection')} className="group flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-all">
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> वापस जाएं
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-lg border">{ward}</span>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        {/* Title Section */}
        <div className="p-8 bg-gradient-to-r from-blue-700 to-indigo-800 text-white relative">
          <h2 className="text-2xl font-black mb-1 text-white">अनुभाग-2: नगर का स्थान विवरण एवं जलवायु</h2>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">मुख्यालयों की दूरी एवं मौसम की जानकारी</p>
          
          <div className={`absolute top-8 right-8 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl
            ${saveStatus === 'complete' ? 'bg-green-500 text-white' : 'bg-red-500 text-white animate-pulse'}`}>
            {saveStatus === 'complete' ? <CheckCircle2 size={14}/> : <AlertCircle size={14}/>}
            {saveStatus === 'complete' ? 'Complete' : 'Pending'}
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Table Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs">#</span>
              स्थान विवरण एवं दूरी (कि. मी. में):
            </h3>

            <div className="border-2 border-slate-50 rounded-[30px] overflow-hidden bg-slate-50/30 shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-white text-[10px] uppercase tracking-widest">
                      <th className="p-4 text-left border-r border-slate-700 w-1/3">मुख्यालय / स्थान</th>
                      <th className="p-4 text-center border-r border-slate-700 w-1/3">नाम (Name)</th>
                      <th className="p-4 text-center w-1/3">नगर से दूरी (कि.मी. में)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-white transition-all">
                        <td className="p-4 font-bold text-slate-500 text-sm bg-slate-50/50">{row.label}</td>
                        <td className="p-2">
                           <input 
                            type="text" 
                            value={fields[row.key].name} 
                            onChange={(e) => setFields({...fields, [row.key]: {...fields[row.key], name: e.target.value}})}
                            placeholder="नाम भरें"
                            className={`w-full p-3 text-center font-bold text-slate-700 rounded-xl outline-none transition-all
                              ${!fields[row.key].name ? 'bg-red-50/50 border-b-2 border-red-200 focus:border-red-500' : 'bg-transparent border-b-2 border-transparent focus:border-blue-500'}`}
                           />
                        </td>
                        <td className="p-2">
                           <input 
                            type="number" 
                            value={fields[row.key].dist} 
                            onChange={(e) => setFields({...fields, [row.key]: {...fields[row.key], dist: e.target.value}})}
                            placeholder="0.0"
                            className={`w-full p-3 text-center font-bold text-slate-700 rounded-xl outline-none transition-all
                              ${!fields[row.key].dist ? 'bg-red-50/50 border-b-2 border-red-200 focus:border-red-500' : 'bg-transparent border-b-2 border-transparent focus:border-blue-500'}`}
                           />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Climate Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <CloudRain className="text-blue-500" size={18} />
              नगर की जलवायु (Climate Details):
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FloatingInput label="औसत वर्षा (मि.मी. में)" value={fields.avg_rain} onChange={(v) => setFields({...fields, avg_rain: v})} />
              <FloatingInput label="अधिकतम तापमान (°C)" value={fields.max_temp} onChange={(v) => setFields({...fields, max_temp: v})} />
              <FloatingInput label="न्यूनतम तापमान (°C)" value={fields.min_temp} onChange={(v) => setFields({...fields, min_temp: v})} />
            </div>
          </div>

          {/* Save Button */}
          <button 
            onClick={handleSave}
            disabled={loading}
            className="group w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[25px] font-black text-xl shadow-2xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {loading ? "सुरक्षित किया जा रहा है..." : (
              <>
                <Save className="group-hover:rotate-12 transition-transform" />
                अनुभाग-2 सुरक्षित करें
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Reusable Components (Same as Anubhag1 for consistency) ---
const FloatingInput = ({ label, value, onChange }) => (
  <div className="relative h-16 w-full">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`peer h-full w-full rounded-2xl border-2 bg-transparent px-4 pt-4 font-bold text-slate-700 outline-none transition-all
        ${!value ? 'border-red-100 focus:border-red-400 bg-red-50/10' : 'border-slate-100 focus:border-blue-500'}`}
      placeholder=" "
    />
    <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 transition-all 
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base 
      peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-2 
      peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2">
      {label}
    </label>
  </div>
);

export default Anubhag2;
