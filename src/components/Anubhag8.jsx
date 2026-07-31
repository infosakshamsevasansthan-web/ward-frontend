import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Save, AlertCircle, CheckCircle2, 
  Trash2, Plus, Info, ArrowRight, Home, 
  Droplets, Zap, Construction, Search, MapPin
} from 'lucide-react';
import axios from 'axios';

const Anubhag8 = () => {
  const navigate = useNavigate();
  const ward = localStorage.getItem('currentWard');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // --- फोटो के अनुसार पूरा 8.1 से 8.13.3 का ढांचा ---
  const slumTemplate = {
    a8_1_city_class: "",    // 8.1 नगर का नाम एवं वर्ग
    a8_2_slum_name: "",     // 8.2 स्लम का नाम
    a8_3_is_notified: "",   // 8.3 क्या अधिसूचित है (1/2)
    a8_4_households: "",    // 8.4 परिवारों की संख्या
    a8_5_population: "",    // 8.5 जनसंख्या
    a8_6_paved_roads: "",   // 8.6 पक्की सड़कें
    a8_7_drainage: "",      // 8.7 जल निकासी व्यवस्था (1/2/3/4)
    a8_8_1_toilet_pit: "",  // 8.8.1 गड्डा प्रणाली
    a8_8_2_toilet_flush: "",// 8.8.2 फ्लश / पोर फ्लश
    a8_8_3_toilet_service: "", // 8.8.3 सर्विस
    a8_8_4_toilet_others: "",  // 8.8.4 अन्य
    a8_9_comm_toilet_bath: "", // 8.9 सामुदायिक शौचालय (स्नान सहित)
    a8_10_comm_toilet_nobath: "", // 8.10 सामुदायिक शौचालय (स्नान रहित)
    a8_11_water_points: "",    // 8.11 सुरक्षित पेयजल नल बिंदु
    a8_12_comm_taps: "",       // 8.12 सामुदायिक नलों की संख्या
    a8_13_1_elec_domestic: "", // 8.13.1 घरेलू विद्युत
    a8_13_2_elec_street: "",   // 8.13.2 स्ट्रीट लाइटिंग
    a8_13_3_elec_others: ""    // 8.13.3 अन्य विद्युत
  };

  const [slums, setSlums] = useState([ { ...slumTemplate } ]);
  const [infoSource, setSource] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/get-ward-data/${ward}/8`);
        if (res.data && res.data.data) {
          setSlums(res.data.data.slums || [ { ...slumTemplate } ]);
          setSource(res.data.data.infoSource || "");
          setSaveStatus(res.data.status);
        }
      } catch (err) { console.log("New Entry"); }
    };
    if (ward) fetchData();
  }, [ward]);

  const handleSlumChange = (index, field, value) => {
    const newSlums = [...slums];
    newSlums[index][field] = value;
    setSlums(newSlums);
  };

  const addNewSlum = () => setSlums([...slums, { ...slumTemplate }]);
  
  const removeSlum = (index) => {
    if (slums.length > 1 && window.confirm("हटाएं?")) {
      setSlums(slums.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!ward) return alert("वार्ड चुनें!");
    setLoading(true);
    
    // Check if basic info in all slums is filled
    const isComplete = slums.every(s => s.a8_2_slum_name && s.a8_3_is_notified) && infoSource !== "";
    const currentStatus = isComplete ? 'complete' : 'pending';

    try {
      await axios.post('http://localhost:5000/api/save-ward-data', {
        ward_no: ward, section_no: 8, data: { slums, infoSource }, status: currentStatus
      });
      setSaveStatus(currentStatus);
      alert(isComplete ? "पूर्ण सुरक्षित!" : "डेटा सुरक्षित (लंबित)");
      navigate('/data-collection');
    } catch (err) { alert("Error!"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto pb-40 pt-6 px-4 font-sans bg-slate-50/50">
      
      {/* Sticky Header */}
      <nav className="flex items-center justify-between mb-8 sticky top-4 z-[100] bg-white/80 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-xl border border-white">
        <button onClick={() => navigate('/data-collection')} className="group flex items-center gap-3 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all">
          <ChevronLeft size={20}/> <span className="font-black text-slate-700 text-sm">वापस</span>
        </button>
        <div className="text-center">
            <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Anubhag 08</h2>
            <p className="text-lg font-black text-slate-900 tracking-tight">{ward}</p>
        </div>
        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-inner
          ${saveStatus === 'complete' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600 animate-pulse'}`}>
          {saveStatus || 'Slum Data'}
        </div>
      </nav>

      {/* Banner */}
      <header className="relative mb-12 p-10 bg-indigo-600 rounded-[3.5rem] overflow-hidden shadow-2xl text-white">
          <div className="absolute top-0 right-0 w-80 h-84 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex items-center gap-8">
              <div className="p-7 bg-white/20 rounded-[2.5rem] backdrop-blur-md shadow-inner"><Home size={50}/></div>
              <div>
                  <h1 className="text-3xl font-black tracking-tight mb-2 uppercase italic leading-none">झुग्गी बस्तियों में सुविधाएं</h1>
                  <p className="text-indigo-100 font-medium max-w-md text-sm italic">8.1 से 8.13.3 तक का विस्तृत विवरण (प्रत्येक स्लम के लिए)</p>
              </div>
          </div>
      </header>

      {/* Slum Cards */}
      <div className="space-y-16">
        {slums.map((slum, index) => (
          <SlumCard 
            key={index} index={index} data={slum}
            onChange={(field, val) => handleSlumChange(index, field, val)}
            onRemove={() => removeSlum(index)}
          />
        ))}
      </div>

      {/* Add Button */}
      <button onClick={addNewSlum} className="mt-12 w-full py-8 border-4 border-dashed border-indigo-200 rounded-[3.5rem] flex flex-col items-center justify-center gap-3 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all group">
          <div className="p-4 bg-indigo-100 rounded-full group-hover:scale-110 transition-transform"><Plus size={32}/></div>
          <span className="font-black uppercase tracking-widest text-sm">वार्ड में एक और स्लम जोड़ें</span>
      </button>

      {/* Info Source */}
      <section className="mt-16 bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl"><Search size={24}/></div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">उपर्युक्त जानकारी का स्रोत</h3>
          </div>
          <input type="text" value={infoSource} onChange={(e) => setSource(e.target.value)} placeholder="स्रोत का नाम लिखें..."
            className={`w-full p-6 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-700 ${!infoSource ? 'border-rose-100 focus:border-rose-500' : 'border-slate-50 focus:border-indigo-500 bg-white'}`}/>
      </section>

      {/* Save Action */}
      <div className="fixed bottom-8 left-0 right-0 px-6 z-[200]">
          <div className="max-w-md mx-auto">
              <button onClick={handleSave} disabled={loading} className="w-full py-6 bg-slate-900 hover:bg-black text-white rounded-[2.5rem] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 group">
                {loading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <><Save size={24}/> <span>पूरा डाटा सुरक्षित करें</span> <ArrowRight size={20}/></>}
              </button>
          </div>
      </div>
    </div>
  );
};

