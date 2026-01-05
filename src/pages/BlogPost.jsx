import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'
import './BlogPost.css'

function BlogPost() {
  const { id } = useParams()
  const post = blogPosts.find(p => p.id === parseInt(id))

  if (!post) {
    return (
      <div className="blog-post-page">
        <div className="container">
          <div className="not-found">
            <h1>פוסט לא נמצא</h1>
            <p>הפוסט המבוקש לא קיים.</p>
            <Link to="/blog" className="btn btn-primary">חזור לבלוג</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-post-page">
      <article className="blog-post">
        <div className="blog-post-header">
          <div className="container">
            <Link to="/blog" className="back-link">← חזור לבלוג</Link>
            <div className="blog-post-meta">
              <span className="post-date">{post.date}</span>
              <span className="post-category">{post.category}</span>
            </div>
            <h1 className="blog-post-title">{post.title}</h1>
            <p className="blog-post-subtitle">{post.excerpt}</p>
          </div>
        </div>

        <div className="blog-post-image">
          <div className="post-image-placeholder">
            {post.emoji}
          </div>
        </div>

        <div className="container">
          <div className="blog-post-content">
            {post.content.map((paragraph, index) => (
              <p key={index} className="content-paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="blog-post-footer">
            <div className="post-tags">
              {post.tags && post.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
              <Link to="/blog" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                קרא עוד פוסטים
              </Link>
              <Link to="/#services" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                השירותים שלנו
              </Link>
              <Link to="/#portfolio" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                אתרים שעשינו
              </Link>
              <Link to="/#contact" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                צור קשר
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

export default BlogPost

