import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/pages/Dashboard';
import { LeadManagement } from './components/pages/LeadManagement';
import { CampaignBuilder } from './components/pages/CampaignBuilder';
import { Analytics } from './components/pages/Analytics';
import { EmailTemplates } from './components/pages/EmailTemplates';
import { Settings } from './components/pages/Settings';
import { Research } from './components/pages/Research';

type Page = 'dashboard' | 'leads' | 'campaigns' | 'analytics' | 'templates' | 'settings' | 'research';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;