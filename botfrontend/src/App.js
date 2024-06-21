import React, { useState, useEffect, useRef } from 'react';
import { Typography, Paper, Grid, TextField, Button, Skeleton, CircularProgress, Box } from '@mui/material';
import ReactAudioPlayer from 'react-audio-player';
import MuiAudioPlayer from 'material-ui-audio-player';
import axios from 'axios';

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [chatLogs, setChatLogs] = useState([]);
  const [isSending, setIsSending] = useState(false); // State to track loading state for current message being sent
  const [isWaitingForBotResponse, setIsWaitingForBotResponse] = useState(false); // State to track if waiting for bot's response

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const sendMessage = async (message) => {
    // Store the user message separately
    const userMessage = { text: message, isUser: true };

    try {
      setIsSending(true); // Set sending state when sending a new message

      // Send message to Rasa server
      const response = await axios.post(`http://localhost:5005/webhooks/rest/webhook`, {
        sender: 'user',
        message: message
      });

      // Process bot's messages
      const botMessages = response.data.map(msg => ({
        text: msg.text,
        isUser: false, // Marking messages from bot
        audioUrl: msg.custom?.payload === "audio" ? msg.custom.url : null
      }));

      // Add user message first, then set bot messages after delay
      setChatLogs(prevLogs => [...prevLogs, userMessage]);

      // Delay setting bot messages to simulate bot typing delay
      setTimeout(() => {
        setChatLogs(prevLogs => [...prevLogs, ...botMessages]);
      }, 3000); // Display bot's message after 3 seconds

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
      await sendMessage(userInput);
      setUserInput("");
    }
    inputRef.current.focus(); // Keep focus on input field after sending message
  };

  useEffect(() => {
    // Function to set waiting state for bot's response
    const setWaitingForBotResponse = () => {
      setIsWaitingForBotResponse(true);
      setTimeout(() => setIsWaitingForBotResponse(false), 3000); // Reset after 3 seconds
    };

    // Listen for user messages and set waiting state
    if (chatLogs.length > 0 && chatLogs[chatLogs.length - 1].isUser) {
      setWaitingForBotResponse();
    }
  }, [chatLogs]);

  // Automatically scroll to top when chat logs change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatLogs, isWaitingForBotResponse]);

  return (
    <div style={{
      display: 'flex',
      width: '60%',
      justifyContent: 'center', // Center items horizontally
      flexDirection: 'column',
      marginTop: '10px',
      padding: '10px',
      marginBottom: '8px',
      margin: 'auto' // Center the entire div horizontally
    }}>
      <Paper style={{ display: 'flex', flexDirection: 'column', padding: '8px', borderRadius: '16px', backgroundColor: '#f0f0f0' }} elevation={3}>
        {/* Display chat logs */}
        <div style={{ display: 'flex', height: '450px', marginTop: '2px', flexDirection: 'column', overflowY: 'auto' }} ref={chatContainerRef}>
          {chatLogs.map((log, index) => (
            <Grid container key={index} alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <Paper style={{
                  padding: '12px',
                  width: 'fit-content', // Adjusts width based on content length
                  borderRadius: '16px',
                  backgroundColor: log.isUser ? '#90CAF9 ' : '#CFD8DC ',
                  color: 'white',
                  alignSelf: log.isUser ? 'flex-end' : 'flex-start',
                  marginBottom: '8px'
                }}>
                  <Typography color={'#373A40'}>{log.text}</Typography>
                </Paper>
                {log.audioUrl && (
                  <Paper style={{ height: '110px', padding: '12px', width: 250, borderRadius: '16px', backgroundColor: log.isUser ? '#90CAF9' : '#CFD8DC', color: 'white', alignSelf: 'flex-start', marginBottom: '8px' }}>
                    <MuiAudioPlayer
                      id="inline-timeline"
                      display="timeline"
                      inline
                      src={log.audioUrl}
                      autoPlay={false}
                      volume={0.7}
                      loop={false}
                      showJumpControls={true}
                      spacing={2}
                      style={{
                        width: '200px', // Set the width of the audio player
                        height: '100px', // Set the height of the audio player
                        backgroundColor: '#f0f0f0', // Custom styles for the player
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                      onError={(error) => console.error('Audio Error:', error)} // Error handling function
                    />
                  </Paper>
                )}
              </Grid>
            </Grid>
          ))}
          {isWaitingForBotResponse &&
            <Paper style={{ display: 'flex', padding: 12, flexDirection: 'row', height: '50px', width: 'fit-content', borderRadius: '16px', backgroundColor: '#CFD8DC', color: 'white', alignSelf: 'flex-start', marginBottom: '8px' }}>
              <Skeleton variant="circular" sx={{ marginRight: 0.2 }} width={15} height={15} />
              <Skeleton variant="circular" sx={{ marginRight: 0.2 }} width={15} height={15} />
              <Skeleton variant="circular" width={15} height={15} />
            </Paper>
          }
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '60px', borderRadius: '16px', backgroundColor: '#eee', width: '100%', padding: '4px', position: 'sticky', bottom: '0' }}>
          <TextField
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type your text here...."
            variant="outlined"
            size="small"
            fullWidth
          />
          <Button
            onClick={handleSubmit}
            style={{ backgroundColor: '#3f51b5', color: 'white', borderRadius: '16px', marginLeft: '2px' }}
            variant="contained"
            disableElevation
          >
            Send
          </Button>
          {/* Loading indicator for sending button */}
          {isSending && <CircularProgress size={24} style={{ marginLeft: '10px' }} />}
        </form>
      </Paper>
    </div>
  );
}

