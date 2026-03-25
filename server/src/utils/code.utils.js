export const parseGenerationResponse = (responseText) => {
  let code = '';
  let description = '';

  const htmlMarker = '```html';
  const startIndex = responseText.indexOf(htmlMarker);

  if (startIndex !== -1) {
    description = responseText.slice(0, startIndex).trim();
    const codeStart = startIndex + htmlMarker.length;
    const codeEnd = responseText.indexOf('```', codeStart);

    if (codeEnd !== -1) {
      code = responseText.slice(codeStart, codeEnd).trim();
    } else {
      code = responseText.slice(codeStart).trim();
    }
  } else {
    // Try generic code block
    const genericStart = responseText.indexOf('```');
    if (genericStart !== -1) {
      description = responseText.slice(0, genericStart).trim();
      const codeStart = genericStart + 3;
      const codeEnd = responseText.indexOf('```', codeStart);

      if (codeEnd !== -1) {
        code = responseText.slice(codeStart, codeEnd).trim();
      } else {
        code = responseText.slice(codeStart).trim();
      }
    } else {
      // No code block found
      description = responseText.trim();
    }
  }

  return { code, description };
};