// --- Professional Slum Card ---
const SlumCard = ({ index, data, onChange, onRemove }) => {
  return (
    <div className="relative bg-white rounded-[4rem] border-2 border-white shadow-xl shadow-slate-200/50 overflow-hidden">
      
      {/* Card Header */}
      <div className="p-8 flex items-center justify-between bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-200">{index + 1}</div>
            <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">स्लम प्रपत्र {index + 1}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Census Section 08 Details</p>
            </div>
        </div>
        <button onClick={onRemove} className="p-3 text-rose-300 hover:text-rose-600 transition-all"><Trash2 size={24}/></button>
      </div>

      <div className="p-10 space-y-12">
        {/* 8.1 - 8.5: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PremiumInput label="8.1 नगर का नाम एवं वर्ग" value={data.a8_1_city_class} onChange={(v)=>onChange('a8_1_city_class', v)} />
            <PremiumInput label="8.2 स्लम का नाम" value={data.a8_2_slum_name} onChange={(v)=>onChange('a8_2_slum_name', v)} />
            <PremiumSelect label="8.3 क्या अधिसूचित है?" value={data.a8_3_is_notified} onChange={(v)=>onChange('a8_3_is_notified', v)}
                options={[{l: "हाँ (1)", v: "1"}, {l: "नहीं (2)", v: "2"}]} />
            <PremiumInput label="8.4 परिवारों की संख्या" type="number" value={data.a8_4_households} onChange={(v)=>onChange('a8_4_households', v)} />
            <PremiumInput label="8.5 स्लम की जनसंख्या" type="number" value={data.a8_5_population} onChange={(v)=>onChange('a8_5_population', v)} />
            <PremiumInput label="8.6 पक्की सड़कें (कि.मी.)" value={data.a8_6_paved_roads} onChange={(v)=>onChange('a8_6_paved_roads', v)} />
        </div>

        {/* 8.7: Drainage */}
        <div className="p-8 bg-slate-50/50 rounded-[3rem] border border-slate-100">
            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6 ml-2 italic">8.7 जल निकासी व्यवस्था</h4>
            <PremiumSelect label="निकासी का प्रकार चुनें" value={data.a8_7_drainage} onChange={(v)=>onChange('a8_7_drainage', v)}
                options={[{l: "1-खुली नाली", v: "1"}, {l: "2-बंद नाली", v: "2"}, {l: "3-दोनों", v: "3"}, {l: "4-नहीं", v: "4"}]} />
        </div>

        {/* 8.8: Private Toilets */}
        <div className="space-y-6">
            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-4 italic">8.8 शौचालय (निजी) की संख्या</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <PremiumInput label="8.8.1 गड्डा प्रणाली" value={data.a8_8_1_toilet_pit} onChange={(v)=>onChange('a8_8_1_toilet_pit', v)} />
                <PremiumInput label="8.8.2 फ्लश / पोर" value={data.a8_8_2_toilet_flush} onChange={(v)=>onChange('a8_8_2_toilet_flush', v)} />
                <PremiumInput label="8.8.3 सर्विस" value={data.a8_8_3_toilet_service} onChange={(v)=>onChange('a8_8_3_toilet_service', v)} />
                <PremiumInput label="8.8.4 अन्य" value={data.a8_8_4_toilet_others} onChange={(v)=>onChange('a8_8_4_toilet_others', v)} />
            </div>
        </div>

        {/* 8.9 - 8.10: Community Toilets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PremiumInput label="8.9 सामुदायिक (स्नान सहित)" value={data.a8_9_comm_toilet_bath} onChange={(v)=>onChange('a8_9_comm_toilet_bath', v)} />
            <PremiumInput label="8.10 सामुदायिक (स्नान रहित)" value={data.a8_10_comm_toilet_nobath} onChange={(v)=>onChange('a8_10_comm_toilet_nobath', v)} />
        </div>

        {/* 8.11 - 8.12: Water */}
        <div className="p-8 bg-blue-50/30 rounded-[3rem] border border-blue-50">
            <h4 className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6 italic"><Droplets size={14}/> 8.11 & 8.12 पेयजल आपूर्ति</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PremiumInput label="8.11 नल बिंदु/हाइड्रेंट संख्या" value={data.a8_11_water_points} onChange={(v)=>onChange('a8_11_water_points', v)} />
                <PremiumInput label="8.12 सामुदायिक नल संख्या" value={data.a8_12_comm_taps} onChange={(v)=>onChange('a8_12_comm_taps', v)} />
            </div>
        </div>

        {/* 8.13: Electricity */}
        <div className="space-y-6">
            <h4 className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4 italic"><Zap size={14}/> 8.13 विद्युत कनेक्शन</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PremiumInput label="8.13.1 घरेलू" value={data.a8_13_1_elec_domestic} onChange={(v)=>onChange('a8_13_1_elec_domestic', v)} />
                <PremiumInput label="8.13.2 स्ट्रीट लाइटिंग" value={data.a8_13_2_elec_street} onChange={(v)=>onChange('a8_13_2_elec_street', v)} />
                <PremiumInput label="8.13.3 अन्य" value={data.a8_13_3_elec_others} onChange={(v)=>onChange('a8_13_3_elec_others', v)} />
            </div>
        </div>
      </div>
    </div>
  );
};

// --- UI Sub-Components ---
const PremiumInput = ({ label, value, onChange, type="text" }) => (
  <div className="flex flex-col gap-2 group relative">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
      className={`w-full p-5 rounded-[1.8rem] border-2 outline-none transition-all font-bold text-lg ${!value ? 'border-rose-100 bg-rose-50/10 focus:border-rose-400' : 'border-slate-100 bg-white focus:border-indigo-500 shadow-sm'}`}
      placeholder="यहाँ भरें..." />
  </div>
);

const PremiumSelect = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-2 group relative">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className={`w-full p-5 rounded-[1.8rem] border-2 bg-white outline-none font-black text-lg appearance-none ${!value ? 'border-rose-100' : 'border-slate-100 focus:border-indigo-500'}`}>
      <option value="">- चुनें -</option>
      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
    <div className="absolute right-5 top-11 pointer-events-none text-slate-400"><ChevronLeft className="-rotate-90" size={18}/></div>
  </div>
);

export default Anubhag8;