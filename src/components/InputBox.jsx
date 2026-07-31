import React from 'react';

const InputBox = ({ label, value, onChange, type = "text", required = true }) => {
  return (
    <div className="relative group mb-6">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className={`peer w-full px-4 py-4 pt-6 bg-white border-2 rounded-2xl outline-none transition-all 
          ${required && !value 
            ? 'border-red-100 focus:border-red-500 bg-red-50/10' 
            : 'border-slate-100 focus:border-blue-500'}`}
      />
      <label className={`absolute left-4 top-1 text-xs font-black uppercase tracking-widest transition-all
        peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium
        peer-focus:top-1 peer-focus:text-xs peer-focus:font-black
        ${required && !value ? 'text-red-400' : 'text-slate-400 peer-focus:text-blue-600'}`}>
        {label}
      </label>
    </div>
  );
};

export default InputBox;