export default Chatbot;

// import React, { useState, useEffect, useRef } from 'react';
// import { Typography, Paper, Grid, TextField, Button, Skeleton, CircularProgress, Chip, Box, Card } from '@mui/material';
// import MuiAudioPlayer from 'material-ui-audio-player';
// import axios from 'axios';
// import Scrollbar from './Components/scrollbar'

// function Chatbot() {
//   const [userInput, setUserInput] = useState("");
//   const [chatLogs, setChatLogs] = useState([]);
//   const [isSending, setIsSending] = useState(false);
//   const [isWaitingForBotResponse, setIsWaitingForBotResponse] = useState(false);

//   const chatContainerRef = useRef(null);
//   const inputRef = useRef(null);

//   // Function to send a message to the Rasa server
//   const sendMessage = async (message) => {
//     const userMessage = { text: message, isUser: true };

//     try {
//       setIsSending(true);

//       const response = await axios.post(`http://localhost:5005/webhooks/rest/webhook`, {
//         sender: 'user',
//         message: message
//       });

//       const botMessages = response.data.map(msg => ({
//         text: msg.text,
//         isUser: false,
//         audioUrl: msg.custom?.payload === "audio" ? msg.custom.url : null,
//         buttons: msg.buttons || []
//       }));
//       console.log(response.data)
//       setChatLogs(prevLogs => [...prevLogs, userMessage]);

//         setIsSending(false)
//         setChatLogs(prevLogs => [...prevLogs, ...botMessages]);


//     } catch (error) {
//       console.error('Error sending message to Rasa:', error);
//     }
//   };

//   const handleInputChange = (event) => {
//     setUserInput(event.target.value);
//   };


//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (userInput.trim() !== "") {
//       await sendMessage(userInput);
//       setUserInput("");
//     }
//     inputRef.current.focus(); 
//   };

//   const handleButtonClick = async (message) => {
//     await sendMessage(message);
//   };

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [chatLogs]);

//   return (
//     <div style={{
//       display: 'flex',
//       width: '55%',
//       justifyContent: 'center',
//       flexDirection: 'column',
//       marginTop: '10px',
//       padding: '10px',
//       marginBottom: '8px',
//       margin: 'auto'
//     }}>
//       <Card style={{ display: 'flex', flexDirection: 'column', padding: '8px', borderRadius: '16px' }} elevation={3}>
//         {/* Display chat logs */}
//         {/* <Scrollbar style={{ height: '460px', width: '100%' }}> */}
       
//         <div style={{ overflowX: 'hidden', display: 'flex', height: '450px', flexDirection: 'column', overflowY: 'auto' }} ref={chatContainerRef}>
         
