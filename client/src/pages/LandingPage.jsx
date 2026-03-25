import { useNavigate } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard.jsx';
import '../styles/landing.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <span className="landing-logo">NxtBuild</span>
        <button className="landing-cta-button" onClick={() => navigate('/login')}>
          Get Started
        </button>
      </nav>

      <section className="landing-hero">
        <h1 className="landing-hero-title">Build Web Apps with AI</h1>
        <p className="landing-hero-subtitle">
          Describe what you want in plain English. AI generates complete, working code instantly.
        </p>

        <div className="landing-prompt-box">
          <div className="landing-prompt-label">Try it now:</div>
          <div className="landing-prompt-input">
            "Build a landing page for a photography portfolio with a gallery section"
          </div>
          <div className="landing-prompt-icon">→</div>
        </div>

        <button className="landing-hero-button" onClick={() => navigate('/login')}>
          Start Building Free
        </button>
      </section>

      <section className="landing-features">
        <h2 className="landing-features-title">How It Works</h2>
        <div className="landing-features-grid">
          <FeatureCard
            icon="1"
            title="Describe Your App"
            description="Tell AI what you want to build in natural language. Be as detailed as you like."
          />
          <FeatureCard
            icon="2"
            title="Get Working Code"
            description="AI generates complete HTML, CSS, and JavaScript instantly. No setup needed."
          />
          <FeatureCard
            icon="3"
            title="Refine & Download"
            description="Preview your app live. Chat to refine it. Download as standalone HTML when done."
          />
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2025 NxtBuild. Transform your ideas into working apps with AI.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
