import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { Card } from '../components/ui/index.ts';
import { roadmap } from '../content/roadmap.ts';
import { usePageMeta } from '../utils/pageMeta.ts';
import './HomePage.css';

interface ResumeState {
  solvedCount: number;
}

interface SectionCard {
  to: string;
  title: string;
  blurb: string;
  count?: string;
  icon?: string;
}

const SECTIONS: SectionCard[] = [
  {
    to: '/data-structures',
    title: 'Data Structures & Algorithms',
    blurb: 'Linear, non-linear, Java collections, and concurrent structures — with memory-level intuition and visual animations.',
    count: 'topics',
  },
  {
    to: '/java',
    title: 'Java: The Backbone',
    blurb: 'Core Java fundamentals, OOP, collections & streams, exceptions & memory, and multithreading — from basics to advanced.',
    count: 'topics',
  },
  {
    to: '/spring',
    title: 'Spring Boot & Spring Framework',
    blurb: 'Dependency injection, Spring Boot autoconfiguration, data access, security, testing, and cloud-native patterns.',
    count: 'topics',
  },
  {
    to: '/databases',
    title: 'Databases',
    blurb: 'SQL, query optimization, indexing, transactions, NoSQL, sharding, and database design patterns for scalable systems.',
    count: 'topics',
  },
  {
    to: '/microservices',
    title: 'Microservices',
    blurb: 'Service decomposition, API design, service discovery, circuit breakers, event-driven architecture, and distributed transactions.',
    count: 'topics',
  },
  {
    to: '/cloud-devops',
    title: 'Cloud & DevOps',
    blurb: 'Containerization, Kubernetes, CI/CD pipelines, infrastructure as code, monitoring, and cloud-native patterns.',
    count: 'topics',
  },
  {
    to: '/ai-ml',
    title: 'AI & ML',
    blurb: 'Machine learning fundamentals, LLMs, RAG, vector databases, prompt engineering, and AI application architecture.',
    count: 'topics',
  },
  {
    to: '/system-design',
    title: 'System Design — LLD & HLD',
    blurb: 'Low-level design with OOP patterns, high-level architecture, scalability, and trade-off analysis for real-world systems.',
    count: 'topics',
  },
] as const;

export default function HomePage() {
  usePageMeta(
    'Java Data Structures & Algorithms, Collections, Concurrency and Low-Level Design',
    'Systems Whispering — learn Java DSA visually: 60+ animated topics, compilable Java code, curated LeetCode practice with progress tracking, guided study sheets, and low-level design.',
  );

  const [resume] = useState<ResumeState | null>(() => {
    try {
      const solvedRaw = window.localStorage.getItem('s4j-dsa-solved-problems');
      const solvedParsed: unknown = solvedRaw ? JSON.parse(solvedRaw) : [];
      const ids = Array.isArray(solvedParsed)
        ? solvedParsed.filter((id): id is string => typeof id === 'string')
        : Object.keys(solvedParsed as Record<string, unknown>).filter(
            (id) => (solvedParsed as Record<string, unknown>)[id] === true,
          );
      const solvedCount = ids.length;
      return solvedCount > 0 ? { solvedCount } : null;
    } catch {
      return null;
    }
  });

  return (
    <PageShell
      title="Systems Whispering"
      description="Learn the craft. Whisper to systems. Java data structures, algorithms, and collections — then low-level design — taught visually with animations and code you can compile."
    >
      <section className="hero" aria-label="Introduction">
        <h2 className="hero__title">From arrays to graphs, let's unfold algorithms before our eyes.</h2>
        <p className="hero__text">
          Every topic pairs plain-English explanation with compilable Java and a
          step-by-step animation you can play, pause, and scrub — then locks it
          in with curated practice and guided study sheets.
        </p>
        <div className="hero__actions">
          <Link className="hero__cta" to="/sheets">
            Start with a Sheet
          </Link>
        </div>
      </section>

      {resume ? (
        <Card title="Continue where you left off">
          <p>
            <Link to="/problems">{resume.solvedCount} problems solved — keep going</Link>
          </p>
        </Card>
      ) : null}

      <h2 className="home-section-title">Let's break Systems, until they Whisper!</h2>
      <div className="home-cards">
        {SECTIONS.map((section) => (
          <Card key={section.to} title={section.title}>
            <p>{section.blurb}</p>
          </Card>
        ))}
      </div>

      <h2 className="home-section-title">Our Journey: A Nerd to a Veteran</h2>
      <div className="roadmap">
        {roadmap.map((phase) => (
          <Card key={phase.id} title={`${phase.order}. ${phase.title}`}>
            <p className="roadmap__goal">{phase.goal}</p>
            <p className="roadmap__meta">
              <span className="roadmap__label">Duration:</span>{' '}
              {phase.duration}
            </p>
            <h3 className="roadmap__sub">Topics</h3>
            <ul className="roadmap__topics">
              {phase.topics.map((topic) => (
                <li key={topic.title} className="roadmap__topic">
                  <span className="roadmap__topic-title">{topic.title}</span>
                  <span className="roadmap__topic-desc">— {topic.description}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}