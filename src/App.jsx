import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- मुख्य पन्ने (Pages) और लेआउट ---
import LoginPage from './pages/LoginPage'; // यह इम्पोर्ट मिसिंग था
import Dashboard from './components/Dashboard';
import DataCollection from './components/DataCollection'; // ऑपरेटर वाला फॉर्म हब
import DataCollectionTable from './components/DataCollectionTable'; // एडमिन वाली टेबल
import AdminReport from './components/AdminReport';
import UserManagement from './components/UserManagement';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// --- सभी 9 अनुभागों का इम्पोर्ट ---
import Anubhag1 from './components/Anubhag1';
import Anubhag2 from './components/Anubhag2';
import Anubhag3 from './components/Anubhag3';
import Anubhag4 from './components/Anubhag4';
import Anubhag5 from './components/Anubhag5';
import Anubhag6 from './components/Anubhag6';
import Anubhag7 from './components/Anubhag7';
import Anubhag8 from './components/Anubhag8';
import Anubhag9 from './components/Anubhag9';

import UserReport from './components/UserReport';
import Settings from './components/Settings'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // लोकल स्टोरेज से रोल और टोकन चेक करें
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  // मास्टर लेआउट (Sidebar + Topbar)
  const Layout = ({ children }) => (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="p-4 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* 1. लॉगिन पेज - अगर पहले से लॉगिन है तो डैशबोर्ड/डाटा कलेक्शन पर भेजें */}
        <Route path="/" element={
          !token ? <LoginPage /> : (userRole === 'admin' ? <Navigate to="/dashboard" /> : <Navigate to="/data-collection" />)
        } />

        {/* 2. सुरक्षित रूट्स (Protected Routes) - सिर्फ लॉगिन होने पर खुलेंगे */}
        {token ? (
          <>
            {/* डैशबोर्ड: एडमिन के लिए असली डैशबोर्ड, यूजर के लिए डाटा कलेक्शन पर रिडायरेक्ट */}
            <Route path="/dashboard" element={
              userRole === 'admin' 
              ? <Layout><Dashboard /></Layout> 
              : <Navigate to="/data-collection" replace />
            } />

            {/* डाटा कलेक्शन: रोल के हिसाब से कंपोनेंट बदल जाएगा */}
            <Route path="/data-collection" element={
              <Layout>
                {userRole === 'admin' ? <DataCollectionTable /> : <DataCollection />}
              </Layout>
            } />

            {/* अनुभाग 1-9 (दोनों देख/भर सकें) */}
            <Route path="/anubhag1" element={<Layout><Anubhag1 /></Layout>} />
            <Route path="/anubhag2" element={<Layout><Anubhag2 /></Layout>} />
            <Route path="/anubhag3" element={<Layout><Anubhag3 /></Layout>} />
            <Route path="/anubhag4" element={<Layout><Anubhag4 /></Layout>} />
            <Route path="/anubhag5" element={<Layout><Anubhag5 /></Layout>} />
            <Route path="/anubhag6" element={<Layout><Anubhag6 /></Layout>} />
            <Route path="/anubhag7" element={<Layout><Anubhag7 /></Layout>} />
            <Route path="/anubhag8" element={<Layout><Anubhag8 /></Layout>} />
            <Route path="/anubhag9" element={<Layout><Anubhag9 /></Layout>} />

            {/* सिर्फ एडमिन के लिए खास पेज */}
            {userRole === 'admin' && (
              <>
                <Route path="/users" element={<Layout><UserManagement /></Layout>} />
                <Route path="/reports" element={<Layout><AdminReport /></Layout>} />
              </>
            )}
            {/* साझा सेटिंग्स (Admin और User दोनों के लिए) */}
            <Route path="/settings" element={<Layout><Settings /></Layout>} />

            {/* सिर्फ यूजर के लिए खास पेज */}
            {userRole === 'user' && (
              <Route path="/user-report" element={<Layout><UserReport /></Layout>} />
            )}

            {/* साझा सेटिंग्स पेज */}
            <Route path="/settings" element={<Layout><div className="p-10 font-bold">सेटिंग्स (पासवर्ड बदलें)</div></Layout>} />
          </>
        ) : (
          // अगर टोकन नहीं है तो किसी भी URL पर लॉगिन पर भेजें
          <Route path="*" element={<Navigate to="/" replace />} />
        )}

        {/* गलत URL हैंडलिंग */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;