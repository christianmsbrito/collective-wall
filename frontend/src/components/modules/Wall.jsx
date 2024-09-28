import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
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

  useEffect(() => {
    const messages = [
      props?.context,
      ...props?.contributions?.map(
        (contribution) => contribution.content
      ),
    ];
    setMessages(messages);
  }, [props]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Wall
      </Typography>
      <ChatMessages messages={messages} />
    </Box>
  );
};

export default Wall;
