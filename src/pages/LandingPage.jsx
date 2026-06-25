import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

/* ─── Data ──────────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "🤖",
    title: "AI Mock Interviews",
    desc: "Have a full mock interview with an AI that adapts its questions based on your answers, just like a real interviewer.",
  },
  {
    icon: "🎤",
    title: "Voice Interaction",
    desc: "Speak your answers aloud. Our voice engine transcribes and evaluates clarity, confidence, and pacing in real time.",
  },
  {
    icon: "📄",
    title: "Resume-Based Questions",
    desc: "Upload your resume and get questions tailored to your specific experience, skills, and target role.",
  },
  {
    icon: "📊",
    title: "Deep Performance Analytics",
    desc: "Every session generates a detailed report: answer quality, filler words, response time, and improvement tips.",
  },
  {
    icon: "🧠",
    title: "Skill Gap Detection",
    desc: "AI identifies exactly which topics you struggle with and creates a personalized study plan to close the gap.",
  },
  {
    icon: "🏆",
    title: "Progress Leaderboard",
    desc: "Compete with peers, track your percentile rank, and stay motivated as your score climbs session after session.",
  },
];

const STEPS = [
  {
    label: "Step 01",
    title: "Create your account",
    desc: "Sign up in 30 seconds — no credit card needed for the free plan.",
  },
  {
    label: "Step 02",
    title: "Pick your interview type",
    desc: "Choose from Technical, HR, Behavioral, or a Custom mix of all three.",
  },
  {
    label: "Step 03",
    title: "Answer AI questions",
    desc: "Respond by typing or speaking. The AI listens, follows up, and challenges you.",
  },
  {
    label: "Step 04",
    title: "Review your report",
    desc: "Get a scored breakdown with specific suggestions to ace the real thing.",
  },
];

const TESTIMONIALS = [
  {
    stars: "★★★★★",
    text: "I went from blanking on system design questions to explaining distributed systems confidently. Got the offer at my dream company after 3 weeks of practice.",
    name: "Arjun Mehta",
    role: "SWE @ Google",
    avatarColor: "#3B6FD4",
  },
  {
    stars: "★★★★★",
    text: "The resume-based questions feature is scary accurate. It found gaps in my experience I hadn't even noticed and helped me craft compelling answers.",
    name: "Priya Sharma",
    role: "PM @ Flipkart",
    avatarColor: "#7C3AED",
  },
  {
    stars: "★★★★★",
    text: "Used this before my Amazon loop. The behavioral question bank with STAR framework coaching alone is worth it. Highly recommend to anyone prepping seriously.",
    name: "Rahul Verma",
    role: "SDE-2 @ Amazon",
    avatarColor: "#0E7490",
  },
];

const FAQS = [
  {
    q: "Do I need a webcam or microphone?",
    a: "No. You can complete every interview in text mode. Voice mode is optional and enhances realism, but it's never required.",
  },
  {
    q: "How are interviews scored?",
    a: "Our model evaluates answer relevance, structure (e.g., STAR format for behavioral), technical accuracy, and communication quality. Each dimension gets a separate score.",
  },
  {
    q: "Can I use this for non-tech interviews?",
    a: "Yes. We support HR, behavioral, product management, data science, and more. You can also build a fully custom question set.",
  },
  {
    q: "Is my data private?",
    a: "Your interview recordings and transcripts are private by default. We never share them with employers or third parties.",
  },
];

const SOCIAL_BTNS = [
  { src: "https://cdn-icons-png.flaticon.com/512/300/300221.png", label: "Google" },
  { src: "https://cdn-icons-png.flaticon.com/512/174/174857.png", label: "LinkedIn" },
  { src: "https://cdn-icons-png.flaticon.com/512/25/25231.png", label: "GitHub" },
];

const COMPANIES = [
  "DevStringx","Google", "Amazon", "Microsoft", "Flipkart","DevStringx", "Infosys",
  "TCS", "Wipro", "Zomato", "Swiggy", "DevStringx","Razorpay", "CRED", "PhonePe",
];

/* ─── Sub-components ────────────────────────────────────────────────────────── */

/** Counts up from 0 to `end` when scrolled into view */
function AnimatedCounter({ end, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let current = 0;
      const step = Math.ceil(end / 60);
      const id = setInterval(() => {
        current = Math.min(current + step, end);
        setCount(current);
        if (current >= end) clearInterval(id);
      }, 20);/* run interval after every 20ms */
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/** Expandable FAQ row */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className="faq-toggle">{open ? "−" : "+"}</span>
      </div>
      {open && <p className="faq-answer">{a}</p>}
    </div>
  );
}

