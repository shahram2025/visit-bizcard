import React, { useEffect, useRef } from 'react';
import { FaAppStoreIos, FaGooglePlay } from "react-icons/fa";
import styles from './CustomerReview.module.css';

function CustomerReview() {
  const testimonials = [
    {
      id: 1,
      rating: 5,
      text: "Solar analysis has never been easier, and I love how it integrates seamlessly with our ERP system.",
      author: "Sarah K., Energy Manager",
      source: "App Store"
    },
    {
      id: 2,
      rating: 4,
      text: "Saves us hours of manual calculations and keeps all financial projections in one place.",
      author: "Michael T., CFO",
      source: "Google Play"
    },
    {
      id: 3,
      rating: 5,
      text: "Sharing reports via QR code has revolutionized how we present to investors.",
      author: "David L., Solar Consultant",
      source: "App Store"
    },
    {
      id: 4,
      rating: 5,
      text: "The most accurate solar investment calculator we've used for our factories.",
      author: "Emma R., Operations Director",
      source: "Google Play"
    }
  ];

  const marqueeRef = useRef(null);
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const containerWidth = marquee.parentElement.offsetWidth;
    const itemWidth = 320; // Card width + margin
    const speed = 0.5; // pixels per frame
    let position = 0;
    let animationFrame;

    const animate = () => {
      position -= speed;
      if (position <= -itemWidth * testimonials.length) {
        position = 0;
      }
      marquee.style.transform = `translateX(${position}px)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return (
      <div className={styles.starRating}>
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`${styles.star} ${i < rating ? styles.filled : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>What Our Customers Say</h2>
          <p className={styles.subtitle}>15,000+ happy users across platforms</p>
        </div>
        
        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeContainer}>
            <div 
              ref={marqueeRef}
              className={styles.marqueeTrack}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <div className={styles.testimonialCard} key={`${testimonial.id}-${index}`}>
                  {renderStars(testimonial.rating)}
                  <p className={styles.testimonialText}>"{testimonial.text}"</p>
                  <div className={styles.testimonialSource}>
                    {testimonial.source === "App Store" ? (
                      <FaAppStoreIos className={styles.storeIcon} />
                    ) : (
                      <FaGooglePlay className={styles.storeIcon} />
                    )}
                    <span>{testimonial.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.downloadCta}>
          <h3 className={styles.ctaTitle}>Available on all platforms</h3>
          <div className={styles.storeButtons}>
            <a href="#app-store" className={styles.storeButton}>
              <FaAppStoreIos className={styles.buttonIcon} />
              <span>App Store</span>
            </a>
            <a href="#play-store" className={styles.storeButton}>
              <FaGooglePlay className={styles.buttonIcon} />
              <span>Google Play</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomerReview;