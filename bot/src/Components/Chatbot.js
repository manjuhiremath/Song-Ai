
import React, { useState, useEffect, useRef } from 'react';
import { Typography, Paper, Grid, TextField, Button, Skeleton, CircularProgress, Chip, Box, Card, IconButton } from '@mui/material';
// import MuiAudioPlayer from 'material-ui-audio-player';
import axios from 'axios';
// import { Audio } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
// import Scrollbar from './Components/scrollbar'
import { Scrollbar } from 'react-scrollbars-custom';

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [chatLogs, setChatLogs] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isWaitingForBotResponse, setIsWaitingForBotResponse] = useState(false);

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Function to send a message to the Rasa server
  const sendMessage = async (message) => {
    const userMessage = { text: message, isUser: true };

    try {
      setIsSending(true);

      const response = await axios.post(`http://localhost:5005/webhooks/rest/webhook`, {
        sender: 'user',
        message: message
      });

      const botMessages = response.data.map(msg => ({
        text: msg.text,
        isUser: false,
        audioUrl: msg.custom?.payload === "audio" ? msg.custom.url : null,
        buttons: msg.buttons || []
      }));
      console.log(response.data)
      setChatLogs(prevLogs => [...prevLogs, userMessage]);

      setIsSending(false)
      setChatLogs(prevLogs => [...prevLogs, ...botMessages]);


    } catch (error) {
      console.error('Error sending message to Rasa:', error);
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
    inputRef.current.focus();
  };

  const handleButtonClick = async (message) => {
    await sendMessage(message);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatLogs, isSending]);

  return (
    <div style={{
      display: 'flex',
      width: '55%',
      justifyContent: 'center',
      flexDirection: 'column',
      marginTop: '25px',
      padding: '10px',
      marginBottom: '8px',
      margin: 'auto',
    }}>

      <Card style={{ backgroundColor: '#26355D', display: 'flex', flexDirection: 'column', padding: '8px', borderRadius: '16px' }} elevation={3}>
        {/* <Scrollbar style={{ width: 250, height: 250 }}> */}
        <div style={{ overflowX: 'hidden', display: 'flex', height: '450px', flexDirection: 'column', overflowY: 'auto' }} ref={chatContainerRef}>

          {chatLogs.map((log, index) => (
            <Grid container key={index} justifyContent={log.isUser ? 'flex-end' : 'flex-start'} spacing={4}>
              <Grid item xs={12} style={{ width: '100%' }}>

                {log.text && (
                  <Paper
                    style={{
                      padding: '12px',
                      width: 'fit-content',
                      borderRadius: '16px',
                      backgroundColor: log.isUser ? '#864AF9' : '#5A639C',
                      color: 'white',
                      textAlign: log.isUser ? 'right' : 'left',
                      alignSelf: log.isUser ? 'flex-end' : 'flex-start',
                      marginBottom: '8px',
                      marginLeft: log.isUser ? 'auto' : '0',
                      marginRight: log.isUser ? '0' : 'auto'
                    }}
                  >
                    <Typography >{log.text}</Typography>
                  </Paper>
                )}
                {log.audioUrl && (
                  <Paper
                    style={{
                      overflow: 'hidden',
                      height: '40px',
                      padding: '12px',
                      width: 250,
                      borderRadius: '10px',
                      backgroundColor: log.isUser ? '#864AF9' : '#5A639C',
                      color: 'white',
                      marginBottom: '8px',
                      textAlign: 'left', // Assuming audio component is aligned to the left
                      alignSelf: 'flex-start',
                    }}
                  >
                    <audio
                      controls
                      src={log.audioUrl}
                      style={{
                        width: '100%',
                        height: '40px',
                        borderRadius: '8px',
                      }}
                      onError={(error) => console.error('Audio Error:', error)}
                    />
                  </Paper>
                )}
                {log.buttons && log.buttons.length > 0 &&
                  <Box style={{  width: 400, justifyContent: 'flex-start', marginTop: '8px' }}>
                    {log.buttons.map((button, buttonIndex) => (
                      <Chip
                        key={buttonIndex}
                        variant="contained"
                        color='primary'
                        // style={{ backgroundColor: '#20b2aa', color: 'white', margin: '4px' }}
                        label={button.title}
                        style={{ margin: '4px' }}
                        onClick={() => handleButtonClick(button.title)}
                      >
                        {button.title}
                      </Chip>
                    ))}
                  </Box>
                }
              </Grid>

            </Grid>

          ))}
          {isSending &&
            <Paper style={{ display: 'flex', padding: 12, flexDirection: 'row', height: '20px', width: 'fit-content', borderRadius: '16px', backgroundColor: '#5A639C', color: 'white', alignSelf: 'flex-start', marginBottom: '8px' }}>
              <Skeleton variant="circular" sx={{ marginRight: 0.2 }} width={15} height={15} />
              <Skeleton variant="circular" sx={{ marginRight: 0.2 }} width={15} height={15} />
              <Skeleton variant="circular" width={15} height={15} />
            </Paper>
          }
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '60px', borderRadius: '16px', width: '95%', marginLeft: '25px', padding: '4px', position: 'sticky', bottom: '0' }}>
          <TextField
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type your text here...."
            variant="standard"
            fullWidth
            inputProps={{ style: { color: 'white' } }} // Set text color to white
          />
          <IconButton
            style={{ backgroundColor: '#3f51b5' }}
            onClick={handleSubmit}
          >
            <SendRoundedIcon
              style={{ paddingLeft: '5px' }} // Ensure icon color is white
            />
          </IconButton>
        </form>
      </Card>
    </div>
  );
}

export default Chatbot;