/* ─── Main component ─── */
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="lp-root">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <a className="nav-logo" href="/">
          <div className="nav-logo-mark">AI</div>
          InterviewAI
        </a>

        <ul className="nav-links">
          {["Features", "How it Works", "FAQ"].map((label) => (
            <li key={label}>
              <a className="nav-link" href={`#${label.toLowerCase().replace(/ /g, "-")}`}>
                {label}
              </a>
            </li>
          ))}
        </ul>


      </nav>

      {/* ── COMPANY TICKER ── */}
      <div className="ticker">
        <div className="ticker-track">
          {[...COMPANIES, ...COMPANIES].map((c, i) => (/*c is string variable where company name is storing and i is the index value0 1 2....*/
            <span key={i} className="ticker-item">✦ {c}</span>/*class ticker item responsible for display nama*/
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="hero" id="home">
        {/* decorative background blobs */}
        <div className="blob blob-blue" />
        <div className="blob blob-purple" />

        <div className="hero-grid">

          {/* Left — headline + stats */}
          <div className="hero-left">
            <div className="eyebrow">⚡ Powered by DevStringx</div>

            <h1 className="hero-headline">
              Ace every interview<br /> 
              <span className="gradient-text">before it happens.</span>
            </h1>

            <p className="hero-sub">
              Practice with an AI that asks real questions, challenges weak answers,
              and gives you a scored report — so you walk into every interview fully prepared.
            </p>

            <div className="hero-ctas">
              <button className="btn-primary" onClick={() => navigate("/login")}>
                Start for free →
              </button>
              <button className="btn-secondary" onClick={()=> window.location.href="https://youtu.be/Gy8HNeYFuAA?si=ejriZQIDYrdV3lkE"}>
                Watch demo ▶
              </button>
            </div>

            <div className="hero-stats">
              {[
                { n: 50000, s: "+", label: "Interviews done" },
                { n: 94,    s: "%", label: "Offer rate" },
                { n: 200,   s: "+", label: "Companies covered" },
              ].map(({ n, s, label }) => (
                <div className="hero-stat" key={label}>
                  <span className="hero-stat-num">
                    <AnimatedCounter end={n} suffix={s} />
                  </span>
                  <span className="hero-stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — login card */}
          <div className="login-card">
            <div className="login-wave">👋</div>
            <h2 className="login-title">Hello, let's get started</h2>
            <p className="login-sub">Free for all.</p>

            <button
              className="btn-primary btn-full"
              onClick={() => navigate("/login")}
            >
              Get started free
            </button>

            <div className="card-divider">
              <span className="card-divider-line" />
              <span className="card-divider-text">or continue with</span>
              <span className="card-divider-line" />
            </div>

            {SOCIAL_BTNS.map(({ src, label }) => (
              <button key={label} className="social-btn">
                <img src={src} alt={label} className="social-icon" />
                Continue with {label}
              </button>
            ))}

            <button className="social-btn" onClick={() => navigate("/signup")}>
              ✉️ Sign up with Email
            </button>

            <p className="login-footer-text">
              Already have an account?{" "}
              <a href="/login" className="login-link">Log in</a>
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section section-alt" id="features">
        <div className="section-inner">
          <p className="section-label">What you get</p>
          <h2 className="section-title">Everything you need to prepare</h2>
          <p className="section-sub">
            One platform covers every part of your interview prep — from question
            practice to gap analysis to final confidence check.
          </p>
          <div className="feature-grid">
            {FEATURES.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="how-it-works">
        <div className="section-inner">
          <p className="section-label">The process</p>
          <h2 className="section-title">From signup to offer in 4 steps</h2>
          <p className="section-sub">
            The whole loop takes under 10 minutes for your first session.
          </p>
        </div>
        <div className="steps-row">
          {STEPS.map((s, i) => (
            <div className="step" key={i}>
              <span className="step-num">{s.label}</span>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section section-alt">
        <div className="section-inner">
          <p className="section-label">Success stories</p>
          <h2 className="section-title">They prepared here. They got the job.</h2>
          <p className="section-sub">
            Real feedback from people who used InterviewAI before their final rounds.
          </p>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="stars">{t.stars}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div
                    className="avatar"
                    style={{ background: t.avatarColor }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="author-name">{t.name}</p>
                    <p className="author-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" id="faq">
        <div className="section-inner">
          <p className="section-label">FAQ</p>
          <h2 className="section-title">Common questions</h2>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div className="cta-banner">
        <div className="blob blob-blue blob-cta" />
        <div className="cta-banner-inner">
          <h2 className="hero-headline">
            Your next interview is<br />
            <span className="gradient-text">closer than you think.</span>
          </h2>
          <p className="cta-sub">
            Join 50,000+ candidates who practice smarter and interview better.
          </p>
          <button
            className="btn-primary btn-lg"
            onClick={() => navigate("/signup")}
          >
            Create your free account →
          </button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-logo">
          <div className="nav-logo-mark">AI</div>
          <span className="footer-logo-name">InterviewAI</span>
        </div>
        <div className="footer-links">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="/" className="footer-link">{l}</a>
          ))}
        </div>
        <span className="footer-copy">© 2026 InterviewAI. All rights reserved .</span>
      </footer>

    </div>
  );
}