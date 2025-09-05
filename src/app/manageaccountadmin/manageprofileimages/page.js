"use client";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/app/components/AdminLayout";
import { toast } from "react-toastify";

export default function ManageProfileImages() {
  const [images, setImages] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loading, setLoading] = useState(false);

  // Load existing images
  const fetchImages = async () => {
    const res = await fetch("/api/profileimages");
    const data = await res.json();
    if (data.success) {
      const imgMap = {};
      data.data.forEach((item) => {
        imgMap[item.type] = `/${item.imagePath}`;
      });
      setImages(imgMap);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileSelect = (type, file) => {
    if (!file) return;
    setSelectedFiles((prev) => ({ ...prev, [type]: file }));

    // show preview immediately (before upload)
    const previewUrl = URL.createObjectURL(file);
    debugger;
    setImages((prev) => ({ ...prev, [type]: previewUrl }));
  };

  const handleUpload = async (type) => {
    const file = selectedFiles[type];
    if (!file) {
      toast.warning("Please select a file before saving.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("type", type);
    formData.append("file", file);

    const res = await fetch("/api/profileimages", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      await fetchImages(); // refresh UI with stored image
      setSelectedFiles((prev) => ({ ...prev, [type]: null }));
      toast.success(`${type} image updated successfully`);
    } else {
      toast.error(`Error updating ${type} image`);
    }
    setLoading(false);
  };

  const ImageUploader = ({ type, label }) => (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body text-center">
        <h5 className="card-title mb-3 fw-bold">{label}</h5>

        {images[type] ? (
          <img
            //src={`${images[type]}?v=${new Date().getTime()}`}
            src={
              images[type].includes("blob")
                ? images[type]
                : `${images[type]}?v=${new Date().getTime()}`
            }
            alt={`${type} preview`}
            className="img-fluid rounded mb-3"
            style={{ maxWidth: "220px", maxHeight: "220px", objectFit: "cover" }}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center bg-light text-muted rounded mb-3"
            style={{ width: "220px", height: "220px", margin: "0 auto" }}
          >
            No Image
          </div>
        )}

        <div className="d-flex flex-column align-items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleFileSelect(type, e.target.files ? e.target.files[0] : null)
            }
            className="form-control"
            style={{ maxWidth: "300px" }}
          />

          <button
            onClick={() => handleUpload(type)}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-center">Manage Profile Images</h2>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <ImageUploader type="profile" label="Profile Image" />
            {/* <ImageUploader type="cover" label="Cover Image" /> */}
            <ImageUploader type="welcome" label="Welcome Image" />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
