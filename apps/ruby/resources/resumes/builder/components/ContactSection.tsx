import {
  InputEmail,
  type InputEmailRefType,
} from '@common/components/input/InputEmail';
import {
  InputName,
  type InputNameRefType,
} from '@common/components/input/InputFirstName';
import {
  InputPhone,
  type InputPhoneRefType,
} from '@common/components/input/InputPhone';
import {
  InputText,
  type InputTextRefType,
} from '@common/components/input/InputText';
import { Selector } from '@common/components/select/Selector';
import { H3, H6 } from '@common/components/typography';
import { LOCATIONS } from '@common/constants';
import { useAuth } from '@ruby/shared/hooks';
import {
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { useRef } from 'react';
import type { ContactInfo } from '../types/resume-builder';
import { LocationSelect } from '@common/components/select/LocationSelect';

interface ContactSectionProps {
  contact: ContactInfo;
  onChange: (contact: ContactInfo) => void;
}

const locationItems = LOCATIONS.map((loc) => ({ value: loc, label: loc }));
export const ContactSection = ({ contact, onChange }: ContactSectionProps) => {
  const updateField = <K extends keyof ContactInfo>(
    field: K,
    value: ContactInfo[K],
  ) => {
    onChange({ ...contact, [field]: value });
  };
  const { data: user } = useAuth();
  const nameRef = useRef<InputNameRefType | null>(null);
  const phoneRef = useRef<InputPhoneRefType | null>(null);
  const emailRef = useRef<InputEmailRefType | null>(null);
  const linkedinRef = useRef<InputTextRefType | null>(null);
  const githubRef = useRef<InputTextRefType | null>(null);
  const websiteRef = useRef<InputTextRefType | null>(null);

  return (
    <div className="space-y-4">
      <H3 className="text-lg font-semibold text-foreground">
        Contact Information
      </H3>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-start gap-2">
            <User className="size-5 text-secondary-text" />
            <H6>Full Name</H6>
          </div>
          <InputName
            ref={nameRef}
            hasLabel={false}
            hasIcon={false}
            placeholder={user?.name}
            value={user?.name || nameRef.current?.getValue()}
            onChange={(e) => {
              nameRef.current?.setValue(e);
              updateField('fullName', e);
            }}
            className="pt-0"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-start gap-2">
            <Mail className="size-5 text-secondary-text" />
            <H6>Email</H6>
          </div>
          <InputEmail
            ref={emailRef}
            hasLabel={false}
            hasIcon={false}
            placeholder={user?.email}
            value={user?.email || emailRef.current?.getValue()}
            onChange={(e) => {
              emailRef.current?.setValue(e);
              updateField('email', e);
            }}
            className="pt-0"
          />
        </div>

        {/* Phone & Location Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-start gap-2">
              <Phone className="size-5 text-secondary-text" />
              <H6>Phone</H6>
            </div>
            <InputPhone
              ref={phoneRef}
              size="sm"
              hasLabel={false}
              hasIcon={false}
              placeholder="+1 (555) 123-4567"
              value={contact.phone || phoneRef.current?.getValue()}
              onChange={(e) => {
                phoneRef.current?.setValue(e);
                updateField('phone', e);
              }}
              className="pt-0"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-start gap-2">
              <MapPin className="size-5 text-secondary-text" />
              <H6>Location</H6>
            </div>
            <LocationSelect
              color="primary"
              placeholder="Select Location"
              value={contact.location}
              onChange={(e) => updateField('location', e)}
              size="sm"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-4">
          <p className="text-sm text-secondary-text font-semibold mb-4">
            Social & Professional Links (optional)
          </p>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-start gap-2">
              <Linkedin className="size-5 text-secondary-text" />
              <H6>LinkedIn</H6>
            </div>
            <InputText
              ref={linkedinRef}
              hasLabel={false}
              hasIcon={false}
              placeholder="linkedin.com/in/username"
              value={contact.linkedin || linkedinRef.current?.getValue()}
              onChange={(e) => {
                linkedinRef.current?.setValue(e);
                updateField('linkedin', e);
              }}
              className="pt-0"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-start gap-2">
              <Github className="size-5 text-secondary-text" />
              <H6>GitHub</H6>
            </div>
            <InputText
              ref={githubRef}
              hasLabel={false}
              hasIcon={false}
              placeholder="github.com/username"
              value={contact.github || githubRef.current?.getValue()}
              onChange={(e) => {
                githubRef.current?.setValue(e);
                updateField('github', e);
              }}
              className="pt-0"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-start gap-2">
              <Globe className="size-5 text-secondary-text" />
              <H6>Website</H6>
            </div>
            <InputText
              ref={websiteRef}
              hasLabel={false}
              hasIcon={false}
              placeholder="yourwebsite.com"
              value={contact.website || websiteRef.current?.getValue()}
              onChange={(e) => {
                websiteRef.current?.setValue(e);
                updateField('website', e);
              }}
              className="pt-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
