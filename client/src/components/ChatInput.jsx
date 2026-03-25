import { useState } from 'react';

function ChatInput({ onSend, loading, disabled }) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim() || loading || disabled) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input-container">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe what you want to build or how to refine it..."
        disabled={disabled}
        className="chat-input-textarea"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || disabled || !input.trim()}
        className="chat-input-button"
      >
        {loading ? 'Generating...' : 'Send'}
      </button>
    </div>
  );
}

export default ChatInput;
