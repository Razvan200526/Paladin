import { Button } from '@common/components/button';
import { H2, P } from '@common/components/typography';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Card, CardBody, CardFooter, CardHeader, Chip } from '@heroui/react';
import { Link } from 'react-router';

const tiers = [
  {
    name: 'Free',
    id: 'tier-free',
    href: '/signup',
    priceMonthly: '$0',
    description: 'Essential tools to get you started.',
    features: [
      'Basic Resume Analysis',
      '1 Resume Template',
      'Limited AI Suggestions',
      'Export to PDF',
    ],
    featured: false,
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    href: '/signup?plan=pro',
    priceMonthly: '$19',
    description: 'Everything you need to master your job search.',
    features: [
      'Unlimited Resume Analysis',
      'Premium Templates',
      'Advanced AI Optimization',
      'Cover Letter Generator',
      'Priority Support',
    ],
    featured: true,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const PricingSection = () => {
  return (
    <div id="pricing" className="py-24 sm:py-32 bg-light/5 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <H2 className="text-3xl font-bold tracking-tight text-light sm:text-4xl">
            Simple, transparent pricing
          </H2>
          <P className="mt-6 text-lg leading-8 text-gray-400">
            Choose the plan that fits your career goals. No hidden fees.
          </P>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2 lg:gap-x-8">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={classNames(
                tier.featured
                  ? 'relative bg-gray-800 shadow-2xl ring-2 ring-primary'
                  : 'bg-light/5 ring-1 ring-white/10 sm:mx-8 lg:mx-0',
                'rounded-3xl p-2 border-none',
              )}
            >
              <CardHeader className="flex flex-col items-start gap-2 px-6 pt-6 pb-0">
                <div className="flex w-full items-center justify-between">
                  <h3
                    id={tier.id}
                    className={classNames(
                      tier.featured ? 'text-primary-400' : 'text-primary',
                      'text-base font-semibold leading-7',
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.featured && (
                    <Chip color="primary" variant="flat" size="sm">
                      Most Popular
                    </Chip>
                  )}
                </div>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-white">
                    {tier.priceMonthly}
                  </span>
                  <span className="text-base text-gray-400">/month</span>
                </p>
                <p className="mt-2 text-base leading-7 text-gray-300">
                  {tier.description}
                </p>
              </CardHeader>
              <CardBody className="px-6 py-6">
                <ul className="space-y-3 text-sm leading-6 text-gray-300">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-primary"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter className="px-6 pb-6 pt-0">
                <Button
                  variant={tier.featured ? 'solid' : 'bordered'}
                  color="primary"
                  className="w-full"
                  aria-describedby={tier.id}
                >
                  <Link
                    to={tier.href}
                    className="w-full h-full flex items-center justify-center"
                  >
                    Get started today
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
