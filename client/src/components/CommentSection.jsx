import { useEffect, useState } from 'react';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`/api/comments/${postId}`)
      .then(res => res.json())
      .then(setComments);
  }, [postId]);

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/comments/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ text })
    });
    if (res.ok) {
      const comment = await res.json();
      setComments(prev => [...prev, comment]);
      setText('');
    } else {
      setMsg('Failed to add comment');
    }
  };

  return (
    <div>
      <h4>Comments</h4>
      <ul>
        {comments.map(c => (
          <li key={c._id}>{c.text}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Add comment" />
        <button type="submit">Post</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
