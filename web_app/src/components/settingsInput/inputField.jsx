import React from 'react';

const InputField = ({ label, type, value, onChange, placeholder, options }) => {
  return (
    <div>
      <label className="block text-gray-600 mb-1">{label}</label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default InputField;
