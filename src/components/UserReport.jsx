import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileSpreadsheet, ChevronLeft, Download, 
  CheckCircle2, Clock, MapPin, Database, Loader2 
} from 'lucide-react';
import API from '../api';
import * as XLSX from 'xlsx';

const UserReport = () => {
  const navigate = useNavigate();
  const [selectedWard, setSelectedWard] = useState("");
  const [wardData, setWardData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ऑपरेटर को असाइन किए गए वार्ड निकालें
  const assignedWardsRaw = localStorage.getItem('wards');
  const assignedWards = assignedWardsRaw ? JSON.parse(assignedWardsRaw) : [];

  // जब वार्ड बदलें, तो उसका स्टेटस लोड करें
  useEffect(() => {
    if (selectedWard) {
      fetchWardSummary();
    }
  }, [selectedWard]);

  const fetchWardSummary = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/ward-full-report/${selectedWard}`);
      setWardData(res.data);
    } catch (err) {
      console.log("Error loading summary");
    } finally {
      setLoading(false);
    }
  };

  // --- Excel Download Logic ---
  const downloadFullWardExcel = () => {
    if (!selectedWard || wardData.length === 0) return alert("डाउनलोड करने के लिए डेटा नहीं है!");

    const formattedData = wardData.map(item => ({
      'वार्ड नंबर': item.ward_no,
      'अनुभाग (Section)': `अनुभाग ${item.section_no}`,
      'स्थिति (Status)': item.status === 'complete' ? 'पूर्ण' : 'लंबित',
      'डाटा विवरण': JSON.stringify(item.data), // पूरा JSON डेटा एक कॉलम में
      'अपडेट की तारीख': new Date(item.updatedAt).toLocaleDateString('hi-IN')
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedWard);
    XLSX.writeFile(workbook, `${selectedWard}_Full_Report.xlsx`);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="bg-green-600 p-3 rounded-2xl text-white shadow-lg shadow-green-200">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">मेरी वार्ड रिपोर्ट</h2>
            <p className="text-xs font-bold text-slate-400">असाइन वार्ड्स का सारांश एवं डाउनलोड</p>
          </div>
        </div>
      </div>

      {/* Ward Selection Card */}
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border-2 border-green-50 mb-10">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">रिपोर्ट देखने के लिए वार्ड चुनें</label>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <select 
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-green-500 font-bold text-slate-700"
          >
            <option value="">--- वार्ड का चयन करें ---</option>
            {assignedWards.map(w => <option key={w} value={w}>{w}</option>)}
          </select>

          <button 
            onClick={downloadFullWardExcel}
            disabled={!selectedWard || loading}
            className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-2xl font-black shadow-lg shadow-green-100 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            <Download size={20}/> एक्सेल (Excel) डाउनलोड करें
          </button>
        </div>
      </div>

      {/* Ward Summary Table */}
      {selectedWard && (
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
                <MapPin size={18} className="text-green-400"/>
                <span className="text-sm font-black uppercase tracking-widest">{selectedWard} - प्रोग्रेस शीट</span>
            </div>
            {loading && <Loader2 className="animate-spin text-green-400" size={18}/>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <th className="p-6">अनुभाग (Section)</th>
                  <th className="p-6 text-center">स्थिति (Status)</th>
                  <th className="p-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[1,2,3,4,5,6,7,8,9].map((num) => {
                  const sectionInfo = wardData.find(d => d.section_no === num);
                  const isComplete = sectionInfo?.status === 'complete';
                  
                  return (
                    <tr key={num} className="group hover:bg-green-50/30 transition-all">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-black">
                            0{num}
                          </span>
                          <span className="text-sm font-bold text-slate-700 uppercase">अनुभाग {num}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        {sectionInfo ? (
                          isComplete ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-[9px] font-black uppercase border border-green-200">
                              <CheckCircle2 size={12}/> पूर्ण
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[9px] font-black uppercase border border-amber-200">
                              <Clock size={12}/> लंबित
                            </span>
                          )
                        ) : (
                          <span className="text-slate-300 text-[10px] font-bold">शुरू नहीं हुआ</span>
                        )}
                      </td>
                      <td className="p-6 text-right">
                         <button 
                          onClick={() => navigate(`/anubhag${num}`)}
                          className="text-[10px] font-black text-blue-600 uppercase hover:underline"
                         >
                           विवरण / एडिट
                         </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReport;