import logoImage from "./assets/ABDUL_COMPANY.png";
import serviceImage from "./assets/1757928406747.png";
import projectImage from "./assets/squre.jpg";

import { useState, useEffect, useRef } from "react";
import "./App.css";

// Komponen kustom
import Lanyard from "./component/Lanyard";
import FallingText from "./component/FallingText";
import ScrollReveal from "./component/ScrollReveal";
import LogoLoop from "./component/LogoLoop";

import {
  SiWhatsapp,
  SiInstagram,
  SiTiktok,
  SiLinkedin,
  SiGithub,
  SiGmail,
} from "react-icons/si";

const techLogos = [
  { node: <SiWhatsapp />, title: "WhatsApp Communication", href: "https://wa.me/6282320681141" },
  { node: <SiInstagram />, title: "Instagram Management", href: "https://www.instagram.com/ab_duullll/" },
  { node: <SiTiktok />, title: "TikTok Content", href: "https://www.tiktok.com/@abdul.yusuf_va?lang=en-GB" },
  { node: <SiLinkedin />, title: "LinkedIn Outreach", href: "https://www.linkedin.com/in/muhamad-abdul-yusuf-b862b7374/" },
  { node: <SiGmail />, title: "Gmail Management", href: "mailto:muhaamdabdulyusuf73@gmail.com" },
  { node: <SiGithub />, title: "GitHub", href: "https://github.com/muhamadabdulyusuf" },
];

