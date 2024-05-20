import React, { useEffect, useState } from 'react';
import { api } from '../../api';

function Chat({ props }) {
  const [messages, setMessages] = useState(props.wall.contributions.map((contribution) => contribution.content));
  const [input, setInput] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleChange = (event) => {
    const words = event.target.value.split(' ');
    if (words.length > 1) {
      // If more than one word is typed, take the first one and clear the input
      setInput(words[0]);
    } else {
      setInput(event.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (input) {
      await api.wall(props.wall.id).createContribution(props.wall.owner, input);
      setMessages([...messages, input]);
      setInput(''); // Clear the input after sending
      // setIsDisabled(true); // Disable the input after sending
    }
  };

  const enableInput = () => {
    setIsDisabled(false);
  };

  return (
    <div>
      <h1>Chat</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          disabled={isDisabled}
          onBlur={enableInput}
        />
        <button type="submit" disabled={isDisabled}>Send</button>
      </form>
    </div>
  );
}

export default Chat;
