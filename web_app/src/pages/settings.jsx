import React, { useState } from 'react';
import InputField from '../components/settingsInput/inputField';

const Settings = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [gender, setGender] = useState('Male');
  const [photo, setPhoto] = useState(null);

  const [supplierRate, setSupplierRate] = useState('');
  const [usageRate, setUsageRate] = useState('');

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    setPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    // Logic to handle form submission
    alert('Form submitted');
  };

  return (
    <div className="container mx-auto">
        <h3 className="text-2xl font-bold mb-4 text-left">Settings</h3>
        <div className="flex items-center justify-center bg-gray-100 mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-screen">

        {/* Profile Photo Upload */}
        <div className="flex flex-col items-center mb-8">
          <label className="relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              onChange={handlePhotoUpload}
            />
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center">
              {photo ? (
                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-12 h-12 bg-gray-200 text-gray-500 flex items-center justify-center rounded-full">
                  <i className="fas fa-camera"></i>
                </div>
              )}
            </div>
          </label>
          <span className="text-green-500 mt-2 cursor-pointer">Upload Photo</span>
        </div>

         {/* Form Inputs */}
         <div className="grid grid-cols-2 gap-4">
            <InputField
              label="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
            <InputField
              label="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
            <InputField
              label="Your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <InputField
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              onClick={handleSubmit}
              className="w-full bg-custom-green text-white p-2 rounded-lg font-semibold text-lg hover:bg-green-600 transition-all duration-300"
            >
              Add Now
            </button>
          </div>
        </div>
      </div>

      {/* Section to Customize User Preferences */}
      <h3 className="text-2xl font-bold mb-4 text-left mt-8">Consumption Preferences</h3>
      <div className="flex items-center justify-center bg-gray-100 mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-screen">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Supplier Rate"
              type="text"
              value={supplierRate}
              onChange={(e) => setSupplierRate(e.target.value)}
              placeholder="kWh"
            />
            <InputField
              label="Usage Rate"
              type="text"
              value={usageRate}
              onChange={(e) => setUsageRate(e.target.value)}
              placeholder="kWh"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              onClick={handleSubmit}
              className="w-full bg-custom-green text-white p-2 rounded-lg font-semibold text-lg hover:bg-green-600 transition-all duration-300"
            >
              Submit Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
   