import React from 'react'
import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'
import './Blog.css'

function Blog() {
  return (
    <div className="blog-page">
      <div className="blog-header">
        <div className="container">
          <h1>בלוג</h1>
          <p>טיפים, מדריכים וחדשות מעולם בניית האתרים</p>
        </div>
      </div>

      <div className="container">
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-card-image">
                <div className="blog-image-placeholder">
                  {post.emoji}
                </div>
              </div>
              <div className="blog-card-content">
                <div className="blog-meta">
                  <span className="blog-date">{post.date}</span>
                  <span className="blog-category">{post.category}</span>
                </div>
                <h2 className="blog-card-title">
                  <Link to={`/busiparo/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <Link to={`/busiparo/blog/${post.id}`} className="blog-read-more">
                  קרא עוד →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blog

