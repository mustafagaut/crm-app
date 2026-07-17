import { Routes, Route, Navigate,BrowserRouter} from 'react-router-dom';
import Layout from './components/Layout';
import ContactsPage from './pages/ContactsPage';
import LogsPage from './pages/LogsPage';
import LoginPage from './pages/LoginPage'; // Assuming your login component path
import SignupPage from './pages/SignupPage'; // Assuming your signup component path
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
   
    <Routes>
      {/* Public Authentication Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 
        Protected Contacts Route: Accessible by both 'User' and 'Admin'.
        Wrapped in ProtectedRoute to enforce user login session.
      */}
      <Route 
        path="/contacts" 
        element={
          <ProtectedRoute>
            <Layout>
              <ContactsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* 
        ADMIN-ONLY Protected Route: Fulfills the Core Activity Logs Requirement.
        Passing allowedRoles={['Admin']} ensures regular Users get blocked.
      */}
      <Route 
        path="/logs" 
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <Layout>
              <LogsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* Fallbacks & Catch-All Redirection */}
      <Route path="/" element={<Navigate to="/contacts" replace />} />
      <Route path="*" element={<Navigate to="/contacts" replace />} />
    </Routes>
     </BrowserRouter>
  );
}

export default App;