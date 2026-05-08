import { useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBars,
  FaCode,
  FaCodeBranch,
  FaDownload,
  FaEnvelope,
  FaExternalLinkAlt,
  FaGithub,
  FaGraduationCap,
  FaLinkedin,
  FaMoon,
  FaPhoneAlt,
  FaRocket,
  FaSun,
  FaTools,
  FaWhatsapp,
} from "react-icons/fa";
import { SiCodeforces, SiDaisyui, SiJavascript, SiNetlify, SiReact, SiTailwindcss } from "react-icons/si";

const navItems = [
  { label: "Home", href: "home" },
  { label: "About", href: "about" },
  { label: "Skills", href: "skills" },
  { label: "Education", href: "education" },
  { label: "Projects", href: "projects" },
  { label: "Contact", href: "contact" },
];

const dataFiles = {
  profile: "/profile.json",
  links: "/links.json",
  skills: "/skills.json",
  education: "/education.json",
  experiences: "/experiences.json",
  projects: "/projects.json",
};

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
}

function navigateWithTransition(navigate, target, afterNavigate) {
  const update = () => {
    navigate(target);
    if (afterNavigate) window.setTimeout(afterNavigate, 90);
  };

  if (document.startViewTransition) {
    document.startViewTransition(update);
  } else {
    update();
  }
}

function SmoothCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!cursor || !dot || !ring || window.matchMedia("(pointer: coarse)").matches) return undefined;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let frame = 0;

    const render = () => {
      ringX += (pointerX - ringX) * 0.22;
      ringY += (pointerY - ringY) * 0.22;
      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(render);
    };

    const move = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursor.classList.add("is-visible");
    };

    const setInteractive = (event) => {
      cursor.classList.toggle("is-interactive", Boolean(event.target.closest("a, button, input, textarea, select, [role='button'], summary")));
    };

    const press = () => cursor.classList.add("is-active");
    const release = () => cursor.classList.remove("is-active");
    const hide = () => cursor.classList.remove("is-visible");

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", setInteractive, { passive: true });
    window.addEventListener("mousedown", press);
    window.addEventListener("mouseup", release);
    window.addEventListener("blur", release);
    document.addEventListener("mouseleave", hide);

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", setInteractive);
      window.removeEventListener("mousedown", press);
      window.removeEventListener("mouseup", release);
      window.removeEventListener("blur", release);
      document.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <div ref={cursorRef} className="smooth-cursor" aria-hidden="true">
      <span ref={ringRef} className="smooth-cursor-ring" />
      <span ref={dotRef} className="smooth-cursor-dot" />
    </div>
  );
}

function useScrollReveal() {
  useEffect(() => {
    const revealItems = document.querySelectorAll(".reveal-section, .scroll-reveal");
    if (!revealItems.length) return undefined;

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.14,
      },
    );

    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);
}

function usePortfolioData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const entries = await Promise.all(
          Object.entries(dataFiles).map(async ([key, url]) => {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Could not load ${url}`);
            return [key, await response.json()];
          }),
        );

        if (active) setData(Object.fromEntries(entries));
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Could not load portfolio data");
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, []);

  return { data, error };
}

function useThemeMode() {
  const [theme, setTheme] = useState(() => localStorage.getItem("portfolio-theme") || "dark");

  useEffect(() => {
    localStorage.setItem("portfolio-theme", theme);
    document.documentElement.dataset.themeMode = theme;
  }, [theme]);

  return [theme, setTheme];
}

function PageShell({ children, profile, links, theme, onThemeChange }) {
  useScrollReveal();

  return (
    <div className="app-shell min-h-screen scroll-smooth font-[Inter] selection:bg-cyan-400 selection:text-slate-950">
      <SmoothCursor />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        html { scroll-behavior: smooth; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-fade-up { animation: fadeUp .85s ease both; }
        .animate-pulse-soft { animation: pulseSoft 2.7s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseSoft { 0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 34%, transparent); } 50% { box-shadow: 0 0 0 18px transparent; } }
      `}</style>
      <Navbar profile={profile} links={links} theme={theme} onThemeChange={onThemeChange} />
      <div className="page-transition relative z-10">{children}</div>
      <Footer profile={profile} />
    </div>
  );
}

