"use client";
import { useState, useEffect } from "react";
import "../Styles/Portfolio.css";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaXRay,
} from "react-icons/fa";
import axios from "axios";
import { ArticleTextPost } from "../components/ArticleTextPost";
import { ArticleMediaPost } from "../components/ArticleMediaPost";
import { ContactMe } from "../components/ContactMe";
 

// import { PortfolioHeader } from "../components/PortfolioHeader";

export default function Portfolio() {
  const [about, setAbout] = useState(null);
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAbout(data.data);
        }
      })
      .catch((err) => console.error("Error fetching about:", err));

    fetch("/api/profileimages")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImages(data.data);
        }
      })
      .catch((err) => console.error("Error fetching profile images:", err));
  }, []);

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

  const profileImage = images?.find((img) => img.type === "profile");
  const profileName = about?.name || "";
  const profileImagePath = profileImage
    ? `/${profileImage.imagePath}`
    : "/defaultpic.png";

  const bindPostAuthorHeader = (createdtTime) => {
    let formattedTime = "";

    if (createdtTime) {
      const date = new Date(createdtTime);

      // Convert to IST by using toLocaleString with 'en-IN'
      formattedTime = date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short", // Jan, Feb, etc.
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true, // 12-hour format with AM/PM
      });
    }

    return (
      <div className="post-header">
        <img
          src={profileImagePath}
          alt="mini"
          className="rounded-circle"
          style={{ width: "48px", height: "48px", objectFit: "cover" }}
        />
        <div>
          <div className="fw-bold">{profileName}</div>
          <div className="text-muted small">{formattedTime}</div>
        </div>
      </div>
    );
  };

  const assignClickPopuptoPosts = () => {
    const posts = document.querySelectorAll("article.post-card[data-media]");
    posts?.forEach((post) => {
      const media = JSON.parse(post.getAttribute("data-media"));
      const gallery = post.querySelector(".stack-gallery");
      const show = 4;

      gallery.innerHTML = "";

      media.forEach((m, idx) => {
        if (idx < show) {
          const el = document.createElement("div");
          el.className = "stack-item";
          if (m.type === "image") {
            const img = document.createElement("img");
            img.src = m.src + "?q=80&w=800&auto=format&fit=crop";
            el.appendChild(img);
          } else if (m.type === "video") {
            const vid = document.createElement("video");
            vid.src = m.src;
            vid.muted = true;
            vid.playsInline = true;
            vid.loop = true;
            vid.controls = true;
            el.appendChild(vid);
          } else if (m.type === "audio") {
            // Create wrapper div
            const wrapper = document.createElement("div");
            wrapper.className = "audio-wrapper";

            // Create audio element
            const aud = document.createElement("audio");
            aud.className = "stack-item-audio";
            aud.src = m.src;
            aud.controls = true; // show play/pause UI

            // Append audio inside wrapper
            wrapper.appendChild(aud);

            // Append wrapper inside your stack item
            el.appendChild(wrapper);
          }
          el.addEventListener("click", () => openLightbox(media, idx));
          gallery.appendChild(el);
        }
      });

      if (media.length > show) {
        const el = document.createElement("div");
        el.className = "stack-item";
        const img = document.createElement("img");
        img.src = media[show - 1].src + "?q=80&w=800&auto=format&fit=crop";
        el.appendChild(img);

        const overlay = document.createElement("div");
        overlay.className = "more-overlay";
        overlay.textContent = "+" + (media.length - show + 1);
        el.appendChild(overlay);

        el.addEventListener("click", () => openLightbox(media, show - 1));
        gallery.appendChild(el);
      }
    });
  };

  useEffect(() => {
    if (posts?.length > 0) {
      // Delay to ensure DOM is updated
      setTimeout(() => {
        assignClickPopuptoPosts();
      }, 0);
    }
  }, [posts]);

  function openLightbox(mediaArray, startIndex) {
    const carouselInner = document.getElementById("carouselInner");
    carouselInner.innerHTML = "";
    mediaArray.forEach((m, i) => {
      const slide = document.createElement("div");
      slide.className = "carousel-item" + (i === startIndex ? " active" : "");
      const container = document.createElement("div");
      container.className =
        "d-flex align-items-center justify-content-center modal-media";

      if (m.type === "image") {
        const img = document.createElement("img");
        img.src = m.src + "?q=80&w=1600&auto=format&fit=crop";
        container.appendChild(img);
      } else if (m.type === "video") {
        const vid = document.createElement("video");
        vid.src = m.src;
        vid.controls = true;
        vid.autoplay = false;
        vid.playsInline = true;
        container.appendChild(vid);
      }
      slide.appendChild(container);
      carouselInner.appendChild(slide);
    });
    const modal = new window.bootstrap.Modal(
      document.getElementById("mediaModal")
    );
    modal.show();
  }

  return (
    <div className="bodyPrtfolio">
      <div className="container container-custom">
        {/*   Portfolio header start */}
        <div className="profile-card text-center">
          <div className="d-flex flex-column align-items-center">
            <img
              className="profile-avatar"
              src={
                profileImage
                  ? `/${profileImage.imagePath}`
                  : "/defaultpic.png"
              }
              alt=""
            />
            <div className="mt-3">
              <div className="name-large">{about?.name || "..."}</div>
              <div className="text-muted">{about?.intro || ""}</div>
            </div>
          </div>
          <hr className="my-3" />
          <div className="text-center small text-muted">
            <div className="social-links d-flex gap-3 my-3 centerFlex">
              {about?.facebook && (
                <a
                  href={about.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook size={24} color="#07D0EB" />
                </a>
              )}
              {about?.instagram && (
                <a
                  href={about.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram size={24} color="#EB07D0" />
                </a>
              )}
              {about?.twitter && (
                <a
                  href={about.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaXRay size={24} />
                </a>
              )}
              {about?.youtube && (
                <a
                  href={about.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube size={24} color="#EB0738" />
                </a>
              )}
            </div>
          </div>
          <div className="text-center">
<ContactMe></ContactMe>
          </div>
        </div>
        {/*   Portfolio header end */}

        <div className="posts-masonry">
          {posts?.map((post, index) =>
            post.type === "text" ? (
              <ArticleTextPost
                key={index}
                post={post}
                bindPostAuthorHeader={bindPostAuthorHeader}
              ></ArticleTextPost>
            ) : (
              <ArticleMediaPost
                key={index}
                post={post}
                bindPostAuthorHeader={bindPostAuthorHeader}
              ></ArticleMediaPost>
            )
          )}
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="mediaModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content bg-transparent border-0">
            <div className="modal-body p-0 position-relative modalPreviewBackground">
              <div
                id="mediaCarousel"
                className="carousel slide"
                data-bs-ride="false"
              >
                <div className="carousel-inner" id="carouselInner"></div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#mediaCarousel"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#mediaCarousel"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
              <button
                type="button"
                className="btn btn-light modalcloseButton"
                data-bs-dismiss="modal"
              >
                X
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
