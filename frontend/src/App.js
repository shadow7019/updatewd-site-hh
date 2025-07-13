import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { 
  Header, 
  Hero, 
  Services, 
  Products, 
  About, 
  Testimonials, 
  Certifications, 
  Contact, 
  QuoteForm, 
  LoginModal, 
  RegisterModal, 
  Footer 
} from "./components";
import ClientPortal from "./ClientPortal";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Set up axios defaults
axios.defaults.baseURL = API;

// Auth Context
const AuthContext = React.createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/login', { email, password });
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      await fetchUserProfile();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const MainWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { user } = useAuth();

  const helloWorldApi = async () => {
    try {
      const response = await axios.get('/');
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero />
            <Services />
            <Products 
              setSelectedCategory={setSelectedCategory}
              setCurrentPage={setCurrentPage}
              selectedCategory={selectedCategory}
            />
            <About />
            <Testimonials />
            <Certifications />
          </>
        );
      case 'about':
        return <About />;
      case 'services':
        return <Services />;
      case 'products':
        return (
          <Products 
            setSelectedCategory={setSelectedCategory}
            setCurrentPage={setCurrentPage}
            selectedCategory={selectedCategory}
          />
        );
      case 'contact':
        return <Contact />;
      case 'quote':
        return <QuoteForm />;
      default:
        return (
          <>
            <Hero />
            <Services />
            <Products 
              setSelectedCategory={setSelectedCategory}
              setCurrentPage={setCurrentPage}
              selectedCategory={selectedCategory}
            />
            <About />
            <Testimonials />
            <Certifications />
          </>
        );
    }
  };

  return (
    <>
      <Header 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setShowLoginModal={setShowLoginModal}
      />
      <main>
        {renderPage()}
      </main>
      <Footer 
        setCurrentPage={setCurrentPage}
        setShowLoginModal={setShowLoginModal}
      />
      
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}
      
      {showRegisterModal && (
        <RegisterModal 
          onClose={() => setShowRegisterModal(false)}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </>
  );
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainWebsite />} />
            <Route path="/portal/*" element={<ClientPortal />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
