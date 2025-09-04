"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card } from "react-bootstrap";
import { AdminLayout } from "@/app/components/AdminLayout";

export default function PostHistory() {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/posts");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Delete post
  const handleDeletePost = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`/api/posts?id=${id}`);
      fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  // Delete single item inside post
  const handleDeleteItem = async (postId, index) => {
    if (!confirm("Delete this media item?")) return;
    try {
      await axios.delete(`/api/postitems?postId=${postId}&index=${index}`);
      fetchPosts();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  // Save edited labels or title
  const handleSave = async (post) => {
    try {
      await axios.put("/api/postitems", {
        postId: post._id,
        title: post.title ?? "",
        text: post.text ?? "",
        items: post.items?.map((it) => ({
          ...it,
          label: it.label ?? "",
        })),
      });
      setEditingPostId(null);
      fetchPosts();
    } catch (err) {
      console.error("Error saving post:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="container py-4">
        <h2 className="mb-4">Posts History</h2>

        {posts?.map((post) => (
          <div key={post._id} className="singleItem">
            {/* Title */}
            {editingPostId === post._id ? (
              <input
                type="text"
                className="form-control mb-2"
                value={post.title ?? ""}
                onChange={(e) =>
                  setPosts((prev) =>
                    prev.map((p) =>
                      p._id === post._id
                        ? { ...p, title: e.target.value }
                        : p
                    )
                  )
                }
              />
            ) : (
              <h5>{post.title ?? "Untitled Post"}</h5>
            )}

            {/* Text Post */}
            {/* {post.text && <p>{post.text}</p>} */}
            {/* Text Post */}
            {post.text !== undefined && (
              editingPostId === post._id ? (
                <textarea
                  className="form-control mb-2"
                  rows={3}
                  value={post.text ?? ""}
                  onChange={(e) =>
                    setPosts((prev) =>
                      prev.map((p) =>
                        p._id === post._id ? { ...p, text: e.target.value } : p
                      )
                    )
                  }
                />
              ) : (
                <p>{post.text}</p>
              )
            )}

            {/* Media Post */}
            {post.items && post.items.length > 0 && (
              <div className="previewBox">
                {post.items.map((item, index) => (
                  

                    
                      <div className="previewItem" key={index}>
                        <div className="previewContainer">
                          {item.filetype === "image" && (
                            <img
                              src={item.fileuploadedpath}
                              className="thumbnailpreview"
                              alt="media"
                            />
                          )}
                          {item.filetype === "video" && (
                            <video
                              src={item.fileuploadedpath}
                              className="thumbnailpreview"
                              controls
                            />
                          )}
                        </div>

                        <div>
                          {editingPostId === post._id ? (
                            <input
                              type="text"
                              className="form-control mb-2"
                              value={item.label ?? ""}
                              onChange={(e) => {
                                const newLabel = e.target.value;
                                setPosts((prev) =>
                                  prev.map((p) =>
                                    p._id === post._id
                                      ? {
                                        ...p,
                                        items: p.items.map((it, i) =>
                                          i === index
                                            ? { ...it, label: newLabel }
                                            : it
                                        ),
                                      }
                                      : p
                                  )
                                );
                              }}
                            />
                          ) : (
                            <p className="small text-muted">{item.label ?? ""}</p>
                          )}
                        </div>
                        <div>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteItem(post._id, index)}
                          >
                            Delete Item
                          </Button>
                        </div>
                      </div>

                    

                   
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="d-flex gap-2 mt-3">
              {editingPostId === post._id ? (
                <Button variant="success" onClick={() => handleSave(post)}>
                  Save
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setEditingPostId(post._id)}
                >
                  Edit
                </Button>
              )}
              <Button
                variant="danger"
                onClick={() => handleDeletePost(post._id)}
              >
                Delete Post
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
