import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';

// Staff Views
import HomeView from '../views/HomeView';
import PatientsView from '../views/PatientsView';
import DoctorsView from '../views/DoctorsView';
import RecordsView from '../views/RecordsView';
import AppointmentsView from '../views/AppointmentsView';
import EmployeesView from '../views/EmployeesView';

// Patient Portal Views
import PatientOverview from '../views/PatientPortal/PatientOverview';
import PatientAppointments from '../views/PatientPortal/PatientAppointments';
import PatientRecords from '../views/PatientPortal/PatientRecords';
import PatientProfile from '../views/PatientPortal/PatientProfile';

export default function Dashboard({ onNavigate }) {
  const { session, logout } = useContext(AppContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('home');

  // Guard routing & set defaults
  useEffect(() => {
    if (!session) {
      onNavigate('login');
      return;
    }

    // Default view based on role
    if (session.user.role === 'patient') {
      setActiveView('patient-home');
    } else {
      setActiveView('home');
    }
  }, [session, onNavigate]);

  if (!session) return null;

  const handleLogout = () => {
    logout();
    onNavigate('landing');
  };

  const renderActiveView = () => {
    switch (activeView) {
      // Staff Views
      case 'home':
        return <HomeView />;
      case 'patients':
        return <PatientsView />;
      case 'doctors':
        return <DoctorsView />;
      case 'records':
        return <RecordsView />;
      case 'appointments':
        return <AppointmentsView />;
      case 'employees':
        return <EmployeesView />;

      // Patient Portal Views
      case 'patient-home':
        return <PatientOverview />;
      case 'patient-appointments':
        return <PatientAppointments />;
      case 'patient-records':
        return <PatientRecords />;
      case 'patient-profile':
        return <PatientProfile />;

      default:
        return session.user.role === 'patient' ? <PatientOverview /> : <HomeView />;
    }
  };

  return (
    <div style={styles.dashboardLayout}>
      {/* Collapsible Sidebar */}
      <Sidebar
        role={session.user.role}
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={handleLogout}
        isCollapsed={isCollapsed}
      />

      {/* Main Content Area */}
      <div style={styles.mainContainer}>
        {/* Top Header */}
        <TopHeader
          user={session.user}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          isCollapsed={isCollapsed}
        />

        {/* Dynamic Content Panel */}
        <main className="content-wrapper" style={styles.contentPanel}>
          <div className="container" style={{ padding: 0 }}>
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  dashboardLayout: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    background: 'var(--bg-app)',
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '100vh',
    overflow: 'hidden',
  },
  contentPanel: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '32px',
    background: 'var(--bg-app)',
  }
};
