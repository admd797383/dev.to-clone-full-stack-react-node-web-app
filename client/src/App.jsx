import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Article from './pages/Article';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import CreateArticle from './pages/CreateArticle';
import EditArticle from './pages/EditArticle';
import Tags from './pages/Tags';
import TagArticles from './pages/TagArticles';
import ReadingList from './pages/ReadingList';
import SearchResults from './pages/SearchResults';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';

function App() {
  const location = useLocation();
  
  // Pages where sidebars should be hidden/full width
  const fullWidthPages = [
    '/article/',
    '/new-article',
    '/edit-article/',
    '/login',
    '/register'
  ];

  const hideSidebars = fullWidthPages.some(path => location.pathname.includes(path));

  return (
    <div className="app">
      <Navbar />
      <main className={`main-content ${hideSidebars ? 'main-content--full' : ''}`}>
        {!hideSidebars && <LeftSidebar />}
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/:username" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-article" element={<CreateArticle />} />
            <Route path="/edit-article/:id" element={<EditArticle />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/tag/:slug" element={<TagArticles />} />
            <Route path="/reading-list" element={<ReadingList />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </div>
        {!hideSidebars && <RightSidebar />}
      </main>
    </div>
  );
}

export default App;
