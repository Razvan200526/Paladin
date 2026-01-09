import {
  BadgeCheck,
  Briefcase,
  Building2,
  Calculator,
  Camera,
  ChefHat,
  CheckCircle2,
  Cloud,
  Code,
  Coffee,
  Cpu,
  Database,
  FileText,
  Film,
  Flag,
  Globe,
  GraduationCap,
  Hammer,
  HardHat,
  Headphones,
  Heart,
  Landmark,
  Leaf,
  LineChart,
  Linkedin,
  Lock,
  type LucideIcon,
  Megaphone,
  MessageSquare,
  Microscope,
  Music,
  Palette,
  PenTool,
  Pill,
  Plane,
  Scale,
  Scissors,
  Search,
  Server,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Stethoscope,
  TrendingUp,
  Truck,
  Users,
  Utensils,
  Wifi,
  Wrench,
  XCircle,
} from 'lucide-react';

export interface JobProfession {
  value: string;
  label: string;
  icon: LucideIcon;
  category: string;
}

export interface LocationOption {
  value: string;
  label: string;
  icon: LucideIcon;
  category: string;
}

export const JOB_PROFESSIONS: JobProfession[] = [
  // Technology
  {
    value: 'software_engineer',
    label: 'Software Engineer',
    icon: Code,
    category: 'Technology',
  },
  {
    value: 'frontend_developer',
    label: 'Frontend Developer',
    icon: Globe,
    category: 'Technology',
  },
  {
    value: 'backend_developer',
    label: 'Backend Developer',
    icon: Server,
    category: 'Technology',
  },
  {
    value: 'fullstack_developer',
    label: 'Full Stack Developer',
    icon: Cpu,
    category: 'Technology',
  },
  {
    value: 'mobile_developer',
    label: 'Mobile Developer',
    icon: Smartphone,
    category: 'Technology',
  },
  {
    value: 'devops_engineer',
    label: 'DevOps Engineer',
    icon: Cloud,
    category: 'Technology',
  },
  {
    value: 'data_scientist',
    label: 'Data Scientist',
    icon: Database,
    category: 'Technology',
  },
  {
    value: 'data_analyst',
    label: 'Data Analyst',
    icon: LineChart,
    category: 'Technology',
  },
  {
    value: 'cybersecurity_analyst',
    label: 'Cybersecurity Analyst',
    icon: Lock,
    category: 'Technology',
  },
  {
    value: 'systems_administrator',
    label: 'Systems Administrator',
    icon: Server,
    category: 'Technology',
  },

  // Design & Creative
  {
    value: 'graphic_designer',
    label: 'Graphic Designer',
    icon: Palette,
    category: 'Design & Creative',
  },
  {
    value: 'ui_ux_designer',
    label: 'UI/UX Designer',
    icon: PenTool,
    category: 'Design & Creative',
  },
  {
    value: 'photographer',
    label: 'Photographer',
    icon: Camera,
    category: 'Design & Creative',
  },
  {
    value: 'video_editor',
    label: 'Video Editor',
    icon: Film,
    category: 'Design & Creative',
  },
  {
    value: 'musician',
    label: 'Musician',
    icon: Music,
    category: 'Design & Creative',
  },
  {
    value: 'animator',
    label: 'Animator',
    icon: Film,
    category: 'Design & Creative',
  },

  // Business & Management
  {
    value: 'project_manager',
    label: 'Project Manager',
    icon: Briefcase,
    category: 'Business & Management',
  },
  {
    value: 'product_manager',
    label: 'Product Manager',
    icon: TrendingUp,
    category: 'Business & Management',
  },
  {
    value: 'business_analyst',
    label: 'Business Analyst',
    icon: LineChart,
    category: 'Business & Management',
  },
  {
    value: 'hr_manager',
    label: 'HR Manager',
    icon: Users,
    category: 'Business & Management',
  },
  {
    value: 'operations_manager',
    label: 'Operations Manager',
    icon: Building2,
    category: 'Business & Management',
  },

  // Marketing & Sales
  {
    value: 'marketing_manager',
    label: 'Marketing Manager',
    icon: Megaphone,
    category: 'Marketing & Sales',
  },
  {
    value: 'digital_marketer',
    label: 'Digital Marketer',
    icon: Globe,
    category: 'Marketing & Sales',
  },
  {
    value: 'sales_representative',
    label: 'Sales Representative',
    icon: ShoppingBag,
    category: 'Marketing & Sales',
  },
  {
    value: 'content_writer',
    label: 'Content Writer',
    icon: FileText,
    category: 'Marketing & Sales',
  },
  {
    value: 'social_media_manager',
    label: 'Social Media Manager',
    icon: Megaphone,
    category: 'Marketing & Sales',
  },

  // Finance & Accounting
  {
    value: 'accountant',
    label: 'Accountant',
    icon: Calculator,
    category: 'Finance & Accounting',
  },
  {
    value: 'financial_analyst',
    label: 'Financial Analyst',
    icon: TrendingUp,
    category: 'Finance & Accounting',
  },
  {
    value: 'banker',
    label: 'Banker',
    icon: Landmark,
    category: 'Finance & Accounting',
  },
  {
    value: 'auditor',
    label: 'Auditor',
    icon: FileText,
    category: 'Finance & Accounting',
  },

  // Healthcare
  {
    value: 'doctor',
    label: 'Doctor',
    icon: Stethoscope,
    category: 'Healthcare',
  },
  { value: 'nurse', label: 'Nurse', icon: Heart, category: 'Healthcare' },
  {
    value: 'pharmacist',
    label: 'Pharmacist',
    icon: Pill,
    category: 'Healthcare',
  },
  {
    value: 'researcher',
    label: 'Medical Researcher',
    icon: Microscope,
    category: 'Healthcare',
  },

  // Legal
  { value: 'lawyer', label: 'Lawyer', icon: Scale, category: 'Legal' },
  { value: 'paralegal', label: 'Paralegal', icon: FileText, category: 'Legal' },

  // Education
  {
    value: 'teacher',
    label: 'Teacher',
    icon: GraduationCap,
    category: 'Education',
  },
  {
    value: 'professor',
    label: 'Professor',
    icon: GraduationCap,
    category: 'Education',
  },
  {
    value: 'tutor',
    label: 'Tutor',
    icon: GraduationCap,
    category: 'Education',
  },

  // Engineering & Construction
  {
    value: 'civil_engineer',
    label: 'Civil Engineer',
    icon: HardHat,
    category: 'Engineering & Construction',
  },
  {
    value: 'mechanical_engineer',
    label: 'Mechanical Engineer',
    icon: Wrench,
    category: 'Engineering & Construction',
  },
  {
    value: 'architect',
    label: 'Architect',
    icon: Building2,
    category: 'Engineering & Construction',
  },
  {
    value: 'construction_worker',
    label: 'Construction Worker',
    icon: Hammer,
    category: 'Engineering & Construction',
  },
  {
    value: 'electrician',
    label: 'Electrician',
    icon: Wrench,
    category: 'Engineering & Construction',
  },

  // Service Industry
  { value: 'chef', label: 'Chef', icon: ChefHat, category: 'Service Industry' },
  {
    value: 'waiter',
    label: 'Waiter/Waitress',
    icon: Utensils,
    category: 'Service Industry',
  },
  {
    value: 'barista',
    label: 'Barista',
    icon: Coffee,
    category: 'Service Industry',
  },
  {
    value: 'hairdresser',
    label: 'Hairdresser',
    icon: Scissors,
    category: 'Service Industry',
  },

  // Transportation & Logistics
  {
    value: 'truck_driver',
    label: 'Truck Driver',
    icon: Truck,
    category: 'Transportation & Logistics',
  },
  {
    value: 'pilot',
    label: 'Pilot',
    icon: Plane,
    category: 'Transportation & Logistics',
  },
  {
    value: 'logistics_coordinator',
    label: 'Logistics Coordinator',
    icon: Truck,
    category: 'Transportation & Logistics',
  },

  // Other
  {
    value: 'customer_support',
    label: 'Customer Support',
    icon: Headphones,
    category: 'Other',
  },
  {
    value: 'security_officer',
    label: 'Security Officer',
    icon: ShieldCheck,
    category: 'Other',
  },
  {
    value: 'environmental_scientist',
    label: 'Environmental Scientist',
    icon: Leaf,
    category: 'Other',
  },
  { value: 'other', label: 'Other', icon: Briefcase, category: 'Other' },
];

export const LOCATION_OPTIONS: LocationOption[] = [
  { value: 'Remote', label: 'Remote', icon: Wifi, category: 'Remote' },
  { value: 'Afghanistan', label: 'Afghanistan', icon: Flag, category: 'Asia' },
  { value: 'Albania', label: 'Albania', icon: Flag, category: 'Europe' },
  { value: 'Algeria', label: 'Algeria', icon: Flag, category: 'Africa' },
  { value: 'Andorra', label: 'Andorra', icon: Flag, category: 'Europe' },
  { value: 'Angola', label: 'Angola', icon: Flag, category: 'Africa' },
  {
    value: 'Antigua and Barbuda',
    label: 'Antigua and Barbuda',
    icon: Flag,
    category: 'Americas',
  },
  { value: 'Argentina', label: 'Argentina', icon: Flag, category: 'Americas' },
  { value: 'Armenia', label: 'Armenia', icon: Flag, category: 'Asia' },
  { value: 'Australia', label: 'Australia', icon: Flag, category: 'Oceania' },
  { value: 'Austria', label: 'Austria', icon: Flag, category: 'Europe' },
  { value: 'Azerbaijan', label: 'Azerbaijan', icon: Flag, category: 'Asia' },
  { value: 'Bahamas', label: 'Bahamas', icon: Flag, category: 'Americas' },
  { value: 'Bahrain', label: 'Bahrain', icon: Flag, category: 'Asia' },
  { value: 'Bangladesh', label: 'Bangladesh', icon: Flag, category: 'Asia' },
  { value: 'Barbados', label: 'Barbados', icon: Flag, category: 'Americas' },
  { value: 'Belarus', label: 'Belarus', icon: Flag, category: 'Europe' },
  { value: 'Belgium', label: 'Belgium', icon: Flag, category: 'Europe' },
  { value: 'Belize', label: 'Belize', icon: Flag, category: 'Americas' },
  { value: 'Benin', label: 'Benin', icon: Flag, category: 'Africa' },
  { value: 'Bhutan', label: 'Bhutan', icon: Flag, category: 'Asia' },
  { value: 'Bolivia', label: 'Bolivia', icon: Flag, category: 'Americas' },
  {
    value: 'Bosnia and Herzegovina',
    label: 'Bosnia and Herzegovina',
    icon: Flag,
    category: 'Europe',
  },
  { value: 'Botswana', label: 'Botswana', icon: Flag, category: 'Africa' },
  { value: 'Brazil', label: 'Brazil', icon: Flag, category: 'Americas' },
  { value: 'Brunei', label: 'Brunei', icon: Flag, category: 'Asia' },
  { value: 'Bulgaria', label: 'Bulgaria', icon: Flag, category: 'Europe' },
  {
    value: 'Burkina Faso',
    label: 'Burkina Faso',
    icon: Flag,
    category: 'Africa',
  },
  { value: 'Burundi', label: 'Burundi', icon: Flag, category: 'Africa' },
  { value: 'Cabo Verde', label: 'Cabo Verde', icon: Flag, category: 'Africa' },
  { value: 'Cambodia', label: 'Cambodia', icon: Flag, category: 'Asia' },
  { value: 'Cameroon', label: 'Cameroon', icon: Flag, category: 'Africa' },
  { value: 'Canada', label: 'Canada', icon: Flag, category: 'Americas' },
  {
    value: 'Central African Republic',
    label: 'Central African Republic',
    icon: Flag,
    category: 'Africa',
  },
  { value: 'Chad', label: 'Chad', icon: Flag, category: 'Africa' },
  { value: 'Chile', label: 'Chile', icon: Flag, category: 'Americas' },
  { value: 'China', label: 'China', icon: Flag, category: 'Asia' },
  { value: 'Colombia', label: 'Colombia', icon: Flag, category: 'Americas' },
  { value: 'Comoros', label: 'Comoros', icon: Flag, category: 'Africa' },
  {
    value: 'Congo (Congo-Brazzaville)',
    label: 'Congo (Congo-Brazzaville)',
    icon: Flag,
    category: 'Africa',
  },
  {
    value: 'Costa Rica',
    label: 'Costa Rica',
    icon: Flag,
    category: 'Americas',
  },
  { value: 'Croatia', label: 'Croatia', icon: Flag, category: 'Europe' },
  { value: 'Cuba', label: 'Cuba', icon: Flag, category: 'Americas' },
  { value: 'Cyprus', label: 'Cyprus', icon: Flag, category: 'Europe' },
  {
    value: 'Czechia (Czech Republic)',
    label: 'Czechia (Czech Republic)',
    icon: Flag,
    category: 'Europe',
  },
  { value: 'Denmark', label: 'Denmark', icon: Flag, category: 'Europe' },
  { value: 'Djibouti', label: 'Djibouti', icon: Flag, category: 'Africa' },
  { value: 'Dominica', label: 'Dominica', icon: Flag, category: 'Americas' },
  {
    value: 'Dominican Republic',
    label: 'Dominican Republic',
    icon: Flag,
    category: 'Americas',
  },
  { value: 'Ecuador', label: 'Ecuador', icon: Flag, category: 'Americas' },
  { value: 'Egypt', label: 'Egypt', icon: Flag, category: 'Africa' },
  {
    value: 'El Salvador',
    label: 'El Salvador',
    icon: Flag,
    category: 'Americas',
  },
  {
    value: 'Equatorial Guinea',
    label: 'Equatorial Guinea',
    icon: Flag,
    category: 'Africa',
  },
  { value: 'Eritrea', label: 'Eritrea', icon: Flag, category: 'Africa' },
  { value: 'Estonia', label: 'Estonia', icon: Flag, category: 'Europe' },
  { value: 'Eswatini', label: 'Eswatini', icon: Flag, category: 'Africa' },
  { value: 'Ethiopia', label: 'Ethiopia', icon: Flag, category: 'Africa' },
  { value: 'Fiji', label: 'Fiji', icon: Flag, category: 'Oceania' },
  { value: 'Finland', label: 'Finland', icon: Flag, category: 'Europe' },
  { value: 'France', label: 'France', icon: Flag, category: 'Europe' },
  { value: 'Gabon', label: 'Gabon', icon: Flag, category: 'Africa' },
  { value: 'Gambia', label: 'Gambia', icon: Flag, category: 'Africa' },
  { value: 'Georgia', label: 'Georgia', icon: Flag, category: 'Asia' },
  { value: 'Germany', label: 'Germany', icon: Flag, category: 'Europe' },
  { value: 'Ghana', label: 'Ghana', icon: Flag, category: 'Africa' },
  { value: 'Greece', label: 'Greece', icon: Flag, category: 'Europe' },
  { value: 'Grenada', label: 'Grenada', icon: Flag, category: 'Americas' },
  { value: 'Guatemala', label: 'Guatemala', icon: Flag, category: 'Americas' },
  { value: 'Guinea', label: 'Guinea', icon: Flag, category: 'Africa' },
  {
    value: 'Guinea-Bissau',
    label: 'Guinea-Bissau',
    icon: Flag,
    category: 'Africa',
  },
  { value: 'Guyana', label: 'Guyana', icon: Flag, category: 'Americas' },
  { value: 'Haiti', label: 'Haiti', icon: Flag, category: 'Americas' },
  { value: 'Holy See', label: 'Holy See', icon: Flag, category: 'Europe' },
  { value: 'Honduras', label: 'Honduras', icon: Flag, category: 'Americas' },
  { value: 'Hungary', label: 'Hungary', icon: Flag, category: 'Europe' },
  { value: 'Iceland', label: 'Iceland', icon: Flag, category: 'Europe' },
  { value: 'India', label: 'India', icon: Flag, category: 'Asia' },
  { value: 'Indonesia', label: 'Indonesia', icon: Flag, category: 'Asia' },
  { value: 'Iran', label: 'Iran', icon: Flag, category: 'Asia' },
  { value: 'Iraq', label: 'Iraq', icon: Flag, category: 'Asia' },
  { value: 'Ireland', label: 'Ireland', icon: Flag, category: 'Europe' },
  { value: 'Israel', label: 'Israel', icon: Flag, category: 'Asia' },
  { value: 'Italy', label: 'Italy', icon: Flag, category: 'Europe' },
  { value: 'Jamaica', label: 'Jamaica', icon: Flag, category: 'Americas' },
  { value: 'Japan', label: 'Japan', icon: Flag, category: 'Asia' },
  { value: 'Jordan', label: 'Jordan', icon: Flag, category: 'Asia' },
  { value: 'Kazakhstan', label: 'Kazakhstan', icon: Flag, category: 'Asia' },
  { value: 'Kenya', label: 'Kenya', icon: Flag, category: 'Africa' },
  { value: 'Kiribati', label: 'Kiribati', icon: Flag, category: 'Oceania' },
  { value: 'Kuwait', label: 'Kuwait', icon: Flag, category: 'Asia' },
  { value: 'Kyrgyzstan', label: 'Kyrgyzstan', icon: Flag, category: 'Asia' },
  { value: 'Laos', label: 'Laos', icon: Flag, category: 'Asia' },
  { value: 'Latvia', label: 'Latvia', icon: Flag, category: 'Europe' },
  { value: 'Lebanon', label: 'Lebanon', icon: Flag, category: 'Asia' },
  { value: 'Lesotho', label: 'Lesotho', icon: Flag, category: 'Africa' },
  { value: 'Liberia', label: 'Liberia', icon: Flag, category: 'Africa' },
  { value: 'Libya', label: 'Libya', icon: Flag, category: 'Africa' },
  {
    value: 'Liechtenstein',
    label: 'Liechtenstein',
    icon: Flag,
    category: 'Europe',
  },
  { value: 'Lithuania', label: 'Lithuania', icon: Flag, category: 'Europe' },
  { value: 'Luxembourg', label: 'Luxembourg', icon: Flag, category: 'Europe' },
  { value: 'Madagascar', label: 'Madagascar', icon: Flag, category: 'Africa' },
  { value: 'Malawi', label: 'Malawi', icon: Flag, category: 'Africa' },
  { value: 'Malaysia', label: 'Malaysia', icon: Flag, category: 'Asia' },
  { value: 'Maldives', label: 'Maldives', icon: Flag, category: 'Asia' },
  { value: 'Mali', label: 'Mali', icon: Flag, category: 'Africa' },
  { value: 'Malta', label: 'Malta', icon: Flag, category: 'Europe' },
  {
    value: 'Marshall Islands',
    label: 'Marshall Islands',
    icon: Flag,
    category: 'Oceania',
  },
  { value: 'Mauritania', label: 'Mauritania', icon: Flag, category: 'Africa' },
  { value: 'Mauritius', label: 'Mauritius', icon: Flag, category: 'Africa' },
  { value: 'Mexico', label: 'Mexico', icon: Flag, category: 'Americas' },
  { value: 'Micronesia', label: 'Micronesia', icon: Flag, category: 'Oceania' },
  { value: 'Moldova', label: 'Moldova', icon: Flag, category: 'Europe' },
  { value: 'Monaco', label: 'Monaco', icon: Flag, category: 'Europe' },
  { value: 'Mongolia', label: 'Mongolia', icon: Flag, category: 'Asia' },
  { value: 'Montenegro', label: 'Montenegro', icon: Flag, category: 'Europe' },
  { value: 'Morocco', label: 'Morocco', icon: Flag, category: 'Africa' },
  { value: 'Mozambique', label: 'Mozambique', icon: Flag, category: 'Africa' },
  {
    value: 'Myanmar (formerly Burma)',
    label: 'Myanmar (formerly Burma)',
    icon: Flag,
    category: 'Asia',
  },
  { value: 'Namibia', label: 'Namibia', icon: Flag, category: 'Africa' },
  { value: 'Nauru', label: 'Nauru', icon: Flag, category: 'Oceania' },
  { value: 'Nepal', label: 'Nepal', icon: Flag, category: 'Asia' },
  {
    value: 'Netherlands',
    label: 'Netherlands',
    icon: Flag,
    category: 'Europe',
  },
  {
    value: 'New Zealand',
    label: 'New Zealand',
    icon: Flag,
    category: 'Oceania',
  },
  { value: 'Nicaragua', label: 'Nicaragua', icon: Flag, category: 'Americas' },
  { value: 'Niger', label: 'Niger', icon: Flag, category: 'Africa' },
  { value: 'Nigeria', label: 'Nigeria', icon: Flag, category: 'Africa' },
  { value: 'North Korea', label: 'North Korea', icon: Flag, category: 'Asia' },
  {
    value: 'North Macedonia',
    label: 'North Macedonia',
    icon: Flag,
    category: 'Europe',
  },
  { value: 'Norway', label: 'Norway', icon: Flag, category: 'Europe' },
  { value: 'Oman', label: 'Oman', icon: Flag, category: 'Asia' },
  { value: 'Pakistan', label: 'Pakistan', icon: Flag, category: 'Asia' },
  { value: 'Palau', label: 'Palau', icon: Flag, category: 'Oceania' },
  {
    value: 'Palestine State',
    label: 'Palestine State',
    icon: Flag,
    category: 'Asia',
  },
  { value: 'Panama', label: 'Panama', icon: Flag, category: 'Americas' },
  {
    value: 'Papua New Guinea',
    label: 'Papua New Guinea',
    icon: Flag,
    category: 'Oceania',
  },
  { value: 'Paraguay', label: 'Paraguay', icon: Flag, category: 'Americas' },
  { value: 'Peru', label: 'Peru', icon: Flag, category: 'Americas' },
  { value: 'Philippines', label: 'Philippines', icon: Flag, category: 'Asia' },
  { value: 'Poland', label: 'Poland', icon: Flag, category: 'Europe' },
  { value: 'Portugal', label: 'Portugal', icon: Flag, category: 'Europe' },
  { value: 'Qatar', label: 'Qatar', icon: Flag, category: 'Asia' },
  { value: 'Romania', label: 'Romania', icon: Flag, category: 'Europe' },
  { value: 'Russia', label: 'Russia', icon: Flag, category: 'Europe' },
  { value: 'Rwanda', label: 'Rwanda', icon: Flag, category: 'Africa' },
  {
    value: 'Saint Kitts and Nevis',
    label: 'Saint Kitts and Nevis',
    icon: Flag,
    category: 'Americas',
  },
  {
    value: 'Saint Lucia',
    label: 'Saint Lucia',
    icon: Flag,
    category: 'Americas',
  },
  {
    value: 'Saint Vincent and the Grenadines',
    label: 'Saint Vincent and the Grenadines',
    icon: Flag,
    category: 'Americas',
  },
  { value: 'Samoa', label: 'Samoa', icon: Flag, category: 'Oceania' },
  { value: 'San Marino', label: 'San Marino', icon: Flag, category: 'Europe' },
  {
    value: 'Sao Tome and Principe',
    label: 'Sao Tome and Principe',
    icon: Flag,
    category: 'Africa',
  },
  {
    value: 'Saudi Arabia',
    label: 'Saudi Arabia',
    icon: Flag,
    category: 'Asia',
  },
  { value: 'Senegal', label: 'Senegal', icon: Flag, category: 'Africa' },
  { value: 'Serbia', label: 'Serbia', icon: Flag, category: 'Europe' },
  { value: 'Seychelles', label: 'Seychelles', icon: Flag, category: 'Africa' },
  {
    value: 'Sierra Leone',
    label: 'Sierra Leone',
    icon: Flag,
    category: 'Africa',
  },
  { value: 'Singapore', label: 'Singapore', icon: Flag, category: 'Asia' },
  { value: 'Slovakia', label: 'Slovakia', icon: Flag, category: 'Europe' },
  { value: 'Slovenia', label: 'Slovenia', icon: Flag, category: 'Europe' },
  {
    value: 'Solomon Islands',
    label: 'Solomon Islands',
    icon: Flag,
    category: 'Oceania',
  },
  { value: 'Somalia', label: 'Somalia', icon: Flag, category: 'Africa' },
  {
    value: 'South Africa',
    label: 'South Africa',
    icon: Flag,
    category: 'Africa',
  },
  { value: 'South Korea', label: 'South Korea', icon: Flag, category: 'Asia' },
  {
    value: 'South Sudan',
    label: 'South Sudan',
    icon: Flag,
    category: 'Africa',
  },
  { value: 'Spain', label: 'Spain', icon: Flag, category: 'Europe' },
  { value: 'Sri Lanka', label: 'Sri Lanka', icon: Flag, category: 'Asia' },
  { value: 'Sudan', label: 'Sudan', icon: Flag, category: 'Africa' },
  { value: 'Suriname', label: 'Suriname', icon: Flag, category: 'Americas' },
  { value: 'Sweden', label: 'Sweden', icon: Flag, category: 'Europe' },
  {
    value: 'Switzerland',
    label: 'Switzerland',
    icon: Flag,
    category: 'Europe',
  },
  { value: 'Syria', label: 'Syria', icon: Flag, category: 'Asia' },
  { value: 'Tajikistan', label: 'Tajikistan', icon: Flag, category: 'Asia' },
  { value: 'Tanzania', label: 'Tanzania', icon: Flag, category: 'Africa' },
  { value: 'Thailand', label: 'Thailand', icon: Flag, category: 'Asia' },
  { value: 'Timor-Leste', label: 'Timor-Leste', icon: Flag, category: 'Asia' },
  { value: 'Togo', label: 'Togo', icon: Flag, category: 'Africa' },
  { value: 'Tonga', label: 'Tonga', icon: Flag, category: 'Oceania' },
  {
    value: 'Trinidad and Tobago',
    label: 'Trinidad and Tobago',
    icon: Flag,
    category: 'Americas',
  },
  { value: 'Tunisia', label: 'Tunisia', icon: Flag, category: 'Africa' },
  { value: 'Turkey', label: 'Turkey', icon: Flag, category: 'Asia' },
  {
    value: 'Turkmenistan',
    label: 'Turkmenistan',
    icon: Flag,
    category: 'Asia',
  },
  { value: 'Tuvalu', label: 'Tuvalu', icon: Flag, category: 'Oceania' },
  { value: 'Uganda', label: 'Uganda', icon: Flag, category: 'Africa' },
  { value: 'Ukraine', label: 'Ukraine', icon: Flag, category: 'Europe' },
  {
    value: 'United Arab Emirates',
    label: 'United Arab Emirates',
    icon: Flag,
    category: 'Asia',
  },
  {
    value: 'United Kingdom',
    label: 'United Kingdom',
    icon: Flag,
    category: 'Europe',
  },
  {
    value: 'United States of America',
    label: 'United States of America',
    icon: Flag,
    category: 'Americas',
  },
  { value: 'Uruguay', label: 'Uruguay', icon: Flag, category: 'Americas' },
  { value: 'Uzbekistan', label: 'Uzbekistan', icon: Flag, category: 'Asia' },
  { value: 'Vanuatu', label: 'Vanuatu', icon: Flag, category: 'Oceania' },
  { value: 'Venezuela', label: 'Venezuela', icon: Flag, category: 'Americas' },
  { value: 'Vietnam', label: 'Vietnam', icon: Flag, category: 'Asia' },
  { value: 'Yemen', label: 'Yemen', icon: Flag, category: 'Asia' },
  { value: 'Zambia', label: 'Zambia', icon: Flag, category: 'Africa' },
  { value: 'Zimbabwe', label: 'Zimbabwe', icon: Flag, category: 'Africa' },
];

export const JOB_CATEGORIES = [
  ...new Set(JOB_PROFESSIONS.map((job) => job.category)),
];

export const LOCATION_CATEGORIES = [
  ...new Set(LOCATION_OPTIONS.map((location) => location.category)),
];

export const getJobsByCategory = (category: string): JobProfession[] => {
  return JOB_PROFESSIONS.filter((job) => job.category === category);
};

export const getJobByValue = (value: string): JobProfession | undefined => {
  return JOB_PROFESSIONS.find((job) => job.value === value);
};

export const getLocationsByCategory = (category: string): LocationOption[] => {
  return LOCATION_OPTIONS.filter((location) => location.category === category);
};

export const getLocationByValue = (
  value: string,
): LocationOption | undefined => {
  return LOCATION_OPTIONS.find((location) => location.value === value);
};

export interface PlatformOption {
  value: string;
  label: string;
  icon: LucideIcon;
  category: string;
}

export interface StatusOption {
  value: string;
  label: string;
  icon: LucideIcon;
  category: string;
}

export const PLATFORM_OPTIONS: PlatformOption[] = [
  { value: 'Linkedin', label: 'LinkedIn', icon: Linkedin, category: 'Social' },
  {
    value: 'Glassdoor',
    label: 'Glassdoor',
    icon: Search,
    category: 'Job Board',
  },
  { value: 'Other', label: 'Other', icon: Globe, category: 'General' },
];

export const STATUS_OPTIONS: StatusOption[] = [
  {
    value: 'Applied',
    label: 'Applied',
    icon: CheckCircle2,
    category: 'Active',
  },
  {
    value: 'Interviewing',
    label: 'Interviewing',
    icon: MessageSquare,
    category: 'Active',
  },
  {
    value: 'Accepted',
    label: 'Accepted',
    icon: BadgeCheck,
    category: 'Completed',
  },
  {
    value: 'Rejected',
    label: 'Rejected',
    icon: XCircle,
    category: 'Completed',
  },
];

export const getPlatformByValue = (
  value: string,
): PlatformOption | undefined => {
  return PLATFORM_OPTIONS.find((platform) => platform.value === value);
};

export const getStatusByValue = (value: string): StatusOption | undefined => {
  return STATUS_OPTIONS.find((status) => status.value === value);
};
