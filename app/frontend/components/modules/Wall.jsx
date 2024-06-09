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

const Wall = ({ props }) => {
  const [messages, setMessages] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //     const fetchMessages = async () => {
  //     setIsLoading(true);
  //     const response = await api.get("/messages");
  //     setMessages(response.data.messages);
  //     setIsLoading(false);
  //     };

  //     fetchMessages();
  // }, []);

  useEffect(() => {
    const messages = [
      props?.wall?.context,
      ...props?.wall?.contributions?.map(
        (contribution) => contribution.content
      ),
    ];
    setMessages(messages);
  }, [props]);

  // const handleSubmit = async (message) => {
  //     setIsLoading(true);
  //     await api.post("/messages", { message });
  //     await fetchMessages();
  //     setIsLoading(false);
  // };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Wall
      </Typography>
      <ChatMessages messages={messages} />
      {/* <ChatInput onSubmit={handleSubmit} isLoading={isLoading} /> */}
    </Box>
  );
};

export default Wall;
