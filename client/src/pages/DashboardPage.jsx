import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../context/ToastContext.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { getProjects, createProject, deleteProject } from '../services/projectService.js';
import '../styles/dashboard.css';

function DashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      showToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNewProject = async () => {
    try {
      const newProject = await createProject('Untitled Project');
      navigate(`/builder/${newProject._id}`);
    } catch (error) {
      showToast('Failed to create project', 'error');
    }
  };

  const handleDelete = async (projectId, title) => {
    if (window.confirm(`Delete "${title}"? This action cannot be undone.`)) {
      try {
        await deleteProject(projectId);
        setProjects(projects.filter((p) => p._id !== projectId));
        showToast('Project deleted', 'success');
      } catch (error) {
        showToast('Failed to delete project', 'error');
      }
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Projects</h1>
        <button className="dashboard-new-button" onClick={handleNewProject}>
          + New Project
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-icon">📁</p>
          <p className="empty-state-title">No projects yet</p>
          <p className="empty-state-subtitle">Create your first web app with AI</p>
          <button className="empty-state-button" onClick={handleNewProject}>
            Create Project
          </button>
        </div>
      ) : (
        <div className="dashboard-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onOpen={(id) => navigate(`/builder/${id}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
