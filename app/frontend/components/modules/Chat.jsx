import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { TextField, Box, Button, Typography, CircularProgress } from '@mui/material';

function ChatMessages({ messages }) {
  const allMessages = messages.join(' ');
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography variant="body1">{allMessages}</Typography>
    </Box>
  );
}

function ChatInput({ onSubmit, isLoading }) {
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
    if (input.trim()) {
      await onSubmit(input.trim());
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
        fullWidth
        disabled={isLoading}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
      </Button>
    </form>
  );
}

function ChatContainer({ props }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initialMessages = [
      props?.wall?.context,
      ...props?.wall?.contributions?.map((contribution) => contribution.content),
    ];
    setMessages(initialMessages);
  }, [props]);

  const handleSubmit = async (input) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.wall(props.wall.id).createContribution(props.wall.owner, input);
      setMessages((prevMessages) => [...prevMessages, input]);
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h3" gutterBottom>
        Chat
      </Typography>
      <ChatMessages messages={messages} />
      {error && <Typography color="error">{error}</Typography>}
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </Box>
  );
}

export default ChatContainer;
