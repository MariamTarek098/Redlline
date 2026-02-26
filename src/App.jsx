import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login'; 
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import NotFound from './components/NotFound/NotFound';
import Profile from './components/profile/Profile';
import AuthContextProvider from './components/context/AuthContext';
import ProtectRoute from './components/protect/ProtectRoute';
import GuesttRoute from './components/protect/GuestRoute';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDetails from './components/post/PostDetails';
import { Toaster } from "react-hot-toast";
import { Offline } from "react-detect-offline";
import { FiWifiOff } from 'react-icons/fi'; 
import Settings from './components/settings/Settings';
import Notifications from './components/Notification/Notifications';


const routes = createBrowserRouter([
  {path: "", element: <Layout/>, children:[
    {index: true, element:<ProtectRoute> <Home/> </ProtectRoute> },
    {path: "home", element: <ProtectRoute> <Home/> </ProtectRoute> },
    {path: "login", element: <GuesttRoute> <Login/></GuesttRoute>},
    {path: "register", element:<GuesttRoute> <Register/> </GuesttRoute> },
    {path: "profile", element: <ProtectRoute> <Profile/> </ProtectRoute> },
    {path: "settings", element: <ProtectRoute> <Settings/> </ProtectRoute> },
    {path: "notifications", element: <ProtectRoute> <Notifications/> </ProtectRoute> },
    {path: "postDetails/:id", element: <ProtectRoute> <PostDetails/> </ProtectRoute> },
    {path: "*", element: <NotFound/>},
  ]},


])

const queryClient = new QueryClient();


export default function App() {
  return (
    <>
    <QueryClientProvider client={queryClient}>

    <AuthContextProvider>
    <RouterProvider router={routes}/>
<Toaster
  position="bottom-right"
  reverseOrder={false}
  toastOptions={{
    duration: 4000, // default 4s for all toasts
    style: {
      border: '1px solid #ff4b4b',  // red border
      padding: '16px',
      color: '#fff',                 // white text
      background: '#18181b',         // dark background
      borderRadius: '12px',
      fontWeight: '500',
      boxShadow: '0 4px 12px rgba(255, 75, 75, 0.3)',
    },
    success: {
      iconTheme: {
        primary: '#ff4b4b',  // red icon
        secondary: '#18181b', // same as background
      },
    },
    error: {
      iconTheme: {
        primary: '#ff4b4b',  // red icon
        secondary: '#18181b',
      },
    },
  }}
/>

    </AuthContextProvider>

    </QueryClientProvider>

    
   <Offline>
    
<div className="fixed bottom-10 right-10 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300">
  <div className="bg-zinc-900 border border-red-600/30 shadow-2xl shadow-red-600/10 rounded-2xl px-5 py-3 flex items-center gap-3">
    
    {/* Red Icon Background Pill */}
    <div className="bg-red-500/10 p-2 rounded-full">
      <FiWifiOff className="text-red-500" size={18} />
    </div>
    
    {/* Text */}
    <p className="text-zinc-100 font-medium text-sm tracking-wide">
      You are currently offline
    </p>

  </div>
</div>
    </Offline> 
    </>
  )
}

