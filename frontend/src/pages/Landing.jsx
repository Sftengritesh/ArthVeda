import { useState } from 'react';
import { Link } from 'react-router-dom';

const team = [
  {
    name: 'Ritesh Vishwakarma',
    role: 'Full Stack Developer',
    mobile: '9076704355',
    email: 'sft.r.vish@gmail.com',
    avatar: 'RV',
    color: '#1EE09A', // Carbon Logic accent instead of #34d399
  },
  {
    name: 'Himanshu Sharma',
    role: 'Frontend Developer',
    mobile: '7627013181',
    email: 'himanshu5080@gmail.com',
    avatar: 'HS',
    color: '#38bdf8', // Carbon Logic Info
  },
  {
    name: 'Ashish Gautam',
    role: 'Backend Developer',
    mobile: '7807725173',
    email: 'Ashish5080@gmail.com',
    avatar: 'AG',
    color: '#a78bfa',
  },
];

const features = [
  { icon: '📊', title: 'Smart Analytics', desc: 'Visual breakdowns of your spending with AI-powered categorization.' },
  { icon: '🤖', title: 'AI Insights', desc: 'Get personalized tips and predictions based on your financial behaviour.' },
  { icon: '🔒', title: 'Bank-Grade Security', desc: 'JWT-based authentication and encrypted data storage to keep you safe.' },
  { icon: '📅', title: 'Budget Planner', desc: 'Set monthly budgets and receive alerts before you overspend.' },
  { icon: '🌐', title: 'Multi-Device Access', desc: 'Access your financial dashboard from any device, anytime.' },
  { icon: '⚡', title: 'Real-Time Sync', desc: 'Every transaction is instantly reflected across all your sessions.' },
];

