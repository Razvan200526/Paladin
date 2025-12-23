// Resume Builder Types
export interface ContactInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  github?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string; // undefined = "Present"
  current: boolean;
  description: string; // HTML from Tiptap
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description: string; // HTML from Tiptap
}

export interface SkillCategory {
  id: string;
  name: string; // e.g., "Programming Languages", "Frameworks"
  skills: string[]; // e.g., ["TypeScript", "Python", "Go"]
}

export interface ProjectEntry {
  id: string;
  name: string;
  url?: string;
  technologies: string[];
  description: string; // HTML from Tiptap
}

export interface CustomSection {
  id: string;
  title: string;
  content: string; // HTML from Tiptap
}

export interface ResumeData {
  id: string;
  name: string; // Resume name for saving
  templateId: string;
  contact: ContactInfo;
  summary?: string; // HTML from Tiptap
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillCategory[];
  projects: ProjectEntry[];
  customSections: CustomSection[];
  createdAt: Date;
  updatedAt: Date;
}
