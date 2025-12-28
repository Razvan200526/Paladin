import { Button } from '@common/components/button';
import { H1, P } from '@common/components/typography';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import imageUrl from '@ruby/assets/PreviewImage.webp';
import { Link } from 'react-router';
import { BenefitsSection } from './components/BenefitsSection';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';
import { HeroNavbar } from './components/HeroNavbar';
import { PricingSection } from './components/PricingSection';

export const HeroPage = () => {
  return (
    <div
      style={{
        background:
          'radial-gradient(at center center, var(--color-primary), var(--color-secondary))',
      }}
      className="scrollbar-hide h-full scroll-smooth overflow-y-scroll dark:bg-gray-900"
    >
      <header className="sticky inset-x-0 top-0 z-50">
        <HeroNavbar />
      </header>

      <div className="py-24 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <H1 className="font-bold tracking-tight text-balance text-light-300 sm:text-7xl dark:text-light">
              The way to up your resume{' '}
              <span className="text-secondary">game</span>
            </H1>
            <p className="mt-8  text-lg text-pretty text-light sm:text-xl/8 dark:text-gray-400">
              Analize,review, and optimize your resume to stand out in the job
              market.
            </p>
            <div className="items-center flex justify-center gap-2">
              <Button
                size="lg"
                disableAnimation={false}
                color="primary"
                variant="solid"
                className="group relative mt-10 flex items-center justify-center overflow-hidden rounded-3xl border border-transparent transition-colors duration-300 hover:border-secondary"
              >
                <div className="absolute inset-0 w-0 bg-secondary transition-[width] duration-300 ease-out group-hover:w-full" />
                <div className="relative z-10 flex items-center justify-center">
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 text-sm text-light transition-all duration-300"
                  >
                    <P className="text-light">Get started</P>
                  </Link>
                  <div className="w-0 overflow-hidden transition-[width] duration-300 group-hover:w-5">
                    <ArrowRightIcon className="size-3.5 shrink-0 text-light" />
                  </div>
                </div>
              </Button>
              <Button
                size="lg"
                variant="bordered"
                color="secondary"
                className="mt-10 flex items-center justify-center gap-x-6 rounded-3xl"
              >
                <Link
                  to="/"
                  className="flex items-center gap-1 px-3.5 py-2.5  text-sm/6 text-light dark:text-light"
                >
                  Learn More
                  <ArrowRightIcon className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
          <img
            alt="App screenshot"
            src={imageUrl}
            id="dashboard"
            fetchPriority="high"
            decoding="async"
            width={2432}
            height={1442}
            className="not-dark:hidden mt-16 rounded-md bg-light/5 shadow-2xl ring-1 ring-light/10 sm:mt-24"
          />
        </div>
      </div>

      <FeaturesSection />
      <BenefitsSection />
      <PricingSection />

      <Footer />
    </div>
  );
};
