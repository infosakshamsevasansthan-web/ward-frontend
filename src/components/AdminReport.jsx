import React, { useState } from 'react';
import { FileDown, Eye, X, CheckCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

const AdminReport = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [selectedData, setSelectedData] = useState(null); // Modal के लिए
  const [isModalOpen, setIsModalOpen] = useState(false);

  const wards = Array.from({ length: 49 }, (_, i) => ({
    id: i + 1,
    ward_no: `वार्ड ${String(i + 1).padStart(2, '0')}`,
    status: 'pending', // बाद में API से आएगा
    updated_at: '2024-05-20',
    data: { field1: "नमूना डेटा 1", field2: "नमूना डेटा 2", field3: "नमूना डेटा 3" } // डमी डेटा
  }));

  const sections = Array.from({ length: 9 }, (_, i) => `अनुभाग ${i + 1}`);

  // Excel डाउनलोड करने का फंक्शन
  const downloadExcel = () => {
    const dataToExport = wards.map(w => ({
      'वार्ड नंबर': w.ward_no,
      'अनुभाग': `अनुभाग ${activeTab}`,
      'स्थिति': w.status === 'complete' ? 'पूर्ण' : 'लंबित',
      'अपडेट तारीख': w.updated_at,
      'विवरण': JSON.stringify(w.data)
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Section_${activeTab}`);
    XLSX.writeFile(workbook, `Ward_Report_Section_${activeTab}.xlsx`);
  };

  // विवरण देखने वाला फंक्शन
  const handleViewDetails = (ward) => {
    setSelectedData(ward);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-screen relative">
      
      {/* Header */}
      <div className="p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">वार्ड-वाइज विस्तृत रिपोर्ट</h2>
          <p className="text-gray-500 text-sm">सभी 49 वार्डों का डेटा प्रबंधित करें</p>
        </div>
        <button 
          onClick={downloadExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 text-sm font-bold"
        >
          <FileDown className="w-5 h-5" />
          एक्सेल (Excel) डाउनलोड करें
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex overflow-x-auto bg-gray-50 border-b no-scrollbar sticky top-0 z-10">
        {sections.map((sec, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i + 1)}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
              activeTab === i + 1 
              ? 'border-blue-600 text-blue-600 bg-white' 
              : 'border-transparent text-gray-400 hover:text-blue-400'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Ward Table */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
              <th className="p-4 border-b">वार्ड नंबर</th>
              <th className="p-4 border-b">डेटा स्थिति</th>
              <th className="p-4 border-b">अंतिम अपडेट</th>
              <th className="p-4 border-b text-center">एक्शन</th>
            </tr>
          </thead>
          <tbody>
            {wards.map((ward, idx) => (
              <tr key={idx} className="border-b hover:bg-blue-50/30 transition-colors">
                <td className="p-4 font-bold text-gray-700">{ward.ward_no}</td>
                <td className="p-4">
                  {ward.status === 'complete' ? (
                    <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-[10px] font-bold w-fit">
                      <CheckCircle className="w-3 h-3" /> पूर्ण (Complete)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-[10px] font-bold w-fit">
                      <AlertCircle className="w-3 h-3" /> लंबित (Pending)
                    </span>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-500 font-medium">{ward.updated_at}</td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handleViewDetails(ward)}
                    className="flex items-center gap-1 mx-auto text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-4 py-1.5 rounded-lg border border-blue-100"
                  >
                    <Eye className="w-4 h-4" /> विवरण देखें
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- View Details Modal (पॉप-अप) --- */}
      {isModalOpen && selectedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{selectedData.ward_no} - विवरण</h3>
                <p className="text-blue-100 text-sm">अनुभाग {activeTab} की जानकारी</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/30">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(selectedData.data).map(([key, value]) => (
                  <div key={key} className="border-b pb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{key}</p>
                    <p className="text-lg text-gray-700 font-medium">{value || '---'}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500 uppercase">वर्तमान स्थिति:</span>
                <span className={`px-4 py-1 rounded-full text-xs font-bold ${selectedData.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedData.status === 'complete' ? 'पूर्ण' : 'लंबित'}
                </span>
              </div>
            </div>

            <div className="p-6 bg-gray-100 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-800 text-white px-8 py-2 rounded-xl font-bold hover:bg-gray-900 transition-all"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReport;