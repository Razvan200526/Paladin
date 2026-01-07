// Resume Template Types

export type TemplateId =
  | 'classic'
  | 'modern'
  | 'minimal'
  | 'professional'
  | 'creative';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string; // Could be a URL or component name
  colors: TemplateColors;
  fonts: TemplateFonts;
  layout: TemplateLayout;
}

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  background: string;
  headerBackground: string;
  sectionBorder: string;
}

export interface TemplateFonts {
  heading: string;
  body: string;
  size: {
    name: string;
    sectionTitle: string;
    jobTitle: string;
    body: string;
    small: string;
  };
}

export interface TemplateLayout {
  type: 'single-column' | 'two-column' | 'sidebar-left' | 'sidebar-right';
  headerStyle: 'centered' | 'left-aligned' | 'two-column' | 'banner';
  sectionSpacing: 'compact' | 'normal' | 'spacious';
  showIcons: boolean;
  borderStyle: 'none' | 'underline' | 'boxed' | 'accent-left';
}

// Predefined template configurations
export const RESUME_TEMPLATES: Record<TemplateId, TemplateConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description:
      'Traditional and professional. Perfect for corporate and formal industries.',
    thumbnail: 'classic',
    colors: {
      primary: '#1f2937', // gray-800
      secondary: '#4b5563', // gray-600
      accent: '#2563eb', // blue-600
      text: '#111827', // gray-900
      textSecondary: '#6b7280', // gray-500
      background: '#ffffff',
      headerBackground: '#ffffff',
      sectionBorder: '#d1d5db', // gray-300
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'system-ui, sans-serif',
      size: {
        name: '1.75rem',
        sectionTitle: '0.875rem',
        jobTitle: '1rem',
        body: '0.875rem',
        small: '0.75rem',
      },
    },
    layout: {
      type: 'single-column',
      headerStyle: 'centered',
      sectionSpacing: 'normal',
      showIcons: true,
      borderStyle: 'underline',
    },
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description:
      'Clean and contemporary with subtle color accents. Great for tech and startups.',
    thumbnail: 'modern',
    colors: {
      primary: '#0f172a', // slate-900
      secondary: '#475569', // slate-600
      accent: '#0ea5e9', // sky-500
      text: '#0f172a',
      textSecondary: '#64748b', // slate-500
      background: '#ffffff',
      headerBackground: '#f8fafc', // slate-50
      sectionBorder: '#e2e8f0', // slate-200
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
      size: {
        name: '1.875rem',
        sectionTitle: '0.75rem',
        jobTitle: '1rem',
        body: '0.875rem',
        small: '0.75rem',
      },
    },
    layout: {
      type: 'single-column',
      headerStyle: 'left-aligned',
      sectionSpacing: 'normal',
      showIcons: true,
      borderStyle: 'accent-left',
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description:
      'Elegant simplicity with ample whitespace. Lets your content shine.',
    thumbnail: 'minimal',
    colors: {
      primary: '#18181b', // zinc-900
      secondary: '#52525b', // zinc-600
      accent: '#18181b',
      text: '#18181b',
      textSecondary: '#71717a', // zinc-500
      background: '#ffffff',
      headerBackground: '#ffffff',
      sectionBorder: '#e4e4e7', // zinc-200
    },
    fonts: {
      heading: 'system-ui, sans-serif',
      body: 'system-ui, sans-serif',
      size: {
        name: '1.5rem',
        sectionTitle: '0.6875rem',
        jobTitle: '0.9375rem',
        body: '0.8125rem',
        small: '0.6875rem',
      },
    },
    layout: {
      type: 'single-column',
      headerStyle: 'left-aligned',
      sectionSpacing: 'spacious',
      showIcons: false,
      borderStyle: 'none',
    },
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description:
      'Executive-style with a sidebar layout. Ideal for senior positions.',
    thumbnail: 'professional',
    colors: {
      primary: '#1e3a5f', // custom dark blue
      secondary: '#2d4a6f',
      accent: '#1e3a5f',
      text: '#1f2937',
      textSecondary: '#6b7280',
      background: '#ffffff',
      headerBackground: '#1e3a5f',
      sectionBorder: '#d1d5db',
    },
    fonts: {
      heading: 'Cambria, Georgia, serif',
      body: 'Calibri, system-ui, sans-serif',
      size: {
        name: '1.625rem',
        sectionTitle: '0.875rem',
        jobTitle: '1rem',
        body: '0.875rem',
        small: '0.75rem',
      },
    },
    layout: {
      type: 'sidebar-left',
      headerStyle: 'banner',
      sectionSpacing: 'compact',
      showIcons: true,
      borderStyle: 'none',
    },
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    description:
      'Bold and distinctive. Perfect for design, marketing, and creative roles.',
    thumbnail: 'creative',
    colors: {
      primary: '#7c3aed', // violet-600
      secondary: '#8b5cf6', // violet-500
      accent: '#7c3aed',
      text: '#1f2937',
      textSecondary: '#6b7280',
      background: '#ffffff',
      headerBackground: '#7c3aed',
      sectionBorder: '#ddd6fe', // violet-200
    },
    fonts: {
      heading: 'Poppins, system-ui, sans-serif',
      body: 'system-ui, sans-serif',
      size: {
        name: '2rem',
        sectionTitle: '0.875rem',
        jobTitle: '1rem',
        body: '0.875rem',
        small: '0.75rem',
      },
    },
    layout: {
      type: 'single-column',
      headerStyle: 'banner',
      sectionSpacing: 'normal',
      showIcons: true,
      borderStyle: 'boxed',
    },
  },
};

export const getTemplate = (templateId: TemplateId): TemplateConfig => {
  return RESUME_TEMPLATES[templateId] || RESUME_TEMPLATES.classic;
};

export const getAllTemplates = (): TemplateConfig[] => {
  return Object.values(RESUME_TEMPLATES);
};
