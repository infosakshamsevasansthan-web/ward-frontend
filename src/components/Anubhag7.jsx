import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Save, AlertCircle, CheckCircle2, 
  Stethoscope, Activity, Bed, Users, 
  PlusSquare, Pill, Info, ArrowRight, MapPin, Search, Building2
} from 'lucide-react';
import API from '../api';

const Anubhag7 = () => {
  const navigate = useNavigate();
  const ward = localStorage.getItem('currentWard');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const govtCategories = [
    { id: "7.1", name: "उप स्वास्थ्य केंद्र" },
    { id: "7.2", name: "प्राथमिक स्वास्थ्य केंद्र" },
    { id: "7.3", name: "सामुदायिक स्वास्थ्य केंद्र" },
    { id: "7.4", name: "प्रसूति एवं बाल कल्याण केंद्र" },
    { id: "7.5", name: "क्षय रोग क्लीनिक / अस्पताल" },
    { id: "7.6", name: "अस्पताल - एलोपैथिक" },
    { id: "7.7", name: "अस्पताल (एलोपैथिक के अलावा अन्य)" },
    { id: "7.8", name: "डिस्पेंसरी" },
    { id: "7.9", name: "कल्याण (वेलनेस सेंटर) केंद्र" },
    { id: "7.10", name: "पशु चिकित्सा अस्पताल" },
    { id: "7.11", name: "सचल स्वास्थ्य क्लीनिक (मोबाइल हेल्थ)" },
    { id: "7.12", name: "परिवार कल्याण केंद्र" },
    { id: "7.13", name: "आईसीडीएस / आंगनवाड़ी केंद्र" }
  ];

  const [govtRows, setGovtRows] = useState(
    govtCategories.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: { avail: "", count: "", beds: "", doc_total: "", doc_present: "", staff_total: "", staff_present: "", near_dist: "" }
    }), {})
  );

  const [privateData, setPrivateData] = useState({ opd: "", combined: "", charity: "" });
  const [personnel, setPersonnel] = useState({ mbbs: "", other_degree: "", no_degree: "", traditional: "", medical_shops: "", other_med: "" });
  const [infoSource, setSource] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(
  `/get-ward-data/${ward}/7`
);
        if (res.data && res.data.data) {
          const d = res.data.data;
          setGovtRows(d.govtRows || govtRows);
          setPrivateData(d.privateData || privateData);
          setPersonnel(d.personnel || personnel);
          setSource(d.infoSource || "");
          setSaveStatus(res.data.status);
        }
      } catch (err) { console.log("New data entry"); }
    };
    if (ward) fetchData();
  }, [ward]);

  const handleSave = async () => {
    if (!ward) return alert("वार्ड चुनें!");
    setLoading(true);
    
    // Check if everything is filled based on Yes/No logic
    const isComplete = govtCategories.every(cat => {
      const r = govtRows[cat.id];
      if (r.avail === "1") return r.count !== "" && r.beds !== "" && r.doc_total !== "";
      if (r.avail === "2") return r.near_dist !== "";
      return false;
    }) && infoSource !== "";

    const currentStatus = isComplete ? 'complete' : 'pending';

    try {
      await API.post(
  '/save-ward-data',
  {
    ward_no: ward,
    section_no: 7,
    data: {
      govtRows,
      privateData,
      personnel,
      infoSource
    },
    status: currentStatus
  }
);
      setSaveStatus(currentStatus);
      alert(isComplete ? "पूर्ण सुरक्षित!" : "डेटा सुरक्षित (लंबित)");
      navigate('/data-collection');
    } catch (err) { alert("Error saving data"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto pb-32 pt-6 px-4 font-sans antialiased bg-slate-50/50">
      
      {/* Sticky Header */}
      <nav className="flex items-center justify-between mb-8 sticky top-4 z-[100] bg-white/80 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-xl shadow-emerald-900/10 border border-white">
        <button onClick={() => navigate('/data-collection')} className="group flex items-center gap-3 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all">
          <ChevronLeft size={20} className="text-slate-600 group-hover:-translate-x-1 transition-transform"/> 
          <span className="font-black text-slate-700 text-sm">वापस</span>
        </button>
        <div className="text-center">
            <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-0.5">Medical Section</h2>
            <p className="text-lg font-black text-slate-900 tracking-tight">{ward}</p>
        </div>
        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-inner
          ${saveStatus === 'complete' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600 animate-pulse'}`}>
          {saveStatus || 'Ready'}
        </div>
      </nav>

      {/* Main Banner */}
      <header className="relative mb-12 p-10 bg-emerald-600 rounded-[3.5rem] overflow-hidden shadow-2xl shadow-emerald-200 text-white">
          <div className="absolute top-0 right-0 w-80 h-84 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex items-center gap-8">
              <div className="p-7 bg-white/20 rounded-[2.5rem] backdrop-blur-md shadow-inner">
                  <Stethoscope size={50} strokeWidth={2.5}/>
              </div>
              <div>
                  <h1 className="text-4xl font-black tracking-tight mb-2 uppercase italic">चिकित्सा सुविधाएं</h1>
                  <p className="text-emerald-50 font-medium max-w-md leading-relaxed opacity-90 text-sm">सरकारी एवं निजी स्वास्थ्य सेवाओं का विस्तृत डेटा प्रपत्र यहाँ भरें।</p>
              </div>
          </div>
      </header>

      {/* --- Section 1: Dynamic Cards (7.1 - 7.13) --- */}
      <div className="space-y-10 mb-20">
        <div className="flex items-center gap-3 ml-6 mb-6">
            <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">7.1 - 7.13 सरकारी चिकित्सा सेवाएं</h3>
        </div>
        
        {govtCategories.map((cat) => (
          <FacilityCard 
            key={cat.id} 
            cat={cat} 
            data={govtRows[cat.id]} 
            onChange={(field, val) => setGovtRows({...govtRows, [cat.id]: {...govtRows[cat.id], [field]: val}})}
          />
        ))}
      </div>

      {/* --- Section 2: Non-Govt & Personnel (Cards) --- */}
      <section className="bg-slate-900 p-10 rounded-[4rem] shadow-2xl text-white mb-12 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 p-10 opacity-5"><Activity size={150}/></div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-10 flex items-center gap-4">
              <PlusSquare className="text-emerald-400"/> 7.14 - 7.17 अन्य विवरण
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
              <div className="space-y-6 bg-white/5 p-8 rounded-[3rem] border border-white/10">
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">गैर सरकारी क्लीनिक</h4>
                  <DarkInput label="7.14.1 बाह्य रोगी (OPD)" value={privateData.opd} onChange={(v)=>setPrivateData({...privateData, opd:v})} />
                  <DarkInput label="7.14.2 अंत एवं बाह्य रोगी" value={privateData.combined} onChange={(v)=>setPrivateData({...privateData, combined:v})} />
                  <DarkInput label="7.14.3 धर्मार्थ (Charity)" value={privateData.charity} onChange={(v)=>setPrivateData({...privateData, charity:v})} />
              </div>
              <div className="space-y-6 bg-white/5 p-8 rounded-[3rem] border border-white/10">
                  <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">स्वास्थ्य कर्मी (संख्या)</h4>
                  <DarkInput label="7.15.1 MBBS डॉक्टर" value={personnel.mbbs} onChange={(v)=>setPersonnel({...personnel, mbbs:v})} />
                  <DarkInput label="7.15.2 अन्य डिग्री डॉक्टर" value={personnel.other_degree} onChange={(v)=>setPersonnel({...personnel, other_degree:v})} />
                  <DarkInput label="7.16 दवा की दुकानें" value={personnel.medical_shops} onChange={(v)=>setPersonnel({...personnel, medical_shops:v})} />
              </div>
          </div>
      </section>

      {/* Info Source */}
      <section className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 mb-20 transition-all hover:shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl"><Search size={24}/></div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">डेटा का मुख्य स्रोत</h3>
          </div>
          <input 
            type="text" 
            value={infoSource}
            onChange={(e) => setSource(e.target.value)}
            placeholder="उदा. सीएमओ ऑफिस, अस्पताल रजिस्टर, सर्वे रिपोर्ट..."
            className={`w-full p-6 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-700
              ${!infoSource ? 'border-rose-100 focus:border-rose-500 shadow-inner' : 'border-slate-50 focus:border-emerald-500 bg-white shadow-lg shadow-emerald-100/20'}`}
          />
      </section>

      {/* Fixed Bottom Save */}
      <div className="fixed bottom-8 left-0 right-0 px-6 z-[200]">
          <div className="max-w-md mx-auto">
              <button onClick={handleSave} disabled={loading}
                className="w-full py-6 bg-slate-900 hover:bg-black text-white rounded-[2.5rem] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 group"
              >
                {loading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <><Save size={24}/> <span>सुरक्षित करें</span> <ArrowRight size={20} className="opacity-40"/></>}
              </button>
          </div>
      </div>
    </div>
  );
};

// --- Exact Logic Card Component ---
const FacilityCard = ({ cat, data, onChange }) => {
  const isAvailable = data.avail === "1"; // "हाँ" चुना गया है
  const isNotAvailable = data.avail === "2"; // "नहीं" चुना गया है

  return (
    <div className={`relative bg-white rounded-[3.5rem] border-2 transition-all duration-700
      ${isNotAvailable ? 'border-rose-400 bg-rose-50/10 scale-[0.98]' : 'border-white shadow-xl hover:border-emerald-200'}`}>
      
      <div className="p-10 space-y-10">
        {/* Header Logic: Yes/No Dropdown */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 pb-8">
            <div className="flex items-center gap-6">
                <div className={`p-5 rounded-[1.8rem] shadow-lg transition-colors ${isNotAvailable ? 'bg-rose-500 shadow-rose-200' : 'bg-emerald-600 shadow-emerald-200'} text-white`}>
                    <PlusSquare size={30}/>
                </div>
                <div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">{cat.id} Category</span>
                    <h3 className="text-2xl font-black text-slate-800 leading-tight mt-1 uppercase tracking-tighter italic">{cat.name}</h3>
                </div>
            </div>
            <div className="w-full md:w-56">
                <PremiumSelect 
                  label="क्या सुविधा उपलब्ध है?" 
                  value={data.avail} 
                  onChange={(v) => onChange('avail', v)}
                  options={[{l: "हाँ", v: "1"}, {l: "नहीं", v: "2"}]}
                />
            </div>
        </div>

        {/* --- Logic 1: IF YES (Show Counts, Beds, Doctors, Staff) --- */}
        {isAvailable && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <PremiumInput label="सुविधाओं की संख्या" type="number" value={data.count} onChange={(v)=>onChange('count', v)} />
                  <PremiumInput label="बिस्तरों (Beds) की संख्या" type="number" value={data.beds} onChange={(v)=>onChange('beds', v)} />
              </div>
              <div className="p-8 bg-blue-50/30 rounded-[2.5rem] border border-blue-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2"><Users size={14}/> चिकित्सा स्टाफ</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <PremiumInput label="कुल स्टाफ" value={data.staff_total} onChange={(v)=>onChange('staff_total', v)} />
                        <PremiumInput label="तैनात स्टाफ" value={data.staff_present} onChange={(v)=>onChange('staff_present', v)} />
                      </div>
                  </div>
                  <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2"><Stethoscope size={14}/> चिकित्सक (Doctors)</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <PremiumInput label="कुल डॉक्टर" value={data.doc_total} onChange={(v)=>onChange('doc_total', v)} />
                        <PremiumInput label="तैनात डॉक्टर" value={data.doc_present} onChange={(v)=>onChange('doc_present', v)} />
                      </div>
                  </div>
              </div>
          </div>
        )}

        {/* --- Logic 2: IF NO (Show Nearest Facility Code) --- */}
        {isNotAvailable && (
          <div className="animate-in slide-in-from-bottom-6 duration-500 p-8 bg-rose-500/5 rounded-[2.5rem] border-2 border-dashed border-rose-200">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl"><MapPin size={24}/></div>
                   <h4 className="text-sm font-black text-rose-600 uppercase tracking-widest max-w-[200px] leading-relaxed">नगर में उपलब्ध नहीं होने पर निकटतम सुविधा का दूरी कोड:</h4>
                </div>
                <div className="w-full md:w-64">
                   <PremiumSelect 
                     label="दूरी कोड (a/b/c)" 
                     value={data.near_dist} 
                     onChange={(v) => onChange('near_dist', v)}
                     options={[
                       {l: "5 किमी से कम (a)", v: "a"}, 
                       {l: "5 से 10 किमी (b)", v: "b"}, 
                       {l: "10 किमी से अधिक (c)", v: "c"}
                     ]}
                   />
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Reusable UI Elements ---
const PremiumInput = ({ label, value, onChange, type="text", placeholder="0" }) => (
  <div className="flex flex-col gap-2 group relative">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
      className={`w-full p-4 rounded-2xl border-2 outline-none transition-all font-bold text-lg
        ${!value ? 'border-rose-100 bg-rose-50/10 focus:border-rose-400' : 'border-slate-100 bg-white focus:border-emerald-500 shadow-sm shadow-slate-100'}`}
      placeholder={placeholder}
    />
  </div>
);

const DarkInput = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-2 group mb-4">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">{label}</label>
    <input type="number" value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full p-4 rounded-2xl border-2 bg-white/5 outline-none transition-all font-bold text-lg border-white/10 text-white focus:border-emerald-500"
      placeholder="0"
    />
  </div>
);

const PremiumSelect = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-2 group relative">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className={`w-full p-4 rounded-2xl border-2 bg-white outline-none font-black text-lg cursor-pointer transition-all appearance-none shadow-md
        ${!value ? 'border-rose-200 focus:border-rose-500' : 'border-slate-100 focus:border-emerald-500'}`}
    >
      <option value="">- चुनें -</option>
      {options.map(o => <option key={o.v} value={o.v} className="font-bold text-slate-800">{o.l}</option>)}
    </select>
    <div className="absolute right-4 top-10 pointer-events-none text-slate-400"><ChevronLeft className="-rotate-90" size={16}/></div>
  </div>
);

export default Anubhag7;
