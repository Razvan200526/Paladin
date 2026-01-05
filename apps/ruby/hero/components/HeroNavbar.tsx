import { Link } from '@common/components/Link';
import { H6 } from '@common/components/typography';
import { Logo } from '@common/icons/Logo';
export const navigation = [
  { name: 'Dashboard', href: '#dashboard' },
  { name: 'Features', href: '#features' },
  { name: 'Plans', href: '#plans' },
  { name: 'Contact', href: '#contact' },
];

export const HeroNavbar = () => {
  return (
    <nav
      aria-label="Global"
      className="fixed top-0 z-50 w-full bg-background border-b border-secondary-text rounded flex items-center justify-between p-3 lg:px-8"
    >
      <div className="flex lg:flex-1">
        <div className="flex items-center gap-2">
          <Logo className="size-8" />
          <H6 className="text-2xl font-title">EasyresPlus</H6>
        </div>
      </div>
      <div className="hidden lg:flex lg:gap-x-12">
        {navigation.map((item) => (
          <Link
            className="text-primary font-semibold"
            key={item.name}
            to={item.href}
            onClick={(e) => {
              if (item.href.startsWith('#')) {
                e.preventDefault();
                const element = document.getElementById(item.href.substring(1));
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="lg:flex lg:flex-1 lg:justify-end">
        <Link to="/signin" className="flex items-center gap-2">
          <H6>Sign In</H6>
        </Link>
      </div>
    </nav>
  );
};
