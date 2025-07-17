import React, { useState, useRef, useEffect, useContext } from 'react';
import { usercontext } from '../src/Userprovider';
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";


const Chat = () => {
  const { itemdetails, myid, email: userEmail } = useContext(usercontext);
  const { roomid } = useParams();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [ai, setAi] = useState("");
  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      auth: {
        token: localStorage.getItem("token")
      },
      query: {
        itemdetails: JSON.stringify(itemdetails),
        myid: myid,
        roomid: roomid
      }
    });

    // 👉 Load previous messages
    socketRef.current.on("load-messages", (loadedMessages) => {
      setMessages(loadedMessages);
    });
    socketRef.current.on("aimessage", (aimessage) => {
      setAi(aimessage);

    });


    // 👉 Append new messages
    socketRef.current.on("receive-message", (msgData) => {
      setMessages((prev) => [...prev, msgData]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [itemdetails, myid, roomid]);

  const handleSend = () => {
    if (inputMessage.trim() === '') return;

    const myMessage = {
      text: inputMessage,
      senderEmail: userEmail,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, myMessage]);

    socketRef.current.emit('send-message', { message: inputMessage });
    setInputMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
    {/* Responsive wrapper for AI and Chat */}
    <div className="flex flex-col lg:flex-row gap-4 w-full justify-center items-start">
      
      {/* AI BOX */}
      <div className='h-[30vh] w-full lg:w-[25vw] bg-[#1E2939] rounded-md flex items-center justify-center'>
        <h1 className='p-4'>{ai}</h1>
      </div>
  
      {/* CHAT BOX */}
      <div className="w-full lg:max-w-md flex flex-col flex-grow border border-gray-700 rounded-lg overflow-hidden max-h-[80vh]">
        <div className="bg-gray-800 px-4 py-2 font-bold">Chat Room</div>
  
        {/* Scrollable message area */}
        <div className="flex-1 bg-gray-900 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          {messages.map((msg, index) => {
            const isYou = msg.senderEmail === userEmail;
            return (
              <div key={index} className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-4 py-2 rounded-xl text-sm max-w-[70%] ${isYou ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-700 text-white rounded-bl-none'
                    }`}
                >
                  <div className="text-xs font-bold mb-1">
                    {msg.senderEmail}{" "}
                    <span className="opacity-50 ml-2">
                      {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
  
        {/* Input */}
        <div className="flex p-2 border-t border-gray-700 bg-gray-800">
          <input
            type="text"
            placeholder="Type a message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 rounded-l-md text-white focus:outline-none bg-gray-700"
          />
          <button onClick={handleSend} className="bg-green-600 px-4 py-2 rounded-r-md">
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default Chat;
