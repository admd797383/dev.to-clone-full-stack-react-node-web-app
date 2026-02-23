// Skeleton Loader Component
// Provides various skeleton placeholders for loading states

// Basic skeleton line
export const SkeletonLine = ({ width = '100%', height = '1rem', style = {} }) => (
  <div 
    className="skeleton-line" 
    style={{ width, height, ...style }} 
  />
);

// Skeleton circle (for avatars)
export const SkeletonCircle = ({ size = '40px', style = {} }) => (
  <div 
    className="skeleton-circle" 
    style={{ width: size, height: size, ...style }} 
  />
);

// Skeleton rectangle (for cover images, cards)
export const SkeletonRectangle = ({ width = '100%', height = '200px', style = {} }) => (
  <div 
    className="skeleton-rectangle" 
    style={{ width, height, ...style }} 
  />
);

// Article Card Skeleton
export const ArticleCardSkeleton = () => (
  <div className="article-card-skeleton">
    <SkeletonRectangle height="160px" style={{ borderRadius: 'var(--border-radius) var(--border-radius) 0 0' }} />
    <div className="article-card-skeleton-content">
      <SkeletonLine width="30%" height="0.75rem" style={{ marginBottom: '0.5rem' }} />
      <SkeletonLine width="90%" height="1.25rem" style={{ marginBottom: '0.5rem' }} />
      <SkeletonLine width="70%" height="1rem" style={{ marginBottom: '1rem' }} />
      <div className="article-card-skeleton-meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SkeletonCircle size="24px" />
          <SkeletonLine width="80px" height="0.75rem" />
        </div>
        <SkeletonLine width="60px" height="0.75rem" />
      </div>
    </div>
  </div>
);

// Article View Skeleton (for Article page)
export const ArticleViewSkeleton = () => (
  <div className="article-view-skeleton">
    <SkeletonLine width="80%" height="2rem" style={{ marginBottom: '1rem' }} />
    <div className="article-view-skeleton-meta">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <SkeletonCircle size="48px" />
        <div>
          <SkeletonLine width="120px" height="1rem" style={{ marginBottom: '0.25rem' }} />
          <SkeletonLine width="80px" height="0.75rem" />
        </div>
      </div>
    </div>
    <SkeletonRectangle height="300px" style={{ margin: '1.5rem 0' }} />
    <div className="article-view-skeleton-content">
      <SkeletonLine width="100%" height="1rem" style={{ marginBottom: '0.5rem' }} />
      <SkeletonLine width="100%" height="1rem" style={{ marginBottom: '0.5rem' }} />
      <SkeletonLine width="90%" height="1rem" style={{ marginBottom: '0.5rem' }} />
      <SkeletonLine width="95%" height="1rem" style={{ marginBottom: '0.5rem' }} />
      <SkeletonLine width="85%" height="1rem" style={{ marginBottom: '0.5rem' }} />
      <SkeletonLine width="100%" height="1rem" style={{ marginBottom: '0.5rem' }} />
      <SkeletonLine width="75%" height="1rem" />
    </div>
  </div>
);

// Profile Skeleton
export const ProfileSkeleton = () => (
  <div className="profile-skeleton">
    <div className="profile-skeleton-header">
      <SkeletonCircle size="120px" />
      <SkeletonLine width="200px" height="1.5rem" style={{ marginTop: '1rem' }} />
      <SkeletonLine width="120px" height="1rem" style={{ marginTop: '0.5rem' }} />
      <SkeletonLine width="300px" height="1rem" style={{ marginTop: '1rem' }} />
      <div className="profile-skeleton-stats" style={{ marginTop: '1.5rem' }}>
        <SkeletonLine width="80px" height="2rem" />
        <SkeletonLine width="80px" height="2rem" />
      </div>
    </div>
    <div className="profile-skeleton-articles" style={{ marginTop: '2rem' }}>
      <SkeletonLine width="150px" height="1.5rem" style={{ marginBottom: '1rem' }} />
      <div className="articles-grid">
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
      </div>
    </div>
  </div>
);

// Comment Skeleton
export const CommentSkeleton = () => (
  <div className="comment-skeleton">
    <div className="comment-skeleton-header">
      <SkeletonCircle size="32px" />
      <SkeletonLine width="100px" height="0.875rem" style={{ marginLeft: '0.5rem' }} />
      <SkeletonLine width="60px" height="0.75rem" style={{ marginLeft: 'auto' }} />
    </div>
    <SkeletonLine width="100%" height="1rem" style={{ marginTop: '0.5rem' }} />
    <SkeletonLine width="85%" height="1rem" style={{ marginTop: '0.5rem' }} />
  </div>
);

// Dashboard Skeleton
export const DashboardSkeleton = () => (
  <div className="dashboard-skeleton">
    <div className="dashboard-skeleton-header">
      <SkeletonLine width="150px" height="2rem" />
      <SkeletonLine width="150px" height="2.5rem" style={{ marginLeft: 'auto' }} />
    </div>
    <div className="dashboard-skeleton-tabs" style={{ marginTop: '1.5rem' }}>
      <SkeletonLine width="120px" height="2.5rem" />
      <SkeletonLine width="120px" height="2.5rem" style={{ marginLeft: '1rem' }} />
    </div>
    <div className="dashboard-skeleton-content" style={{ marginTop: '1.5rem' }}>
      <div className="articles-grid">
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
      </div>
    </div>
  </div>
);

// Tag Header Skeleton
export const TagHeaderSkeleton = () => (
  <div className="tag-header-skeleton">
    <SkeletonLine width="150px" height="2rem" />
    <SkeletonLine width="300px" height="1rem" style={{ marginTop: '0.5rem' }} />
    <SkeletonLine width="100px" height="0.875rem" style={{ marginTop: '0.5rem' }} />
  </div>
);

// Search Results Skeleton
export const SearchResultsSkeleton = () => (
  <div className="search-results-skeleton">
    <SkeletonLine width="250px" height="1.5rem" />
    <SkeletonLine width="100px" height="1rem" style={{ marginTop: '0.5rem' }} />
    <div className="articles-grid" style={{ marginTop: '1.5rem' }}>
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
    </div>
  </div>
);

// Reading List Skeleton
export const ReadingListSkeleton = () => (
  <div className="reading-list-skeleton">
    <SkeletonLine width="150px" height="2rem" style={{ marginBottom: '1.5rem' }} />
    <div className="articles-grid">
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
    </div>
  </div>
);

export default {
  SkeletonLine,
  SkeletonCircle,
  SkeletonRectangle,
  ArticleCardSkeleton,
  ArticleViewSkeleton,
  ProfileSkeleton,
  CommentSkeleton,
  DashboardSkeleton,
  TagHeaderSkeleton,
  SearchResultsSkeleton,
  ReadingListSkeleton
};
