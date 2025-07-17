import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../homecomponents/Navbar';
import axiosinstance from '../config/axios';
import { usercontext } from '../src/Userprovider';

function bufferToBase64(buffer) {
  return btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}

const LostItemDetails = () => {
  const navigate = useNavigate();
  const { attr, setAttr, setItemdetails } = useContext(usercontext);
  const [isfound, setIsfound] = useState(false);
  const [iscontact, setIscontact] = useState(false);
  const [isclaim, setIsclaim] = useState(false);
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axiosinstance.get(`/item/${id}`, {
          params: { message: attr }
        });
        const fetchedItem = response.data.item;
        setItem(fetchedItem);

        const {
          brand,
          color,
          date,
          description,
          location,
          name,
          question,
          serialnumber,
          userid
        } = fetchedItem;

        setItemdetails({
          itemid: id,
          brand,
          color,
          date,
          description,
          location,
          name,
          question,
          serialnumber,
          userid
        });
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    fetchItem();
  }, [id]);

  // Close contact box on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contactRef.current && !contactRef.current.contains(event.target)) {
        setIscontact(false);
      }
    };

    if (iscontact) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [iscontact]);

  if (!item) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="bg-[#012F49] min-h-screen w-full text-white font-['Inter',sans-serif] overflow-x-hidden">
      <Navbar />

      {/* Floating Contact Box */}
      {iscontact && (
        <div
          ref={contactRef}
          className='fixed z-50 bottom-5 right-5 flex flex-col sm:flex-row gap-4 items-center bg-[#004B6D] px-6 py-3 rounded-full shadow-lg border border-blue-300'
        >
          <button className='bg-[#299A0B] hover:bg-[#299A0B]/80 px-4 py-2 rounded-full font-medium'>
            Call: {item.phoneNumber || 'Not Available'}
          </button>
          <button
            className='bg-[#299A0B] hover:bg-[#299A0B]/80 px-4 py-2 rounded-full font-medium'
            onClick={() => navigate("/chat/1")}
          >
            Chat With User
          </button>
        </div>
      )}

      <h1 className='text-3xl sm:text-4xl text-center mt-6 font-bold'>
        {`${attr.split('i')[0]} i${attr.split('i')[1]}`}
      </h1>

      <div className="max-w-6xl mx-auto p-4 mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#013B5C] rounded-xl shadow-lg mb-8">
        {/* Image Section */}
        <div className="flex justify-center items-center">
          <img
            src={`data:${item.image.contentType};base64,${bufferToBase64(item.image.data.data)}`}
            alt={item.name}
            className="rounded-xl max-h-[400px] w-full object-contain shadow-lg"
            onError={(e) => (e.target.style.display = 'none')}
          />
        </div>

        {/* Item Details */}
        <div className="space-y-3 text-base sm:text-lg">
          <h2 className="text-2xl font-bold">{item.name}</h2>
          <p><span className="font-semibold">Brand:</span> {item.brand}</p>
          <p><span className="font-semibold">Color:</span> {item.color}</p>
          <p><span className="font-semibold">Serial No:</span> {item.serialnumber}</p>
          <p><span className="font-semibold">Question:</span> {item.question}</p>
          <p><span className="font-semibold">Description:</span> {item.description}</p>
          <p><span className="font-semibold">Location:</span> {item.location}</p>
          <p><span className="font-semibold">{`${attr.split('i')[0]} on:`}</span> {new Date(item.date).toLocaleDateString()}</p>

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded shadow-md font-semibold"
              onClick={() => {
                alert("Are you sure?");
                setIsfound(true);
              }}
            >
              {attr === "founditem" ? "Claim" : "Mark as Found"}
            </button>

            {(isfound || isclaim) && (
              <button
                className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded shadow-md font-semibold"
                onClick={() => setIscontact(true)}
              >
                Contact Finder
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostItemDetails;
