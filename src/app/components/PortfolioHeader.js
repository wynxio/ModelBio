import React, { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { ContactMe } from "./ContactMe";


export const PortfolioHeader = () => {
    const [about, setAbout] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch('/api/about')
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setAbout(data.data);
                }
            })
            .catch((err) => console.error("Error fetching about:", err));



        fetch('/api/profileimages')
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setImages(data.data);
                }
            })
            .catch((err) => console.error("Error fetching profile images:", err));

    }, [])

     const profileImage = images?.find((img) => img.type === "profile");
 

    return (
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
                    <div className="name-large">{about?.name || "Loading..."}</div>
                    <div className="text-muted">{about?.intro ||""}</div>
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
                      <FaFacebook size={24} />
                    </a>
                  )}
                  {about?.instagram && (
                    <a
                      href={about.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram size={24} />
                    </a>
                  )}
                  {about?.twitter && (
                    <a
                      href={about.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTwitter size={24} />
                    </a>
                  )}
                  {about?.youtube && (
                    <a
                      href={about.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaYoutube size={24} />
                    </a>
                  )}
                </div>
            </div>
            <div className="text-center">
                    <ContactMe></ContactMe>
            </div>
        </div>
    )
}
