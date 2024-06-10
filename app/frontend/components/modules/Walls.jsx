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
import Wall from "./Wall";

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

// function ChatInput({ onSubmit, isLoading }) {
//   const [input, setInput] = useState("");

//   const handleChange = (event) => {
//     // const words = event.target.value.split(" ");
//     // if (words.length > 1) {
//     //   setInput(words[0]);
//     // } else {
//     setInput(event.target.value);
//     // }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (input.trim()) {
//       await onSubmit(input.trim());
//       setInput("");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <TextField
//         type="text"
//         value={input}
//         onChange={handleChange}
//         label="Message"
//         variant="outlined"
//         fullWidth
//         disabled={isLoading}
//       />
//       <Button
//         type="submit"
//         variant="contained"
//         color="primary"
//         fullWidth
//         sx={{ mt: 2 }}
//         disabled={isLoading}
//       >
//         {isLoading ? <CircularProgress size={24} color="inherit" /> : "Send"}
//       </Button>
//     </form>
//   );
// }

function Walls({ props }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [isClosed, setIsClosed] = useState(props?.wall?.is_closed);

  const [walls, setWalls] = useState([]);

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
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
            }}
        >
            {props?.walls?.map((wall) => (
                <Wall key={wall.id} props={wall} />
            ))}
        </Box>
        <ChatMessages messages={messages} />
        {error && <Typography color="error">{error}</Typography>}
        {/* {!image && <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />} */}
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
    // <>Test</>
);
}

export default Walls;
