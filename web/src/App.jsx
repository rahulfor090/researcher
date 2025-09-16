import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, Protected } from './auth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Collection from './pages/Collection';
import CollectionDetail from './pages/CollectionDetail';
import CollectionAssign from './pages/CollectionAssign';
import Settings from './pages/Settings'
import ArticleDetails from './pages/ArticleDetails';
import Authors from './pages/Authors';
import About from './pages/About';
import Home from './pages/Home';
import AuthSuccess from './pages/AuthSuccess';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import HashTags from './pages/hashTags';
import ArticlesByTag from './components/ArticlesByTag';
import Upgrade from './pages/upgrade';
import PremiumPayment from './pages/PremiumPayment';
import ThankYou from './pages/ThankYou';
import PaypalSuccess from './pages/PaypalSuccess';
import PaypalCancel from './pages/PaypalCancel';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<Protected><Dashboard/></Protected>} />
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Protected><Library/></Protected>} />
          <Route path="/collection" element={<Protected><Collection/></Protected>} />
          <Route path="/collection/:id" element={<Protected><CollectionDetail/></Protected>} />
          <Route path="/collection/:id/assign" element={<Protected><CollectionAssign/></Protected>} />
          <Route path="/authors" element={<Protected><Authors/></Protected>} />
          <Route path="/library/article/:id" element={<Protected><ArticleDetails/></Protected>} />
          <Route path="/article/:id" element={<Protected><ArticleDetails/></Protected>} />
          <Route path="/settings" element={<Protected><Settings/></Protected>} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/hashtags" element={<Protected><HashTags/></Protected>} />
          <Route path="/hashtags/:id" element={<Protected><ArticlesByTag/></Protected>} />
          <Route path="/premium-payment" element={<Protected><PremiumPayment/></Protected>} />
          <Route path="/thank-you" element={<Protected><ThankYou/></Protected>} />
          <Route path="/paypal-success" element={<Protected><PaypalSuccess/></Protected>} />  
          <Route path="/paypal-cancel" element={<Protected><PaypalCancel/></Protected>} />
          <Route path="/upgrade" element={<Upgrade/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}