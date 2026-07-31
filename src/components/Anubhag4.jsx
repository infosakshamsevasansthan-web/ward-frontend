import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Save, AlertCircle, CheckCircle2, 
  GraduationCap, School, MapPin, Building2, 
  Search, BookOpen, Info, ArrowRight
} from 'lucide-react';
import API from '../api';

const Anubhag4 = () => {
  const navigate = useNavigate();
  const ward = localStorage.getItem('currentWard');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const categories = [
    { id: "4.1", name: "पूर्व-प्राथमिक विद्यालय (नर्सरी/LKG/UKG)" },
    { id: "4.2", name: "प्राथमिक विद्यालय" },
    { id: "4.3", name: "उच्च प्राथमिक विद्यालय" },
    { id: "4.4", name: "माध्यमिक विद्यालय" },
    { id: "4.5", name: "उच्च/वरिष्ठ माध्यमिक विद्यालय" },
    { id: "4.6", name: "व्यवसायिक प्रशिक्षण संस्थान / आईटीआई" },
    { id: "4.7", name: "पॉलिटेक्निक, नर्सिंग एवं अध्यापक प्रशिक्षण" },
    { id: "4.8.1", name: "सामान्य कॉलेज (स्नातक स्तर और ऊपर)" },
    { id: "4.8.2", name: "केवल कला संकाय कॉलेज" },
    { id: "4.8.3", name: "केवल वाणिज्य संकाय कॉलेज" },
    { id: "4.8.4", name: "केवल विज्ञान संकाय कॉलेज" },
    { id: "4.8.5", name: "केवल नर्सिंग संकाय कॉलेज" },
    { id: "4.8.6", name: "केवल शिक्षा संकाय कॉलेज" },
    { id: "4.9", name: "विधि (Law) कॉलेज" },
    { id: "4.10", name: "मेडिकल कॉलेज" },
    { id: "4.11", name: "इंजीनियरिंग कॉलेज" },
    { id: "4.12", name: "मैनेजमेंट कॉलेज" },
    { id: "4.13", name: "विश्वविद्यालय / वि.वि. स्तर के संस्थान" },
    { id: "4.14", name: "गैर-औपचारिक प्रशिक्षण केंद्र" },
    { id: "4.15", name: "दिव्यांगजन हेतु विशेष विद्यालय" },
    { id: "4.16", name: "कौशल विकास केंद्र" },
    { id: "4.17", name: "मुक्त शिक्षण केंद्र (Open Learning)" },
  ];

  const [rows, setRows] = useState(
    categories.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: { gov_avail: "", gov_count: "", pvt_avail: "", pvt_count: "", near_type: "", near_name: "", near_dist: "" }
    }), {})
  );
  const [infoSource, setSource] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(
  `/get-ward-data/${ward}/4`
);
        if (res.data && res.data.data) {
          setRows(res.data.data.rows);
          setSource(res.data.data.infoSource || "");
          setSaveStatus(res.data.status);
        }
      } catch (err) { console.log("New session"); }
    };
    if (ward) fetchData();
  }, [ward]);

  const handleInputChange = (id, field, value) => {
    setRows(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSave = async () => {
    if (!ward) return alert("वार्ड चुनें!");
    setLoading(true);
    
    // Logic: Every row must have gov_avail and pvt_avail filled
    const isComplete = categories.every(c => rows[c.id].gov_avail && rows[c.id].pvt_avail) && infoSource !== "";
    const currentStatus = isComplete ? 'complete' : 'pending';

    try {
      await API.post(
  '/save-ward-data',
  {
    ward_no: ward,
    section_no: 4,
    data: { rows, infoSource },
    status: currentStatus
  }
);
      setSaveStatus(currentStatus);
      alert(isComplete ? "पूर्ण सुरक्षित!" : "अधूरा डेटा सुरक्षित किया गया (Pending)");
      navigate('/data-collection');
    } catch (err) { alert("Error!"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto pb-32 pt-6 px-4 font-sans antialiased bg-slate-50/50">
      
      {/* Sticky Header Navigation */}
      <nav className="flex items-center justify-between mb-8 sticky top-4 z-[100] bg-white/80 backdrop-blur-xl p-4 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white/20">
        <button onClick={() => navigate('/data-collection')} className="group flex items-center gap-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all active:scale-95">
          <ChevronLeft className="text-slate-600 group-hover:-translate-x-1 transition-transform" size={20}/> 
          <span className="font-black text-slate-700 text-sm">वापस</span>
        </button>
        <div className="text-center">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-0.5">Section 04</h2>
            <p className="text-lg font-black text-slate-900 tracking-tight">{ward}</p>
        </div>
        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-inner
          ${saveStatus === 'complete' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600 animate-pulse'}`}>
          {saveStatus || 'New Form'}
        </div>
      </nav>

      {/* Main Banner */}
      <header className="relative mb-12 p-10 bg-indigo-600 rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex items-center gap-8 text-white">
              <div className="p-6 bg-white/20 rounded-[2rem] backdrop-blur-md shadow-inner">
                  <GraduationCap size={48} strokeWidth={2.5}/>
              </div>
              <div>
                  <h1 className="text-4xl font-black tracking-tight mb-2 uppercase italic">शैक्षणिक सुविधाएं</h1>
                  <p className="text-indigo-100 font-medium max-w-md leading-relaxed opacity-90 text-sm">नगर में उपलब्ध सभी सरकारी एवं निजी शिक्षण संस्थानों की जानकारी यहाँ दर्ज करें।</p>
              </div>
          </div>
      </header>

      {/* Categories Cards */}
      <div className="space-y-10">
        {categories.map((cat, index) => (
          <ModernFacilityCard 
            key={cat.id} 
            cat={cat} 
            index={index}
            data={rows[cat.id]} 
            onChange={(field, val) => handleInputChange(cat.id, field, val)}
          />
        ))}
      </div>

      {/* Information Source Card */}
      <section className="mt-12 group">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 transition-all group-hover:shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Info size={24}/></div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">डेटा का मुख्य स्रोत</h3>
              </div>
              <div className="relative">
                  <input 
                    type="text" 
                    value={infoSource}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="उदा. स्कूल रजिस्टर, वार्ड पार्षद की रिपोर्ट..."
                    className={`w-full p-6 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-700
                      ${!infoSource ? 'border-rose-100 focus:border-rose-500 shadow-inner' : 'border-slate-50 focus:border-indigo-500 bg-white shadow-lg shadow-indigo-100/20'}`}
                  />
                  {!infoSource && <div className="mt-4 flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest ml-4"><AlertCircle size={14}/> यह जानकारी भरना अनिवार्य है</div>}
              </div>
          </div>
      </section>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-8 left-0 right-0 px-6 z-[200]">
          <div className="max-w-md mx-auto">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full py-6 bg-slate-900 hover:bg-black text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-slate-400 transition-all active:scale-95 flex items-center justify-center gap-4 group overflow-hidden"
              >
                {loading ? (
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>प्रतीक्षा करें...</span>
                    </div>
                ) : (
                    <>
                        <Save size={24} className="group-hover:rotate-12 transition-transform"/> 
                        <span>डाटा सुरक्षित करें</span>
                        <ArrowRight size={20} className="opacity-40 group-hover:translate-x-2 transition-transform"/>
                    </>
                )}
              </button>
          </div>
      </div>
    </div>
  );
};

// --- Modern Card Component ---
const ModernFacilityCard = ({ cat, data, onChange, index }) => {
  // Logic: When "Nahi" (2) is selected for BOTH Gov and Pvt
  const showNearestFields = data.gov_avail === "2" && data.pvt_avail === "2";

  return (
    <div className={`relative bg-white rounded-[4rem] border-2 transition-all duration-700 overflow-hidden
      ${showNearestFields ? 'border-rose-500 shadow-2xl shadow-rose-200/50 scale-[1.02]' : 'border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-indigo-100 hover:-translate-y-1'}`}>
      
      {/* Decorative ID Number */}
      <div className="absolute top-6 right-10 text-8xl font-black text-slate-50 opacity-[0.03] select-none pointer-events-none">
          {cat.id}
      </div>

      <div className="p-10 space-y-12">
        {/* Header */}
        <div className="flex items-start gap-6 border-b border-slate-50 pb-8">
            <div className={`p-5 rounded-3xl shadow-lg transition-colors
              ${showNearestFields ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-slate-900 text-white shadow-slate-200'}`}>
                {index % 2 === 0 ? <School size={32}/> : <Building2 size={32}/>}
            </div>
            <div className="pt-2">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">{cat.id} Category</span>
                <h3 className="text-2xl font-black text-slate-800 leading-tight mt-2 uppercase tracking-tighter italic">{cat.name}</h3>
            </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
          
          {/* Section: Government */}
          <div className="space-y-6 relative">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">सरकारी (Govt)</h4>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <PremiumSelect 
                  label="उपलब्ध है?" 
                  value={data.gov_avail} 
                  onChange={(v) => onChange('gov_avail', v)}
                  options={[{l: "हाँ", v: "1"}, {l: "नहीं", v: "2"}]}
                />
                <PremiumInput 
                  label="कुल संख्या" 
                  type="number" 
                  value={data.gov_count} 
                  disabled={data.gov_avail !== "1"}
                  onChange={(v) => onChange('gov_count', v)} 
                />
            </div>
          </div>

          {/* Section: Private */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">निजी (Private)</h4>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <PremiumSelect 
                  label="उपलब्ध है?" 
                  value={data.pvt_avail} 
                  onChange={(v) => onChange('pvt_avail', v)}
                  options={[{l: "हाँ", v: "1"}, {l: "नहीं", v: "2"}]}
                />
                <PremiumInput 
                  label="कुल संख्या" 
                  type="number" 
                  value={data.pvt_count} 
                  disabled={data.pvt_avail !== "1"}
                  onChange={(v) => onChange('pvt_count', v)} 
                />
            </div>
          </div>
        </div>

        {/* --- SECTION: NEAREST FACILITY (आपके कहे अनुसार बदलाव) --- */}
        {showNearestFields && (
          <div className="animate-in slide-in-from-bottom-10 fade-in duration-500 bg-rose-50/50 p-10 rounded-[3rem] border-2 border-dashed border-rose-200 relative">
            <div className="absolute -top-4 left-10 bg-rose-500 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-rose-200 flex items-center gap-2">
                <MapPin size={14}/> Nearest Facility Required
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <PremiumSelect 
                  label="संस्थान का प्रकार" 
                  value={data.near_type} 
                  onChange={(v) => onChange('near_type', v)}
                  options={[{l: "सरकारी", v: "सरकारी"}, {l: "निजी", v: "निजी"}]}
                />
                <PremiumInput 
                  label="नजदीक में कहाँ है (नाम)" 
                  placeholder="गाँव/शहर का नाम"
                  value={data.near_name} 
                  onChange={(v) => onChange('near_name', v)} 
                />
                <PremiumInput 
                  label="कितने दूरी पर है (किमी)" 
                  placeholder="0.0 km"
                  type="number"
                  value={data.near_dist} 
                  onChange={(v) => onChange('near_dist', v)} 
                />
            </div>
            <div className="mt-4 flex items-center gap-2 text-rose-500 font-bold text-[9px] uppercase tracking-widest">
                <Search size={12}/> वार्ड में उपलब्ध नहीं होने के कारण यह जानकारी भरना आवश्यक है।
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Reusable Premium UI Components ---

const PremiumInput = ({ label, value, onChange, type="text", disabled=false, placeholder="0" }) => (
  <div className="flex flex-col gap-2 relative group">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{label}</label>
    <div className="relative">
      <input 
        type={type}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-5 rounded-2xl border-2 outline-none transition-all font-bold text-lg
          ${disabled ? 'bg-slate-100 border-slate-100 text-slate-300' : 'bg-white border-slate-100 focus:border-indigo-500 shadow-inner'}`}
        placeholder={placeholder}
      />
      {!disabled && !value && <span className="absolute right-4 top-5 text-rose-400 animate-pulse"><AlertCircle size={18}/></span>}
    </div>
  </div>
);

const PremiumSelect = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-2 group">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{label}</label>
    <div className="relative">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-5 rounded-2xl border-2 bg-white outline-none font-black text-lg cursor-pointer transition-all appearance-none
          ${!value ? 'border-rose-100 focus:border-rose-500' : 'border-slate-100 focus:border-indigo-500 shadow-md'}`}
      >
        <option value="">- चुनें -</option>
        {options.map(o => <option key={o.v} value={o.v} className="font-bold text-slate-800">{o.l}</option>)}
      </select>
      <div className="absolute right-4 top-6 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
          <ChevronLeft className="-rotate-90" size={16}/>
      </div>
    </div>
  </div>
);

export default Anubhag4;
