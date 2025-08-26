import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, Protected } from './auth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/" element={<Protected><Dashboard/></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
