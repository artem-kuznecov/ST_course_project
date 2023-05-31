import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Playlist from './containers/Playlist';
import Register from './containers/Register';
import Layout from './hocs/Layout';
import Login from './containers/Login';
import Library from './containers/Library';
import Profile from './containers/Profile';
import UploadSong from './containers/UploadSong';



function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<Navigate to='/login' />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/playlist' element={<Playlist />} />
          <Route path='/library' element={<Library />} />
          <Route path='/library/add' element={<UploadSong />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
