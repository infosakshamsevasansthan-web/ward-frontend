import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Save, AlertCircle, CheckCircle2, 
  Landmark, HandCoins, Factory, Package, 
  Info, ArrowRight, TrendingUp, Building 
} from 'lucide-react';
import API from '../api';

const Anubhag6 = () => {
  const navigate = useNavigate();
  const ward = localStorage.getItem('currentWard');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // --- Form State ---
  const [fields, setFields] = useState({
    bank_public: "",
    bank_private: "",
    bank_coop: "",
    credit_agri: "",
    credit_non_agri: "",
    prod_1: "",
    prod_2: "",
    prod_3: "",
    infoSource: ""
  });

  // --- Load Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(
  `/get-ward-data/${ward}/6`
);
        if (res.data && res.data.data) {
          setFields(res.data.data);
          setSaveStatus(res.data.status);
        }
      } catch (err) { console.log("New session for section 6"); }
    };
    if (ward) fetchData();
  }, [ward]);

  const handleInputChange = (field, value) => {
    setFields(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!ward) return alert("वार्ड चुनें!");
    setLoading(true);
    
    // Validation: Check if mandatory fields are filled
    const isComplete = Object.values(fields).every(val => val.trim() !== "");
    const currentStatus = isComplete ? 'complete' : 'pending';

    try {
      await API.post(
  '/save-ward-data',
  {
    ward_no: ward,
    section_no: 6,
    data: fields,
    status: currentStatus
  }
);
      setSaveStatus(currentStatus);
      alert(isComplete ? "अनुभाग-6 पूर्ण सुरक्षित!" : "डेटा सुरक्षित हुआ (लंबित)");
      navigate('/data-collection');
    } catch (err) { alert("Error saving data"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto pb-32 pt-6 px-4 font-sans antialiased bg-slate-50/50">
      
      {/* Sticky Header */}
      <nav className="flex items-center justify-between mb-8 sticky top-4 z-[100] bg-white/80 backdrop-blur-xl p-4 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white/20">
        <button onClick={() => navigate('/data-collection')} className="group flex items-center gap-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all active:scale-95">
          <ChevronLeft className="text-slate-600 group-hover:-translate-x-1 transition-transform" size={20}/> 
          <span className="font-black text-slate-700 text-sm">वापस</span>
        </button>
        <div className="text-center">
            <h2 className="text-xs font-black text-amber-600 uppercase tracking-[0.2em] mb-0.5">Section 06</h2>
            <p className="text-lg font-black text-slate-900 tracking-tight">{ward}</p>
        </div>
        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-inner
          ${saveStatus === 'complete' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600 animate-pulse'}`}>
          {saveStatus || 'New Form'}
        </div>
      </nav>

      {/* Hero Banner */}
      <header className="relative mb-12 p-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[3rem] overflow-hidden shadow-2xl shadow-amber-200 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex items-center gap-8">
              <div className="p-6 bg-white/20 rounded-[2rem] backdrop-blur-md shadow-inner">
                  <Landmark size={48} strokeWidth={2.5}/>
              </div>
              <div>
                  <h1 className="text-3xl font-black tracking-tight mb-2 uppercase italic leading-none">उद्योग एवं बैंकिंग सुविधाएं</h1>
                  <p className="text-amber-50 font-medium max-w-md leading-relaxed opacity-90 text-sm">वार्ड में स्थित बैंकों, ऋण समितियों और प्रमुख उद्योगों का विवरण दर्ज करें।</p>
              </div>
          </div>
      </header>

      {/* --- Section: Banking (6.1 - 6.3) --- */}
      <section className="mb-10 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl"><Building size={24}/></div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">बैंकिंग संस्थान (संख्या भरें)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <PremiumInput label="6.1 सार्वजनिक क्षेत्र का बैंक" type="number" value={fields.bank_public} onChange={(v)=>handleInputChange('bank_public', v)} />
                  <PremiumInput label="6.2 निजी वाणिज्यिक बैंक" type="number" value={fields.bank_private} onChange={(v)=>handleInputChange('bank_private', v)} />
                  <PremiumInput label="6.3 सहकारी बैंक" type="number" value={fields.bank_coop} onChange={(v)=>handleInputChange('bank_coop', v)} />
              </div>
          </div>
      </section>

      {/* --- Section: Credit Societies (6.4.1 - 6.4.2) --- */}
      <section className="mb-10 animate-in slide-in-from-bottom-6 duration-500">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><HandCoins size={24}/></div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">6.4 ऋण समितियां (संख्या)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <PremiumInput label="6.4.1 कृषि ऋण समितियां" type="number" value={fields.credit_agri} onChange={(v)=>handleInputChange('credit_agri', v)} />
                  <PremiumInput label="6.4.2 गैर-कृषि ऋण समितियां" type="number" value={fields.credit_non_agri} onChange={(v)=>handleInputChange('credit_non_agri', v)} />
              </div>
          </div>
      </section>

      {/* --- Section: Major Products (6.5) --- */}
      <section className="mb-10 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden">
              <div className="absolute bottom-0 right-0 p-10 opacity-10"><Factory size={120}/></div>
              <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="p-3 bg-white/10 rounded-2xl text-amber-400"><Package size={24}/></div>
                  <h3 className="text-xl font-black uppercase tracking-tighter italic">6.5 तीन प्रमुख निर्मित वस्तुओं के नाम</h3>
              </div>
              <div className="space-y-6 relative z-10">
                  <DarkInput label="1st प्रमुख वस्तु" value={fields.prod_1} onChange={(v)=>handleInputChange('prod_1', v)} />
                  <DarkInput label="2nd प्रमुख वस्तु" value={fields.prod_2} onChange={(v)=>handleInputChange('prod_2', v)} />
                  <DarkInput label="3rd प्रमुख वस्तु" value={fields.prod_3} onChange={(v)=>handleInputChange('prod_3', v)} />
              </div>
          </div>
      </section>

      {/* Information Source */}
      <section className="mt-12">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl"><Info size={24}/></div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">जानकारी का मुख्य स्रोत</h3>
              </div>
              <input 
                type="text" 
                value={fields.infoSource}
                onChange={(e) => handleInputChange('infoSource', e.target.value)}
                placeholder="उदा. व्यापार मंडल, बैंक शाखा, वार्ड पार्षद..."
                className={`w-full p-6 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-700
                  ${!fields.infoSource ? 'border-rose-100 focus:border-rose-500 shadow-inner' : 'border-slate-50 focus:border-amber-500 bg-white shadow-lg shadow-amber-100/20'}`}
              />
          </div>
      </section>

      {/* Fixed Bottom Save Button */}
      <div className="fixed bottom-8 left-0 right-0 px-6 z-[200]">
          <div className="max-w-md mx-auto">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full py-6 bg-slate-900 hover:bg-black text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-slate-400 transition-all active:scale-95 flex items-center justify-center gap-4 group"
              >
                {loading ? (
                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
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

// --- Custom Reusable Components ---

const PremiumInput = ({ label, value, onChange, type="text" }) => (
  <div className="flex flex-col gap-2 group">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{label}</label>
    <div className="relative">
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-5 rounded-2xl border-2 outline-none transition-all font-bold text-lg
          ${!value ? 'border-rose-100 focus:border-rose-400 bg-rose-50/10 shadow-inner' : 'border-slate-50 focus:border-amber-500 bg-white shadow-md shadow-slate-100/50'}`}
        placeholder="0"
      />
      {!value && <span className="absolute right-4 top-5 text-rose-400 animate-pulse"><AlertCircle size={18}/></span>}
    </div>
  </div>
);

const DarkInput = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-2 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{label}</label>
    <div className="relative">
      <input 
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-5 rounded-2xl border-2 bg-white/5 outline-none transition-all font-bold text-lg border-white/10 text-white
          ${!value ? 'focus:border-amber-500' : 'focus:border-amber-400 bg-white/10'}`}
        placeholder="..."
      />
      {!value && <span className="absolute right-4 top-5 text-amber-500/50"><TrendingUp size={18}/></span>}
    </div>
  </div>
);

export default Anubhag6;
