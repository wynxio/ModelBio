import React from 'react'

export const ArticleMediaPost = ({ post, bindPostAuthorHeader }) => {
  // build media array from post.items
  const mediaItems = (post?.items || []).map(item => ({
    type: item.filetype === "video" ? "video" : "image",
    src: item.fileuploadedpath,
    label: item.label || "",
  }))

  return (
    <article
      className="post-card"
      data-media={JSON.stringify(mediaItems)}
    >
      {bindPostAuthorHeader(post.createdTime)}

      <div className="post-body">
        {post.title && <div className="post-title">{post.title}</div>}
        {post.text && <p className="text-muted">{post.text}</p>}
      </div>

      <div className="stack-gallery">
        {/* {mediaItems.map((media, index) => (
          <div key={index} className="stack-item">
            {media.type === "image" ? (
              <img
                src={media.src+'?q=80&w=800&auto=format&fit=crop'}
                alt={media.label || `media-${index}`}
                className="gallery-image"
              />
            ) : (
              <video
                src={media.src+'?q=80&w=800&auto=format&fit=crop'}
                controls
                className="gallery-video"
              />
            )}
          </div>
        ))} */}
      </div>
    </article>
  )
}
