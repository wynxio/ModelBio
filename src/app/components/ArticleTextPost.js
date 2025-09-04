// TextPost.js
export const ArticleTextPost = ({ post, bindPostAuthorHeader }) => {
  return (
    <article className="post-card">
      {bindPostAuthorHeader(post.createdTime)}
      <div className="post-body">
        <div className="post-title">{post.title}</div>
        <p className="mb-1 text-muted">{post.text}</p>
      </div>
    </article>
  );
};
