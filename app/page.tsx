"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../components/Logo";

// 🖼️ IMAGE URLs - Replace these with your own images
// 🖼️ IMAGE URLs - Using local images
const HERO_IMAGE = "/images/hero-bg.jpg";
const FEATURES_IMAGE = "/images/features-bg.jpg";
const HOW_IT_WORKS_IMAGE = "/images/how-it-works-bg.jpg";
const USERS_IMAGE = "/images/users-bg.jpg";
const IOT_IMAGE = "/images/iot-bg.jpg";
const ABOUT_IMAGE = "/images/about-bg.jpg";
const features = [
  {
    icon: "🌱",
    title: "Smart Farm Management",
    description:
      "Manage farms, plots, crops and agricultural activities from one simple platform.",
    color: "green",
  },
  {
    icon: "📊",
    title: "Farm Monitoring",
    description:
      "Monitor important farm information and receive useful alerts for better decisions.",
    color: "blue",
  },
  {
    icon: "🤖",
    title: "Smart Recommendations",
    description:
      "Get agricultural insights and recommendations to support better crop management.",
    color: "yellow",
  },
  {
    icon: "🛒",
    title: "Farmer Marketplace",
    description:
      "Connect farmers directly with buyers and make agricultural products easier to trade.",
    color: "green",
  },
  {
    icon: "👨‍🌾",
    title: "Agricultural Experts",
    description:
      "Connect with agricultural experts for guidance, advice and professional support.",
    color: "blue",
  },
  {
    icon: "📱",
    title: "Web & Mobile",
    description:
      "Access AGRINOVA from your browser or use the mobile application wherever you are.",
    color: "yellow",
  },
];

