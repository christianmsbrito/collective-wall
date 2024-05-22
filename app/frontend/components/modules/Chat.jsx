import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import TextField from '@mui/material/TextField';

import { Button, List, ListItem, ListItemText } from '@mui/material';

function ChatMessages({ messages }) {
  const allMessages = messages.join(' ');
  return (
    <p>{allMessages}</p>
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
      />
      <Button type="submit" variant="contained" color="primary">
        Send
      </Button>
    </form>
  );
}

function Chat({ props }) {
  const [messages, setMessages] = useState([
    props?.wall?.context,
    ...props?.wall?.contributions?.map?.((contribution) => contribution.content),
  ]);

  const handleSubmit = async (input) => {
    await api.wall(props.wall.id).createContribution(props.wall.owner, input);
    setMessages([...messages, input]);
  };

  return (
    <div>
      <h1>Chat</h1>
      <ChatMessages messages={messages} />
      <ChatInput onSubmit={handleSubmit} />
    </div>
  );
}

export default Chat;