function App() {
  // ====================== STATE MANAGEMENT =======================
  
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const navbarRef = useRef(null);
  const hamburgerRef = useRef(null);
  
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const searchInputRef = useRef(null); 

  // ====================== HANDLER FUNCTIONS =======================
  
  const handleHamburgerClick = () => {
    setIsNavbarOpen((prev) => !prev);
    if (isSearchVisible) setIsSearchVisible(false);
  };
  
  // ✅ HANDLER BARU: MEMBUKA KOTAK PENCARIAN
  const handleSearchClick = (e) => {
      e.preventDefault(); 
      
      // Jika sudah terlihat (dan ada teks), panggil submit
      if (isSearchVisible && searchTerm.length > 0) {
          handleSearchSubmit(e);
          return;
      }
      
      // Buka kotak (tanpa reset jika sudah terbuka, tapi kali ini kita paksa buka)
      setIsSearchVisible(true); 
      setSearchTerm(''); 
      if (isNavbarOpen) setIsNavbarOpen(false); 

      // Fokuskan input setelah elemen diaktifkan oleh CSS
      setTimeout(() => {
          searchInputRef.current?.focus();
      }, 50); 
  };
  
  // ✅ HANDLER BARU: SUBMIT (DI PANGGIL DENGAN KLIK IKON LAGI)
  const handleSearchSubmit = (e) => {
      e.preventDefault(); 
      
      // Sembunyikan kotak dan hapus pencarian
      setIsSearchVisible(false);
      setSearchTerm(''); // Ini akan memicu filter untuk menampilkan semua
  };

  const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
  };
  
  // ====================== EFFECT HOOKS (Filtering & Feather) =======================

  useEffect(() => {
    // Logika Filtering Konten
    if (searchTerm.length > 0) {
        const query = searchTerm.toLowerCase();
        
        const searchableSections = document.querySelectorAll(
            '#about, #service, #project, #contact, .hero' 
        );

        searchableSections.forEach(section => {
            const textContent = section.textContent.toLowerCase();
            
            if (textContent.includes(query)) {
                section.classList.remove('hide-on-search');
            } else {
                section.classList.add('hide-on-search');
            }
        });
    } else {
        // Tampilkan semua jika kotak pencarian kosong
        document.querySelectorAll('.hide-on-search').forEach(element => {
            element.classList.remove('hide-on-search');
        });
    }
    
    // Handler klik di luar
    function handleOutsideClick(event) {
      const isClickOnHamburger = hamburgerRef.current && hamburgerRef.current.contains(event.target);
      const isClickOnNavbar = navbarRef.current && navbarRef.current.contains(event.target);
      const isClickOnSearchIcon = event.target.closest('#search');
      
      const isClickOnSearchForm = searchInputRef.current && searchInputRef.current.closest('.search-form')?.contains(event.target);

      // Jika Search terlihat dan klik di luar input DAN ikon search, sembunyikan
      if (isSearchVisible && !isClickOnSearchForm && !isClickOnSearchIcon) {
          setIsSearchVisible(false);
          setSearchTerm('');
      }


      if (!isClickOnNavbar && !isClickOnHamburger && !isClickOnSearchIcon) {
        setIsNavbarOpen(false);
      }
    }

    document.addEventListener("click", handleOutsideClick);
    return () => {
        document.removeEventListener("click", handleOutsideClick);
    };
  }, [isNavbarOpen, searchTerm, isSearchVisible]); 


  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
    // Tambahkan event listener untuk Enter di seluruh dokumen
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Enter' && isSearchVisible) {
        handleSearchSubmit(e);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
        document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isSearchVisible, searchTerm]); // Tambahkan searchTerm sebagai dependency agar submit bisa melihat nilainya

  return (
    <>
      {/* ========================================= NAVBAR ========================================= */}
      <div className="navbar">
        <div className="logo">
          <img
            className="navbar-logo"
            src={logoImage}
            alt="Logo Abdul Company"
          />
          <a className="navbar-logo-text" href="#home">
            abdul
          </a>
        </div>

        <div
          ref={navbarRef}
          className={`navbar-nav ${isNavbarOpen ? "active" : ""}`}
        >
          <a href="#home">Home</a>
          <a href="#about">About Me</a>
          <a href="#service">Service</a>
          <a href="#project">Project</a>
        </div>

        <div className="navbar-extra">
          {/* ✅ KOTAK SEARCH MENGGUNAKAN CLASS ACTIVE */}
          <div className={`search-form ${isSearchVisible ? 'active' : ''}`}>
              <input 
                  ref={searchInputRef}
                  type="text" 
                  id="search-input"
                  placeholder="Cari..."
                  value={searchTerm} 
                  onChange={handleSearchChange}
              />
          </div>

          <a href="#" id="search" onClick={handleSearchClick}> 
            <i data-feather="search"></i>
          </a>

          <button
            id="hamburger-menu"
            ref={hamburgerRef}
            onClick={handleHamburgerClick}
            className="hamburger-btn"
          >
            <i data-feather="menu"></i>
          </button>
        </div>
      </div>
      
      {/* ========================================= KONTEN LAINNYA ========================================= */}
      <section className="hero" id="home">
        <main className="content">
          <h1> MUHAMAD <span>ABDUL YUSUF</span> </h1>
          <p> Saya adalah seorang [Posisi Anda], siap membantu bisnis Anda mencapai efisiensi operasional tertinggi melalui manajemen digital yang strategis. </p>
          <a href="#contact" className="cta"> Contact Me </a>
        </main>
      </section>

      <div className="lanyard-wrapper"><Lanyard /></div>

      <section id="about" className="about">
        <h2>About <span>Me</span></h2>
        <div className="about-row">
          <div className="about-content"><ScrollReveal baseOpacity={0.1} enableBlur={0} baseRotation={0} blurStrength={0.2}>
              I am an aspiring Virtual Assistant with a strong foundation in hospitality and administrative support. Proficient in Microsoft Word and Excel (including functions such as VLOOKUP and Pivot Tables), I have experience in handling reports, correspondence, and proposal writing. With basic design skills and a detail-oriented mindset, I am committed to providing reliable support while continuously developing my expertise to deliver even greater value to clients. Confidentiality and trust are my top priorities. I handle every document and communication with discretion and professionalism, ensuring that sensitive information remains secure at all times.
            </ScrollReveal></div>
        </div>
      </section>

      <section id="service" className="service">
        <h2>What I Bring <span>to Your Table</span></h2>
        <div className="demo">
          <FallingText text={"Email Management Administrative Sosial Media Management Excel Word Power Point"} highlightWords={["..."]} highlightClass="highlighted" trigger="hover" backgroundColor="transparent" gravity={0.56} mouseConstraintStiffness={0.9} />
        </div>
        <div className="service-cards-container">
          <div className="service-card">
            <i data-feather="mail" className="service-icon"></i>
            <h3>Email Management</h3>
            <p> Mengatur lalu lintas pesan masuk (inbox), menyusun draf balasan profesional, serta melakukan kurasi email penting agar komunikasi bisnis tetap berjalan lancar tanpa ada informasi yang terlewat.</p>
            <a href="#contact" className="service-cta"> Learn More </a>
          </div>
          <div className="service-card">
            <i data-feather="layers" className="service-icon"></i>
            <h3>Microsoft Office</h3>
            <p> Mahir mengoperasikan Word untuk penyusunan dokumen dan laporan formal, Excel untuk pengolahan data serta rumus otomatis (VLOOKUP/Pivot), dan PowerPoint untuk mendesain presentasi bisnis yang informatif.</p>
            <a href="#contact" className="service-cta"> Learn More </a>
          </div>
          <div className="service-card">
            <i data-feather="clipboard" className="service-icon"></i>
            <h3>Administrative</h3>
            <p> Menyediakan dukungan operasional mulai dari entri data yang akurat, manajemen jadwal harian (calendar), hingga pengarsipan dokumen digital secara sistematis untuk meningkatkan efisiensi kerja.</p>
            <a href="#contact" className="service-cta"> Learn More </a>
          </div>
          <div className="service-card">
            <i data-feather="share-2" className="service-icon"></i>
            <h3>Sosial Media Management</h3>
            <p> Mengelola kehadiran digital melalui perencanaan konten yang konsisten, pembuatan draf caption, serta memantau interaksi audiens untuk membangun engagement yang positif di berbagai platform.</p>
            <a href="#contact" className="service-cta"> Learn More </a>
          </div>
          <div className="service-card">
            <i data-feather="pen-tool" className="service-icon"></i>
            <h3>Design</h3>
            <p> Menyediakan jasa desain grafis kreatif untuk kebutuhan promosi, mulai dari pembuatan konten media sosial (Instagram/Facebook), desain presentasi, hingga elemen visual lainnya menggunakan Canva atau Photoshop.</p>
            <a href="#contact" className="service-cta"> Learn More </a>
          </div>
        </div>
      </section>

      <section id="project" className="project">
        <h2>My Recent <span>Work</span></h2>
        <p className="project-subheading"> Beberapa proyek dan hasil kerja yang menunjukkan keahlian saya. </p>
        <div className="project-row">
          <div className="project-card">
            <img src={projectImage} alt="Project A" className="project-card-img" />
            <h3 className="project-card-title"> Project: Inventory Management </h3>
            <p className="project-card-description"> Sistem inventaris otomatis yang memangkas proses manual. Cukup input data penjualan, sistem akan secara otomatis menghitung sisa stok dan bahan baku yang terpakai secara real-time menggunakan formula Excel tingkat lanjut.</p>
            <a href="https://drive.google.com/drive/folders/1QEbfEMCTRlQiKwlsjx_VY4u_67QaNotp?usp=drive_link" className="project-link"> Download Now <i data-feather="arrow-right"></i> </a>
          </div>
          <div className="project-card">
            <img src={projectImage} alt="Project B" className="project-card-img" />
            <h3 className="project-card-title"> Project: Internal Comms Hub </h3>
            <p className="project-card-description"> Perancangan hub komunikasi internal untuk tim remote. </p>
            <a href="#" className="project-link"> Download Now <i data-feather="arrow-right"></i> </a>
          </div>
          <div className="project-card">
            <img src={projectImage} alt="Project C" className="project-card-img" />
            <h3 className="project-card-title"> Project: Portofolio Web UI </h3>
            <p className="project-card-description"> Pengembangan front-end portofolio interaktif dengan 3D. </p>
            <a href="#" className="project-link"> View Case Study <i data-feather="arrow-right"></i> </a>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <h2>Get In <span>Touch</span></h2>
        <p className="contact-subheading"> Tertarik berkolaborasi? Kirimkan pesan melalui formulir di bawah ini. </p>
        <div className="contact-form-container">
          <form>
            <input type="text" placeholder="Nama Lengkap" required />
            <input type="email" placeholder="Email Aktif" required />
            <textarea placeholder="Pesan Anda..." required></textarea>
            <button type="submit" className="cta"> Send Message </button>
          </form>
        </div>
      </section>

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