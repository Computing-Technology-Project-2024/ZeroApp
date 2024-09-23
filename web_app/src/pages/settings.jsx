import React, { useState } from 'react';

const Settings = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [gender, setGender] = useState('Male');
  const [photo, setPhoto] = useState(null);

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
          <div>
            <label className="block text-gray-600 mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Position</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your position"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition-all duration-300"
          >
            Add Now
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Settings;
