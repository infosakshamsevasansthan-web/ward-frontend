import React from 'react';
import { ChevronDown, MapPin, AlertCircle } from 'lucide-react';

const SelectBox = ({ label, value, onChange, options, required = true }) => {
  const isError = required && !value;

  return (
    <div className="flex flex-col gap-2 mb-6 w-full">
      
      {/* 1. ऊपर का मुख्य लेबल */}
      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
        वार्ड का चयन (Select Ward)
      </label>

      {/* 2. सेलेक्ट बॉक्स कंटेनर */}
      <div className="relative group">
        {/* Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
          <MapPin size={18} />
        </div>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-4 pl-12 bg-white border-2 rounded-2xl outline-none appearance-none transition-all cursor-pointer font-bold text-slate-700 text-lg
            ${isError 
              ? 'border-red-400 bg-red-50/10 focus:border-red-500' 
              : 'border-slate-100 focus:border-blue-500 shadow-sm'}`}
        >
          <option value="" className="text-slate-400 font-normal">--- यहाँ क्लिक करके वार्ड चुनें ---</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt} className="text-slate-800 font-bold">
              {opt}
            </option>
          ))}
        </select>

        {/* Custom Arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-500">
          <ChevronDown size={20} />
        </div>
      </div>

      {/* 3. नीचे का मैंडेटरी मैसेज (सिर्फ तब दिखेगा जब वार्ड नहीं चुना होगा) */}
      {isError && (
        <div className="flex items-center gap-1 ml-2 mt-1 text-red-500 animate-pulse">
          <AlertCircle size={12} />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            सर्वे शुरू करने के लिए वार्ड का चयन करना अनिवार्य है
          </span>
        </div>
      )}
    </div>
  );
};

export default SelectBox;