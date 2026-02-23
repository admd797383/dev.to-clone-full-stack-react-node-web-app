import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for infinite scroll functionality
 * Uses scroll event listener to detect when user scrolls near bottom
 */
const useInfiniteScroll = (fetchMore, threshold = 300, enabled = true) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (loadingRef.current || !hasMore || !enabled) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // Check if user is near bottom (within threshold pixels)
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      loadingRef.current = true;
      setIsLoading(true);
      
      Promise.resolve(fetchMore()).finally(() => {
        loadingRef.current = false;
        setIsLoading(false);
      });
    }
  }, [fetchMore, threshold, enabled, hasMore]);

  // Set up scroll listener
  useEffect(() => {
    if (!enabled || !hasMore) return;

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, enabled, hasMore]);

  const setNoMore = useCallback(() => {
    setHasMore(false);
  }, []);

  const reset = useCallback(() => {
    setHasMore(true);
    setIsLoading(false);
    loadingRef.current = false;
  }, []);

  // Return a dummy ref (not needed with scroll approach)
  const lastElementRef = useCallback((node) => {
    // Not needed for scroll-based approach
  }, []);

  return {
    isLoading,
    hasMore,
    lastElementRef,
    setNoMore,
    reset,
  };
};

export default useInfiniteScroll;
