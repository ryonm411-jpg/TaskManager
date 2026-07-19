import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// React.StrictMode renders components twice in development to surface side effects.
// It has no effect on production builds.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