function Navbar({ profile, links, theme, onThemeChange }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleNav = (section) => {
    setOpen(false);
    if (window.location.pathname !== "/") {
      navigateWithTransition(navigate, "/", () => scrollToSection(section));
    } else {
      scrollToSection(section);
    }
  };

  return (
    <div className="nav-shell sticky top-0 z-50 px-4 py-3 lg:px-12">
      <div className="glass liquid-glass navbar mx-auto max-w-7xl rounded-2xl border px-4 shadow-xl">
      <div className="navbar-start">
        <button onClick={() => handleNav("home")} className="brand-mark text-xl font-black tracking-tight text-primary">
          {profile.name.split(" ")[0]}<span className="text-accent">.</span>
        </button>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1 px-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <button onClick={() => handleNav(item.href)} className="nav-link rounded-full font-semibold text-secondary hover:bg-accent-soft hover:text-accent">
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <button
          className="btn btn-circle btn-sm border-soft bg-soft text-primary hover:border-accent hover:bg-accent-soft"
          onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
          aria-label="Change color theme"
          title="Change color theme"
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>
        <a href={links.github} target="_blank" rel="noreferrer" className="btn btn-circle btn-sm border-soft bg-soft text-primary hover:border-accent hover:bg-accent-soft">
          <FaGithub />
        </a>
        <button className="btn btn-circle btn-sm border-soft bg-soft text-primary lg:hidden" onClick={() => setOpen(!open)} aria-label="Open navigation">
          <FaBars />
        </button>
      </div>

      {open && (
        <div className="liquid-glass absolute left-4 right-4 top-[4.7rem] rounded-3xl border border-soft p-4 shadow-2xl lg:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <button key={item.href} onClick={() => handleNav(item.href)} className="rounded-2xl px-4 py-3 text-left font-semibold text-secondary hover:bg-accent-soft hover:text-accent">
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="section-title mx-auto mb-12 max-w-3xl text-center">
      <p className="eyebrow mb-3 text-sm font-bold uppercase tracking-[0.35em] text-accent">{eyebrow}</p>
      <h2 className="text-3xl font-black text-primary md:text-5xl">{title}</h2>
      {description && <p className="mt-5 text-base leading-8 text-secondary md:text-lg">{description}</p>}
    </div>
  );
}

function Hero({ profile, links }) {
  return (
    <section id="home" className="reveal-section is-visible hero-section relative overflow-hidden px-4 pb-24 pt-16 md:pb-28 md:pt-24 lg:px-12">
      <div className="hero-glow-primary absolute left-[-80px] top-20 h-72 w-72 rounded-full blur-3xl" />
      <div className="hero-glow-secondary absolute bottom-10 right-[-80px] h-80 w-80 rounded-full blur-3xl" />

      <div className="container mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
        <div className="animate-fade-up">
          <div className="status-pill mb-6 inline-flex items-center gap-2 rounded-full border border-accent bg-accent-soft px-4 py-2 text-sm font-bold text-accent">
            <span className="status-dot" />
            Available for Web Development Projects
          </div>
          <h1 className="hero-heading text-4xl font-black leading-tight text-primary md:text-6xl lg:text-7xl">
            Hi, I am <span className="gradient-text">{profile.name}</span>
          </h1>
          <h2 className="mt-5 text-xl font-bold text-accent md:text-2xl">{profile.designation}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-secondary">{profile.intro}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href={profile.resume} download className="btn border-none bg-accent text-on-accent shadow-lg hover:bg-accent-hover">
              <FaDownload /> Download Resume
            </a>
            <button onClick={() => scrollToSection("projects")} className="btn border-soft bg-soft text-primary hover:border-accent hover:bg-accent-soft">
              <FaRocket /> View Projects
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <SocialButton href={links.github} icon={<FaGithub />} label="GitHub" />
            <SocialButton href={links.linkedin} icon={<FaLinkedin />} label="LinkedIn" />
            <SocialButton href={links.codeforces} icon={<SiCodeforces />} label="Codeforces" />
            <SocialButton href={`mailto:${profile.email}`} icon={<FaEnvelope />} label="Email" />
          </div>

          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            <HeroMetric value="React" label="Primary stack" />
            <HeroMetric value="UI/UX" label="Design focus" />
            <HeroMetric value={profile.location} label="Location" />
          </div>
        </div>

        <div className="hero-visual relative mx-auto w-full max-w-md animate-float">
          <div className="hero-photo-glow absolute inset-0 rounded-[3rem] blur-2xl opacity-30" />
          <div className="profile-frame liquid-glass relative rounded-[3rem] border border-soft p-4 shadow-2xl">
            <img
              src={profile.photo}
              alt={profile.name}
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x700/0f172a/67e8f9?text=Your+Photo";
              }}
              className="h-[420px] w-full rounded-[2.4rem] object-cover"
            />
          </div>
          <div className="floating-note liquid-glass absolute -bottom-6 left-6 rounded-3xl border border-soft p-5 shadow-2xl">
            <p className="text-sm text-muted">Focused on</p>
            <p className="font-bold text-primary">Clean UI + Responsive UX</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMetric({ value, label }) {
  return (
    <div className="metric-card rounded-2xl border border-soft bg-soft p-4">
      <p className="text-lg font-black text-primary">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

function SocialButton({ href, icon, label }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="btn btn-sm rounded-full border-soft bg-soft text-secondary hover:border-accent hover:bg-accent-soft hover:text-accent">
      {icon} {label}
    </a>
  );
}

function About({ profile }) {
  return (
    <section id="about" className="reveal-section section-band px-4 py-20 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        <SectionTitle eyebrow="About Me" title={profile.aboutTitle} description={profile.aboutDescription} />

        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div className="themed-card feature-card scroll-reveal p-8">
            <FaCode className="mb-5 text-5xl text-accent" />
            <h3 className="mb-4 text-2xl font-black text-primary">My Programming Journey</h3>
            <p className="leading-8 text-secondary">{profile.journey}</p>
          </div>

          <div className="themed-card feature-card scroll-reveal p-8">
            <h3 className="mb-4 text-2xl font-black text-primary">What I Enjoy</h3>
            <p className="leading-8 text-secondary">{profile.interests}</p>
            <p className="mt-5 leading-8 text-secondary">{profile.outsideProgramming}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills({ skills }) {
  return (
    <section id="skills" className="reveal-section section-band px-4 py-20 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Skills"
          title="Technologies I use to build modern websites"
          description="A categorized skill section with progress-style graphical bars. You can change the values anytime."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="themed-card feature-card scroll-reveal p-6 transition hover:-translate-y-2 hover:border-accent">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-accent-soft p-3 text-accent">
                  <FaTools />
                </div>
                <h3 className="text-2xl font-black text-primary">{category}</h3>
              </div>
              <div className="space-y-5">
                {items.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-2 flex justify-between text-sm font-semibold text-secondary">
                      <span>{skill.name}</span>
                      <span>{skill.value}%</span>
                    </div>
                    <progress className="progress progress-info h-3 w-full bg-track" value={skill.value} max="100" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <TechPill icon={<SiReact />} label="React" />
          <TechPill icon={<SiJavascript />} label="JavaScript" />
          <TechPill icon={<SiTailwindcss />} label="Tailwind" />
          <TechPill icon={<SiDaisyui />} label="DaisyUI" />
          <TechPill icon={<SiNetlify />} label="Netlify" />
        </div>
      </div>
    </section>
  );
}

function TechPill({ icon, label }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-soft bg-soft px-5 py-4 text-lg font-bold text-primary">
      <span className="text-accent">{icon}</span> {label}
    </div>
  );
}

function Education({ education }) {
  return (
    <section id="education" className="reveal-section section-band px-4 py-20 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        <SectionTitle eyebrow="Education" title="Educational Qualification" description="Add your real institute name, passing year, CGPA, and achievements here." />

        <div className="timeline-grid grid gap-6 lg:grid-cols-2">
          {education.map((item, index) => (
            <div key={index} className="themed-card timeline-card scroll-reveal p-7">
              <FaGraduationCap className="mb-5 text-4xl text-accent" />
              <h3 className="text-2xl font-black text-primary">{item.degree}</h3>
              <p className="mt-2 font-bold text-accent">{item.institute}</p>
              <p className="mt-1 text-sm text-muted">{item.year}</p>
              <p className="mt-5 leading-8 text-secondary">{item.details}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience({ experiences }) {
  return (
    <section id="experience" className="reveal-section section-band px-4 py-20 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        <SectionTitle eyebrow="Experience" title="Experience" description="Keep this section if you have experience. Otherwise, you can rename it to Training / Activities." />

        <div className="mx-auto max-w-4xl space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="themed-card timeline-card scroll-reveal p-7">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-black text-primary">{exp.role}</h3>
                  <p className="font-bold text-accent">{exp.company}</p>
                </div>
                <span className="badge border-accent bg-accent-soft px-4 py-4 text-accent">{exp.duration}</span>
              </div>
              <p className="mt-5 leading-8 text-secondary">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects({ projects }) {
  return (
    <section id="projects" className="reveal-section section-band px-4 py-20 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Projects"
          title="Selected projects that show my frontend skills"
          description="Each project card includes a detailed page with stack, description, live link, GitHub link, challenges, and future plans."
        />

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  const navigate = useNavigate();
  const handleDetailsClick = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigateWithTransition(navigate, `/project/${project.id}`);
  };

  return (
    <div className="project-card themed-card scroll-reveal group overflow-hidden transition duration-300 hover:-translate-y-2 hover:border-accent">
      <div className="relative h-56 overflow-hidden">
        <img
          src={project.image}
          alt={project.name}
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/700x450/0f172a/67e8f9?text=${encodeURIComponent(project.name)}`;
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 image-fade" />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-black text-primary">{project.name}</h3>
        <p className="mt-3 min-h-24 leading-7 text-secondary">{project.short}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.slice(0, 3).map((tech) => (
            <span key={tech} className="badge border-accent bg-accent-soft text-accent">
              {tech}
            </span>
          ))}
        </div>
        <Link to={`/project/${project.id}`} onClick={handleDetailsClick} className="btn mt-6 w-full border-none bg-accent text-on-accent hover:bg-accent-hover">
          View More / Details
        </Link>
      </div>
    </div>
  );
}

function Contact({ profile, links }) {
  return (
    <section id="contact" className="reveal-section section-band px-4 py-20 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        <SectionTitle eyebrow="Contact" title="Let's build something together" description="Visitors can contact you directly through email, phone, LinkedIn, GitHub, or WhatsApp." />

        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div className="themed-card feature-card scroll-reveal p-8">
            <h3 className="mb-6 text-2xl font-black text-primary">Contact Information</h3>
            <div className="space-y-4">
              <ContactLine icon={<FaEnvelope />} label="Email" value={profile.email} href={`mailto:${profile.email}`} />
              <ContactLine icon={<FaPhoneAlt />} label="Phone" value={profile.phone} href={`tel:${profile.phone}`} />
              <ContactLine icon={<FaWhatsapp />} label="WhatsApp" value={profile.phone} href={links.whatsapp} />
              <ContactLine icon={<FaLinkedin />} label="LinkedIn" value="toukir-sarder" href={links.linkedin} />
              <ContactLine icon={<FaGithub />} label="GitHub" value="Toukir048" href={links.github} />
            </div>
          </div>

          <form className="themed-card feature-card scroll-reveal p-8" onSubmit={(e) => e.preventDefault()}>
            <h3 className="mb-6 text-2xl font-black text-primary">Send a Message</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="input input-bordered border-soft bg-input text-primary" placeholder="Your Name" />
              <input className="input input-bordered border-soft bg-input text-primary" placeholder="Your Email" />
            </div>
            <input className="input input-bordered mt-4 w-full border-soft bg-input text-primary" placeholder="Subject" />
            <textarea className="textarea textarea-bordered mt-4 min-h-36 w-full border-soft bg-input text-primary" placeholder="Your Message" />
            <a href={`mailto:${profile.email}`} className="btn mt-4 border-none bg-accent text-on-accent hover:bg-accent-hover">
              Send Message
            </a>
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactLine({ icon, label, value, href }) {
  return (
    <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="scroll-reveal flex items-center gap-4 rounded-2xl border border-soft bg-input p-4 transition hover:border-accent hover:bg-accent-soft">
      <span className="rounded-xl bg-accent-soft p-3 text-accent">{icon}</span>
      <span>
        <span className="block text-sm text-muted">{label}</span>
        <span className="font-bold text-primary">{value}</span>
      </span>
    </a>
  );
}

function Footer({ profile }) {
  return (
    <footer className="border-t border-soft px-4 py-8 text-center lg:px-12">
      <p className="text-muted">&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
    </footer>
  );
}

function LoadingScreen({ theme, onThemeChange }) {
  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4">
      <button
        className="btn absolute right-4 top-4 border-soft bg-soft text-primary"
        onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
        aria-label="Change color theme"
      >
        {theme === "dark" ? <FaSun /> : <FaMoon />}
      </button>
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-soft border-t-[var(--accent)]" />
        <p className="font-semibold text-secondary">Loading portfolio...</p>
      </div>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4 text-center">
      <div className="themed-card max-w-lg p-8">
        <h1 className="text-2xl font-black text-primary">Data could not load</h1>
        <p className="mt-4 text-secondary">{message}</p>
      </div>
    </main>
  );
}

function HomePage({ data, theme, onThemeChange }) {
  return (
    <PageShell profile={data.profile} links={data.links} theme={theme} onThemeChange={onThemeChange}>
      <Hero profile={data.profile} links={data.links} />
      <About profile={data.profile} />
      <Skills skills={data.skills} />
      <Education education={data.education} />
      <Experience experiences={data.experiences} />
      <Projects projects={data.projects} />
      <Contact profile={data.profile} links={data.links} />
    </PageShell>
  );
}

function ProjectDetailsPage({ data, theme, onThemeChange }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = useMemo(() => data.projects.find((item) => item.id === id), [data.projects, id]);

  if (!project) {
    return (
      <PageShell profile={data.profile} links={data.links} theme={theme} onThemeChange={onThemeChange}>
        <main className="container mx-auto px-4 py-24 text-center lg:px-12">
          <h1 className="text-4xl font-black text-primary">Project not found</h1>
          <button onClick={() => navigateWithTransition(navigate, "/")} className="btn mt-6 border-none bg-accent text-on-accent">
            Go Back Home
          </button>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell profile={data.profile} links={data.links} theme={theme} onThemeChange={onThemeChange}>
      <main className="container mx-auto px-4 py-16 lg:px-12">
        <button onClick={() => navigateWithTransition(navigate, -1)} className="btn mb-8 border-soft bg-soft text-primary hover:border-accent hover:bg-accent-soft">
          <FaArrowLeft /> Back
        </button>

        <div className="grid gap-10 lg:grid-cols-[1fr_.85fr]">
          <div>
            <img
              src={project.image}
              alt={project.name}
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/900x560/0f172a/67e8f9?text=${encodeURIComponent(project.name)}`;
              }}
              className="h-[360px] w-full rounded-[2rem] border border-soft object-cover shadow-2xl"
            />
          </div>
          <div className="themed-card feature-card scroll-reveal p-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-accent">Project Details</p>
            <h1 className="text-3xl font-black text-primary md:text-5xl">{project.name}</h1>
            <p className="mt-5 leading-8 text-secondary">{project.description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={project.live} target="_blank" rel="noreferrer" className="btn border-none bg-accent text-on-accent hover:bg-accent-hover">
                <FaExternalLinkAlt /> Live Link
              </a>
              <a href={project.github} target="_blank" rel="noreferrer" className="btn border-soft bg-soft text-primary hover:border-accent hover:bg-accent-soft">
                <FaGithub /> Client GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-7 lg:grid-cols-3">
          <DetailBox title="Main Technology Stack" icon={<FaCodeBranch />}>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span key={tech} className="badge border-accent bg-accent-soft px-3 py-3 text-accent">
                  {tech}
                </span>
              ))}
            </div>
          </DetailBox>
          <DetailBox title="Challenges Faced" icon={<FaTools />}>
            <p className="leading-8 text-secondary">{project.challenges}</p>
          </DetailBox>
          <DetailBox title="Future Plans" icon={<FaRocket />}>
            <p className="leading-8 text-secondary">{project.improvements}</p>
          </DetailBox>
        </div>
      </main>
    </PageShell>
  );
}

function DetailBox({ title, icon, children }) {
  return (
    <div className="themed-card feature-card scroll-reveal p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="rounded-2xl bg-accent-soft p-3 text-accent">{icon}</span>
        <h2 className="text-xl font-black text-primary">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const { data, error } = usePortfolioData();
  const [theme, setTheme] = useThemeMode();

  if (error) return <ErrorScreen message={error} />;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={data ? <HomePage data={data} theme={theme} onThemeChange={setTheme} /> : <LoadingScreen theme={theme} onThemeChange={setTheme} />}
        />
        <Route
          path="/project/:id"
          element={data ? <ProjectDetailsPage data={data} theme={theme} onThemeChange={setTheme} /> : <LoadingScreen theme={theme} onThemeChange={setTheme} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
