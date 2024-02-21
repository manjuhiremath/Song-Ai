import './App.css';
import axios from 'axios';
import { useState } from 'react';

function App() {
  const [responseMsg, setResponseMsg] = useState([]); // Initialize responseMsg as an empty array
  const [userInput, setUserInput] = useState(""); // State to hold user input
  const [getSong, setSong] = useState("");
  async function sendMessage(message) {
    try {
      const response = await axios.post(`http://localhost:5005/webhooks/rest/webhook`, {
        sender: 'user',
        message: message
      });
      // console.log(response.data[0]);
      if (response.data[0].custom && response.data[0].custom.payload === "audio" && response.data[0].custom.url !== "") {
        // console.log(response.data[0].custom.url);
        setSong(response.data[0].custom);
        // console.log(setUrl);
      }
      console.log(response.data);
      setResponseMsg(response.data); // Update responseMsg with the received data
    } catch (error) {
      console.error('Error sending message to Rasa:', error);
    }
  }

  const handleInputChange = (event) => {
    setUserInput(event.target.value); // Update userInput state with the input value
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(userInput); // Call sendMessage function with the user input
    setUserInput(""); // Clear the input field after sending the message
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit} className="flex items-center max-w-80 bg-gray-50 rounded-lg p-2 dark:bg-gray-700">
        <input 
          id="chat" 
          type="text" 
          value={userInput} 
          onChange={handleInputChange} 
          className="p-2 text-lg text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex-1 mr-2" 
          placeholder="Your message..."
        />
        <button 
          type="submit" 
          className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
        >
          Send
          <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </button>
      </form>

      {/* Render bot responses */}
      <div>{responseMsg.map((msg, index) => {
        if (msg.custom && msg.custom.payload === "audio" && msg.custom.src === "song_name") {
          return (
            <><h1>{getSong.title}</h1>
            <div className="audio-player" key={index}>
              {/* Render your audio player component here */}
             
              <audio controls autoPlay>
                <source src={getSong.url} type="audio/mp4" />
                Your browser does not support the audio element.
              </audio>
            </div>
            </>
          );
        } else {
          return (
            <h6 key={index}>Bot Response: {msg.text}</h6>
          );
        }
      })}</div>
    </div>
  );
}

export default App;
