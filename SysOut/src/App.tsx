import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import BaseLayout from './Components/Layout/BaseLayout.tsx';
import AuthProvider from './Components/Form/AuthContext.tsx';
import Connect from './Components/Form/connection.tsx';
import ChatLayout from './Components/Layout/ChatLayout.tsx';
import NotFound from './Components/ErrorsPages/NotFound.tsx';
import FriendsLayout from './Components/Layout/FriendsLayout/FriendsLayout.tsx';
import ProfileCard from './Components/Card/ProfileCard.tsx';
import EditLayout from './Components/Layout/EditLayout.tsx';
import ChannelLayout from './Components/Layout/ChannelLayout.tsx';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<BaseLayout />} />
        <Route path="/connectForm" element={<Connect />} />
        <Route path="/chatLayout" element={<ChatLayout selectedReceiver={'Superman'} />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} /> 
        <Route path="/friends" element={<FriendsLayout/>} />
        <Route path="/profile" element={<ProfileCard username={'Khara'}/>} />
        <Route path="/edit" element={<EditLayout />} />
        <Route path="/channelLayout" element={<ChannelLayout selectedChannel={'channelName'} />} />
        <Route path="/FriendMsg" element={<BaseLayout initialSelectedReceiver="Roger" />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;