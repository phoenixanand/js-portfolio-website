import { useState, useEffect, useRef } from "react";

// ── Utility: clamp scroll progress ──────────────────────────────────────
const useScrollY = () => {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
};

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

// ── Color / Design tokens ────────────────────────────────────────────────
const C = {
  bg: "#050A10",
  surface: "#0A1628",
  card: "rgba(10,22,40,0.85)",
  border: "rgba(0,200,255,0.15)",
  accent: "#00C8FF",
  accent2: "#00FF94",
  accent3: "#FF6B35",
  text: "#E2EEF8",
  muted: "#6B8CA8",
};

// ── Global styles injected once ──────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{background:${C.bg};color:${C.text};font-family:'Syne',sans-serif;overflow-x:hidden}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:${C.bg}}
    ::-webkit-scrollbar-thumb{background:${C.accent};border-radius:2px}
    .mono{font-family:'Space Mono',monospace}
    .glass{background:rgba(10,22,40,0.7);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid ${C.border}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes pulse-ring{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.6);opacity:0}}
    @keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideRight{from{width:0}to{width:var(--w)}}
    @keyframes dash{to{stroke-dashoffset:0}}
    .fade-up{animation:fadeUp .6s ease both}
    .delay-1{animation-delay:.1s}.delay-2{animation-delay:.2s}.delay-3{animation-delay:.3s}.delay-4{animation-delay:.4s}.delay-5{animation-delay:.5s}
    a{color:inherit;text-decoration:none}
    section{position:relative}
  `}</style>
);

// ── Reusable Tag chip ────────────────────────────────────────────────────
const Tag = ({ label, color = C.accent }) => (
  <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 99, border: `1px solid ${color}40`, color, background: `${color}12`, fontFamily: "'Space Mono',monospace", letterSpacing: ".04em" }}>
    {label}
  </span>
);

// ── Section Header ───────────────────────────────────────────────────────
const SectionHeader = ({ pre, title, sub }) => (
  <div style={{ textAlign: "center", marginBottom: 48 }}>
    <p className="mono" style={{ color: C.accent, fontSize: 12, letterSpacing: "0.2em", marginBottom: 10, textTransform: "uppercase" }}>{pre}</p>
    <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 12 }}>{title}</h2>
    {sub && <p style={{ color: C.muted, maxWidth: 560, margin: "0 auto", lineHeight: 1.7, fontSize: 15 }}>{sub}</p>}
    <div style={{ width: 48, height: 2, background: `linear-gradient(90deg,${C.accent},${C.accent2})`, margin: "20px auto 0", borderRadius: 1 }} />
  </div>
);

// ── Floating background particles ────────────────────────────────────────
const Particles = () => {
  const pts = Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * 100, y: Math.random() * 100,
    s: Math.random() * 2 + 1, d: Math.random() * 6 + 4, o: Math.random() * .4 + .1
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {pts.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.s, height: p.s, borderRadius: "50%",
          background: C.accent, opacity: p.o,
          animation: `float ${p.d}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 4}s`
        }} />
      ))}
      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
        backgroundSize: "60px 60px", opacity: .3
      }} />
    </div>
  );
};

// ── Navbar ───────────────────────────────────────────────────────────────
const Navbar = () => {
  const y = useScrollY();
  const [open, setOpen] = useState(false);
  const links = ["About", "Stack", "Projects", "Timeline", "Achievements", "Contact"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: y > 40 ? "rgba(5,10,16,0.92)" : "transparent",
      backdropFilter: y > 40 ? "blur(20px)" : "none",
      borderBottom: y > 40 ? `1px solid ${C.border}` : "none",
      transition: "all .3s ease", padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div className="mono" style={{ color: C.accent, fontSize: 14, fontWeight: 700, letterSpacing: ".05em" }}>
          <span style={{ color: C.accent2 }}>{">"}</span> anand<span style={{ color: C.muted }}>@devops</span>
        </div>
        {/* Desktop */}
        <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="desktop-nav">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: 13, color: C.muted, transition: "color .2s" }}
              onMouseEnter={e => e.target.style.color = C.accent} onMouseLeave={e => e.target.style.color = C.muted}>
              {l}
            </a>
          ))}
          <a href="#contact" style={{ padding: "8px 20px", borderRadius: 6, background: `${C.accent}15`, border: `1px solid ${C.accent}40`, color: C.accent, fontSize: 13, fontWeight: 600, transition: "background .2s" }}
            onMouseEnter={e => e.target.style.background = `${C.accent}25`} onMouseLeave={e => e.target.style.background = `${C.accent}15`}>
            Hire Me
          </a>
        </div>
        {/* Mobile burger */}
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: C.accent, fontSize: 22, cursor: "pointer", display: "none" }} className="burger">☰</button>
      </div>
      <style>{`@media(max-width:768px){.desktop-nav{display:none!important}.burger{display:block!important}}`}</style>
    </nav>
  );
};

// ── Hero ─────────────────────────────────────────────────────────────────
const Hero = () => {
  const [typed, setTyped] = useState("");
  const full = "DevOps Engineer | Cloud & Infrastructure Automation";
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { if (i <= full.length) { setTyped(full.slice(0, i)); i++; } else clearInterval(t); }, 45);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px", position: "relative", zIndex: 1 }}>
      {/* Glow */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle,${C.accent}18 0%,transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 900, textAlign: "center" }}>
        {/* Status badge */}
        {/* <div className="glass fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 99, marginBottom: 28, fontSize: 12 }} >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent2, boxShadow: `0 0 8px ${C.accent2}`, display: "inline-block", animation: "pulse-ring 1.5s ease-out infinite" }} />
          <span className="mono" style={{ color: C.accent2 }}>Available for opportunities</span>
        </div> */}

        <h1 className="fade-up delay-1" style={{ fontSize: "clamp(2.8rem,8vw,5.5rem)", fontWeight: 800, lineHeight: 1, marginBottom: 16, letterSpacing: "-.02em" }}>
          Hey, I'm{" "}
          <span style={{ background: `linear-gradient(135deg,${C.accent},${C.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Anand</span>
          {/* <br /><span style={{ color: C.muted, fontSize: "60%" }}>(Phoenix)</span> */}
        </h1>

        <div className="mono fade-up delay-2" style={{ fontSize: "clamp(.9rem,2.5vw,1.2rem)", color: C.accent, marginBottom: 16, height: "2em", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <span style={{ color: C.accent2 }}>$</span> {typed}
          <span style={{ animation: "blink 1s step-end infinite", color: C.accent }}>█</span>
        </div>

        <p className="fade-up delay-3" style={{ color: C.muted, fontSize: "clamp(.95rem,2vw,1.1rem)", lineHeight: 1.8, maxWidth: 640, margin: "0 auto 40px" }}>
          I design <span style={{ color: C.text }}>scalable cloud infrastructure</span>, automate <span style={{ color: C.text }}>CI/CD pipelines</span>, and build <span style={{ color: C.text }}>reliable deployment systems</span> that ship faster and break less.
        </p>

        <div className="fade-up delay-4" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "View Projects", href: "#projects", primary: true },
            { label: "Resume", href: "./resume/Anand.pdf", primary: false },
            { label: "GitHub", href: "https://github.com/phoenixanand", primary: false },
          ].map(btn => (
            <a key={btn.label} href={btn.href}
              style={{
                padding: "12px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .25s",
                ...(btn.primary
                  ? { background: `linear-gradient(135deg,${C.accent},${C.accent2})`, color: "#050A10", border: "none", boxShadow: `0 0 24px ${C.accent}40` }
                  : { background: "transparent", color: C.text, border: `1px solid ${C.border}` })
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; if (!btn.primary) e.currentTarget.style.borderColor = C.accent; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; if (!btn.primary) e.currentTarget.style.borderColor = C.border; }}>
              {btn.label}
            </a>
          ))}
        </div>

        {/* Stats row */}
        <div className="fade-up delay-5" style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 60, flexWrap: "wrap" }}>
          {[["8+", "Projects"], ["3+", "Articles"], ["5yrs+", "Blockchain Analyst"], ["2nd", "Hackathon Place"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: C.accent, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── About ────────────────────────────────────────────────────────────────
const About = () => {
  const [ref, inView] = useInView();
  const highlights = [
    { icon: "☁️", label: "Cloud Infrastructure", desc: "Designing scalable AWS architectures for production workloads" },
    { icon: "🔐", label: "Blockchain", desc: "Blockchain in smart contract ecosystems, on-chain data analysis, and decentralized infrastructure" },
    { icon: "🐳", label: "Devops", desc: "DevOps enthusiast focused on automating infrastructure, building CI/CD pipelines, and deploying scalable cloud-native applications" },
    { icon: "🏗️", label: "Cryptography", desc: "Strong interest in cryptography, exploring encryption, decryption, and Cipher" },
    { icon: "📊", label: "Machine Learning", desc: "Experienced in machine learning and applying data-driven approaches to solve real-world problems." },
    { icon: "𖥂", label: "Drone Technology", desc: "Skilled in drone technology and aerial operations with hands-on experience in drone navigation, and aerial systems" },
  ];
  return (
    <section id="about" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }} ref={ref}>
        <SectionHeader pre="about me" title="Building Reliable Systems at Scale" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          {/* Left */}
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateX(-30px)", transition: "all .7s ease" }}>
            <div className="mono" style={{ color: C.accent2, fontSize: 12, marginBottom: 16, letterSpacing: ".1em" }}>$ whoami</div>
            <p style={{ color: C.text, lineHeight: 1.9, marginBottom: 16, fontSize: 15 }}>
              I'm <strong style={{ color: C.accent }}>Anand</strong>, a DevOps Engineer passionate about bridging the gap between development and operations through automation, cloud infrastructure, and modern deployment practices.
            </p>
            <p style={{ color: C.muted, lineHeight: 1.9, marginBottom: 24, fontSize: 15 }}>
              My journey started with Electronics & Communication Engineering and evolved into a deep focus on cloud-native DevOps practices. I've built CI/CD pipelines for Spring Boot and Flask applications, implemented GitOps workflows with ArgoCD, and set up full observability stacks for microservices environments.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["AWS", "Kubernetes", "Terraform", "Blockchain", "Jenkins", "Docker"].map(t => <Tag key={t} label={t} />)}
            </div>
          </div>
          {/* Right grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, opacity: inView ? 1 : 0, transform: inView ? "none" : "translateX(30px)", transition: "all .7s ease .2s" }}>
            {highlights.map((h, i) => (
              <div key={i} className="glass" style={{ padding: 18, borderRadius: 12, transition: "transform .25s,border-color .25s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = `${C.accent}50`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = C.border; }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{h.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{h.label}</div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{h.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){#about .grid2{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
};

// ── Tech Stack ───────────────────────────────────────────────────────────
const techData = [
  { cat: "Cloud", color: C.accent, tools: [{ n: "AWS", i: "☁️" }] },
  { cat: "Containers", color: "#2496ED", tools: [{ n: "Docker", i: "🐳" }, { n: "Kubernetes", i: "⚙️" }] },
  { cat: "CI/CD", color: C.accent2, tools: [{ n: "Jenkins", i: "🔧" }, { n: "GitHub Actions", i: "🐙" }, { n: "CodePipeline", i: "🔀" }, { n: "CodeBuild", i: "🏗️" }, { n: "CodeDeploy", i: "🚀" }] },
  { cat: "IaC", color: "#7B42BC", tools: [{ n: "Terraform", i: "🏔️" }] },
  { cat: "Observability", color: C.accent3, tools: [{ n: "Prometheus", i: "📊" }, { n: "Grafana", i: "📈" }, { n: "ELK Stack", i: "🔍" }, { n: "Jaeger", i: "🔭" }, { n: "OpenTelemetry", i: "📡" }] },
  { cat: "Programming", color: "#FFD700", tools: [{ n: "Python", i: "🐍" }, { n: "Linux Scripting", i: "🐧" } ] },
];

const Stack = () => {
  const [ref, inView] = useInView();
  return (
    <section id="stack" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }} ref={ref}>
        <SectionHeader pre="tech stack" title="Tools I Work With" sub="The DevOps toolchain powering my infrastructure automation and deployment workflows" />
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {techData.map((cat, ci) => (
            <div key={ci} style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: `all .5s ease ${ci * .1}s` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span className="mono" style={{ color: cat.color, fontSize: 12, letterSpacing: ".1em" }}>// {cat.cat}</span>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${cat.color}30,transparent)` }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {cat.tools.map((t, ti) => (
                  <div key={ti} className="glass" style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 10,
                    transition: "all .25s", cursor: "default", borderColor: `${cat.color}25`
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = `${cat.color}60`; e.currentTarget.style.boxShadow = `0 8px 24px ${cat.color}20`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = `${cat.color}25`; e.currentTarget.style.boxShadow = ""; }}>
                    <span style={{ fontSize: 18 }}>{t.i}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{t.n}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Projects ─────────────────────────────────────────────────────────────
const projects = [
  {
    title: "CI/CD Pipeline for Spring Boot Application",
    desc: "Built a full CI/CD pipeline that automatically builds, scans, containerizes, and deploys a Spring Boot application to Kubernetes using GitOps principles.",
    tools: ["Jenkins", "Docker", "SonarQube", "Kubernetes", "ArgoCD", "AWS", "Minikube"],
    color: C.accent, icon: "🔄", link: "https://github.com/phoenixanand/cicd-jenkins-argocd-project"
  },
  {
    title: "AWS CI/CD for Flask App",
    desc: "Implemented a fully automated CI/CD pipeline to build and deploy a Python Flask application on AWS using native cloud services.",
    tools: ["CodePipeline", "CodeBuild", "CodeDeploy", "EC2", "S3", "GitHub"],
    color: C.accent2, icon: "☁️", link: "https://github.com/phoenixanand/aws-python"
  },
  {
    title: "Kubernetes GitOps Deployment",
    desc: "Implemented GitOps-based continuous deployment using ArgoCD for declarative, version-controlled Kubernetes cluster management.",
    tools: ["Kubernetes", "Docker", "ArgoCD"],
    color: "#2496ED", icon: "⎈", link: "https://github.com/phoenixanand/opentelemetry-demo"
  },
  {
    title: "Observability Stack",
    desc: "Implemented comprehensive monitoring, logging, and distributed tracing for microservices with full visibility across the stack.",
    tools: ["Prometheus", "Grafana", "ELK Stack", "Jaeger", "OpenTelemetry"],
    color: C.accent3, icon: "📊", link: "https://github.com/phoenixanand"
  },
];

const PipelineViz = ({ type }) => {
  const steps = {
    jenkins: ["Code Push", "Jenkins Trigger", "Maven Build", "SonarQube Scan", "Docker Build", "Push to Registry", "ArgoCD Deploy", "K8s Cluster"],
    aws: ["GitHub Push", "CodePipeline", "CodeBuild", "Unit Tests", "S3 Artifact", "CodeDeploy", "EC2 Instance"],
    obs: ["App Metrics", "Prometheus", "Grafana", "Logs → ELK", "Traces → Jaeger", "OpenTelemetry", "Alerts"],
  }[type];
  const color = type === "jenkins" ? C.accent : type === "aws" ? C.accent2 : C.accent3;
  return (
    <div style={{ overflowX: "auto", paddingBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: "max-content" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, margin: "0 auto 4px", boxShadow: `0 0 8px ${color}` }} />
              <div className="mono" style={{ fontSize: 9, color: C.muted, maxWidth: 60, lineHeight: 1.3, textAlign: "center" }}>{s}</div>
            </div>
            {i < steps.length - 1 && <div style={{ width: 28, height: 1, background: `linear-gradient(90deg,${color}60,${color}30)`, margin: "0 0 14px", flexShrink: 0 }} />}
          </div>
        ))}
      </div>
    </div>
  );
};

const Projects = () => {
  const [ref, inView] = useInView();
  return (
    <section id="projects" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }} ref={ref}>
        <SectionHeader pre="projects" title="DevOps Projects" sub="Real-world infrastructure automation and deployment engineering" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          {projects.map((p, i) => (
            <div key={i} className="glass" style={{
              borderRadius: 16, padding: 24, display: "flex", flexDirection: "column",
              opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(30px)",
              transition: `all .6s ease ${i * .1}s`, cursor: "default", borderColor: `${p.color}20`
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = `${p.color}50`; e.currentTarget.style.boxShadow = `0 20px 40px ${p.color}15`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = `${p.color}20`; e.currentTarget.style.boxShadow = ""; }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${p.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{p.icon}</div>
                <a href={p.link} target="_blank" rel="noreferrer" style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${p.color}40`, color: p.color, fontSize: 11, fontFamily: "'Space Mono',monospace", transition: "background .2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = `${p.color}15`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  GitHub ↗
                </a>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: C.text }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 16, flex: 1 }}>{p.desc}</p>
              {/* Pipeline viz */}
              <div style={{ marginBottom: 14, padding: "10px 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
                <PipelineViz type={i === 0 ? "jenkins" : i === 1 ? "aws" : i === 3 ? "obs" : "jenkins"} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {p.tools.map(t => <Tag key={t} label={t} color={p.color} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Architecture ──────────────────────────────────────────────────────────
const Architecture = () => {
  const [ref, inView] = useInView();
  const pipelines = [
    { title: "Jenkins CI/CD Pipeline", type: "jenkins", color: C.accent },
    { title: "AWS CI/CD Pipeline", type: "aws", color: C.accent2 },
    { title: "Observability Architecture", type: "obs", color: C.accent3 },
  ];
  return (
    <section id="architecture" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }} ref={ref}>
        <SectionHeader pre="architecture" title="DevOps Pipeline Architectures" sub="Visual diagrams of the deployment and observability pipelines I've built" />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {pipelines.map((p, i) => (
            <div key={i} className="glass" style={{
              borderRadius: 14, padding: "24px 28px",
              opacity: inView ? 1 : 0, transform: inView ? "none" : "translateX(-20px)",
              transition: `all .5s ease ${i * .15}s`, borderColor: `${p.color}25`
            }}>
              <div style={{ marginBottom: 16 }}>
                <span className="mono" style={{ color: p.color, fontSize: 11, letterSpacing: ".1em" }}>// {p.title.toUpperCase()}</span>
              </div>
              <PipelineViz type={p.type} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Timeline ─────────────────────────────────────────────────────────────
const timelineItems = [
  { year: "2022", title: "Blockchain Analyst", desc: "Blockchain Analyst specializing in on-chain data analysis, and decentralized infrastructure with hands-on experience across multiple blockchain protocols.", color: C.accent },
  { year: "2022", title: "Front-end development", desc: "Front-End Developer skilled in building modern, responsive web applications using clean UI/UX, scalable architecture, and the latest web technologies.", color: C.accent2 },
  { year: "2023", title: "Graduated in Electronics And Communication Engineering", desc: "Completed a Bachelor's degree in Electronics and Communication Engineering, building a strong foundation in problem-solving, analytical thinking, and core engineering concepts.", color: "#2496ED" },
  { year: "2024-2025", title: "SSC Aspirant", desc: "Dedicated two years to preparing for the SSC CGL examination, strengthening discipline, logical reasoning, and problem-solving abilities.", color: "#7B42BC" },
  { year: "2025", title: "AWS Journey", desc: "Achieved AWS Certified Cloud Practitioner and built hands-on experience with core AWS services such as EC2, S3, VPC, IAM, EKS, ECS, ECR, CloudFront, CloudFormation, and Systems Manager.", color: C.accent3 },
  { year: "2026", title: "DevOps Journey", desc: "Started my DevOps journey, learning tools like Docker, Kubernetes, Jenkins, Terraform, and building CI/CD pipelines for cloud-native applications.", color: "#FFD700" },
];

const Timeline = () => {
  const [ref, inView] = useInView();
  return (
    <section id="timeline" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }} ref={ref}>
        <SectionHeader pre="life journey" title="My Learning Journey" sub="From electronics engineering to cloud-native infrastructure automation" />
        <div style={{ position: "relative" }}>
          {/* Center line */}
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg,${C.accent},${C.accent2},${C.accent3})`, transform: "translateX(-50%)", opacity: .4 }} />
          {timelineItems.map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: i % 2 === 0 ? "flex-end" : "flex-start",
              paddingRight: i % 2 === 0 ? "calc(50% + 32px)" : 0,
              paddingLeft: i % 2 === 1 ? "calc(50% + 32px)" : 0,
              marginBottom: 28,
              opacity: inView ? 1 : 0, transform: inView ? "none" : `translateX(${i % 2 === 0 ? -20 : 20}px)`,
              transition: `all .5s ease ${i * .1}s`
            }}>
              {/* Dot */}
              <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 14, height: 14, borderRadius: "50%", background: item.color, boxShadow: `0 0 12px ${item.color}`, marginTop: 16, zIndex: 2 }} />
              <div className="glass" style={{ padding: "16px 20px", borderRadius: 12, maxWidth: 300, borderColor: `${item.color}30` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${item.color}60`; e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${item.color}30`; e.currentTarget.style.transform = ""; }}>
                <span className="mono" style={{ fontSize: 11, color: item.color }}>{item.year}</span>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: "4px 0 6px", color: C.text }}>{item.title}</h4>
                <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:600px){#timeline .timeline-item{padding-left:40px!important;padding-right:0!important;justify-content:flex-start!important}}`}</style>
    </section>
  );
};

// ── Achievements ─────────────────────────────────────────────────────────
const Achievements = () => {
  const [ref, inView] = useInView();
  const items = [
    { icon: "🏆", title: "Blockchain Hackathon – 2nd Place", sub: "Tamil Nadu State Level", desc: "Secured 2nd place in a competitive state-level blockchain hackathon among teams from top engineering colleges.", color: "#FFD700" },
    { icon: "📜", title: "Advanced Puzzle Challenge", sub: "12 Rings Completion", desc: "Successfully solved 144 complex challenges in the 12 Rings puzzle series, inspired by Cicada-3301. The challenges involved cryptography, steganography, programming, logical reasoning, mathematics, historical analysis, mapping, music, poetry, and hidden pattern recognition.", color: C.accent2 },
    { icon: "🚁", title: "Certified Drone Pilot", sub: "DGCA RPAS Certification", desc: "Certified Remote Pilot (RPAS) for Small & Medium category drones, issued under DGCA regulations. Skilled in drone operations, aerial navigation, safety protocols, and practical drone flight handling.", color: C.accent },
  ];
  return (
    <section id="achievements" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }} ref={ref}>
        <SectionHeader pre="achievements" title="Recognition & Milestones" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
          {items.map((a, i) => (
            <div key={i} className="glass" style={{
              padding: 28, borderRadius: 16, textAlign: "center",
              opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)",
              transition: `all .5s ease ${i * .15}s`, borderColor: `${a.color}25`
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = `${a.color}50`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = `${a.color}25`; }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{a.icon}</div>
              <span className="mono" style={{ fontSize: 10, color: a.color, letterSpacing: ".1em" }}>{a.sub}</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "8px 0 10px", color: C.text }}>{a.title}</h3>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── GitHub Activity ───────────────────────────────────────────────────────
const GitHub = () => {
  const [ref, inView] = useInView();
  return (
    <section id="github" style={{ padding: "80px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }} ref={ref}>
        <SectionHeader pre="github" title="GitHub Activity" sub="Open source contributions and project repositories" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, opacity: inView ? 1 : 0, transition: "opacity .7s ease" }}>
          {[
            { src: "https://github-readme-stats.vercel.app/api?username=phoenixanand&show_icons=true&theme=transparent&hide_border=true&title_color=00C8FF&icon_color=00FF94&text_color=E2EEF8&bg_color=0A1628", label: "Stats" },
            { src: "https://github-readme-streak-stats.herokuapp.com/?user=phoenixanand&theme=transparent&hide_border=true&ring=00C8FF&fire=00FF94&currStreakLabel=00C8FF&background=0A1628&stroke=0A1628&dates=6B8CA8", label: "Streak" },
          ].map((img, i) => (
            <div key={i} className="glass" style={{ borderRadius: 14, overflow: "hidden", padding: 16 }}>
              <img src={img.src} alt={`GitHub ${img.label}`} style={{ width: "100%", borderRadius: 8 }} onError={e => e.target.style.display = "none"} />
            </div>
          ))}
        </div>
        <div className="glass" style={{ marginTop: 20, borderRadius: 14, overflow: "hidden", padding: 16, opacity: inView ? 1 : 0, transition: "opacity .7s .2s ease" }}>
          <img src="https://ghchart.rshah.org/00C8FF/phoenixanand" alt="GitHub contribution chart" style={{ width: "100%", borderRadius: 8 }} onError={e => { e.target.parentElement.innerHTML = `<div style="padding:24px;text-align:center;color:#6B8CA8;font-family:'Space Mono',monospace;font-size:12px">// contribution graph — visit github.com/phoenixanand</div>`; }} />
        </div>
      </div>
      <style>{`@media(max-width:600px){#github .grid2{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
};

// ── Blog ──────────────────────────────────────────────────────────────────
const Blog = () => {
  const [ref, inView] = useInView();
  const posts = [
    { title: "Avoid vehicle collision using Lifi Technology", tag: "LIFI", color: C.accent, read: "8 min" },
    { title: "AWS CI/CD for Flask: CodePipeline to CodeDeploy", tag: "AWS", color: C.accent2, read: "6 min" },
    // { title: "GitOps with ArgoCD: Declarative K8s Deployments", tag: "GitOps", color: "#2496ED", read: "7 min" },
    // { title: "Monitoring Kubernetes with Prometheus & Grafana", tag: "Observability", color: C.accent3, read: "10 min" },
  ];
  return (
    <section id="blog" style={{ padding: "80px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }} ref={ref}>
        <SectionHeader pre="articles" title="Blog" sub="Technical deep-dives and tutorials" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
          {posts.map((p, i) => (
            <div key={i} className="glass" style={{
              padding: 22, borderRadius: 14, cursor: "pointer",
              opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)",
              transition: `all .5s ease ${i * .1}s`, borderColor: `${p.color}20`
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = `${p.color}50`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = `${p.color}20`; }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <Tag label={p.tag} color={p.color} />
                <span className="mono" style={{ fontSize: 10, color: C.muted }}>{p.read}</span>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.5, marginBottom: 14, color: C.text }}>{p.title}</h3>
              {/* <div style={{ fontSize: 12, color: p.color, fontFamily: "'Space Mono',monospace" }}>Coming soon →</div> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Contact ───────────────────────────────────────────────────────────────
const Contact = () => {
  const [ref, inView] = useInView();
  const links = [
    { icon: "📧", label: "Email", value: "anandk0211@gmail.com", href: "mailto:anandk0211@gmail.com", color: C.accent },
    { icon: "🐙", label: "GitHub", value: "phoenixanand", href: "https://github.com/phoenixanand", color: C.accent2 },
    { icon: "💼", label: "LinkedIn", value: "Connect with me", href: "https://www.linkedin.com/in/anand-k02/", color: "#0A66C2" },
    { icon: "🌐", label: "Dev", value: "dev.to/alpha-anand", href: "https://dev.to/alpha-anand", color: C.accent3 },
  ];
  return (
    <section id="contact" style={{ padding: "100px 24px 60px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }} ref={ref}>
        <SectionHeader pre="contact" title="Let's Build Something Together" sub="Open to DevOps roles, freelance infrastructure projects, and interesting engineering challenges." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 40 }}>
          {links.map((l, i) => (
            <a key={i} href={l.href} target="_blank" rel="noreferrer" className="glass" style={{
              display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 12,
              opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)",
              transition: `all .5s ease ${i * .1}s`, borderColor: `${l.color}25`
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${l.color}60`; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${l.color}25`; e.currentTarget.style.transform = ""; }}>
              <span style={{ fontSize: 24 }}>{l.icon}</span>
              <div style={{ textAlign: "left" }}>
                <div className="mono" style={{ fontSize: 10, color: l.color, letterSpacing: ".1em" }}>{l.label}</div>
                <div style={{ fontSize: 13, color: C.text }}>{l.value}</div>
              </div>
            </a>
          ))}
        </div>
        {/* Footer */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 28, color: C.muted, fontSize: 12 }} className="mono">
          <p>Built with React • Deployed on Vercel • Anand © 2026</p>
          <p style={{ marginTop: 6 }}>
            <span style={{ color: C.accent }}>{">"}</span> All rights by ANAND
          </p>
        </div>
      </div>
    </section>
  );
};

// ── Root App ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <GlobalStyle />
      <Particles />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Stack />
        <Projects />
        <Architecture />
        <Timeline />
        <Achievements />
        <GitHub />
        <Blog />
        <Contact />
      </main>
    </>
  );
}