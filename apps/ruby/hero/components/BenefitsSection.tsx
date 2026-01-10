import { H2, P } from '@common/components/typography';

const stats = [
  { id: 1, name: 'More Interviews', value: '50%' },
  { id: 2, name: 'Faster Application Process', value: '2x' },
  { id: 3, name: 'Users Hired', value: '10k+' },
  { id: 4, name: 'Resume Score Improvement', value: '30pts' },
];

export const BenefitsSection = () => {
  return (
    <div id="plans" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <H2 className="text-3xl font-bold tracking-tight text-light sm:text-4xl">
              Proven Results
            </H2>
            <P className="mt-4 text-lg leading-8 text-gray-400">
              Don't just take our word for it. See the impact Paladin has on
              job search success.
            </P>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col bg-light/5 p-8 dark:bg-gray-800/50"
              >
                <dt className="text-sm font-semibold leading-6 text-gray-400">
                  {stat.name}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
