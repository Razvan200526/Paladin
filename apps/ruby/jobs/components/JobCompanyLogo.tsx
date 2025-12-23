import { BriefcaseIcon } from '@heroicons/react/24/outline';

interface JobCompanyLogoProps {
  logo?: string;
  company: string;
}

export const JobCompanyLogo = ({ logo, company }: JobCompanyLogoProps) => {
  if (logo) {
    return (
      <img
        src={logo}
        alt={company}
        className="w-12 h-12 rounded-lg object-cover"
      />
    );
  }

  return (
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
      <BriefcaseIcon className="w-6 h-6 text-primary" />
    </div>
  );
};
