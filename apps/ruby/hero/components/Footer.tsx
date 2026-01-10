import { Link } from '@common/components/Link';
import { H2, H3, P } from '@common/components/typography';
import { Logo } from '@common/icons/Logo';
import { Facebook, Instagram, Linkedin, Mail, Twitter } from 'lucide-react';

const navigation = {
  main: [
    { name: 'Product', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Plans', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: Facebook,
    },
    {
      name: 'Twitter',
      href: '#',
      icon: Twitter,
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: Linkedin,
    },
    {
      name: 'Instagram',
      href: '#',
      icon: Instagram,
    },
  ],
  legal: [
    { name: 'Politica de Confidențialitate', href: '#' },
    { name: 'Termeni și Condiții', href: '#' },
    { name: 'Politica de Cookie-uri', href: '#' },
    { name: 'ANPC', href: 'https://anpc.ro/' },
    { name: 'SOL', href: 'https://ec.europa.eu/consumers/odr' },
  ],
};

export const Footer = () => {
  return (
    <footer id="contact" className="bg-background dark:bg-gray-900">
      <H2 id="footer-heading" className="sr-only">
        Footer
      </H2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-12 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo className="size-8" />
              <span className="text-2xl font-bold text-primary">
                Paladin
              </span>
            </div>
            <P className="text-sm leading-6 text-secondary-text">
              Empowering your career with AI-driven resume optimization.
            </P>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-primary hover:text-primary"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 text-primary-200">
              <Mail className="h-5 w-5" />
              {/*<a
                href="mailto:contact@Paladin.ro"
                className="text-sm hover:text-primary"
              >
                contact@Paladin.ro
              </a>*/}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <H3>Product</H3>
                <ul className="mt-6 space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-sm leading-6 text-primary hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0 mx-0">
                <H3>Legal (RO)</H3>
                <ul className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-sm text-primary hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">
            &copy; {new Date().getFullYear()} Paladin. Toate drepturile
            rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
};
