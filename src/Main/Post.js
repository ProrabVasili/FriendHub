import React from 'react';
import './Post.css'; 

const Post = ({ imgSrc, content, onLike, onDislike }) => (
  <div className="post">
    <img src={imgSrc} alt="Post" />
    <p>{content}</p>
    <div className="actions">
      <button className="like-btn" onClick={onLike}>Like</button>
      <button className="dislike-btn" onClick={onDislike}>Dislike</button>
    </div>
  </div>
);

export default Post;
