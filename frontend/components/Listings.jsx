import React, { useState, useEffect, useContext } from 'react';
import axiosinstance from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { usercontext } from '../src/Userprovider';

const placeholderImage =
  'data:image/svg+xml;base64,' +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" style="background:#ccc">
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-size="24">
        No Image
      </text>
    </svg>`
  );

function bufferToBase64(buffer) {
  return btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}

const Listings = () => {
  const { attr, setAttr } = useContext(usercontext);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState('');
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('');

  useEffect(() => {
    axiosinstance.get('/item/allitems')
      .then((res) => {
        if (res.data.status) {
          setLostItems(res.data.data?.lostItems || []);
          setFoundItems(res.data.data?.foundItems || []);
        }
      })
      .catch((err) => console.error('Error fetching items:', err))
      .finally(() => setLoading(false));
  }, []);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-[#012F49] text-white">
  //       <div className="flex flex-col items-center space-y-4">
  //         <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
  //         <h2 className="text-xl sm:text-2xl">Loading...</h2>
  //       </div>
  //     </div>
  //   );
  // }

  const renderCard = (item) => {
    const fieldsToShow = ['brand', 'color', 'date'];

    return (
      <div
        key={item._id}
        className="bg-[#013b5c] p-3 rounded-xl shadow-lg w-full sm:w-[170px] md:w-[200px] lg:w-[220px] text-white flex flex-col items-center text-center hover:scale-105 hover:shadow-blue-600 transition-transform duration-200"
        onClick={() => navigate(`/project/${item._id}`)}
      >
        <img
          src={`data:${item.image.contentType};base64,${bufferToBase64(item.image.data.data)}`}
          alt={item.name}
          className="rounded w-full h-[140px] object-cover mb-2"
          onError={(e) => { e.target.src = placeholderImage; }}
        />
        <h2 className="text-base font-bold truncate mb-1">{item.name}</h2>
        {Object.entries(item).map(([key, value]) => {
          if (fieldsToShow.includes(key)) {
            return (
              <p className="text-sm" key={key}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{' '}
                {key === 'date' ? new Date(value).toLocaleDateString() : value}
              </p>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#012F49] text-white px-3 pb-8">
      <h1 className="text-3xl sm:text-4xl mt-6 mb-4 ml-2">
        Hello {userDetails ? userDetails.split('@')[0] : 'User'}
      </h1>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 flex-wrap mb-6">
        <button
          className={`px-4 py-2 rounded font-semibold transition-all ${
            viewType === 'lost' ? 'bg-orange-500 text-white' : 'bg-gray-300 text-black'
          }`}
          onClick={() => {
            setViewType('lost');
            setAttr('lostitem');
          }}
        >
          View Lost Items
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold transition-all ${
            viewType === 'found' ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-black'
          }`}
          onClick={() => {
            setViewType('found');
            setAttr('founditem');
          }}
        >
          View Found Items
        </button>
      </div>

      {/* Items Grid */}
      {(viewType === 'lost' || viewType === 'found') && (
        <div>
          <h2 className="text-2xl text-center mb-4">
            {viewType === 'lost' ? 'Lost Items' : 'Found Items'}
          </h2>
          {((viewType === 'lost' && lostItems.length === 0) || (viewType === 'found' && foundItems.length === 0)) ? (
            <p className="text-center text-xl">No {viewType} items found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-center">
              {(viewType === 'lost' ? lostItems : foundItems).map(renderCard)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Listings;
