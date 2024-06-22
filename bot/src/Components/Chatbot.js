
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
                      backgroundColor: log.isUser ? '#1679AB' : '#0E46A3',
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
                      height: '87px',
                      padding: '12px',
                      width: 250,
                      borderRadius: '10px',
                      backgroundColor: log.isUser ? '#90CAF9' : '#0E46A3',
                      color: 'white',
                      marginBottom: '8px',
                      textAlign: 'left', // Assuming audio component is aligned to the left
                      alignSelf: 'flex-start',
                    }}
                  >
                    <audio
                      id={`inline-timeline-${index}`}
                      display="timeline"
                      inline
                      src={log.audioUrl}
                      autoPlay={false}
                      volume={0.7}
                      loop={false}
                      showJumpControls={true}
                      spacing={2}
                      style={{
                        width: '200px',
                        height: '100px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                      onError={(error) => console.error('Audio Error:', error)}
                    />
                  </Paper>
                )}
                {log.buttons && log.buttons.length > 0 &&
                  <Box style={{ display: 'flex', width: 200, justifyContent: 'flex-start', marginTop: '8px' }}>
                    {log.buttons.map((button, buttonIndex) => (
                      <Chip
                        key={buttonIndex}
                        variant="outlined"
                        color="primary"
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
            <Paper style={{ display: 'flex', padding: 12, flexDirection: 'row', height: '20px', width: 'fit-content', borderRadius: '16px', backgroundColor: '#0E46A3', color: 'white', alignSelf: 'flex-start', marginBottom: '8px' }}>
              <Skeleton variant="circular" sx={{ marginRight: 0.2 }} width={15} height={15} />
              <Skeleton variant="circular" sx={{ marginRight: 0.2 }} width={15} height={15} />
              <Skeleton variant="circular" width={15} height={15} />
            </Paper>
          }
        </div>
        {/* </Scrollbar> */}

        {/* </Scrollbar> */}

        {/* Input form with buttons */}
        {/* <Card style={{backgroundColor:'#0F6292',borderRadius: '16px'}}> */}
        <form onSubmit={handleSubmit} style={{color: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center', height: '60px', borderRadius: '16px', width: '95%', marginLeft: '25px', padding: '4px', position: 'sticky', bottom: '0' }}>
          <TextField
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type your text here...."
            variant="standard"
            // color="success"
            fullWidth
          />
          {/* <Button
            onClick={handleSubmit}
            style={{ backgroundColor: '#3f51b5', color: 'white', borderRadius: '16px', marginLeft: '10px' }}
            variant="contained"
            disableElevation
          >
            Send
          </Button> */}
          <IconButton
            style={{ backgroundColor: '#3f51b5' }}
            onClick={handleSubmit}>
            <SendRoundedIcon
              color='#3f51b5'
              style={{ paddingLeft: '5px' }}
            />
          </IconButton>
        </form>
      </Card>
    </div>
  );
}

export default Chatbot;