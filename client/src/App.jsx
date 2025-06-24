import React from 'react';
import PostList from './components/PostList';
import CategoryList from './components/CategoryList';

function App() {
  return (
    <div>
      <h1>MERN Blog</h1>
      <CategoryList />
      <PostList />
      {/* ...other components/routes... */}
    </div>
  );
}

export default App;