import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';
import herovideo from '../assets/hero-video.mp4';

function HeroSection() {
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [heroMessage, setHeroMessage] = useState('Brighten Your Smile With Us');

  useEffect(() => {
    const messages = [
      'Brighten Your Smile With Us',
      'Transform Your Dental Care',
      'Smile Confidently Today',
    ];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setHeroMessage(messages[index]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handlePlayVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.play().then(() => {
        setIsVideoPlaying(true);
      }).catch((error) => {
        console.error('Video playback failed:', error);
        setIsVideoPlaying(false);
      });
    }
  };

  return (
    <motion.section
      className="hero-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {!isVideoPlaying && (
        <div className="video-fallback">
          <button className="play-button" onClick={handlePlayVideo} aria-label="Play hero video">
            Play Video
          </button>
          <p className="error-message">Unable to load video. Click to retry.</p>
        </div>
      )}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        poster="/path/to/fallback-image.jpg"
        className="hero-video"
        onError={(e) => {
          console.error('Video error:', e);
          setIsVideoPlaying(false);
        }}
        onCanPlay={() => {
          handlePlayVideo();
        }}
      >
        <source src={herovideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <motion.h1
          className="hero-title fade-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {heroMessage}
        </motion.h1>
        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Expert Dental Care for a Confident Smile
        </motion.p>
        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link to="/booking" className="hero-button primary" aria-label="Book a Re-Examination Appointment">
            Book Now
          </Link>
          <Link to="/services" className="hero-button secondary" aria-label="Learn More About Our Services">
            Discover Services
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}

function ServiceCard({ iconClass, title, description, index }) {
  return (
    <motion.div
      className="service-card group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#FF9999]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none"></div>
      <i className={iconClass} aria-hidden="true"></i>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}

function ServicesSection() {
  const services = [
    { iconClass: "fa-solid fa-tooth", title: "Teeth Cleaning", description: "Precision cleaning for a radiant smile." },
    { iconClass: "fa-solid fa-face-smile", title: "Whitening", description: "Advanced whitening for brilliant teeth." },
    { iconClass: "fa-solid fa-teeth", title: "Orthodontics", description: "Modern solutions for perfect alignment." },
  ];

  return (
    <section className="services-section">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Our Expertise
      </motion.h2>
      <div className="services-grid">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} index={index} />
        ))}
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const reasons = [
    { iconClass: "fa-solid fa-certificate", title: "Certified Experts", description: "Board-certified dental specialists." },
    { iconClass: "fa-solid fa-tools", title: "Advanced Technology", description: "Cutting-edge tools for optimal results." },
    { iconClass: "fa-solid fa-user-friends", title: "Patient-Centric Care", description: "Warm, personalized service." },
  ];

  return (
    <section className="why-choose-us">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Why Choose Us?
      </motion.h2>
      <div className="reasons-grid">
        {reasons.map((reason, index) => (
          <motion.div
            key={index}
            className="reason-card group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#FF9999]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none"></div>
            <i className={reason.iconClass} aria-hidden="true"></i>
            <h3>{reason.title}</h3>
            <p>{reason.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TestimonialSlider() {
  const testimonials = [
    { name: "John Doe", feedback: "Exceptional care transformed my smile!" },
    { name: "Jane Smith", feedback: "Professional and welcoming team." },
    { name: "Mike Johnson", feedback: "Top-notch service, highly recommend!" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: false,
          arrows: false,
        },
      },
    ],
  };

  return (
    <section className="testimonial-section">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Client Testimonials
      </motion.h2>
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <div key={index}>
            <motion.div
              className="testimonial-card flex items-start space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="w-12 h-12 bg-[#FF9999] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <p className="feedback">"{testimonial.feedback}"</p>
                <p className="name">{testimonial.name}</p>
              </div>
            </motion.div>
          </div>
        ))}
      </Slider>
    </section>
  );
}

function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="footer-content">
        <div>
          <h3 className="footer-heading">Dental Clinic</h3>
          <p className="footer-text">Transforming smiles with care and precision.</p>
        </div>
        <div>
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/about" className="footer-link">About</Link></li>
            <li><Link to="/services" className="footer-link">Services</Link></li>
            <li><Link to="/contact" className="footer-link">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="footer-heading">Connect</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Dental Clinic. All rights reserved.</p>
      </div>
    </motion.footer>
  );
}

function Home() {
  return (
    <div className="home-container">
      <Helmet>
        <title>Dental Clinic - Expert Dental Care</title>
        <meta name="description" content="Transform your smile with our professional dental services, including cleaning, whitening, and orthodontics." />
      </Helmet>
      <HeroSection />
      <div className="section-divider"></div>
      <ServicesSection />
      <div className="section-divider"></div>
      <WhyChooseUs />
      <div className="section-divider"></div>
      <TestimonialSlider />
      <div className="section-divider"></div>
      <Footer />
    </div>
  );
}

export default Home;