"use client";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/app/components/AdminLayout";
import { toast } from "react-toastify";

export default function ManageAbout() {
  const [name, setName] = useState("");
  const [intro, setIntro] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing data
  const fetchAbout = async () => {
    const res = await fetch("/api/about");
    const data = await res.json();
    if (data.success && data.data) {
      setName(data.data.name || "");
      setIntro(data.data.intro || "");
      setInstagram(data.data.instagram || "");
      setFacebook(data.data.facebook || "");
      setTwitter(data.data.twitter || "");
      setYoutube(data.data.youtube || "");
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/about", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        intro,
        instagram,
        facebook,
        twitter,
        youtube,
      }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("About info saved successfully");
    } else {
      toast.error("Some error happened. Please try again later");
    }

    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 width80">
                <h3 className="card-title mb-4 text-center fw-bold">
                  Manage About Info
                </h3>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Intro</label>
                    <textarea
                      value={intro}
                      onChange={(e) => setIntro(e.target.value)}
                      className="form-control"
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Instagram Profile</label>
                    <input
                      type="url"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="form-control"
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Facebook Profile</label>
                    <input
                      type="url"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      className="form-control"
                      placeholder="https://facebook.com/yourprofile"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Twitter (X) Profile</label>
                    <input
                      type="url"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="form-control"
                      placeholder="https://x.com/yourprofile"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">YouTube Link</label>
                    <input
                      type="url"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      className="form-control"
                      placeholder="https://youtube.com/@yourchannel"
                    />
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
