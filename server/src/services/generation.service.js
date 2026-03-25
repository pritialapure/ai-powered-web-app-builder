import { askGemini } from './gemini.service.js';
import { getProjectById, updateProject } from './project.service.js';
import { buildGenerationPrompt } from '../constants/prompts.js';
import { parseGenerationResponse } from '../utils/code.utils.js';

export const generateCode = async (projectId, userId, userPrompt) => {
  const project = await getProjectById(projectId, userId);

  const fullPrompt = buildGenerationPrompt(
    project.messages,
    project.generatedCode,
    userPrompt
  );

  const aiResponse = await askGemini(fullPrompt);
  const { code, description } = parseGenerationResponse(aiResponse);

  // Add user message to history
  project.messages.push({
    role: 'user',
    content: userPrompt,
    timestamp: new Date(),
  });

  // Add assistant message to history
  project.messages.push({
    role: 'assistant',
    content: description || aiResponse,
    timestamp: new Date(),
  });

  // Archive old code as version if it exists
  if (project.generatedCode) {
    project.versions.push({
      code: project.generatedCode,
      createdAt: new Date(),
    });
  }

  // Update generated code
  if (code) {
    project.generatedCode = code;
  }

  // Auto-set title from first user message
  if (!project.title || project.title === 'Untitled Project') {
    const firstMessage = project.messages.find((m) => m.role === 'user');
    if (firstMessage) {
      project.title = firstMessage.content.slice(0, 50);
    }
  }

  // Save project
  await updateProject(projectId, userId, {
    messages: project.messages,
    generatedCode: project.generatedCode,
    versions: project.versions,
    title: project.title,
  });

  return {
    message: {
      role: 'assistant',
      content: description || aiResponse,
    },
    code,
  };
};
