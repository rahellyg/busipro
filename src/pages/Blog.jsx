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
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <Link to={`/blog/${post.id}`} className="blog-read-more">
                  קרא עוד →
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="blog-navigation" style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '2px solid #e2e8f0', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '2rem', color: 'var(--text-dark)', fontSize: '1.5rem' }}>גלה עוד</h3>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/#services" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              השירותים שלנו
            </Link>
            <Link to="/#portfolio" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              אתרים שעשינו
            </Link>
            <Link to="/#contact" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              צור קשר
            </Link>
            <Link to="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog

