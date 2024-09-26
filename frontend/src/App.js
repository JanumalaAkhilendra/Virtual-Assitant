// frontend/src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import ChatWindow from './components/ChatWindow';
import './App.css';
import MoodTracker from './components/MoodTracker';
import Navbar from './components/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {

  const userId = 1; // Assign a static user ID for testing

  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Append user message to chat
    setMessages([...messages, { text: input, sender: 'user' }]);

    try {
      // Send user message to backend
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: input,
      });

      // Append AI response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.reply, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    // Clear input box
    setInput('');
  };

  return (
    <div className="App">
      <Navbar />
      <ChatWindow messages={messages} />
      
      <div className="input-container">
        <input className="input" type="text" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="How are you feeling today?"
      />
        
      <button onClick={handleSendMessage} >
          <span className="button_top"> Send </span>
      </button>

      </div>
      <MoodTracker userId={userId} />
    </div>
  );
};

export default App;
