import React, { useState } from 'react';
import axiosinstance from "../config/axios.js";
const FoundItemForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    brand: '',
    serialnumber: '',
    question: '',
    description: '',
    location: '',
    image: null
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

    const handleSubmit = (e) => {
  e.preventDefault();

  const formDataToSend = new FormData();


  Object.entries(formData).forEach(([key, value]) => {
    formDataToSend.append(key, value);
  });

  axiosinstance.post('/user/foundform', formDataToSend)
    .then((res) => {
      if (res.status === 200) {
        alert("found item reported successfully");

        
        setFormData({
          name: '',
          color: '',
          brand: '',
          serialnumber: '',
          question: '',
          description: '',
          location: '',
          image: null
        });
      }else if(res.status<400){
        setFormData({
          name: '',
          color: '',
          brand: '',
          serialnumber: '',
          question: '',
          description: '',
          location: '',
          image: null
        });
        alert("sombody had missed thi item and they already posted u can access him with chat application showed in notification")
      }
      
      else {
        alert("Failed to report found item");
      }
    })
    .catch((error) => {
      console.error("Error reporting lost item:", error);
      alert("An error occurred while reporting the lost item.");
    });
};
  return (
    <div className=" scrollhandle text-black h-full overflow-y-auto bg-[#E8E1B5] flex items-center justify-center p-4 rounded-xl">
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-xl w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#E8E1B5]"
      >
        <h2 className="col-span-1 md:col-span-2 text-3xl font-bold text-center text-[#012F49]">
          Report found Item
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Item Name"
          required
          maxLength={7}
          value={formData.name}
          onChange={handleChange}
          className="p-3 bg-[#E8E1B5] border border-black rounded-lg"
        />

        <input
          type="text"
          name="color"
          placeholder="Color"
          maxLength={7}
          value={formData.color}
          onChange={handleChange}
          className="p-3 bg-[#E8E1B5] border border-black rounded-lg"
        />

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          required
          maxLength={7}
          value={formData.brand}
          onChange={handleChange}
          className="p-3 bg-[#E8E1B5] border border-black rounded-lg"
        />

        <input
          type="text"
          name="serialnumber"
          placeholder="Serial Number"
          maxLength={7}
          value={formData.serialnumber}
          onChange={handleChange}
          className="p-3 bg-[#E8E1B5] border border-black rounded-lg"
        />

        <input
          type="text"
          name="question"
          placeholder="Security Question (for verification)"
          required
          maxLength={20}
          value={formData.question}
          onChange={handleChange}
          className="p-3 bg-[#E8E1B5] border border-black rounded-lg col-span-1 md:col-span-2"
        />

        <textarea
          name="description"
          placeholder="Description (max 200 characters)"
          required
          maxLength={200}
          value={formData.description}
          onChange={handleChange}
          className="p-3 bg-[#E8E1B5] border border-black rounded-lg col-span-1 md:col-span-2 h-28 resize-none"
        />

        <input
          type="text"
          name="location"
          placeholder="Lost Location"
          required
          value={formData.location}
          onChange={handleChange}
          className="p-3 bg-[#E8E1B5] border border-black rounded-lg col-span-1 md:col-span-2"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          required
          onChange={handleChange}
          className="p-2 bg-[#E8E1B5] border border-black rounded-lg col-span-1 md:col-span-2"
        />

        <button
          type="submit"
          className="bg-[#012F49] text-white py-3 px-6 rounded-lg col-span-1 md:col-span-2 hover:bg-[#02395f] transition"
        >
          Submit found Item
        </button>
      </form>
    </div>
  );
};

export default FoundItemForm;
