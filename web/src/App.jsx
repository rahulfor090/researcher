import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, Protected } from './auth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import ArticleDetails from './pages/ArticleDetails';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/" element={<Protected><Dashboard/></Protected>} />
          <Route path="/library" element={<Protected><Library/></Protected>} />
          <Route path="/library/article/:id" element={<Protected><ArticleDetails/></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
