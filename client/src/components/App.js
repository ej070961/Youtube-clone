import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import LandingPage from './views/LandingPage/LandingPage';
import LoginPage from './views/LoginPage/LoginPage';
import RegisterPage from './views/RegisterPage/RegisterPage';
import VideoUploadPage from "./views/VideoUploadPage/VideoUploadPage";
import NavBar from "./views/NavBar/NavBar";
import VideoDetailPage from "./views/VideoDetailPage/VideoDetailPage";
import SubscriptionPage from "./views/SubscriptionPage/SubscriptionPage";

function App() {
  return (
    <BrowserRouter>
    <NavBar/>
    <div style={{ paddingTop: '75px', minHeight: 'calc(100vh - 80px)' }}>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/video/upload" element={<VideoUploadPage/>}/>
          <Route path="/video/:videoId" element={<VideoDetailPage/>}/>
          <Route path="/subscription" element={<SubscriptionPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
