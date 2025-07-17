import React, { useEffect, useRef, useContext, useState } from 'react';
import gsap from 'gsap';
import { usercontext } from '../src/Userprovider';
import { useNavigate } from 'react-router-dom';
import axiosinstance from "../config/axios.js";

function bufferToBase64(buffer) {
  return btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}

const Scrollbar = () => {
  const navigate = useNavigate();
  const {
    item2,
    setItem2,
    email,
    img,
    setImg
  } = useContext(usercontext);

  const sidebarRef = useRef(null);
  const [profile, setProfile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (item2 && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setItem2(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [item2]);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleSubmit = () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('image', selectedFile);
    axiosinstance.post('/user/upload-profile', formData)
      .then(() => {
        alert('Profile uploaded successfully!');
        setProfile(false);
      })
      .catch(err => {
        console.error('Upload failed:', err);
        alert('Failed to upload profile picture');
      });
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full z-[1000] font-sans transition-all duration-300 ${item2 ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
      {/* Overlay */}
      <div className={`absolute top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${item2 ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`absolute top-0 right-0 h-full w-[80vw] sm:w-[30vw] bg-[#77C2BC]/70 text-white shadow-xl rounded-l-xl p-4 transform transition-transform duration-500 ${item2 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      >
        {/* Close Button */}
        <button
          onClick={() => setItem2(false)}
          className="absolute top-4 right-4 text-3xl font-bold text-white hover:text-red-400"
        >
          &times;
        </button>

        {/* Sidebar Content */}
        <div className='bar flex flex-col justify-start items-center mt-14 space-y-14 text-[18px] font-medium'>
          {/* User Info */}
          <div className='flex items-center gap-4'>
            <div className='rounded-full bg-white h-20 w-20 overflow-hidden'>
              {img?.data && (
                <img
                  src={`data:${img.contentType};base64,${bufferToBase64(img.data.data)}`}
                  className='object-cover h-full w-full rounded-full'
                  alt="profile"
                />
              )}
            </div>
            <h1 className='text-2xl'>{email?.split('@')[0]}</h1>
          </div>

          {/* Actions */}
          <div className='flex flex-col items-center gap-5 space-y-7'>
            <h1 className="text-xl cursor-pointer hover:underline" onClick={() => setProfile(!profile)}>
              Upload Profile Pic
            </h1>
            <h1 className='text-xl'>myCommunity</h1>
            <h1 className='text-xl cursor-pointer hover:underline' onClick={() => navigate("/chat/2")}>
              Live Chat
            </h1>
            <h1 className='text-xl cursor-pointer hover:underline' onClick={() => navigate("/listings")}>
              Listings
            </h1>
            <h1 className='text-xl'>Rate Us</h1>
          </div>
        </div>

        {/* Upload Profile Modal */}
        {profile && (
          <div className='fixed top-0 left-0 w-full h-full bg-[#012F49]/30 backdrop-blur-md z-[999] flex flex-col items-center justify-center p-4'>
            <div
              className='absolute top-4 right-5 h-6 w-6 cursor-pointer z-[1001]'
              onClick={() => setProfile(false)}
            >
              <img
                src="https://img.icons8.com/?size=100&id=feuKSvqNnsys&format=png&color=000000"
                alt="Close"
                className='w-full h-full'
              />
            </div>

            <label htmlFor="profilePic" className='p-2 text-white text-lg mb-2'>Upload Profile:</label>

            <input
              type="file"
              id="profilePic"
              name="image"
              accept="image/*"
              className='bg-white/30 rounded-md px-3 py-1 mb-3 text-white'
              onChange={handleFileChange}
            />

            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover mb-3"
              />
            )}

            <button
              onClick={handleSubmit}
              className='bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded'
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scrollbar;
