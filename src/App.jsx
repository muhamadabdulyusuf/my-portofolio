// ====================== IMPORTS ======================
import React, { useState, useEffect, useRef } from "react";

// Pastikan path dan file ini ada di folder Anda
import logoImage from "./assets/ABDUL_COMPANY.png";
import projectImage from "./assets/squre.jpg";
import "./App.css";

// Komponen custom (Pastikan file-file ini ada di folder './component')
import Lanyard from "./component/Lanyard";
import FallingText from "./component/FallingText";
import ScrollReveal from "./component/ScrollReveal";
import LogoLoop from "./component/LogoLoop";

// Library Icons 
import {
  SiWhatsapp,
  SiInstagram,
  SiTiktok,
  SiLinkedin,
  SiGithub,
  SiGmail,
} from "react-icons/si";
// Icon untuk Form Status
import { FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi"; 


// ====================== DATA ======================
const techLogos = [
  { node: <SiWhatsapp />, title: "WhatsApp Communication", href: "https://wa.me/6282320681141" },
  { node: <SiInstagram />, title: "Instagram Management", href: "https://www.instagram.com/ab_duullll/" },
  { node: <SiTiktok />, title: "TikTok Content", href: "https://www.tiktok.com/@abdul.yusuf_va?lang=en-GB" },
  { node: <SiLinkedin />, title: "LinkedIn Outreach", href: "https://www.linkedin.com/in/muhamad-abdul-yusuf-b862b7374/" },
  { node: <SiGmail />, title: "Gmail Management", href: "mailto:muhaamdabdulyusuf73@gmail.com" },
  { node: <SiGithub />, title: "GitHub", href: "https://github.com/muhamadabdulyusuf" },
];

// ====================== CONTACT FORM ======================
function ContactForm() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 
  
  // Kunci Akses Web3Forms diambil dari .env.local 
  // VARIABEL INI HARUS ADA DI .env LOKAL DAN DI KONFIGURASI VERCEL
  const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  
  const onSubmit = async (event) => {
    event.preventDefault();

    // Check untuk menghindari crash saat Vercel Key hilang
    if (!ACCESS_KEY) {
      setResult("Error: Web3Forms access key is missing in .env file. Check VITE_WEB3FORMS_ACCESS_KEY.");
      console.error("Web3Forms ACCESS KEY IS MISSING! (Check Vercel Environment Variables)");
      setIsSubmitting(false); // Pastikan tombol tidak terkunci
      setTimeout(() => setResult(''), 5000); 
      return; 
    }

    setIsSubmitting(true); 
    setResult("Sending...."); 
    
    const formData = new FormData(event.target);
    formData.append("access_key", ACCESS_KEY);
    formData.append("subject", "Pesan Baru dari Portofolio Web Abdul");
    formData.append("botcheck", ""); 

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            setResult("Form Submitted Successfully!");
            event.target.reset();
        } else {
            setResult(data.message || "Error submitting form. Please try again.");
        }
    } catch (error) {
        setResult("Network Error. Please try again later.");
    } finally {
        setIsSubmitting(false); 
        setTimeout(() => setResult(''), 5000); 
    }
  };

  return (
    <form onSubmit={onSubmit} className="contact-form">
      <input type="text" name="name" placeholder="Nama Anda" required disabled={isSubmitting} />
      <input type="email" name="email" placeholder="Email Anda" required disabled={isSubmitting} />
      <textarea name="message" placeholder="Pesan Anda" required disabled={isSubmitting}></textarea>

      <button type="submit" disabled={isSubmitting} className="submit-btn">
          {isSubmitting ? (
              <>
                  <FiLoader className="loading-icon" /> Mengirim...
              </>
          ) : (
              "Submit Form"
          )}
      </button>

      {/* Menampilkan status dengan icon yang lebih visual */}
      {result && result !== "Sending...." && (
        <span className={`form-status ${result.includes("Success") ? 'success' : 'error'}`}>
          {result.includes("Success") ? <FiCheckCircle /> : <FiAlertCircle />} {result}
        </span>
      )}
    </form>
  );
}

