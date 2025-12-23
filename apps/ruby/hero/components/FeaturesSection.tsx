import { H2, P } from '@common/components/typography';
import {
  ChartBarIcon,
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader } from '@heroui/react';

const features = [
  {
    name: 'AI-Powered Analysis',
    description:
      'Get instant feedback on your resume with our advanced AI engine that checks for ATS compatibility and content quality.',
    icon: SparklesIcon,
  },
  {
    name: 'Smart Optimization',
    description:
      'Automatically optimize your resume keywords and formatting to match job descriptions perfectly.',
    icon: DocumentMagnifyingGlassIcon,
  },
  {
    name: 'Performance Tracking',
    description:
      'Track your application success rates and see how your resume improvements correlate with more interviews.',
    icon: ChartBarIcon,
  },
];

export const FeaturesSection = () => {
  return (
    <div
      id="features"
      className="py-24 sm:py-32 bg-light/5 dark:bg-gray-900/50"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <H2 className="text-3xl font-bold tracking-tight text-light sm:text-4xl">
            Everything you need to land your dream job
          </H2>
          <P className="mt-6 text-lg leading-8 text-secondary">
            Our platform provides comprehensive tools to ensure your resume
            stands out in a crowded market.
          </P>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.name}
                className="bg-background/5 border-none shadow-lg dark:bg-gray-800"
              >
                <CardHeader className="flex gap-3 px-6 pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                    <feature.icon
                      className="h-6 w-6 text-secondary"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-md font-bold text-light">
                      {feature.name}
                    </p>
                  </div>
                </CardHeader>
                <CardBody className="px-6 pb-6">
                  <p className="text-small text-secondary">
                    {feature.description}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
