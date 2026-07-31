import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, AlertCircle, CheckCircle2, Database } from 'lucide-react';
import axios from 'axios';

const Anubhag1 = () => {
  const navigate = useNavigate();
  const ward = localStorage.getItem('currentWard');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'pending' or 'complete'

  // --- Form State ---
  const [fields, setFields] = useState({
    state_name: "", dist_name: "", city_name: "",
    civic_status: "", location_code: "", tehsil_name: "", area_sqkm: ""
  });

  const [censusTable, setCensusTable] = useState(
    [1911, 1921, 1931, 1941, 1951, 1961, 1971, 1981, 1991, 2001, 2011, 2021, 2027].map(year => ({
      year, population: "", growth_rate: "", sex_ratio: ""
    }))
  );

  // --- Load Existing Data (Update Logic) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/get-ward-data/${ward}/1`);
        if (res.data && res.data.data) {
          setFields(res.data.data.fields || fields);
          setCensusTable(res.data.data.censusTable || censusTable);
          setSaveStatus(res.data.status);
        }
      } catch (err) { console.log("New record or error"); }
    };
    if (ward) fetchData();
  }, [ward]);

  // --- Validation Logic ---
  const checkIsComplete = () => {
    const basicFilled = Object.values(fields).every(val => val.trim() !== "");
    const tableFilled = censusTable.every(row => 
      row.population.trim() !== "" && row.growth_rate.trim() !== "" && row.sex_ratio.trim() !== ""
    );
    return basicFilled && tableFilled;
  };

  // --- Save Function ---
  const handleSave = async () => {
    if (!ward) return alert("कृपया पहले वार्ड चुनें!");
    setLoading(true);
    
    const isComplete = checkIsComplete();
    const currentStatus = isComplete ? 'complete' : 'pending';

    try {
      await axios.post('http://localhost:5000/api/save-ward-data', {
        ward_no: ward,
        section_no: 1,
        data: { fields, censusTable },
        status: currentStatus
      });
      setSaveStatus(currentStatus);
      alert(isComplete ? "सफलतापूर्वक पूर्ण सुरक्षित!" : "डेटा सुरक्षित हुआ (अभी कुछ फील्ड बाकी हैं)");
      navigate('/data-collection');
    } catch (err) {
      alert("सर्वर एरर: डेटा सेव नहीं हो सका");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button onClick={() => navigate('/data-collection')} className="group flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-all">
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> वापस जाएं
        </button>
        <div className="flex items-center gap-2">
          <Database size={16} className="text-blue-600" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">{ward}</span>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        {/* Section Title Area */}
        <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white relative">
          <h2 className="text-2xl font-black mb-1">अनुभाग-1: स्थिति एवं विकास का इतिहास</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">नगर जनगणना विवरण प्रपत्र</p>
          
          <div className={`absolute top-8 right-8 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl
            ${saveStatus === 'complete' ? 'bg-green-500 text-white' : 'bg-red-500 text-white animate-pulse'}`}>
            {saveStatus === 'complete' ? <CheckCircle2 size={14}/> : <AlertCircle size={14}/>}
            {saveStatus === 'complete' ? 'Complete' : 'Pending'}
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Row 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FloatingInput label="राज्य / केंद्र शासित प्रदेश" value={fields.state_name} onChange={(v) => setFields({...fields, state_name: v})} />
            <FloatingInput label="जिले का नाम" value={fields.dist_name} onChange={(v) => setFields({...fields, dist_name: v})} />
            <FloatingInput label="नगर का नाम" value={fields.city_name} onChange={(v) => setFields({...fields, city_name: v})} />
          </div>

          {/* Row 2: Numbered Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FloatingInput label="1.1 नगर की नागरिक स्थिति" value={fields.civic_status} onChange={(v) => setFields({...fields, civic_status: v})} />
            <FloatingInput label="1.2 लोकेशन कोड" value={fields.location_code} onChange={(v) => setFields({...fields, location_code: v})} />
            <FloatingInput label="1.3 तहसील का नाम" value={fields.tehsil_name} onChange={(v) => setFields({...fields, tehsil_name: v})} />
            <FloatingInput label="1.4 क्षेत्रफल (Sq. KM)" value={fields.area_sqkm} onChange={(v) => setFields({...fields, area_sqkm: v})} />
          </div>

          {/* Census Table Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs">#</span>
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
                          <TableInput value={row.population} onChange={(v) => {
                            const nt = [...censusTable]; nt[idx].population = v; setCensusTable(nt);
                          }} />
                        </td>
                        <td className="p-2">
                          <TableInput value={row.growth_rate} onChange={(v) => {
                            const nt = [...censusTable]; nt[idx].growth_rate = v; setCensusTable(nt);
                          }} />
                        </td>
                        <td className="p-2">
                          <TableInput value={row.sex_ratio} onChange={(v) => {
                            const nt = [...censusTable]; nt[idx].sex_ratio = v; setCensusTable(nt);
                          }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleSave}
            disabled={loading}
            className="group w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[25px] font-black text-xl shadow-2xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {loading ? "सुरक्षित किया जा रहा है..." : (
              <>
                <Save className="group-hover:rotate-12 transition-transform" />
                अनुभाग-1 सुरक्षित करें
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Custom Floating Label Input Component ---
const FloatingInput = ({ label, value, onChange }) => {
  return (
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
};

// --- Table Inner Input ---
const TableInput = ({ value, onChange }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full p-2 text-center font-bold text-slate-700 rounded-lg outline-none transition-all border-b-2
      ${!value ? 'bg-red-50 border-red-200 focus:border-red-500' : 'bg-transparent border-transparent focus:border-blue-500'}`}
  />
);

export default Anubhag1;