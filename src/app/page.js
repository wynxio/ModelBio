'use client';

import { useRouter } from "next/navigation";
import '../app/Styles/intro.css';
import { ModalIntroName } from "./common";
import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Home() {
  const [screen, setScreen] = useState('welcome');
  const [about, setAbout] = useState(null);
  const [images, setImages] = useState([]);
  const router = useRouter();

  const gotoPortfolio = () => {
    router.push('/portfolio');
  }
  useEffect(() => {
    // switch screen after 3s
    const timer = setTimeout(() => {
      setScreen('intro');
    }, 3000);

    // fetch about info
    fetch('/api/about')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAbout(data.data);
        }
      })
      .catch((err) => console.error("Error fetching about:", err));

    // fetch profile images
    fetch('/api/profileimages')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImages(data.data);
        }
      })
      .catch((err) => console.error("Error fetching profile images:", err));

    return () => clearTimeout(timer);
  }, []);

  // pick welcome + profile images
  const welcomeImage = images.find((img) => img.type === "welcome");
 

  return (
    <>
      {screen === 'welcome' && (
        <div className="textIntroContainer">
          <div className="intro-container">
            <div className="first-name">{ModalIntroName}</div>
            <div className="glow-line"></div>
            <div className="second-name"></div>
          </div>
        </div>
      )}

      {screen === 'intro' && (
        <div className="welcomescreen">
          <div className="container">
            <div className="row align-items-center justify-content-end">
              <div className="col-12 col-md-4 text-center mb-4 mb-md-0">
                <img
                  src={
                    welcomeImage
                      ? `/${welcomeImage.imagePath}`
                      : "/defaultpic.png"
                  }
                  alt=""
                  className="profile-pic"
                />
              </div>
              <div className="col-12 col-md-6 text-container">
                <h3 className="himessage">HI THERE !</h3>
                <p className="profilename">
                  I'M <span className="name">{about?.name || "Loading..."}</span>
                </p>
                <p className="profile-intro-text">
                  {about?.intro ||""}
                </p>

                {/* Social Links */}
                <div className="social-links d-flex gap-3 my-3">
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

                <button className="portfolio-btn" onClick={() => gotoPortfolio()}>Check My Portfolio</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
