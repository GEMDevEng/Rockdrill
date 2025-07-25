import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/pages/Dashboard';
import { LeadManagement } from './components/pages/LeadManagement';
import { CampaignBuilder } from './components/pages/CampaignBuilder';
import { Analytics } from './components/pages/Analytics';
import { EmailTemplates } from './components/pages/EmailTemplates';
import { Settings } from './components/pages/Settings';
import { Research } from './components/pages/Research';
import { NotificationContainer } from './components/ui/NotificationContainer';
import { DemoBanner } from './components/ui/DemoBanner';
import type { Page } from './types';

const AppContent: React.FC = () => {
  const { state } = useApp();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <LeadManagement />;
      case 'campaigns':
        return <CampaignBuilder />;
      case 'analytics':
        return <Analytics />;
      case 'templates':
        return <EmailTemplates />;
      case 'settings':
        return <Settings />;
      case 'research':
        return <Research />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isOpen={state.sidebarOpen}
        />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${state.sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
          <Header />
          <main className="flex-1 p-6">
            <DemoBanner />
            {renderPage()}
          </main>
        </div>
        <NotificationContainer />
      </div>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;