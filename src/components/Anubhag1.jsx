import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, AlertCircle, CheckCircle2, Database } from 'lucide-react';

import API from '../api';

const Anubhag1 = () => {
  const navigate = useNavigate();
  const ward = localStorage.getItem('currentWard');
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [fields, setFields] = useState({
    state_name: "", dist_name: "", city_name: "",
    civic_status: "", location_code: "", tehsil_name: "", area_sqkm: ""
  });

  const [censusTable, setCensusTable] = useState(
    [1911, 1921, 1931, 1941, 1951, 1961, 1971, 1981, 1991, 2001, 2011, 2021, 2027].map(year => ({
      year, population: "", growth_rate: "", sex_ratio: ""
    }))
  );

  // --- Load Data (Using Central API) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // http://localhost हटाकर सिर्फ एंडपॉइंट लिखा
        const res = await API.get(`/get-ward-data/${ward}/1`); 
        if (res.data && res.data.data) {
          setFields(res.data.data.fields || fields);
          setCensusTable(res.data.data.censusTable || censusTable);
          setSaveStatus(res.data.status);
        }
      } catch (err) { console.log("डेटा लोड करने में समस्या या नया रिकॉर्ड"); }
    };
    if (ward) fetchData();
  }, [ward]);

  const checkIsComplete = () => {
    const basicFilled = Object.values(fields).every(val => val && val.trim() !== "");
    const tableFilled = censusTable.every(row => 
      row.population && row.population.trim() !== "" && 
      row.growth_rate && row.growth_rate.trim() !== "" && 
      row.sex_ratio && row.sex_ratio.trim() !== ""
    );
    return basicFilled && tableFilled;
  };
