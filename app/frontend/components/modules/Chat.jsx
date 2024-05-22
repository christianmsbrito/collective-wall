import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import TextField from '@mui/material/TextField';

import { Box, Button, Typography } from '@mui/material';

function ChatMessages({ messages }) {
  const allMessages = messages.join(' ');
  return (
    <Box sx={{ width: '100%' }}>
      <Typography>{allMessages}</Typography>
    </Box>
  );
}

function ChatInput({ onSubmit }) {
  const [input, setInput] = useState('');

  const handleChange = (event) => {
    const words = event.target.value.split(' ');
    if (words.length > 1) {
      setInput(words[0]);
    } else {
      setInput(event.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (input) {
      await onSubmit(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        type="text"
        value={input}
        onChange={handleChange}
        label="Message"
        variant="outlined"
        style={{ width: '100%' }}
      />
      <br />
      <Button type="submit" variant="contained" color="primary" style={{ width: '100%', marginTop: '10px' }}>
        Send
      </Button>
    </form>
  );
}

function ChatContainer({ props }) {
  const [messages, setMessages] = useState([
    props?.wall?.context,
    ...props?.wall?.contributions?.map?.((contribution) => contribution.content),
  ]);

  const handleSubmit = async (input) => {
    await api.wall(props.wall.id).createContribution(props.wall.owner, input);
    setMessages([...messages, input]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 2 }}>
      <Typography variant="h3">Chat</Typography>
      <ChatMessages messages={messages} />
      <ChatInput onSubmit={handleSubmit} />
    </Box>
  );
}

export default ChatContainer;
