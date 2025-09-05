"use client";
import { useState } from "react";
import { AdminLayout } from "@/app/components/AdminLayout";
import axios from "axios";
import { toast } from "react-toastify";


export default function ManagePosts() {
  const [postType, setPostType] = useState("media");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [mediaItems, setMediaItems] = useState([{ file: null, label: "" }]);
  const [message, setMessage] = useState("");

  const handleAddMedia = () => {
    setMediaItems([...mediaItems, { file: null, label: "" }]);
  };

  const handleFileChange = (index, file) => {
    const newItems = [...mediaItems];
    newItems[index].file = file;
    setMediaItems(newItems);
  };

  const handleLabelChange = (index, label) => {
    const newItems = [...mediaItems];
    newItems[index].label = label;
    setMediaItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (postType === "text") {
        if(title === "" && text === "") {
          alert('heading or subheading is must for text post');
        }
        else{
        const res = await axios.post("/api/posts", { title, text });
        setMessage(res.data.message);
        toast.success(res.data.message);
        }
      
      } else {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("text", text);
        mediaItems?.forEach((item, i) => {
          if (item.file) {
            formData.append(`file-${i}`, item.file);
            formData.append(`label-${i}`, item.label);
          }
        });

       

        if(mediaItems[0]?.file === null) {
          alert('please select valid image/video');
        }
        else{
 const res = await axios.post("/api/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage(res.data.message);
        toast.success(res.data.message);
        }

       
      }

      // Reset form after success
      setTitle("");
      setText("");
      setMediaItems([{ file: null, label: "" }]);
    } catch (err) {
      setMessage("Error saving post. Please try again.");
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h3 className="mb-4">Create a New Post</h3>

        {message && (
          <div className="alert alert-info" role="alert">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          {/* Dropdown */}
          <div className="mb-3">
            <label className="form-label">Select Post Type</label>
            <select
              className="form-select"
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
            >
              
              <option value="media">Photos or Videos</option>
              <option value="text">Text</option>
            </select>
          </div>

          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Heading</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              
            />
          </div>

          {/* Text Post */}
          
            <div className="mb-3">
              <label className="form-label">Sub Heading</label>
              <textarea
                className="form-control"
                rows="4"
                value={text}
                onChange={(e) => setText(e.target.value)}
                
              ></textarea>
            </div>
          

          {/* Media Post */}
          {postType === "media" && (
            <div className="mb-3">
              <label className="form-label">Upload Files</label>
              {mediaItems.map((item, index) => (
                <div key={index} className="border rounded p-3 mb-3 bg-light">
                  <input
                    type="file"
                    className="form-control mb-2"
                    accept="image/*,video/*,audio/*"
                    onChange={(e) =>
                      handleFileChange(index, e.target.files[0])
                    }
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter label"
                    value={item.label}
                    onChange={(e) => handleLabelChange(index, e.target.value)}
                  />
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleAddMedia}
              >
                + Add More
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            Save Post
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