//           {chatLogs.map((log, index) => (
//             <Grid container key={index} justifyContent={log.isUser ? 'flex-end' : 'flex-start'} spacing={4}>
//               <Grid item xs={12} style={{ width: '100%' }}>
//                 {log.text && (
//                   <Paper
//                     style={{
//                       padding: '12px',
//                       width: 'fit-content',
//                       borderRadius: '16px',
//                       backgroundColor: log.isUser ? '#1679AB' : '#0E46A3',
//                       color: 'white',
//                       textAlign: log.isUser ? 'right' : 'left',
//                       alignSelf: log.isUser ? 'flex-end' : 'flex-start',
//                       marginBottom: '8px',
//                       marginLeft: log.isUser ? 'auto' : '0',
//                       marginRight: log.isUser ? '0' : 'auto'
//                     }}
//                   >
//                     <Typography >{log.text}</Typography>
//                   </Paper>
//                 )}
//                 {log.audioUrl && (
//                   <Paper
//                     style={{
//                       overflow: 'hidden',
//                       height: '109px',
//                       padding: '12px',
//                       width: 250,
//                       borderRadius: '10px',
//                       backgroundColor: log.isUser ? '#90CAF9' : '#0E46A3',
//                       color: 'white',
//                       marginBottom: '8px',
//                       textAlign: 'left', // Assuming audio component is aligned to the left
//                       alignSelf: 'flex-start',
//                     }}
//                   >
//                     <MuiAudioPlayer
//                       id={`inline-timeline-${index}`}
//                       display="timeline"
//                       inline
//                       src={log.audioUrl}
//                       autoPlay={false}
//                       volume={0.7}
//                       loop={false}
//                       showJumpControls={true}
//                       spacing={2}
//                       style={{
//                         width: '200px',
//                         height: '100px',
//                         backgroundColor: '#f0f0f0',
//                         borderRadius: '8px',
//                         padding: '16px',
//                       }}
//                       onError={(error) => console.error('Audio Error:', error)}
//                     />
//                   </Paper>
//                 )}
//                 {log.buttons && log.buttons.length > 0 &&
//                   <Box style={{ display: 'flex', width: 200, justifyContent: 'flex-start', marginTop: '8px' }}>
//                     {log.buttons.map((button, buttonIndex) => (
//                       <Chip
//                         key={buttonIndex}
//                         variant="outlined"
//                         color="primary"
//                         label={button.title}
//                         style={{ margin: '4px' }}
//                         onClick={() => handleButtonClick(button.title)}
//                       >
//                         {button.title}
//                       </Chip>
//                     ))}
//                   </Box>
//                 }
//               </Grid>
//             </Grid>
//           ))}
//           {isSending &&
//             <Paper style={{ display: 'flex', padding: 12, flexDirection: 'row', height: '40px', width: 'fit-content', borderRadius: '16px', backgroundColor: '#CFD8DC', color: 'white', alignSelf: 'flex-start', marginBottom: '8px' }}>
//               <Skeleton variant="circular" sx={{ marginRight: 0.2 }} width={15} height={15} />
//               <Skeleton variant="circular" sx={{ marginRight: 0.2 }} width={15} height={15} />
//               <Skeleton variant="circular" width={15} height={15} />
//             </Paper>
//           }

//         </div>
//         {/* </Scrollbar> */}

//         {/* Input form with buttons */}
//         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '60px', borderRadius: '16px', width: '100%', padding: '4px', position: 'sticky', bottom: '0' }}>
//           <TextField
//             ref={inputRef}
//             type="text"
//             value={userInput}
//             onChange={handleInputChange}
//             placeholder="Type your text here...."
//             variant="outlined"
//             size="small"
//             fullWidth
//           />
//           <Button
//             onClick={handleSubmit}
//             style={{ backgroundColor: '#3f51b5', color: 'white', borderRadius: '16px', marginLeft: '2px' }}
//             variant="contained"
//             disableElevation
//           >
//             Send
//           </Button>
//           {/* Loading indicator for sending button */}
//           {/* {isSending && <CircularProgress size={24} style={{ marginLeft: '10px' }} />} */}
//         </form>
//       </Card>
//     </div>
//   );
// }

// export default Chatbot;