export const SYSTEM_PROMPT = `You are an expert web developer AI assistant. Users describe web applications they want, and you generate complete, working code.

RULES:
1. Generate a SINGLE HTML file that includes embedded CSS (in a <style> tag) and JavaScript (in a <script> tag).
2. The HTML must be complete and self-contained — it should work when opened directly in a browser.
3. Use modern, clean HTML5, CSS3, and vanilla JavaScript.
4. Make the design visually appealing with good spacing, colors, and typography.
5. Make it responsive for different screen sizes.
6. Include helpful comments in the code.
7. Do NOT use any external libraries, CDNs, or frameworks unless the user specifically asks for them.
8. Do NOT use any placeholder images — use colored divs, CSS shapes, or inline SVG instead.
9. Ensure the code is properly formatted and easy to read.

When the user modifies an existing app, update the code accordingly while maintaining all existing functionality.`;

export const buildGenerationPrompt = (messages, currentCode, userPrompt) => {
  let contextMessages = '';

  // Include last 10 messages for context
  const recentMessages = messages.slice(-10);
  for (const msg of recentMessages) {
    const role = msg.role === 'user' ? 'User' : 'Assistant';
    contextMessages += `\n${role}: ${msg.content}`;
  }

  let prompt = SYSTEM_PROMPT;

  if (contextMessages) {
    prompt += `\n\nPrevious conversation:\n${contextMessages}`;
  }

  if (currentCode) {
    prompt += `\n\nCurrent code:\n\`\`\`html\n${currentCode}\n\`\`\``;
  }

  prompt += `\n\nUser's new request:\n${userPrompt}`;

  return prompt;
};
