import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CodeQuestProvider } from './context/CodeQuestContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PracticePage } from './pages/PracticePage';
import { PracticeSessionPage } from './pages/PracticeSessionPage';
import { TopicsPage } from './pages/TopicsPage';
import { RevisionPage } from './pages/RevisionPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  return (
    <CodeQuestProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/practice/session/:topicId" element={<PracticeSessionPage />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/revision" element={<RevisionPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CodeQuestProvider>
  );
}

export default App;