const roles = [
  {
    icon: "👨‍🌾",
    title: "Farmers",
    description:
      "Manage farms and crops, monitor agricultural activities, receive recommendations and sell produce directly to buyers.",
    color: "green",
    path: "/register/farmer",
  },
  {
    icon: "🛍️",
    title: "Buyers",
    description:
      "Discover agricultural products, communicate with farmers and manage your purchases.",
    color: "blue",
    path: "/register/buyer",
  },
  {
    icon: "🌾",
    title: "Agricultural Experts",
    description:
      "Provide agricultural guidance, support diagnosis and help farmers make better decisions.",
    color: "yellow",
    path: "/register/agronomist",
  },
  {
    icon: "🛡️",
    title: "Administrators",
    description:
      "Manage users, verify documents, monitor activities and maintain the AGRINOVA platform.",
    color: "green",
    path: "/register/admin",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const goToLogin = () => {
    router.push("/login");
  };

  const goToRegister = () => {
    document.getElementById("roles")?.scrollIntoView({ behavior: "smooth" });
  };

  const protectedAction = () => {
    router.push("/login");
  };

  return (
    <main className="agrinova-page">
      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="nav-container">
          <a href="#home" className="brand">
            <Logo width={150} />
            <span className="brand-tagline">
              Smart Agriculture • Better Connections
            </span>
          </a>

          <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <a href="#features" onClick={() => setMenuOpen(false)}>
              Features
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How It Works
            </a>
            <a href="#roles" onClick={() => setMenuOpen(false)}>
              Users
            </a>
            <a href="#iot" onClick={() => setMenuOpen(false)}>
              Smart IoT
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>

            <div className="mobile-nav-buttons">
              <button className="btn btn-outline" onClick={goToLogin}>
                Login
              </button>

              <button className="btn btn-primary" onClick={goToRegister}>
                Get Started
              </button>
            </div>
          </nav>

          <div className="nav-actions">
            <button className="login-link" onClick={goToLogin}>
              Login
            </button>

            <button className="btn btn-primary nav-register" onClick={goToRegister}>
              Get Started
            </button>
          </div>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* ================= HERO SECTION WITH BACKGROUND IMAGE ================= */}
      <section className="hero" id="home">
        {/* Background Image */}
        <div className="hero-bg">
          <Image
            src={HERO_IMAGE}
            alt="Smart farming in Africa"
            fill
            className="hero-bg-image"
            priority
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-decoration hero-decoration-one"></div>
        <div className="hero-decoration hero-decoration-two"></div>

        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              The future of intelligent agriculture
            </div>

            <h1>
              Grow smarter.
              <br />
              <span>Connect better.</span>
              <br />
              Farm brighter.
            </h1>

            <p className="hero-description">
              AGRINOVA brings farmers, buyers and agricultural experts together
              through one intelligent agricultural management platform.
            </p>

            <div className="hero-buttons">
              <button className="btn btn-primary btn-large" onClick={goToRegister}>
                Start with AGRINOVA
                <span className="arrow">→</span>
              </button>

              <a href="#how-it-works" className="btn btn-light btn-large">
                Explore Platform
                <span className="play-icon">▶</span>
              </a>
            </div>

            <div className="hero-note">
              <span>✓</span>
              Explore freely. Registration is only required for actions.
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="hero-visual">
            <div className="sun-glow"></div>

            <div className="farm-card">
              <div className="farm-card-top">
                <div>
                  <span className="mini-label">AGRINOVA FARM</span>
                  <h3>Smart Agriculture</h3>
                </div>

                <div className="online-status">
                  <span></span>
                  Live
                </div>
              </div>

              <div className="farm-land">
                <div className="hill hill-back"></div>
                <div className="hill hill-front"></div>

                <div className="field field-one"></div>
                <div className="field field-two"></div>
                <div className="field field-three"></div>

                <div className="tree tree-one">🌳</div>
                <div className="tree tree-two">🌳</div>
                <div className="tree tree-three">🌴</div>

                <div className="farm-house">
                  <div className="roof"></div>
                  <div className="house-body">
                    <div className="window"></div>
                    <div className="door"></div>
                  </div>
                </div>

                <div className="sun">☀</div>
              </div>

              <div className="farm-stats">
                <div>
                  <span>🌱</span>
                  <strong>Healthy</strong>
                  <small>Crops</small>
                </div>

                <div>
                  <span>💧</span>
                  <strong>Optimal</strong>
                  <small>Conditions</small>
                </div>

                <div>
                  <span>📈</span>
                  <strong>Growing</strong>
                  <small>Progress</small>
                </div>
              </div>
            </div>

            <div className="floating-card weather-card">
              <div className="floating-icon blue-icon">☀️</div>
              <div>
                <small>Weather</small>
                <strong>28°C</strong>
              </div>
            </div>

            <div className="floating-card crop-card">
              <div className="floating-icon green-icon">🌿</div>
              <div>
                <small>Crop status</small>
                <strong>Healthy</strong>
              </div>
            </div>

            <div className="floating-card market-card">
              <div className="floating-icon yellow-icon">🛒</div>
              <div>
                <small>Marketplace</small>
                <strong>Active</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* ================= TRUST BAR ================= */}
      <section className="trust-section">
        <div className="container trust-container">
          <div>
            <strong>One platform.</strong>
            <span>Multiple agricultural needs.</span>
          </div>

          <div className="trust-items">
            <span>🌱 Farm Management</span>
            <span>🛒 Marketplace</span>
            <span>🧑‍🌾 Expert Support</span>
            <span>📊 Smart Monitoring</span>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION WITH BACKGROUND IMAGE ================= */}
      <section className="section features-section" id="features">
        <div className="features-bg">
          <Image
            src={FEATURES_IMAGE}
            alt="Modern farming technology"
            fill
            className="features-bg-image"
          />
          <div className="features-overlay"></div>
        </div>
        <div className="container">
          <div className="section-heading">
            <div className="section-label">
              <span></span>
              AGRINOVA PLATFORM
            </div>

            <h2>
              Everything you need to
              <span> farm smarter.</span>
            </h2>

            <p>
              AGRINOVA combines farm management, intelligent monitoring,
              agricultural expertise and a direct marketplace in one simple
              ecosystem.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <article
                className={`feature-card feature-${feature.color}`}
                key={feature.title}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="feature-icon">{feature.icon}</div>

                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>

                <button className="learn-more" onClick={protectedAction}>
                  Explore <span>→</span>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION WITH BACKGROUND IMAGE ================= */}
      <section className="section process-section" id="how-it-works">
        <div className="process-bg">
          <Image
            src={HOW_IT_WORKS_IMAGE}
            alt="Farming process"
            fill
            className="process-bg-image"
          />
          <div className="process-overlay"></div>
        </div>
        <div className="container">
          <div className="process-wrapper">
            <div className="process-intro">
              <div className="section-label">
                <span></span>
                SIMPLE BY DESIGN
              </div>

              <h2>
                Agriculture shouldn&apos;t
                <span> be complicated.</span>
              </h2>

              <p>
                Whether you are a farmer looking to manage your activities, a
                buyer searching for produce, or an expert helping farmers,
                AGRINOVA keeps the experience simple.
              </p>

              <button className="btn btn-primary" onClick={goToRegister}>
                Create your account →
              </button>
            </div>

            <div className="steps">
              <div className="step">
                <div className="step-number">01</div>
                <div>
                  <h3>Create your account</h3>
                  <p>
                    Register according to your role and provide the required
                    information.
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">02</div>
                <div>
                  <h3>Build your agricultural profile</h3>
                  <p>
                    Set up your farms, products, services or buyer preferences.
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">03</div>
                <div>
                  <h3>Connect and manage</h3>
                  <p>
                    Manage your agricultural activities and connect with other
                    members of the ecosystem.
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">04</div>
                <div>
                  <h3>Grow with intelligence</h3>
                  <p>
                    Use monitoring, recommendations, expert support and
                    marketplace tools to make better decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= USER ROLES SECTION WITH BACKGROUND IMAGE ================= */}
      <section className="section roles-section" id="roles">
        <div className="roles-bg">
          <Image
            src={USERS_IMAGE}
            alt="Farmers community"
            fill
            className="roles-bg-image"
          />
          <div className="roles-overlay"></div>
        </div>
        <div className="container">
          <div className="section-heading centered">
            <div className="section-label">
              <span></span>
              BUILT FOR THE AGRICULTURAL ECOSYSTEM
            </div>

            <h2>
              One ecosystem,
              <span> every role.</span>
            </h2>

            <p>
              Choose the experience that matches what you do in agriculture.
            </p>
          </div>

          <div className="roles-grid">
            {roles.map((role) => (
              <article className={`role-card role-${role.color}`} key={role.title}>
                <div className="role-icon">{role.icon}</div>

                <h3>{role.title}</h3>

                <p>{role.description}</p>

                <button onClick={() => router.push(role.path)}>
                  Join as{" "}
                  {role.title
                    .replace("Agricultural Experts", "Expert")
                    .replace("Administrators", "Admin")}
                  <span>→</span>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= IoT SECTION WITH BACKGROUND IMAGE ================= */}
      <section className="section iot-section" id="iot">
        <div className="iot-bg">
          <Image
            src={IOT_IMAGE}
            alt="Smart farming technology"
            fill
            className="iot-bg-image"
          />
          <div className="iot-overlay"></div>
        </div>
        <div className="container">
          <div className="iot-card">
            <div className="iot-content">
              <div className="section-label">
                <span></span>
                OPTIONAL SMART TECHNOLOGY
              </div>

              <h2>
                Bring your farm
                <span> into the smart era.</span>
              </h2>

              <p>
                AGRINOVA can work with IoT devices and environmental sensors
                to automatically collect useful farm information.
              </p>

              <p>
                <strong>No IoT? No problem.</strong> The platform remains fully
                usable. Farmers can manually record observations and
                agricultural activities when smart devices are unavailable.
              </p>

              <div className="iot-points">
                <div>
                  <span>✓</span>
                  Optional sensor integration
                </div>

                <div>
                  <span>✓</span>
                  Automatic environmental readings
                </div>

                <div>
                  <span>✓</span>
                  Manual monitoring remains available
                </div>
              </div>

              <button className="btn btn-dark" onClick={protectedAction}>
                Explore Smart Monitoring →
              </button>
            </div>

            <div className="iot-visual">
              <div className="iot-orbit orbit-one"></div>
              <div className="iot-orbit orbit-two"></div>

              <div className="iot-center">
                <span>🌱</span>
                <strong>AGRINOVA</strong>
                <small>SMART FARM</small>
              </div>

              <div className="sensor sensor-one">
                <span>🌡️</span>
                <small>Temperature</small>
              </div>

              <div className="sensor sensor-two">
                <span>💧</span>
                <small>Humidity</small>
              </div>

              <div className="sensor sensor-three">
                <span>🌦️</span>
                <small>Weather</small>
              </div>

              <div className="sensor sensor-four">
                <span>🌱</span>
                <small>Soil</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MARKETPLACE ================= */}
      <section className="section marketplace-section">
        <div className="container marketplace-container">
          <div className="marketplace-visual">
            <div className="market-circle circle-one"></div>
            <div className="market-circle circle-two"></div>

            <div className="produce-card produce-main">
              <div className="produce-image">🥬</div>
              <div>
                <strong>Fresh produce</strong>
                <small>Direct from farmer</small>
              </div>
              <span className="verified">✓</span>
            </div>

            <div className="produce-card produce-small produce-small-one">
              🍅
              <span>Fresh tomatoes</span>
            </div>

            <div className="produce-card produce-small produce-small-two">
              🌽
              <span>Quality maize</span>
            </div>

            <div className="produce-card produce-small produce-small-three">
              🥑
              <span>Fresh vegetables</span>
            </div>
          </div>

          <div className="marketplace-content">
            <div className="section-label">
              <span></span>
              DIRECT AGRICULTURAL MARKET
            </div>

            <h2>
              From the farm
              <span> to the buyer.</span>
            </h2>

            <p>
              AGRINOVA creates a direct connection between farmers and buyers.
              Farmers can present their products while buyers can discover
              agricultural produce from the platform.
            </p>

            <div className="market-features">
              <div>
                <span>🌾</span>
                <div>
                  <strong>Farmers sell directly</strong>
                  <small>Showcase available produce and manage listings.</small>
                </div>
              </div>

              <div>
                <span>🛒</span>
                <div>
                  <strong>Buyers discover products</strong>
                  <small>Search for agricultural products that meet their needs.</small>
                </div>
              </div>

              <div>
                <span>🤝</span>
                <div>
                  <strong>Flexible delivery</strong>
                  <small>
                    Buyer collection or farmer delivery can be arranged.
                  </small>
                </div>
              </div>
            </div>

            <button className="btn btn-primary" onClick={protectedAction}>
              Explore Marketplace →
            </button>
          </div>
        </div>
      </section>

      {/* ================= MOBILE APP ================= */}
      <section className="section app-section">
        <div className="container">
          <div className="app-card">
            <div className="app-content">
              <div className="section-label">
                <span></span>
                AGRINOVA MOBILE
              </div>

              <h2>
                Your farm.
                <br />
                <span>In your pocket.</span>
              </h2>

              <p>
                Stay connected to your agricultural activities wherever you
                are. AGRINOVA is designed to provide a consistent experience
                across web and mobile.
              </p>

              <div className="app-buttons">
                <button className="store-button" onClick={protectedAction}>
                  <span>▶</span>
                  <div>
                    <small>AVAILABLE SOON</small>
                    <strong>Mobile App</strong>
                  </div>
                </button>

                <button className="btn btn-primary" onClick={goToRegister}>
                  Get started →
                </button>
              </div>
            </div>

            <div className="phone-wrapper">
              <div className="phone">
                <div className="phone-speaker"></div>

                <div className="phone-screen">
                  <div className="phone-header">
                    <div>
                      <small>Good morning</small>
                      <strong>AGRINOVA 🌱</strong>
                    </div>
                    <span>●</span>
                  </div>

                  <div className="phone-weather">
                    <span>☀️</span>
                    <div>
                      <strong>28°C</strong>
                      <small>Good farming conditions</small>
                    </div>
                  </div>

                  <div className="phone-section-title">Farm overview</div>

                  <div className="phone-stats">
                    <div>
                      <span>🌱</span>
                      <strong>12</strong>
                      <small>Crops</small>
                    </div>

                    <div>
                      <span>🌾</span>
                      <strong>4</strong>
                      <small>Plots</small>
                    </div>

                    <div>
                      <span>📊</span>
                      <strong>92%</strong>
                      <small>Health</small>
                    </div>
                  </div>

                  <div className="phone-chart">
                    <div className="chart-label">
                      <span>Farm activity</span>
                      <strong>+18%</strong>
                    </div>

                    <div className="bars">
                      <i></i>
                      <i></i>
                      <i></i>
                      <i></i>
                      <i></i>
                      <i></i>
                      <i></i>
                    </div>
                  </div>

                  <div className="phone-nav">
                    <span>⌂</span>
                    <span>🌱</span>
                    <span className="active">＋</span>
                    <span>🛒</span>
                    <span>◉</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION WITH BACKGROUND IMAGE ================= */}
      <section className="section about-section" id="about">
        <div className="about-bg">
          <Image
            src={ABOUT_IMAGE}
            alt="About AGRINOVA"
            fill
            className="about-bg-image"
          />
          <div className="about-overlay"></div>
        </div>
        <div className="container about-grid">
          <div>
            <div className="section-label">
              <span></span>
              ABOUT AGRINOVA
            </div>

            <h2>
              Technology that works
              <span> with agriculture.</span>
            </h2>
          </div>

          <div>
            <p>
              AGRINOVA is an intelligent agricultural management system
              designed to improve how agricultural activities are managed,
              monitored and connected.
            </p>

            <p>
              The platform brings farmers, buyers, agricultural experts and
              administrators together while keeping smart technology
              accessible and optional.
            </p>

            <div className="about-highlights">
              <div>
                <strong>01</strong>
                <span>Intelligent</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Connected</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Accessible</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta-section">
        <div className="cta-shape shape-one"></div>
        <div className="cta-shape shape-two"></div>

        <div className="container cta-content">
          <div className="cta-icon">🌱</div>

          <h2>
            Ready to grow with
            <span> AGRINOVA?</span>
          </h2>

          <p>
            Explore the platform freely or create an account to unlock its
            full agricultural experience.
          </p>

          <div className="cta-buttons">
            <button className="btn btn-dark btn-large" onClick={goToRegister}>
              Create an account →
            </button>

            <button className="cta-login" onClick={goToLogin}>
              Already registered? <strong>Login</strong>
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <a href="#home" className="brand">
                <Logo width={130} />
                <span className="brand-tagline">Smart Agriculture</span>
              </a>

              <p>
                Connecting agriculture with intelligent technology and better
                opportunities.
              </p>
            </div>

            <div className="footer-column">
              <h4>Platform</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#roles">Users</a>
              <a href="#iot">Smart IoT</a>
            </div>

            <div className="footer-column">
              <h4>Explore</h4>
              <a href="#about">About AGRINOVA</a>
              <button onClick={protectedAction}>Marketplace</button>
              <button onClick={protectedAction}>Farm Management</button>
              <button onClick={protectedAction}>Expert Support</button>
            </div>

            <div className="footer-column">
              <h4>Account</h4>
              <button onClick={goToLogin}>Login</button>
              <button onClick={goToRegister}>Register</button>
              <button onClick={protectedAction}>Mobile App</button>
            </div>
          </div>

          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} AGRINOVA. All rights reserved.
            </span>

            <span>Intelligent Agricultural Management System</span>
          </div>
        </div>
      </footer>
    </main>
  );
}