// ====================== APP ======================
function App() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navbarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleHamburgerClick = () => {
    setIsNavbarOpen((prev) => !prev);
    if (isSearchVisible) setIsSearchVisible(false);
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    if (isSearchVisible && searchTerm.length > 0) {
      handleSearchSubmit(e);
      return;
    }
    setIsSearchVisible(true);
    setSearchTerm("");
    if (isNavbarOpen) setIsNavbarOpen(false);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchVisible(false);
    setSearchTerm("");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (window.feather) {
        window.feather.replace();
    }

    const handleOutsideClick = (event) => {
      const isClickOnHamburger = hamburgerRef.current?.contains(event.target);
      const isClickOnNavbar = navbarRef.current?.contains(event.target);
      const isClickOnSearchIcon = event.target.closest("#search");
      const isClickOnSearchForm = searchInputRef.current?.closest(".search-form")?.contains(event.target);

      if (isSearchVisible && !isClickOnSearchForm && !isClickOnSearchIcon) {
        setIsSearchVisible(false);
        setSearchTerm("");
      }
      if (!isClickOnNavbar && !isClickOnHamburger && !isClickOnSearchIcon) {
        setIsNavbarOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isNavbarOpen, isSearchVisible]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === "Enter" && isSearchVisible) handleSearchSubmit(e);
    };
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isSearchVisible]);

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo">
          <img src={logoImage} className="navbar-logo" alt="Logo Abdul Company" />
          <a className="navbar-logo-text" href="#home">abdul</a>
        </div>
        <div ref={navbarRef} className={`navbar-nav ${isNavbarOpen ? "active" : ""}`}>
          <a href="#home">Home</a>
          <a href="#about">About Me</a>
          <a href="#service">Service</a>
          <a href="#project">Project</a>
        </div>
        <div className="navbar-extra">
          <div className={`search-form ${isSearchVisible ? "active" : ""}`}>
            <input ref={searchInputRef} type="text" placeholder="Cari..." value={searchTerm} onChange={handleSearchChange} />
          </div>
          <a href="#" id="search" onClick={handleSearchClick}><i data-feather="search"></i></a>
          <button ref={hamburgerRef} className="hamburger-btn" onClick={handleHamburgerClick}><i data-feather="menu"></i></button>
        </div>
      </div>

      {/* HERO */}
      <section className="hero" id="home">
        <main className="content">
          <h1>MUHAMAD <span>ABDUL YUSUF</span></h1>
          <p>Saya adalah seorang profesional di bidang Hospitality dan Virtual Assistant, siap membantu menghadirkan layanan yang efisien, responsif, dan berorientasi pada kebutuhan klien maupun tamu melalui dukungan operasional yang strategis dan pelayanan terbaik.</p>
          <a href="#contact" className="cta">Contact Me</a>
        </main>
      </section>

      <div className="lanyard-wrapper"><Lanyard /></div>

      {/* ABOUT */}
      <section id="about" className="about">
        <h2>About <span>Me</span></h2>
        <div className="about-row">
          <div className="about-content">
            <ScrollReveal baseOpacity={0.1} enableBlur={0} baseRotation={0} blurStrength={0.2}>
              Hai! Saya Muhamad Abdul Yusuf. Berpengalaman di dunia hospitality, berangkat dari Food & Beverage Service. Suka kerja yang dinamis, ketemu banyak orang, dan kasih pelayanan yang bikin tamu merasa nyaman dan puas. Selain itu, saya juga jalanin kerjaan sebagai Virtual Assistant. Biasanya bantu ngatur jadwal, bikin dokumen, riset, atau tugas-tugas ringan lainnya.
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SERVICE */}
      <section id="service" className="service">
        <h2>What I Bring <span>to Your Table</span></h2>
        <div className="demo">
          <FallingText text={"Email Management Administrative Sosial Media Management Excel Word Power Point Hospitality Food and Beverage Service Barista"} highlightWords={["..."]} highlightClass="highlighted" trigger="hover" backgroundColor="transparent" gravity={0.56} mouseConstraintStiffness={0.9} />
        </div>
        <div className="service-cards-container">
          <div className="service-card"><i data-feather="mail" className="service-icon"></i><h3>Email Management</h3><p>Mengatur lalu lintas pesan masuk (inbox), menyusun draf balasan profesional, serta melakukan kurasi email penting agar komunikasi bisnis tetap berjalan lancar.</p><a href="#contact" className="service-cta">Learn More</a></div>
          <div className="service-card"><i data-feather="layers" className="service-icon"></i><h3>Microsoft Office</h3><p>Mahir mengoperasikan Word, Excel, dan PowerPoint untuk mendukung kebutuhan bisnis dan presentasi.</p><a href="#contact" className="service-cta">Learn More</a></div>
          <div className="service-card"><i data-feather="clipboard" className="service-icon"></i><h3>Administrative</h3><p>Menyediakan dukungan operasional mulai dari entri data, manajemen jadwal, hingga pengarsipan dokumen digital.</p><a href="#contact" className="service-cta">Learn More</a></div>
          <div className="service-card"><i data-feather="share-2" className="service-icon"></i><h3>Sosial Media Management</h3><p>Mengelola kehadiran digital melalui perencanaan konten yang konsisten dan memantau interaksi audiens.</p><a href="#contact" className="service-cta">Learn More</a></div>
          <div className="service-card"><i data-feather="pen-tool" className="service-icon"></i><h3>Design</h3><p>Menyediakan jasa desain grafis kreatif untuk kebutuhan promosi, konten media sosial, dan presentasi.</p><a href="#contact" className="service-cta">Learn More</a></div>
          <div className="service-card"><i data-feather="coffee" className="service-icon"></i><h3>Barista</h3><p>Dalam dua bulan perjalanan sebagai barista, saya fokus menjaga konsistensi rasa dan kualitas visual latte art. Meski tergolong singkat, progres ini menjadi pencapaian pribadi bagi saya karena mampu menguasai teknik dan komposisi menu secara cepat dan presisi.</p><a href="#contact" className="service-cta">Learn More</a></div>
          <div className="service-card"><i data-feather="user-check" className="service-icon"></i><h3>Hospitality</h3><p>Memiliki pengalaman operasional yang kuat di bagian F&B Service. Terbiasa menangani Guest Service secara langsung, efisiensi Room Service, hingga koordinasi tim di bagian Banquet. Komitmen saya adalah memberikan pelayanan yang cepat, ramah, dan sesuai standar hospitality</p><a href="#contact" className="service-cta">Learn More</a></div>
        </div>
      </section>

      {/* PROJECT */}
      <section id="project" className="project">
        <h2>My Recent <span>Work</span></h2>
        <p className="project-subheading">Beberapa proyek dan hasil kerja yang menunjukkan keahlian saya.</p>
        <div className="project-row">
          <div className="project-card"><img src={projectImage} alt="Project: Inventory Management" className="project-card-img" /><h3 className="project-card-title">Project: Inventory Management</h3><p className="project-card-description">Sistem inventaris otomatis yang memangkas proses manual. Input data penjualan, sistem menghitung sisa stok dan bahan baku secara real-time menggunakan formula Excel.</p><a href="https://drive.google.com/drive/folders/1QEbfEMCTRlQiKwlsjx_VY4u_67QaNotp?usp=drive_link" className="project-link">Download Now <i data-feather="arrow-right"></i></a></div>
          <div className="project-card"><img src={projectImage} alt="Project: Internal Comms Hub" className="project-card-img" /><h3 className="project-card-title">Project: </h3><p className="project-card-description">Lorem, ipsum dolor.</p><a href="#" className="project-link">Download Now <i data-feather="arrow-right"></i></a></div>
          <div className="project-card"><img src={projectImage} alt="Project: Portofolio Web UI" className="project-card-img" /><h3 className="project-card-title">Project: </h3><p className="project-card-description">Lorem, ipsum dolor.</p><a href="#" className="project-link">Download Now<i data-feather="arrow-right"></i></a></div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <h2>Get In <span>Touch</span></h2>
        <p className="contact-subheading">Tertarik berkolaborasi? Kirimkan pesan melalui formulir di bawah ini.</p>
        <div className="contact-form-container">
          <ContactForm /> 
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div style={{ height: "50px", width: "100%", position: "relative", overflow: "hidden", marginBottom: "20px" }}>
          <LogoLoop logos={techLogos} speed={60} direction="left" logoHeight={25} gap={10} hoverSpeed={0} scaleOnHover={true} fadeOut fadeOutColor="#1A1A1A" ariaLabel="Technology stack used" />
        </div>
        <p>&copy; 2025 Muhamad Abdul Yusuf. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;