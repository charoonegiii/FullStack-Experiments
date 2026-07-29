import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPosts } from './features/posts/postsSlice';
import { fetchPlatforms } from './features/platforms/platformsSlice';
import PostForm from './components/PostForm';
import PostsSummary from './components/PostsSummary';
import ExistingPosts from './components/ExistingPosts';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPlatforms());
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Full Stack Lab Experiment 2</h1>


      {/* <p style={{ textAlign: 'center', color: '#666', marginBottom: 32 }}>
       // Manage posts with Redux Toolkit and React-Redux.
     // </p>
*/}


      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <PostForm />
        <div style={{ flex: 1 }}>
          <PostsSummary />
          <ExistingPosts />
        </div>
      </div>
    </div>
  );
}
