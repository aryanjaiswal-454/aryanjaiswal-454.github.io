export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  year?: number;
  summary: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string | null;
  demoUrl?: string | null;
  image?: string | null;
  featured: boolean;
  order: number;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface TimelineItem {
  type: "experience" | "education";
  title?: string;
  qualification?: string;
  organization?: string;
  institution?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  certificateUrl?: string;
  postUrl?: string;
  result?: string;
  status?: string;
}

export interface GithubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number | null;
}

export interface FeaturedPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date?: string | null;
  featured: boolean;
  order: number;
}

export interface SiteConfig {
  websiteUrl: string;
  identity: {
    fullName: string;
    displayName: string;
    wordmark: string;
    profession: string;
    roleLine2: string;
    location: string;
    availability: string;
    headline: string;
    intro: string;
    about: string;
    portrait: string;
    resume: string;
    favicon: string;
    logo: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    github: string;
    kaggle: string;
    leetcode: string;
    codechef: string;
    codeforces: string;
    behance: string;
    dribbble: string;
    otherLinks: Array<{ label: string; url: string }>;
  };
  appearance: {
    background: string;
    surface: string;
    elevated: string;
    text: string;
    accent: string;
    brightAccent: string;
    deepAccent: string;
    muted: string;
    border: string;
    displayFont: string;
    bodyFont: string;
  };
  metadata: {
    title: string;
    description: string;
    canonical: string;
    openGraph: {
      type: string;
      title: string;
      description: string;
      url: string;
      image: string;
      imageAlt: string;
    };
    twitter: {
      card: string;
      title: string;
      description: string;
      image: string;
    };
    jsonLd: Record<string, unknown>;
  };
  localStorageKeys: {
    motionPreference: string;
  };
  ariaLabels: Record<string, string>;
  preferences: Record<string, boolean>;
}

export interface ApiMessage {
  error?: string;
  message?: string;
}
