import './App.css';
import axios from 'axios';
import { useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';

function Chatbot() {
  const [responseMsg, setResponseMsg] = useState("");
  const [userInput, setUserInput] = useState("");
  // const [getSong, setSong] = useState("");
  const [chatLogs, setChatLogs] = useState([]);

  const sendMessage = async (message) => {
    try {
      const response = await axios.post(`http://localhost:5005/webhooks/rest/webhook`, {
        sender: 'user',
        message: message
      });

      const botMessages = response.data.map(msg => msg.text).join('\n'); // Extract text from bot messages
      const audioUrl = response.data[0]?.custom?.payload === "audio" ? response.data[0].custom.url : null; // Check if the first message is audio
      setResponseMsg(botMessages);

      setChatLogs(prevLogs => [...prevLogs, { user: message, bot: botMessages, audio: audioUrl }]);
    } catch (error) {
      console.error('Error sending message to Rasa:', error);
    }
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(userInput);
    setUserInput("");
  };

  return (
    <div className="grid justify-center backdrop-blur-xl">
    <div className="ChatLogs h-90 w-45">
      {/* Display chat logs */}
      {chatLogs.map((log, index) => (
        <div key={index} className="flex flex-col mb-4">
          <p className="mb-1 colo">User: {log.user}</p>
          <p className="mb-1">Bot: {log.bot}</p>
          {log.audio && <ReactAudioPlayer className="mt-1" controls autoPlay><source src={log.audio} type="audio/mp4" /></ReactAudioPlayer>}
        </div>
      ))}
    </div>
    <div className="flex fixed items-end">
      <form onSubmit={handleSubmit} className="max-w-80 bg-gray-50 rounded-lg p-2 flex items-center">
        <input
          id="chat"
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="p-2 text-lg text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 flex-1 mr-2"
          placeholder="Your message..."
        />
        <button
          type="submit"
          className="p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100"
        >
          Send
          <svg className="w-6 h-6 rotate-90 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </button>
      </form>
    </div>
  </div>
  );
}

export default Chatbot;
