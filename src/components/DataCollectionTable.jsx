import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, PencilLine, CheckCircle2, Clock, Search, Database, ChevronRight 
} from 'lucide-react';
import SelectBox from './SelectBox';
import axios from 'axios';

const DataCollection = () => {
  const navigate = useNavigate();
  const [selectedWard, setSelectedWard] = useState(localStorage.getItem('currentWard') || "");
  const [loading, setLoading] = useState(false);
  
  // 9 अनुभागों का स्टेटस (Backend से आएगा)
  const [sectionStatus, setSectionStatus] = useState({
    1: 'pending', 2: 'pending', 3: 'pending', 4: 'pending', 
    5: 'pending', 6: 'pending', 7: 'pending', 8: 'pending', 9: 'pending'
  });

  const wardOptions = Array.from({ length: 49 }, (_, i) => `वार्ड ${String(i + 1).padStart(2, '0')}`);

  const anubhags = [
    { id: 1, name: "अनुभाग-1: स्थिति एवं विकास का इतिहास" },
    { id: 2, name: "अनुभाग-2: नगर का स्थान विवरण एवं जलवायु" },
    { id: 3, name: "अनुभाग-3: नागरिक एवं अन्य सुविधाएं" },
    { id: 4, name: "अनुभाग-4: शैक्षणिक सुविधाएं" },
    { id: 5, name: "अनुभाग-5: सामाजिक, मनोरंजन एवं सांस्कृतिक सुविधाएं" },
    { id: 6, name: "अनुभाग-6: उद्योग एवं बैंकिंग सुविधाएं" },
    { id: 7, name: "अनुभाग-7: चिकित्सा सुविधाएं" },
    { id: 8, name: "अनुभाग-8: झुग्गी बस्तियों में सुविधाएं" },
    { id: 9, name: "अनुभाग-9: टिप्पणियां एवं अवलोकन" },
  ];

  // वार्ड बदलते ही बैकएंड से स्टेटस लोड करना
  useEffect(() => {
    const fetchStatus = async () => {
      if (!selectedWard) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/get-ward-status/${selectedWard}`);
        if (res.data) setSectionStatus(res.data);
      } catch (err) {
        console.log("Error fetching status");
      }
    };
    fetchStatus();
  }, [selectedWard]);

  const handleWardChange = (val) => {
    setSelectedWard(val);
    localStorage.setItem('currentWard', val);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Ward Selection Header */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border-2 border-blue-50">
        <SelectBox 
          label="डेटा भरने के लिए वार्ड चुनें"
          value={selectedWard}
          options={wardOptions}
          onChange={handleWardChange}
        />
      </div>

      {/* Table Section */}
      <div className={`bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 transition-all ${!selectedWard ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
                <Database className="text-blue-400" />
                <h2 className="text-lg font-black uppercase tracking-widest">अनुभाग प्रविष्टि सूची</h2>
            </div>
            <span className="text-[10px] font-bold bg-white/10 px-4 py-2 rounded-full uppercase">Total: 09 Sections</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-widest">
                <th className="p-5 border-b">Sl no</th>
                <th className="p-5 border-b">Anubhag (विवरण)</th>
                <th className="p-5 border-b text-center">Completed</th>
                <th className="p-5 border-b text-center">Pending</th>
                <th className="p-5 border-b text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {anubhags.map((item, index) => {
                const isComplete = sectionStatus[item.id] === 'complete';
                return (
                  <tr key={item.id} className="group hover:bg-blue-50/50 transition-all">
                    <td className="p-5 font-black text-slate-300 group-hover:text-blue-600 italic">{String(index + 1).padStart(2, '0')}</td>
                    <td className="p-5">
                      <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    </td>
                    <td className="p-5 text-center">
                      {isComplete && <CheckCircle2 className="mx-auto text-green-500" size={20} />}
                    </td>
                    <td className="p-5 text-center">
                      {!isComplete && <Clock className="mx-auto text-rose-400 animate-pulse" size={20} />}
                    </td>
                    <td className="p-5">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => navigate(`/anubhag${item.id}`)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                          <PencilLine size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataCollection;