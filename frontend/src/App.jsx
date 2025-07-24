import {Routes, Route, Navigate} from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import SettingPage from './pages/settingPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { useEffect } from 'react';
import {Loader} from 'lucide-react';
import {Toaster} from 'react-hot-toast';

const App = () => {
  //1.check auth and fetch auth data
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

  //3.for change the theme
  const { theme } = useThemeStore();
    
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  

  //2.create some animatation while loading authUser
  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin' />
    </div>
  )
  
  return (
    <div data-theme={theme}>
      <Navbar />
      
      {/*Create route*/}
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to='/' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/settings' element={<SettingPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