export default function Landing() {
  const [activeSection, setActiveSection] = useState('features');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContact = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans scroll-smooth">

      {/* ── Navigation ── */}
      <nav className="flex items-center justify-between px-10 py-5 sticky top-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur border-b border-[var(--border-subtle)]">
        <div className="text-2xl font-extrabold text-[var(--accent)] tracking-tight">ArthVeda</div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {['features', 'about', 'contact'].map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className={`capitalize transition pb-0.5 ${activeSection === s ? 'text-[var(--accent)] border-b border-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-white'}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
          <Link to="/signup" className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] px-6 py-2 rounded-full transition font-bold">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-10 max-w-7xl mx-auto w-full gap-16 py-24">
        <div className="flex-1 space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="text-xs font-bold tracking-widest text-[var(--accent)] uppercase">The Financial Luminary</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Illuminate Your <br />
            <span className="text-[var(--accent)]">Finances</span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
            Elevate your wealth management with precision tracking and editorial-grade analytics.
            Designed for those who demand clarity in every transaction.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <Link to="/signup" className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] px-8 py-3 rounded-xl transition font-bold flex items-center gap-2">
              Sign Up Free <span className="ml-1">→</span>
            </Link>
            <button onClick={() => scrollTo('features')} className="bg-white/5 hover:bg-[var(--bg-surface-raised)] text-[var(--accent)] font-medium px-8 py-3 rounded-xl transition">
              Explore Features
            </button>
          </div>
        </div>

        {/* Dashboard mock */}
        <div className="flex-1 w-full relative">
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-2xl relative w-full h-[450px] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="text-sm font-bold text-[var(--accent)]">ArthVeda</div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent)] text-xs font-bold">₹</div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Total Balance</div>
                <div className="text-2xl font-bold text-white">₹8,920.00</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {['Food', 'Travel', 'Bills'].map((cat, i) => (
                <div key={cat} className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">{cat}</div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${[60, 35, 80][i]}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-xl p-4 flex-1 flex gap-4">
              <div className="flex-1 space-y-4">
                {[70, 40, 90].map((w, i) => (
                  <div key={i} className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--accent)]" style={{ width: `${w}%` }} />
                  </div>
                ))}
              </div>
              <div className="w-[100px] bg-white/5 rounded-lg" />
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--accent)] opacity-10 blur-[100px] rounded-full pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-10 py-24 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-bold tracking-widest text-[var(--accent)] uppercase">What We Offer</span>
          <h2 className="text-4xl font-extrabold">Everything you need to<br /><span className="text-[var(--accent)]">master your money</span></h2>
          <p className="text-gray-400 max-w-xl mx-auto">From budgeting to AI-powered predictions, ArthVeda has you covered.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6 hover:border-[var(--accent)]/50 transition group">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--accent)] transition">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="px-10 py-24 bg-[var(--bg-secondary)] w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold tracking-widest text-[var(--accent)] uppercase">Who We Are</span>
            <h2 className="text-4xl font-extrabold">Built by students,<br /><span className="text-[var(--accent)]">driven by passion</span></h2>
          </div>

          {/* Mission blurb */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-8 mb-12 max-w-4xl mx-auto text-center">
            <p className="text-gray-300 text-lg leading-relaxed">
              We are a team of <span className="text-white font-semibold">3rd-year Computer Science students</span>, currently pursuing our B.Tech degree.
              Passionate about full-stack development, we built <span className="text-[var(--accent)] font-semibold">ArthVeda</span> as a real-world MERN-stack application
              to help people take control of their personal finances through intelligent tracking, budgeting, and AI-driven insights.
              This project reflects our commitment to writing clean, production-ready code and building products that genuinely help people.
            </p>
          </div>

          {/* Team cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6 text-center hover:border-opacity-40 transition group" style={{ '--tw-border-opacity': 0.1 }}>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-extrabold mx-auto mb-4"
                  style={{ backgroundColor: `${member.color}18`, color: member.color, border: `2px solid ${member.color}40` }}
                >
                  {member.avatar}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                <p className="text-sm font-medium mb-4" style={{ color: member.color }}>{member.role}</p>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <span>📞</span>
                    <a href={`tel:${member.mobile}`} className="hover:text-white transition">{member.mobile}</a>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>✉️</span>
                    <a href={`mailto:${member.email}`} className="hover:text-white transition break-all">{member.email}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="px-10 py-24 max-w-7xl mx-auto w-full shadow-inner">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-bold tracking-widest text-[var(--accent)] uppercase">Get In Touch</span>
          <h2 className="text-4xl font-extrabold">Have a <span className="text-[var(--accent)]">question?</span></h2>
          <p className="text-gray-400 max-w-md mx-auto">We'd love to hear from you. Drop us a message and we'll get back to you shortly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">

          {/* Contact form */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-5xl">✅</div>
                <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                <p className="text-gray-400">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1.5">Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] font-bold py-3 rounded-xl transition"
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>

          {/* Contact info panel */}
          <div className="space-y-6">
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 text-[var(--accent)]">Direct Contact</h3>
              <div className="space-y-4">
                {team.map((member) => (
                  <div key={member.name} className="flex items-start gap-4 pb-4 border-b border-[var(--border-subtle)] last:border-0 last:pb-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: `${member.color}18`, color: member.color }}
                    >
                      {member.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm">{member.name}</p>
                      <a href={`tel:${member.mobile}`} className="text-gray-400 hover:text-white text-xs transition block">📞 {member.mobile}</a>
                      <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-white text-xs transition block break-all">✉️ {member.email}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-sm mb-4">Ready to get started?</p>
              <Link to="/signup" className="inline-block bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] font-bold px-8 py-3 rounded-xl transition">
                Create Free Account →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border-subtle)] px-10 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xl font-extrabold text-[var(--accent)]">ArthVeda</div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ArthVeda. Built with ❤️ by Ritesh, Himanshu & Ashish.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <button onClick={() => scrollTo('features')} className="hover:text-white transition">Features</button>
            <button onClick={() => scrollTo('about')} className="hover:text-white transition">About</button>
            <button onClick={() => scrollTo('contact')} className="hover:text-white transition">Contact</button>
          </div>
        </div>
      </footer>

    </div>
  );
}