import React, { createContext, useState, useEffect } from 'react';

const usercontext = createContext();

const safeParse = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const Userprovider = ({ children }) => {
  const [enable, setEnable] = useState(() => safeParse('enable', false));
  const [item, setItem] = useState(() => localStorage.getItem('item') || "");
  const [item2, setItem2] = useState(() => safeParse('item2', false));
  const [email, setEmail] = useState(() => localStorage.getItem('email') || "");
  const [attr, setAttr] = useState(() => localStorage.getItem('attr') || "");
  const [myid, setMyid] = useState(() => localStorage.getItem('myid') || "");

  const [img, setImg] = useState(() => safeParse('img', { data: "", contentType: "" }));

  const [array, setArray] = useState(() => safeParse('array', []));

  const [itemdetails, setItemdetails] = useState(() =>
    safeParse('itemdetails', {
      itemid: "",
      brand: "",
      color: "",
      date: "",
      description: "",
      location: "",
      name: "",
      question: "",
      serialnumber: "",
      userid: ""
    })
  );

  useEffect(() => {
    localStorage.setItem('enable', JSON.stringify(enable));
  }, [enable]);

  useEffect(() => {
    if (item !== undefined) localStorage.setItem('item', item);
  }, [item]);

  useEffect(() => {
    localStorage.setItem('item2', JSON.stringify(item2));
  }, [item2]);

  useEffect(() => {
    if (email !== undefined) localStorage.setItem('email', email);
  }, [email]);

  useEffect(() => {
    if (attr !== undefined) localStorage.setItem('attr', attr);
  }, [attr]);

  useEffect(() => {
    if (myid !== undefined) localStorage.setItem('myid', myid);
  }, [myid]);

  useEffect(() => {
    localStorage.setItem('img', JSON.stringify(img));
  }, [img]);

  useEffect(() => {
    localStorage.setItem('itemdetails', JSON.stringify(itemdetails));
  }, [itemdetails]);

  useEffect(() => {
    localStorage.setItem('array', JSON.stringify(array));
  }, [array]);

  return (
    <usercontext.Provider
      value={{
        enable, setEnable,
        item, setItem,
        item2, setItem2,
        email, setEmail,
        attr, setAttr,
        itemdetails, setItemdetails,
        myid, setMyid,
        array, setArray,
        img, setImg
      }}
    >
      {children}
    </usercontext.Provider>
  );
};

export default Userprovider;
export { usercontext };
