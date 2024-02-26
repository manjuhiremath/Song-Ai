import './App.css';
import axios from 'axios';
import { useState,useEffect,useRef } from 'react';
import ReactAudioPlayer from 'react-audio-player';

function Chatbot() {
  const [responseMsg, setResponseMsg] = useState("");
  const [userInput, setUserInput] = useState("");
  const [chatLogs, setChatLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State to track loading state

  const chatContainerRef = useRef(null);

  const sendMessage = async (message) => {
    setIsLoading(true); // Set loading state to true when sending message
    try {
      const response = await axios.post(`http://localhost:5005/webhooks/rest/webhook`, {
        sender: 'user',
        message: message
      });

      const botMessages = response.data.map(msg => msg.text).join('\n');
      const audioUrl = response.data[0]?.custom?.payload === "audio" ? response.data[0].custom.url : null;
      setResponseMsg(botMessages);

      setChatLogs(prevLogs => [...prevLogs, { user: message, bot: botMessages, audio: audioUrl }]);
    } catch (error) {
      console.error('Error sending message to Rasa:', error);
    } finally {
      setIsLoading(false); // Set loading state to false when message is sent
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

  // Function to scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom when chat logs change
  useEffect(() => {
    scrollToBottom();
  }, [chatLogs]);

  return (
    <>
    {/* <div style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', width: '80%', zIndex: 999 }} */}
{/* > */}
    <div className="flex flex-col flex-auto h-full p-10 mb-8 border-sky-500">
      <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-500 h-full p-8">
        {/* Display chat logs */}
        <div ref={chatContainerRef} class="flex flex-col h-full scroll-smooth md:scroll-auto mb-4">
          {chatLogs.map((log, index) => (
            <div class="flex flex-col h-full" key={index}>
              <div class="grid grid-cols-12 gap-y-2">
                <div class="col-start-6 col-end-13 p-3 rounded-lg">
                  <div class="flex items-center justify-start flex-row-reverse">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                    >
                      User
                    </div>
                    <div
                      class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                    >
                      <div>{log.user}</div>
                    </div>
                  </div>
                </div>
                <div class="col-start-1 col-end-8 p-3 rounded-lg">
                  <div class="flex flex-row items-center">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-full bg-violet-600 flex-shrink-0"
                    >
                      Bot
                    </div>
                    <div
                      class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                    >
                       {isLoading ? <div>Loading...</div> : <div>{log.bot}</div>}
                      {/* <div>{log.bot}</div> */}
                      {log.audio && <ReactAudioPlayer className="mt-1" controls ><source src={log.audio} text={log.title} type="audio/mp4" /></ReactAudioPlayer>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* </div> */}


        <form onSubmit={handleSubmit}>
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', zIndex: 999 }}
>
          <div
            class="flex flex-row items-center h-16 rounded-xl bg-slate-400 w-full px-4"
          >
            <div>
              <button
                class="flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  ></path>
                </svg>
              </button>
            </div>
            <div class="flex-grow ml-4">
              <div class="relative w-full">
                <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  placeholder='Type your text here....'
                  class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                />
                <button
                  class="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="ml-4">
              <button
                onClick={handleSubmit}
                class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
              >
                <span>Send</span>
                <span class="ml-2">
                  <svg
                    class="w-4 h-4 transform rotate-45 -mt-px"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
        </form>
      </div>
      
    </div>
  </>
  
  );
}

export default Chatbot;
