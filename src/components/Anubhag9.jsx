import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Save, AlertCircle, CheckCircle2, 
  MessageSquare, UserCheck, Calendar, Phone, 
  Eraser, PenTool, Search, ArrowRight, Flag
} from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';

const Anubhag9 = () => {
  const navigate = useNavigate();
  const ward = localStorage.getItem('currentWard');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // --- Signature Refs ---
  const officerSignRef = useRef(null);
  const chiefSignRef = useRef(null);

  // --- Form State ---
  const [fields, setFields] = useState({
    observation: "",
    // नगर अधिकारी विवरण
    officer_name: "", officer_mobile: "", officer_date: "", officer_sign: null,
    // नगर प्रमुख विवरण
    chief_name: "", chief_mobile: "", chief_date: "", chief_sign: null
  });

  // --- Load Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/get-ward-data/${ward}/9`);
        if (res.data && res.data.data) {
          setFields(res.data.data);
          setSaveStatus(res.data.status);
          // साईन लोड करने के लिए Canvas पर Draw करना होगा (Optional for view mode)
        }
      } catch (err) { console.log("New session"); }
    };
    if (ward) fetchData();
  }, [ward]);

  // --- Signature Logic ---
  const clearOfficerSign = () => officerSignRef.current.clear();
  const clearChiefSign = () => chiefSignRef.current.clear();

  const handleSave = async () => {
    if (!ward) return alert("वार्ड चुनें!");
    setLoading(true);

    // साईन को Image (Base64) में बदलना
    const offSignData = officerSignRef.current.isEmpty() ? null : officerSignRef.current.getTrimmedCanvas().toDataURL('image/png');
    const chiSignData = chiefSignRef.current.isEmpty() ? null : chiefSignRef.current.getTrimmedCanvas().toDataURL('image/png');

    const updatedFields = { ...fields, officer_sign: offSignData, chief_sign: chiSignData };

    // Validation
    const isComplete = fields.observation && fields.officer_name && offSignData;
    const currentStatus = isComplete ? 'complete' : 'pending';

    try {
      await axios.post('http://localhost:5000/api/save-ward-data', {
        ward_no: ward, section_no: 9, data: updatedFields, status: currentStatus
      });
      setSaveStatus(currentStatus);
      alert(isComplete ? "पूरा सर्वे सफलतापूर्वक संपन्न!" : "डेटा सुरक्षित (लंबित)");
      navigate('/data-collection');
    } catch (err) { alert("Save Error!"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto pb-40 pt-6 px-4 font-sans antialiased bg-slate-50/50">
      
      {/* Sticky Header */}
      <nav className="flex items-center justify-between mb-8 sticky top-4 z-[100] bg-white/80 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-xl border border-white">
        <button onClick={() => navigate('/data-collection')} className="group flex items-center gap-3 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all">
          <ChevronLeft size={20}/> <span className="font-black text-slate-700 text-sm">वापस</span>
        </button>
        <div className="text-center">
            <h2 className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Final Section</h2>
            <p className="text-lg font-black text-slate-900 tracking-tight">{ward}</p>
        </div>
        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-inner
          ${saveStatus === 'complete' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600 animate-pulse'}`}>
          {saveStatus || 'Conclusion'}
        </div>
      </nav>

      {/* Banner */}
      <header className="relative mb-12 p-10 bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl text-white">
          <div className="absolute top-0 right-0 w-80 h-84 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex items-center gap-8">
              <div className="p-7 bg-white/10 rounded-[2.5rem] backdrop-blur-md border border-white/10 shadow-inner">
                  <Flag size={50} className="text-rose-500" strokeWidth={2.5}/>
              </div>
              <div>
                  <h1 className="text-3xl font-black tracking-tight mb-2 uppercase italic leading-none">अनुभाग - 9: टिप्पणियां एवं अवलोकन</h1>
                  <p className="text-slate-400 font-medium max-w-md text-sm italic">सर्वे का अंतिम चरण: महत्वपूर्ण जानकारी एवं हस्ताक्षर</p>
              </div>
          </div>
      </header>

      {/* --- Observation Text Area --- */}
      <section className="mb-12">
          <div className="bg-white p-10 rounded-[4rem] shadow-xl border border-slate-100 group">
              <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl"><MessageSquare size={24}/></div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">नगर के बारे में अन्य उल्लेखनीय जानकारी</h3>
              </div>
              <textarea 
                value={fields.observation}
                onChange={(e) => setFields({...fields, observation: e.target.value})}
                placeholder="यहाँ अपनी टिप्पणी और अवलोकन विस्तार से लिखें..."
                className="w-full h-64 p-8 bg-slate-50 border-2 border-slate-50 rounded-[3rem] outline-none font-bold text-slate-700 text-lg transition-all focus:bg-white focus:border-rose-500 focus:shadow-2xl focus:shadow-rose-100"
              />
          </div>
      </section>

      {/* --- Signatory 1: Municipal Officer --- */}
      <section className="mb-12 bg-white rounded-[4rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200"><UserCheck size={24}/></div>
              <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tighter">अधिकृत हस्ताक्षरकर्ता / नगर अधिकारी</h3>
          </div>
          <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <PremiumInput label="नाम तथा पदनाम" value={fields.officer_name} onChange={(v)=>setFields({...fields, officer_name:v})} />
                  <PremiumInput label="मोबाईल नं." type="number" value={fields.officer_mobile} onChange={(v)=>setFields({...fields, officer_mobile:v})} />
                  <PremiumInput label="दिनांक" type="date" value={fields.officer_date} onChange={(v)=>setFields({...fields, officer_date:v})} />
              </div>
              
              {/* Signature Pad */}
              <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">हस्ताक्षर (डिजिटल साईन करें)</label>
                  <div className="relative bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] overflow-hidden h-60">
                      <SignatureCanvas 
                        ref={officerSignRef}
                        penColor="navy"
                        canvasProps={{className: "w-full h-full cursor-crosshair"}}
                      />
                      <button onClick={clearOfficerSign} className="absolute bottom-4 right-4 p-3 bg-white text-rose-500 rounded-2xl shadow-lg border hover:bg-rose-50 transition-all flex items-center gap-2 text-xs font-bold">
                          <Eraser size={14}/> साफ़ करें
                      </button>
                  </div>
              </div>
          </div>
      </section>

      {/* --- Signatory 2: City Chief --- */}
      <section className="mb-12 bg-white rounded-[4rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200"><UserCheck size={24}/></div>
              <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tighter">अधिकृत हस्ताक्षरकर्ता / नगर प्रमुख</h3>
          </div>
          <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <PremiumInput label="नाम तथा पदनाम" value={fields.chief_name} onChange={(v)=>setFields({...fields, chief_name:v})} />
                  <PremiumInput label="मोबाईल नं." type="number" value={fields.chief_mobile} onChange={(v)=>setFields({...fields, chief_mobile:v})} />
                  <PremiumInput label="दिनांक" type="date" value={fields.chief_date} onChange={(v)=>setFields({...fields, chief_date:v})} />
              </div>
              
              {/* Signature Pad */}
              <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">हस्ताक्षर (डिजिटल साईन करें)</label>
                  <div className="relative bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] overflow-hidden h-60">
                      <SignatureCanvas 
                        ref={chiefSignRef}
                        penColor="black"
                        canvasProps={{className: "w-full h-full cursor-crosshair"}}
                      />
                      <button onClick={clearChiefSign} className="absolute bottom-4 right-4 p-3 bg-white text-rose-500 rounded-2xl shadow-lg border hover:bg-rose-50 transition-all flex items-center gap-2 text-xs font-bold">
                          <Eraser size={14}/> साफ़ करें
                      </button>
                  </div>
              </div>
          </div>
      </section>

      {/* Final Save Action */}
      <div className="fixed bottom-8 left-0 right-0 px-6 z-[200]">
          <div className="max-w-md mx-auto">
              <button onClick={handleSave} disabled={loading}
                className="w-full py-7 bg-slate-900 hover:bg-black text-white rounded-[3rem] font-black text-2xl shadow-2xl shadow-slate-400 transition-all active:scale-95 flex items-center justify-center gap-5 group"
              >
                {loading ? <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <><Save size={30} className="group-hover:scale-125 transition-transform"/> <span>पूर्ण डेटा सबमिट करें</span> <ArrowRight size={24} className="opacity-30"/></>}
              </button>
          </div>
      </div>
    </div>
  );
};

// --- Sub Component ---
const PremiumInput = ({ label, value, onChange, type="text" }) => (
  <div className="flex flex-col gap-2 group relative">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 italic">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
      className={`w-full p-5 rounded-[2rem] border-2 outline-none transition-all font-bold text-lg ${!value ? 'border-rose-100 bg-rose-50/10 focus:border-rose-400' : 'border-slate-50 focus:border-indigo-500 bg-white shadow-sm'}`}
      placeholder="यहाँ लिखें..." />
  </div>
);

export default Anubhag9;