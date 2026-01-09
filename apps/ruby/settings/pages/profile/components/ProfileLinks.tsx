import { Card } from '@common/components/card';
import { H6 } from '@common/components/typography';
import { Divider, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

interface SocialLink {
  id: string;
  icon: string;
  label: string;
  placeholder: string;
  value: string;
}

interface ProfileLinksProps {
  links?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
  };
  onLinksChange?: (links: Record<string, string>) => void;
}

export const ProfileLinks = ({ links, onLinksChange }: ProfileLinksProps) => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: 'linkedin',
      icon: 'mdi:linkedin',
      label: 'LinkedIn',
      placeholder: 'https://linkedin.com/in/username',
      value: links?.linkedin || '',
    },
    {
      id: 'github',
      icon: 'mdi:github',
      label: 'GitHub',
      placeholder: 'https://github.com/username',
      value: links?.github || '',
    },
    {
      id: 'portfolio',
      icon: 'heroicons:globe-alt',
      label: 'Portfolio',
      placeholder: 'https://yourportfolio.com',
      value: links?.portfolio || '',
    },
    {
      id: 'twitter',
      icon: 'mdi:twitter',
      label: 'Twitter / X',
      placeholder: 'https://twitter.com/username',
      value: links?.twitter || '',
    },
  ]);

  const handleLinkChange = (id: string, value: string) => {
    const updatedLinks = socialLinks.map((link) =>
      link.id === id ? { ...link, value } : link,
    );
    setSocialLinks(updatedLinks);

    const linksObject = updatedLinks.reduce(
      (acc, link) => {
        acc[link.id] = link.value;
        return acc;
      },
      {} as Record<string, string>,
    );
    onLinksChange?.(linksObject);
  };

  return (
    <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon icon="heroicons:link" className="size-5 text-primary" />
          </div>
          <div>
            <H6 className="text-primary">Social Links</H6>
            <p className="text-xs text-secondary-text">
              Add your social profiles and portfolio links
            </p>
          </div>
        </div>

        <Divider className="bg-border" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialLinks.map((link) => (
            <div key={link.id} className="space-y-1.5">
              <Input
                id={`social-link-${link.id}`}
                label={
                  <span className="flex items-center gap-2">
                    <Icon icon={link.icon} className="size-4" />
                    {link.label}
                  </span>
                }
                value={link.value}
                onChange={(e) => handleLinkChange(link.id, e.target.value)}
                placeholder={link.placeholder}
                variant="bordered"
                size="sm"
                labelPlacement="outside"
                classNames={{
                  label: 'text-sm font-medium text-primary',
                  input: 'text-primary text-sm',
                  inputWrapper: 'border-border',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
