import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [error, setError] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Image size must be less than 2MB');
      return;
    }

    setAvatarError('');
    setUploadingAvatar(true);

    try {
      // Convert to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
      });
      
      console.log('Uploading avatar, size:', base64.length);
      
      // Update profile via API
      const response = await api.put('/users/profile', { avatar: base64 });
      console.log('Upload response:', response.data);
      
      if (response.data.success) {
        setProfile(prev => ({
          ...prev,
          avatar: response.data.user.avatar
        }));
        // Also update the user in AuthContext
        updateUser({ avatar: response.data.user.avatar });
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload image';
      setAvatarError(errorMessage);
    } finally {
      setUploadingAvatar(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setError('');
      const response = await api.get(`/users/${username}`);
      setProfile(response.data.user);
      setArticles(response.data.articles || []);
      setFollowing(response.data.user.isFollowing || false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('User not found');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      return;
    }
    try {
      const userId = profile.id || profile._id;
      const response = await api.post(`/users/${userId}/follow`);
      setFollowing(response.data.following);
      // Update followers count
      setProfile(prev => ({
        ...prev,
        followers: response.data.following ? prev.followers + 1 : prev.followers - 1
      }));
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const fetchFollowers = async () => {
    try {
      const userId = profile.id || profile._id;
      const response = await api.get(`/users/${userId}/followers`);
      setFollowers(response.data.followers);
      setShowFollowers(true);
    } catch (err) {
      console.error('Error fetching followers:', err);
    }
  };

  const fetchFollowing = async () => {
    try {
      const userId = profile.id || profile._id;
      const response = await api.get(`/users/${userId}/following`);
      setFollowingList(response.data.following);
      setShowFollowing(true);
    } catch (err) {
      console.error('Error fetching following:', err);
    }
  };

  const handleCloseModal = () => {
    setShowFollowers(false);
    setShowFollowing(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error || !profile) {
    return (
      <div className="form-container">
        <h2>{error || 'User not found'}</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Go Home
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.username === username;

  return (
    <div>
      <div className="profile-header">
        <div className="avatar-container" style={{ position: 'relative', display: 'inline-block', width: '120px', height: '120px' }}>
          <img 
            src={profile.avatar || '/default-avatar.png'} 
            alt={profile.username}
            className="profile-avatar"
            style={{ width: '100%', height: '100%', marginBottom: 0 }}
          />
          {isOwnProfile && (
            <button 
              className="avatar-edit-btn"
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                border: '2px solid white',
                background: 'var(--primary)',
                color: 'white',
                cursor: uploadingAvatar ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: uploadingAvatar ? 0.7 : 1
              }}
              title="Change profile picture"
            >
              {uploadingAvatar ? (
                <span style={{ fontSize: '10px' }}>...</span>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              )}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
        </div>
        {avatarError && (
          <p style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.5rem' }}>{avatarError}</p>
        )}
        
        <h1 className="profile-name">{profile.name || profile.username}</h1>
        <p className="profile-username">@{profile.username}</p>
        
        {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        
        <div className="profile-links">
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="profile-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              Website
            </a>
          )}
          {profile.github && (
            <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="profile-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {profile.github}
            </a>
          )}
          {profile.twitter && (
            <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="profile-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              {profile.twitter}
            </a>
          )}
        </div>

        <div className="profile-stats">
          <div 
            className="profile-stat-clickable" 
            onClick={fetchFollowers}
          >
            <div className="profile-stat-value">{profile.followers || 0}</div>
            <div className="profile-stat-label">Followers</div>
          </div>
          <div 
            className="profile-stat-clickable" 
            onClick={fetchFollowing}
          >
            <div className="profile-stat-value">{profile.following || 0}</div>
            <div className="profile-stat-label">Following</div>
          </div>
        </div>

        {currentUser && !isOwnProfile && (
          <button 
            className={`btn ${following ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleFollow}
            style={{ marginTop: '1rem' }}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        )}

        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Joined {format(new Date(profile.joinedAt), 'MMMM d, yyyy')}
        </p>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>Articles</h2>
      
      <div className="articles-grid">
        {articles && articles.length > 0 ? (
          articles.map(article => (
            <ArticleCard key={article._id} article={article} />
          ))
        ) : (
          <div className="empty-state">
            <h2>No articles yet</h2>
            <p>{isOwnProfile ? 'Start writing your first article!' : 'This user hasn\'t published any articles yet.'}</p>
            {isOwnProfile && (
              <Link to="/new-article" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Write an Article
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Followers Modal */}
      {showFollowers && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Followers</h2>
              <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            </div>
            <div className="modal-body">
              {followers.length > 0 ? (
                <ul className="user-list">
                  {followers.map(user => (
                    <li key={user._id} className="user-list-item">
                      <Link to={`/${user.username}`} onClick={handleCloseModal}>
                        <img 
                          src={user.avatar || 'https://i.pravatar.cc/150?u=default'} 
                          alt={user.username}
                          className="user-list-avatar"
                        />
                        <div className="user-list-info">
                          <div className="user-list-name">{user.name || user.username}</div>
                          <div className="user-list-username">@{user.username}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No followers yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowing && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Following</h2>
              <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            </div>
            <div className="modal-body">
              {followingList.length > 0 ? (
                <ul className="user-list">
                  {followingList.map(user => (
                    <li key={user._id} className="user-list-item">
                      <Link to={`/${user.username}`} onClick={handleCloseModal}>
                        <img 
                          src={user.avatar || 'https://i.pravatar.cc/150?u=default'} 
                          alt={user.username}
                          className="user-list-avatar"
                        />
                        <div className="user-list-info">
                          <div className="user-list-name">{user.name || user.username}</div>
                          <div className="user-list-username">@{user.username}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Not following anyone yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
