import { useEffect, useState } from 'react';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading categories...</div>;

  return (
    <ul>
      {categories.map(cat => (
        <li key={cat._id}>{cat.name}</li>
      ))}
    </ul>
  );
}
