import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, AlertCircle, CheckCircle2, Road, Droplets, Zap, ChevronDown } from 'lucide-react';
import API from '../api';
const Anubhag3 = () => {
  const navigate = useNavigate();
  const ward = localStorage.getItem('currentWard');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // --- Form State ---
  const [fields, setFields] = useState({
    road_paved: "", road_unpaved: "",
    drainage_type: "", 
    lat_pit: "", lat_single_pit: "", lat_double_pit: "", lat_flush: "", lat_service: "", lat_comm_bath: "", lat_comm_nobath: "", lat_others: "",
    water_source: "", storage_type: "", water_capacity: "",
    fire_service: "", fire_dist: "",
    elec_domestic: "", elec_industrial: "", elec_commercial: "", elec_street: "", elec_others: ""
  });

  // --- Dropdown Options ---
  const drainOptions = ["1-खुली नाली", "2-बंद नाली", "3-दोनों", "4-कोई नहीं"];
  const waterSources = [
    "नल का पानी उपचारित श्रोत से (TT)", "नल का पानी अनुपचारित श्रोत से (TU)", "ढंका हुआ कुआं (CW)", 
    "बिना ढंका हुआ कुआं (UW)", "हैण्ड पंप (HP)", "टुबेवल/बोरहोल (TW/B)", "वर्षा का जल (RW)", 
    "झरना (S)", "नदी/ नहर (R/C)", "टैंक तालाब झील (TK/P/L)", "ओवरहेड टैंक (OHT)", "दबाब टैंक (PT)", "अन्य (O)"
  ];
  const storageTypes = ["ओवरहेड टैंक (OHT)", "सर्विस जलाशय (SR)", "नदी अंतप्रवाह गैलरी (RIG)", "बोल्बेल पम्पिंग सिस्टम (BPS)"];

  // --- Logic for Conditional Fields ---
  const showStorage = ["TW/B", "RW", "S", "R/C", "TK/P/L", "OHT", "PT", "O"].some(code => fields.water_source.includes(code));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(
  `/get-ward-data/${ward}/3`
);
        if (res.data && res.data.data) {
          setFields(res.data.data);
          setSaveStatus(res.data.status);
        }
      } catch (err) { console.log("New session"); }
    };
    if (ward) fetchData();
  }, [ward]);

  const checkIsComplete = () => {
    const { storage_type, water_capacity, fire_dist, ...requiredFields } = fields;
    return Object.values(requiredFields).every(val => val.trim() !== "");
  };

  const handleSave = async () => {
    if (!ward) return alert("कृपया वार्ड चुनें!");
    setLoading(true);
    const isComplete = checkIsComplete();
    const currentStatus = isComplete ? 'complete' : 'pending';

    try {
     await API.post(
  '/save-ward-data',
  {
    ward_no: ward,
    section_no: 3,
    data: fields,
    status: currentStatus
  }
);
      setSaveStatus(currentStatus);
      alert(isComplete ? "पूर्ण सुरक्षित!" : "लंबित स्थिति में सुरक्षित!");
      navigate('/data-collection');
    } catch (err) { alert("Error!"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button onClick={() => navigate('/data-collection')} className="group flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-all">
          <ChevronLeft /> वापस जाएं
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-lg border">{ward}</span>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-emerald-600 to-teal-700 text-white relative">
          <h2 className="text-2xl font-black mb-1">अनुभाग-3: नागरिक एवं अन्य सुविधाएं</h2>
          <p className="text-emerald-50 text-xs font-bold uppercase tracking-widest">आधारभूत अवसंरचना विवरण</p>
          <div className={`absolute top-8 right-8 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl
            ${saveStatus === 'complete' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}>
            {saveStatus === 'complete' ? <CheckCircle2 size={14}/> : <AlertCircle size={14}/>}
            {saveStatus === 'complete' ? 'Complete' : 'Pending'}
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* 3.1 & 3.2 Road and Drainage */}
          <section className="space-y-6">
            <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest border-b pb-2"><Road size={18} className="text-emerald-600"/> सड़क एवं जल निकासी</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FloatingInput label="3.1.1 पक्की सड़क (KM)" value={fields.road_paved} onChange={(v)=>setFields({...fields, road_paved:v})} />
              <FloatingInput label="3.1.2 कच्ची सड़क (KM)" value={fields.road_unpaved} onChange={(v)=>setFields({...fields, road_unpaved:v})} />
              <div className="relative group h-16">
                <select value={fields.drainage_type} onChange={(e)=>setFields({...fields, drainage_type:e.target.value})} className="peer h-full w-full rounded-2xl border-2 bg-transparent px-4 pt-4 font-bold text-slate-700 outline-none transition-all appearance-none focus:border-emerald-500">
                  <option value="">चयन करें</option>
                  {drainOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <label className="absolute left-4 top-1 text-[10px] font-black text-slate-400 uppercase">3.2 जल निकासी व्यवस्था</label>
                <ChevronDown className="absolute right-4 top-5 text-slate-400" size={18}/>
              </div>
            </div>
          </section>

          {/* 3.3 Toilets */}
          <section className="space-y-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b pb-2">3.3 शौचालय की संख्या</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FloatingInput label="3.3.0 गड्डा प्रणाली" value={fields.lat_pit} onChange={(v)=>setFields({...fields, lat_pit:v})} />
              <FloatingInput label="3.3.1 एक गड्डा" value={fields.lat_single_pit} onChange={(v)=>setFields({...fields, lat_single_pit:v})} />
              <FloatingInput label="3.3.2 दो गड्ढे" value={fields.lat_double_pit} onChange={(v)=>setFields({...fields, lat_double_pit:v})} />
              <FloatingInput label="3.3.3 फ्लश / पोर" value={fields.lat_flush} onChange={(v)=>setFields({...fields, lat_flush:v})} />
              <FloatingInput label="3.3.4 सर्विस" value={fields.lat_service} onChange={(v)=>setFields({...fields, lat_service:v})} />
              <FloatingInput label="3.3.5 सामुदायिक (स्नान)" value={fields.lat_comm_bath} onChange={(v)=>setFields({...fields, lat_comm_bath:v})} />
              <FloatingInput label="3.3.6 सामुदायिक (बिना)" value={fields.lat_comm_nobath} onChange={(v)=>setFields({...fields, lat_comm_nobath:v})} />
              <FloatingInput label="3.3.7 अन्य" value={fields.lat_others} onChange={(v)=>setFields({...fields, lat_others:v})} />
            </div>
          </section>

          {/* 3.4 & 3.5 Water & Fire */}
          <section className="space-y-6">
            <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest border-b pb-2"><Droplets size={18} className="text-emerald-600"/> पेयजल एवं अग्निशमन</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative h-16">
                <select value={fields.water_source} onChange={(e)=>setFields({...fields, water_source:e.target.value})} className="peer h-full w-full rounded-2xl border-2 bg-transparent px-4 pt-4 font-bold text-slate-700 outline-none appearance-none focus:border-emerald-500">
                  <option value="">चयन करें</option>
                  {waterSources.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <label className="absolute left-4 top-1 text-[10px] font-black text-slate-400 uppercase">3.4.1 जल आपूर्ति स्रोत</label>
                <ChevronDown className="absolute right-4 top-5 text-slate-400" size={18}/>
              </div>
              
              {showStorage && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in duration-300">
                   <div className="relative h-16">
                    <select value={fields.storage_type} onChange={(e)=>setFields({...fields, storage_type:e.target.value})} className="peer h-full w-full rounded-2xl border-2 bg-transparent px-4 pt-4 font-bold text-slate-700 outline-none appearance-none focus:border-emerald-500">
                      <option value="">चयन करें</option>
                      {storageTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <label className="absolute left-4 top-1 text-[10px] font-black text-slate-400 uppercase">3.4.2 भंडारण प्रणाली</label>
                   </div>
                   <FloatingInput label="क्षमता (किलो लीटर में)" value={fields.water_capacity} onChange={(v)=>setFields({...fields, water_capacity:v})} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative h-16">
                <select value={fields.fire_service} onChange={(e)=>setFields({...fields, fire_service:e.target.value})} className="peer h-full w-full rounded-2xl border-2 bg-transparent px-4 pt-4 font-bold text-slate-700 outline-none appearance-none focus:border-emerald-500">
                  <option value="">चयन करें</option>
                  <option value="हाँ">हाँ</option>
                  <option value="नहीं">नहीं</option>
                </select>
                <label className="absolute left-4 top-1 text-[10px] font-black text-slate-400 uppercase">3.5 अग्निशमन सेवा</label>
              </div>
              {fields.fire_service && (
                <FloatingInput 
                  label={fields.fire_service === 'हाँ' ? "दूरी (KM)" : "नजदीक में कितने किलोमीटर की दूरी में है"} 
                  value={fields.fire_dist} 
                  onChange={(v)=>setFields({...fields, fire_dist:v})} 
                />
              )}
            </div>
          </section>

          {/* 3.6 Electrification */}
          <section className="space-y-6">
            <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest border-b pb-2"><Zap size={18} className="text-emerald-600"/> 3.6 विद्युतीकरण</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <FloatingInput label="3.6.1 घरेलू" value={fields.elec_domestic} onChange={(v)=>setFields({...fields, elec_domestic:v})} />
              <FloatingInput label="3.6.2 औद्योगिक" value={fields.elec_industrial} onChange={(v)=>setFields({...fields, elec_industrial:v})} />
              <FloatingInput label="3.6.3 व्यावसायिक" value={fields.elec_commercial} onChange={(v)=>setFields({...fields, elec_commercial:v})} />
              <FloatingInput label="3.6.4 स्ट्रीट लाइट" value={fields.elec_street} onChange={(v)=>setFields({...fields, elec_street:v})} />
              <FloatingInput label="3.6.5 अन्य" value={fields.elec_others} onChange={(v)=>setFields({...fields, elec_others:v})} />
            </div>
          </section>

          <button onClick={handleSave} disabled={loading} className="group w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[25px] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
            {loading ? "Saving..." : <><Save /> अनुभाग-3 सुरक्षित करें</>}
          </button>
        </div>
      </div>
    </div>
  );
};

const FloatingInput = ({ label, value, onChange }) => (
  <div className="relative h-16 w-full">
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`peer h-full w-full rounded-2xl border-2 bg-transparent px-4 pt-4 font-bold text-slate-700 outline-none transition-all ${!value ? 'border-red-100 bg-red-50/10 focus:border-red-400' : 'border-slate-100 focus:border-emerald-500'}`} placeholder=" "/>
    <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-emerald-600 peer-[:not(:placeholder-shown)]:top-1 uppercase">{label}</label>
  </div>
);

export default Anubhag3;
