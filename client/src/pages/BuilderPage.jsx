import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContext } from '../context/ToastContext.jsx';
import ChatMessage from '../components/ChatMessage.jsx';
import ChatInput from '../components/ChatInput.jsx';
import CodeEditor from '../components/CodeEditor.jsx';
import LivePreview from '../components/LivePreview.jsx';
import { getProject, updateProject } from '../services/projectService.js';
import { generateCode } from '../services/generationService.js';
import '../styles/builder.css';

function BuilderPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preview');
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const data = await getProject(projectId);
      setProject(data);
      setMessages(data.messages);
      setCode(data.generatedCode);
      setNewTitle(data.title);
    } catch (error) {
      showToast('Failed to load project', 'error');
      navigate('/dashboard');
    } finally {
      setPageLoading(false);
    }
  };

  const handleSend = async (prompt) => {
    const userMessage = {
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const result = await generateCode(projectId, prompt);

      const aiMessage = {
        role: 'assistant',
        content: result.message.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (result.code) {
        setCode(result.code);
      }

      await updateProject(projectId, { messages: [...messages, userMessage, aiMessage], generatedCode: result.code });
    } catch (error) {
      setMessages((prev) => prev.slice(0, -1));
      showToast('Failed to generate code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleUpdate = async () => {
    if (newTitle.trim() && newTitle !== project.title) {
      try {
        await updateProject(projectId, { title: newTitle });
        setProject((prev) => ({ ...prev, title: newTitle }));
        showToast('Title updated', 'success');
      } catch (error) {
        showToast('Failed to update title', 'error');
      }
    }
    setEditingTitle(false);
  };

  const handleDownload = () => {
    if (!code) {
      showToast('No code to download yet', 'error');
      return;
    }

    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${newTitle || 'app'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded successfully', 'success');
  };

  if (pageLoading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="builder-page">
      <div className="builder-main">
        <div className="builder-chat-panel">
          <div className="builder-header">
            {editingTitle ? (
              <div className="builder-title-edit">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={handleTitleUpdate}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleUpdate()}
                  autoFocus
                  className="builder-title-input"
                />
              </div>
            ) : (
              <h2 className="builder-title" onClick={() => setEditingTitle(true)}>
                {newTitle}
              </h2>
            )}
          </div>

          <div className="builder-messages">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <p className="chat-empty-icon">💡</p>
                <p className="chat-empty-title">Start building</p>
                <p className="chat-empty-subtitle">Describe your app idea and AI will generate code</p>

                <div className="chat-suggestions">
                  {[
                    'Build a to-do list app',
                    'Create a portfolio landing page',
                    'Make a weather display widget',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="chat-suggestion-chip"
                      onClick={() => handleSend(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg} />
              ))
            )}

            {loading && (
              <div className="chat-typing">
                <span className="typing-indicator"></span>
                <span className="typing-indicator"></span>
                <span className="typing-indicator"></span>
              </div>
            )}
          </div>

          <ChatInput onSend={handleSend} loading={loading} disabled={!project} />
        </div>

        <div className="builder-preview-panel">
          <div className="builder-preview-header">
            <div className="builder-tabs">
              <button
                className={`builder-tab ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                Preview
              </button>
              <button
                className={`builder-tab ${activeTab === 'code' ? 'active' : ''}`}
                onClick={() => setActiveTab('code')}
              >
                Code
              </button>
            </div>
            <button className="builder-download-button" onClick={handleDownload}>
              Download
            </button>
          </div>

          <div className="builder-preview-content">
            {activeTab === 'preview' ? (
              <LivePreview code={code} />
            ) : (
              <CodeEditor code={code} onChange={setCode} readOnly={true} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuilderPage;
