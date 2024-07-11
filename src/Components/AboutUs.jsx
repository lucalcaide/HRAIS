import React from 'react';
import lucImage from '../../public/Images/alcaide.jpg'; // Replace with the correct path to your image
import johnImage from '../../public/Images/jrobert.jpg'; // Replace with the correct path to your image

const AboutUs = () => {
  return (
    <div className="about-outer-container">
      <div className="about-container">
        <h1 className="about-title">About Us</h1>

        <section className="about-section">
          <h2 className="section-title">Who We Are</h2>
          <p className="section-text">We are 4th Year BSIT students at the City College of San Fernando, Pampanga, passionate about technology and its transformative power. Our journey in Information Technology has equipped us with the skills and knowledge to tackle real-world problems through innovative solutions.</p>
        </section>

        <section className="about-section">
          <h2 className="section-title">Our Team</h2>
          <div className="team-member">
            <img src={johnImage} alt="John Robert G. Reyes" className="team-member-image" />
            <h3 className="member-name">John Robert G. Reyes</h3>
            <p className="member-description">John Robert is the brain behind the HRIS system for R.C. Ramos Construction Corp. With his wholehearted dedication and hard work, he designed and developed the system, ensuring it meets the needs and standards of the company.</p>
          </div>
          <div className="team-member">
            <img src={lucImage} alt="Luc Erich Oliver P. Alcaide" className="team-member-image" />
            <h3 className="member-name">Luc Erich Oliver P. Alcaide</h3>
            <p className="member-description">Luc played a pivotal role in assisting John Robert in developing the HRIS system for R.C. Ramos Construction Corp, bringing a collaborative approach to the project.</p>
          </div>
        </section>

        <section className="about-section">
          <h2 className="section-title">Our Vision</h2>
          <p className="section-text">Our vision is to become leading IT professionals who can contribute to the advancement of technology and innovation. We aim to leverage our skills to create solutions that not only address current challenges but also anticipate future needs.</p>
        </section>

        <section className="about-section">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-text">If you would like to connect with us, please feel free to reach out via email:</p>
          <ul className="contact-list">
            <li><a href="mailto:alcaideluc22@gmail.com" className="contact-link">Luc Erich Oliver P. Alcaide: alcaideluc22@gmail.com</a></li>
            <li><a href="mailto:jhnrbrtrys27@gmail.com" className="contact-link">John Robert G. Reyes: jhnrbrtrys27@gmail.com</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;