console.log("API =", API.defaults.baseURL);
  // --- Save Function (Using Central API) ---
  const handleSave = async () => {
    console.log("BUILD VERSION = 31 JULY");
    console.log(API.defaults.baseURL);
    console.log(window.location.hostname);
    
    if (!ward) return alert("कृपया पहले वार्ड चुनें!");
    setLoading(true);
    
    const isComplete = checkIsComplete();
    const currentStatus = isComplete ? 'complete' : 'pending';

    try {
      // यहाँ भी सीधा API.post इस्तेमाल किया
      await API.post('/save-ward-data', {
        ward_no: ward,
        section_no: 1,
        data: { fields, censusTable },
        status: currentStatus
      });
      
      setSaveStatus(currentStatus);
      alert(isComplete ? "सफलतापूर्वक पूर्ण सुरक्षित!" : "डेटा सुरक्षित हुआ (अभी कुछ फील्ड बाकी हैं)");
      navigate('/data-collection');
    } catch (err) {
      alert("सर्वर एरर: डेटा सेव नहीं हो सका। पक्का करें कि बैकएंड चल रहा है।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button onClick={() => navigate('/data-collection')} className="group flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-all">
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> वापस जाएं
        </button>
        <div className="flex items-center gap-2">
          <Database size={16} className="text-blue-600" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 border px-3 py-1 rounded-lg bg-slate-50">{ward}</span>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white relative">
          <h2 className="text-2xl font-black mb-1 italic">अनुभाग-1: स्थिति एवं विकास का इतिहास</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">नगर जनगणना विवरण प्रपत्र</p>
          
          <div className={`absolute top-8 right-8 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl
            ${saveStatus === 'complete' ? 'bg-green-500 text-white' : 'bg-red-500 text-white animate-pulse'}`}>
            {saveStatus === 'complete' ? <CheckCircle2 size={14}/> : <AlertCircle size={14}/>}
            {saveStatus === 'complete' ? 'Complete' : 'Pending'}
          </div>
        </div>

        <div className="p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FloatingInput label="राज्य / केंद्र शासित प्रदेश" value={fields.state_name} onChange={(v) => setFields({...fields, state_name: v})} readOnly={!isAdmin} />
            <FloatingInput label="जिले का नाम" value={fields.dist_name} onChange={(v) => setFields({...fields, dist_name: v})} readOnly={!isAdmin} />
            <FloatingInput label="नगर का नाम" value={fields.city_name} onChange={(v) => setFields({...fields, city_name: v})} readOnly={!isAdmin} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FloatingInput label="1.1 नगर की नागरिक स्थिति" value={fields.civic_status} onChange={(v) => setFields({...fields, civic_status: v})} readOnly={!isAdmin} />
            <FloatingInput label="1.2 लोकेशन कोड" value={fields.location_code} onChange={(v) => setFields({...fields, location_code: v})} readOnly={!isAdmin} />
            <FloatingInput label="1.3 तहसील का नाम" value={fields.tehsil_name} onChange={(v) => setFields({...fields, tehsil_name: v})} readOnly={!isAdmin} />
            <FloatingInput label="1.4 क्षेत्रफल (Sq. KM)" value={fields.area_sqkm} onChange={(v) => setFields({...fields, area_sqkm: v})} readOnly={!isAdmin} />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 italic">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-[10px]">#</span>
              विभिन्न जनगणनाओं में नगर की जनसंख्या, वृद्धि दर एवं लिंगानुपात:
            </h3>
            
            <div className="border-2 border-slate-50 rounded-[30px] overflow-hidden shadow-inner bg-slate-50/50">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-white text-[10px] uppercase tracking-widest">
                      <th className="p-4 text-center border-r border-slate-700">जनगणना वर्ष</th>
                      <th className="p-4 text-center border-r border-slate-700">जनसंख्या</th>
                      <th className="p-4 text-center border-r border-slate-700">वृद्धि दर (%)</th>
                      <th className="p-4 text-center">लिंगानुपात</th>
                    </tr>
                  </thead>
                  <tbody>
                    {censusTable.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-white transition-colors">
                        <td className="p-4 text-center font-black text-slate-400 bg-slate-100/50">{row.year}</td>
                        <td className="p-2">
                         <TableInput
  value={row.population}
  onChange={(v) => {
    const nt = [...censusTable];
    nt[idx].population = v;
    setCensusTable(nt);
  }}
  readOnly={!isAdmin}
/>
                        </td>
                        <td className="p-2">
                          <TableInput
  value={row.growth_rate}
  onChange={(v) => {
    const nt = [...censusTable];
    nt[idx].growth_rate = v;
    setCensusTable(nt);
  }}
  readOnly={!isAdmin}
/>
                        </td>
                        <td className="p-2">
                         <TableInput
  value={row.sex_ratio}
  onChange={(v) => {
    const nt = [...censusTable];
    nt[idx].sex_ratio = v;
    setCensusTable(nt);
  }}
  readOnly={!isAdmin}
/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {isAdmin && (
          <button 
            onClick={handleSave}
            disabled={loading}
            className="group w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[25px] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-blue-100"
          >
            {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : (
              <>
                <Save className="group-hover:rotate-12 transition-transform" />
                अनुभाग-1 सुरक्षित करें
              </>
            )}
          </button>
      )}
        </div>
      </div>
    </div>
  );
};

const FloatingInput = ({
    label,
    value,
    onChange,
    readOnly = false
}) => (
  <div className="relative h-16 w-full group">
    <input
      type="text"
      value={value}
      onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
      className={`peer h-full w-full rounded-2xl border-2 px-4 pt-4 font-bold outline-none transition-all
${
  readOnly
    ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
    : !value
      ? "border-red-100 focus:border-red-400 bg-red-50/10"
      : "border-slate-100 focus:border-blue-500 bg-white"
}`}
      placeholder=" "
      readOnly={readOnly}
    />
    <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 transition-all 
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base 
      peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-2 
      peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2">
      {label}
    </label>
  </div>
);

const TableInput = ({
    value,
    onChange,
    readOnly = false
}) => (
  <input
  type="text"
  value={value}
  onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
  readOnly={readOnly}
  className={`w-full p-2 text-center font-bold rounded-lg outline-none transition-all border-b-2
    ${
      readOnly
        ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
        : !value
        ? "bg-red-50 border-red-200 focus:border-red-500"
        : "bg-transparent border-transparent focus:border-blue-500"
    }`}
/>
);

export default Anubhag1;
