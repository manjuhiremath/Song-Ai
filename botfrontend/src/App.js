import './App.css';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import ReactAudioPlayer from 'react-audio-player';

function Chatbot() {
  const [responseMsg, setResponseMsg] = useState("");
  const [userInput, setUserInput] = useState("");
  const [chatLogs, setChatLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State to track loading state for previous messages
  const [isSending, setIsSending] = useState(false); // State to track loading state for current message being sent

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const sendMessage = async (message) => {
    setIsSending(true); // Set sending state when sending a new message
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
      setIsSending(false); // Clear sending state when response received
    }
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userInput.trim() !== "") {
      setIsSending(true);
      await sendMessage(userInput);
      setUserInput("");
    }
    inputRef.current.focus(); // Keep focus on input field after sending message
  };

  // Automatically scroll to top when chat logs change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatLogs]);

  return (
    <div className="flex flex-col p-10 mb-8 border-sky-500">
      <div className="flex flex-col rounded-2xl bg-gray-500 p-8">
        {/* Display chat logs */}
        <div className="flex flex-col" ref={chatContainerRef}>
          {chatLogs.map((log, index) => (
            <div className="flex flex-col" key={index}>
              <div className="grid grid-cols-12 gap-y-2">
                <div className="col-start-6 col-end-13 p-3 rounded-lg">
                  <div className="flex items-center justify-start flex-row-reverse">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">User</div>
                    <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                      <div>{log.user}</div>
                    </div>
                  </div>
                </div>
                <div className="col-start-1 col-end-8 p-3 rounded-lg">
                  <div className="flex flex-row items-center">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-violet-600 flex-shrink-0">Bot</div>
                    <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                      <div>{isSending && index === chatLogs.length - 1 ? 'Sending...' : log.bot}</div>
                      {log.audio && <ReactAudioPlayer className="mt-1" controls><source src={log.audio} text={log.title} type="audio/mp4" /></ReactAudioPlayer>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

     
      </div>
      <form onSubmit={handleSubmit} className="flex flex-row items-center h-16 rounded-xl bg-slate-400 w-full px-4 sticky bottom-0">
        <input ref={inputRef} type="text" value={userInput} onChange={handleInputChange} placeholder='Type your text here....' className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10" />
        <button onClick={handleSubmit} className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0 ml-4">
          <span>Send</span>
          <span className="ml-2">
            <svg className="w-4 h-4 transform rotate-45 -mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18zm0 0v-8"></path>
            </svg>
          </span>
        </button>
      </form>
    </div>
  );
}

export default Chatbot;

















// import './App.css';
// import axios from 'axios';
// import { useState,useEffect,useRef } from 'react';
// import ReactAudioPlayer from 'react-audio-player';

// function Chatbot() {
//   const [responseMsg, setResponseMsg] = useState("");
//   const [userInput, setUserInput] = useState("");
//   const [chatLogs, setChatLogs] = useState([]);
//   const [isLoading, setIsLoading] = useState(false); // State to track loading state

//   const chatContainerRef = useRef(null);

//   const sendMessage = async (message) => {
//     setIsLoading(true); // Set loading state to true when sending message
//     try {
//       const response = await axios.post(`http://localhost:5005/webhooks/rest/webhook`, {
//         sender: 'user',
//         message: message
//       });

//       const botMessages = response.data.map(msg => msg.text).join('\n');
//       const audioUrl = response.data[0]?.custom?.payload === "audio" ? response.data[0].custom.url : null;
//       setResponseMsg(botMessages);

//       setChatLogs(prevLogs => [...prevLogs, { user: message, bot: botMessages, audio: audioUrl }]);
//     } catch (error) {
//       console.error('Error sending message to Rasa:', error);
//     } finally {
//       setIsLoading(false); // Set loading state to false when message is sent
//     }
//   };

//   const handleInputChange = (event) => {
//     setUserInput(event.target.value);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     await sendMessage(userInput);
//     setUserInput("");
//   };

//   // Function to scroll to the bottom of the chat container
//   const scrollToBottom = () => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   };

//   // Scroll to bottom when chat logs change
//   useEffect(() => {
//     scrollToBottom();
//   }, [chatLogs]);

//   return (
//     <>
//     {/* <div style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', width: '80%', zIndex: 999 }} */}
// {/* > */}
//     <div className="flex flex-col flex-auto h-full p-10 mb-8 border-sky-500">
//       <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-500 h-full p-8">
//         {/* Display chat logs */}
//         <div className="flex flex-col h-full scroll-smooth md:scroll-auto mb-4">
//           {chatLogs.map((log, index) => (
//             <div className="flex flex-col h-full" key={index}>
//               <div className="grid grid-cols-12 gap-y-2">
//                 <div className="col-start-6 col-end-13 p-3 rounded-lg">
//                   <div className="flex items-center justify-start flex-row-reverse">
//                     <div
//                       className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
//                     >
//                       User
//                     </div>
//                     <div
//                       className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
//                     >
//                       <div>{log.user}</div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-start-1 col-end-8 p-3 rounded-lg">
//                   <div className="flex flex-row items-center">
//                     <div
//                       className="flex items-center justify-center h-10 w-10 rounded-full bg-violet-600 flex-shrink-0"
//                     >
//                       Bot
//                     </div>
//                     <div
//                       className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
//                     >
//                        {isLoading ? <div>Loading...</div> : <div>{log.bot}</div>}
//                       {/* <div>{log.bot}</div> */}
//                       {log.audio && <ReactAudioPlayer className="mt-1" controls ><source src={log.audio} text={log.title} type="audio/mp4" /></ReactAudioPlayer>}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* </div> */}


//         <form onSubmit={handleSubmit}>
//         <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', zIndex: 999 }}
// >
//           <div
//             className="flex flex-row items-center h-16 rounded-xl bg-slate-400 w-full px-4"
//           >
//             <div>
//               <button
//                 className="flex items-center justify-center text-gray-400 hover:text-gray-600"
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     stroke-width="2"
//                     d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
//                   ></path>
//                 </svg>
//               </button>
//             </div>
//             <div className="flex-grow ml-4">
//               <div className="relative w-full">
//                 <input
//                   type="text"
//                   value={userInput}
//                   onChange={handleInputChange}
//                   placeholder='Type your text here....'
//                   class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
//                 />
//                 <button
//                   className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                       stroke-width="2"
//                       d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                     ></path>
//                   </svg>
//                 </button>
//               </div>
//             </div>
//             <div className="ml-4">
//               <button
//                 onClick={handleSubmit}
//                 class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
//               >
//                 <span>Send</span>
//                 <span className="ml-2">
//                   <svg
//                     className="w-4 h-4 transform rotate-45 -mt-px"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                       stroke-width="2"
//                       d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//                     ></path>
//                   </svg>
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>
//         </form>
//       </div>
      
//     </div>
//   </>
  
//   );
// }

// export default Chatbot;
