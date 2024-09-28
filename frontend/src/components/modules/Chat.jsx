import React, { useEffect, useState } from "react";
import { api } from "../../api";
import {
  TextField,
  Box,
  Button,
  Typography,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { getCurrentlyOpenedWall } from "../../api/wall";

import PropTypes from 'prop-types';

function ChatMessages({ messages }) {
  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      {messages.map((message, index) => (
        <Tooltip key={index} title={message}>
          <Typography
            variant="body1"
            component="span"
            sx={{ display: "inline-block", mr: 1 }}
          >
            {message}
          </Typography>
        </Tooltip>
      ))}
    </Box>
  );
}


function ChatInput({ onSubmit, isLoading }) {
  const [input, setInput] = useState("");

  const handleChange = (event) => {
    // const words = event.target.value.split(" ");
    // if (words.length > 1) {
    //   setInput(words[0]);
    // } else {
    setInput(event.target.value);
    // }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (input.trim()) {
      await onSubmit(input.trim());
      setInput("");
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
        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Send"}
      </Button>
    </form>
  );
}

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wall, setWall] = useState();
  const [image, setImage] = useState(wall?.imageUrl);
  const [isClosed, setIsClosed] = useState(wall?.isClosed);

  useEffect(() => {
    getCurrentlyOpenedWall().then((wall) => {
      setWall(wall);
      
      const initialMessages = [
        wall?.context,
        ...(wall?.contributions ?? []).map(
          (contribution) => contribution.content
        ),
      ];
      setMessages(initialMessages);
    })
  }, []);

  const handleSubmit = async (input) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.wall(wall.id).createContribution(wall.owner, input);
      setMessages((prevMessages) => [...prevMessages, input]);
    } catch (err) {
      setError("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const paintWall = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { image } = await api.wall(wall.id).paint();
      console.log(image);
      setImage(image);
      setIsClosed(true);
    } catch (err) {
      console.error(err);
      setError("Failed to paint wall");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "75%",
        ml: "auto",
        mr: "auto",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          direction: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h3">Collective Wall</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* <Button variant="contained" color="primary">
            Button 1
          </Button> */}
          { !isClosed && <Button
            variant="contained"
            color="secondary"
            sx={{ ml: 2 }}
            onClick={paintWall}
          >
            Paint
          </Button> }
        </Box>
      </Box>
      <ChatMessages messages={messages} />
      {error && <Typography color="error">{error}</Typography>}
      {!image && <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />}
      {image && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <img
            src={image}
            alt="test"
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "100vw",
              maxHeight: "100vh",
            }}
          />
        </Box>
      )}
    </Box>
  );
}

ChatInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};


ChatMessages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ChatContainer;
