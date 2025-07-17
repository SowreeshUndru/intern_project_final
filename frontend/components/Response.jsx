import React, { useState, useEffect, useContext } from 'react';
import Navbar from "../homecomponents/Navbar";
import axiosinstance from '../config/axios';
import { usercontext } from '../src/Userprovider';
import { useNavigate } from 'react-router-dom';

// Convert buffer to base64 string
function bufferToBase64(buffer) {
    return btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
}

const Response = () => {
    const { attr, setAttr } = useContext(usercontext);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState("");
    const [lostItems, setLostItems] = useState([]);
    const [foundItems, setFoundItems] = useState([]);
    const [id, setId] = useState("");

    useEffect(() => {
        axiosinstance.get('/response')
            .then((res) => {
                if (res.data.status) {
                    setUserDetails(res.data.email);
                    setLostItems(res.data.data.yourLostItems);
                    setFoundItems(res.data.data.yourFoundItems);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const renderCard = (item, type) => (
        <div
            key={item._id}
            className="bg-[#013B5C] rounded-xl shadow-lg hover:shadow-blue-600 transition duration-300 p-4 sm:p-6 flex flex-col md:flex-row gap-4 cursor-pointer"
            onClick={() => {
                setAttr(type);
                setId(item._id);
                navigate(`/project/${item._id}`);
            }}
        >
            <div className="w-full md:w-1/3 flex items-center justify-center">
                <img
                    src={`data:${item.image.contentType};base64,${bufferToBase64(item.image.data.data)}`}
                    alt={item.name}
                    className="rounded-xl max-h-[200px] object-contain shadow"
                    onError={(e) => (e.target.style.display = 'none')}
                />
            </div>
            <div className="w-full md:w-2/3 space-y-2 text-white">
                <h2 className="text-2xl font-bold">{item.name}</h2>
                <p><strong>Brand:</strong> {item.brand}</p>
                <p><strong>Color:</strong> {item.color}</p>
                <p><strong>Location:</strong> {item.location}</p>
                <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
                <div className="flex gap-3 mt-2">
                    <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-sm font-semibold">Claim</button>
                    <button className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-sm font-semibold">Contact</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="font-['Inter',sans-serif] min-h-screen w-full bg-[#012F49] text-white overflow-x-hidden">
            <Navbar />
            <div className="px-4 max-w-7xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-semibold my-8">
                    Hello, {userDetails.split('@')[0]}
                </h1>

                {/* Lost Items */}
                <section className="mt-6">
                    <h2 className="text-2xl sm:text-3xl font-semibold border-b border-gray-400 pb-2 mb-4">
                        Lost Items
                    </h2>
                    <div className="space-y-6">
                        {lostItems.length === 0 ? (
                            <p className="text-lg text-gray-300">No lost items found.</p>
                        ) : (
                            lostItems.map(item => renderCard(item, "lostitem"))
                        )}
                    </div>
                </section>

                {/* Found Items */}
                <section className="mt-12 pb-8">
                    <h2 className="text-2xl sm:text-3xl font-semibold border-b border-gray-400 pb-2 mb-4">
                        Found Items
                    </h2>
                    <div className="space-y-6">
                        {foundItems.length === 0 ? (
                            <p className="text-lg text-gray-300">No found items reported.</p>
                        ) : (
                            foundItems.map(item => renderCard(item, "founditem"))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Response;
