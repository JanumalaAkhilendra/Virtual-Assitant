// frontend/src/components/ChatWindow.js

import React from 'react';
import './ChatWindow.css';
import therpy1 from '../Assets/10813443.jpg';
import therpy2 from '../Assets/Screenshot 2024-09-26 204543.png'

const ChatWindow = ({ messages }) => {
  return (
    <div className='outerwindow'>
    <img className='chatImage'  src={therpy2} alt="img "/>
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender}`}>
          {msg.text}
        </div>
      ))}
      
    </div>
    <img className='chatImage'  src={therpy1} alt="img "/>
    </div>
  );
};

export default ChatWindow;
