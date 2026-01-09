import { Button } from '@common/components/button';
import { H4 } from '@common/components/typography';
import { formatDate } from '@common/utils';
import {
  AcademicCapIcon,
  ArrowTopRightOnSquareIcon,
  BookmarkIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  MapPinIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { Chip, Divider, ScrollShadow } from '@heroui/react';
import parse from 'html-react-parser';
import type { JobMatch, MatchStatus } from '../../../sdk/JobFetcher';
import { useUpdateMatchStatus } from '../hooks';
import { CompatibilityScore } from './CompatibilityScore';
import { ScoreBreakdown } from './ScoreBreakdown';
import { SkillsAnalysis } from './SkillsAnalysis';

interface JobMatchDetailProps {
  match: JobMatch;
}

export const JobMatchDetail = ({ match }: JobMatchDetailProps) => {
  const { mutate: updateStatus, isPending } = useUpdateMatchStatus();
  const { job } = match;

  const handleStatusChange = (status: MatchStatus) => {
    updateStatus({ matchId: match.id, status });
  };

  const formatSalary = (min?: number, max?: number, currency = 'USD') => {
    if (!min && !max) return 'Not specified';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    });
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    }
    return min
      ? `${formatter.format(min)}+`
      : `Up to ${formatter.format(max ?? 0)}`;
  };

  return (
    <div className="h-full w-full flex flex-col bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <H4 className="text-primary">{job.title}</H4>
            <p className="text-secondary-text font-medium">{job.company}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Chip
                size="sm"
                color="primary"
                variant="flat"
                startContent={<MapPinIcon className="w-3 h-3" />}
              >
                {job.isRemote ? 'Remote' : job.location}
              </Chip>
              <Chip
                size="sm"
                color="primary"
                variant="flat"
                startContent={<BriefcaseIcon className="w-3 h-3" />}
              >
                {job.jobType}
              </Chip>
              {job.experienceLevel && (
                <Chip size="sm" variant="flat">
                  {job.experienceLevel.charAt(0).toUpperCase() +
                    job.experienceLevel.slice(1)}{' '}
                  Level
                </Chip>
              )}
            </div>
          </div>
          <CompatibilityScore score={match.compatibilityScore} size="md" />
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant={match.status === 'saved' ? 'solid' : 'flat'}
            color={match.status === 'saved' ? 'warning' : undefined}
            startContent={
              match.status === 'saved' ? (
                <BookmarkSolidIcon className="w-4 h-4" />
              ) : (
                <BookmarkIcon className="w-4 h-4" />
              )
            }
            isDisabled={isPending}
            onPress={() =>
              handleStatusChange(match.status === 'saved' ? 'viewed' : 'saved')
            }
          >
            {match.status === 'saved' ? 'Saved' : 'Save'}
          </Button>
          <Button
            size="sm"
            variant={match.status === 'applied' ? 'solid' : 'flat'}
            color={match.status === 'applied' ? 'success' : undefined}
            startContent={<CheckCircleIcon className="w-4 h-4" />}
            isDisabled={isPending || match.status === 'applied'}
            onPress={() => handleStatusChange('applied')}
          >
            {match.status === 'applied' ? 'Applied' : 'Mark Applied'}
          </Button>
          <Button
            size="sm"
            variant="flat"
            color="danger"
            startContent={<XCircleIcon className="w-4 h-4" />}
            isDisabled={isPending}
            onPress={() => handleStatusChange('dismissed')}
          >
            Dismiss
          </Button>
          <div className="flex-1" />
          <Button
            size="sm"
            color="primary"
            endContent={<ArrowTopRightOnSquareIcon className="w-4 h-4" />}
            onPress={() => window.open(job.applyUrl || job.url, '_blank')}
          >
            Apply Now
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollShadow className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center gap-2 text-muted text-xs mb-1">
                <CurrencyDollarIcon className="w-4 h-4" />
                Salary
              </div>
              <p className="font-semibold text-primary text-sm">
                {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center gap-2 text-muted text-xs mb-1">
                <ClockIcon className="w-4 h-4" />
                Experience
              </div>
              <p className="font-semibold text-primary text-sm">
                {job.yearsExperienceMin
                  ? `${job.yearsExperienceMin}${job.yearsExperienceMax ? `-${job.yearsExperienceMax}` : '+'} years`
                  : 'Not specified'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center gap-2 text-muted text-xs mb-1">
                <AcademicCapIcon className="w-4 h-4" />
                Education
              </div>
              <p className="font-semibold text-primary text-sm">
                {job.educationRequirement || 'Not specified'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center gap-2 text-muted text-xs mb-1">
                <ClockIcon className="w-4 h-4" />
                Posted
              </div>
              <p className="font-semibold text-primary text-sm">
                {formatDate(job.postedAt ?? '')}
              </p>
            </div>
          </div>

          <Divider />

          {/* Score Breakdown */}
          <ScoreBreakdown
            skillsScore={match.skillsScore}
            experienceScore={match.experienceScore}
            educationScore={match.educationScore}
            keywordsScore={match.keywordsScore}
            semanticScore={match.semanticScore}
          />

          <Divider />

          <SkillsAnalysis
            matchedSkills={match.matchedSkills}
            missingSkills={match.missingSkills}
          />

          <Divider />

          {match.improvementSuggestions.length > 0 && (
            <>
              <div>
                <h4 className="font-semibold text-primary text-sm mb-3 flex items-center gap-2">
                  <LightBulbIcon className="w-4 h-4 text-yellow-500" />
                  Improvement Suggestions
                </h4>
                <ul className="space-y-2">
                  {match.improvementSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-secondary-text"
                    >
                      <span className="text-primary">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
              <Divider />
            </>
          )}

          {/* Benefits */}
          {job.benefits.length > 0 && (
            <>
              <div>
                <h4 className="font-semibold text-primary text-sm mb-2">
                  Benefits
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((benefit) => (
                    <Chip
                      key={benefit}
                      size="sm"
                      variant="flat"
                      color="success"
                    >
                      {benefit}
                    </Chip>
                  ))}
                </div>
              </div>
              <Divider />
            </>
          )}

          {/* Job Description */}
          <div>
            <h4 className="font-semibold text-primary text-sm mb-3">
              Job Description
            </h4>
            {job.descriptionHtml ? (
              <div className="space-y-4 p-6 rounded-lg border border-border">
                {parse(job.descriptionHtml, {
                  replace: (domNode: any) => {
                    if (domNode.type !== 'tag') return;

                    const children = domNode.children?.map((child: any) =>
                      child.type === 'text'
                        ? child.data
                        : parse(child.data || '', { replace: () => null }),
                    );

                    // Headings
                    if (domNode.name === 'h1') {
                      return (
                        <h1 className="text-2xl font-bold text-primary mt-6 mb-3">
                          {children}
                        </h1>
                      );
                    }
                    if (domNode.name === 'h2') {
                      return (
                        <h2 className="text-xl font-bold text-primary mt-5 mb-2">
                          {children}
                        </h2>
                      );
                    }
                    if (domNode.name === 'h3') {
                      return (
                        <h3 className="text-lg font-semibold text-primary mt-4 mb-2">
                          {children}
                        </h3>
                      );
                    }
                    if (domNode.name === 'h4') {
                      return (
                        <h4 className="text-base font-semibold text-primary mt-3 mb-2">
                          {children}
                        </h4>
                      );
                    }

                    // Paragraphs
                    if (domNode.name === 'p') {
                      return (
                        <p className="text-sm text-secondary-text leading-relaxed mb-3">
                          {children}
                        </p>
                      );
                    }

                    // Lists
                    if (domNode.name === 'ul') {
                      return (
                        <ul className="list-disc list-inside space-y-1 text-sm text-secondary-text ml-4">
                          {children}
                        </ul>
                      );
                    }
                    if (domNode.name === 'ol') {
                      return (
                        <ol className="list-decimal list-inside space-y-1 text-sm text-secondary-text ml-4">
                          {children}
                        </ol>
                      );
                    }
                    if (domNode.name === 'li') {
                      return (
                        <li className="text-sm text-secondary-text">
                          {children}
                        </li>
                      );
                    }

                    // Links
                    if (domNode.name === 'a') {
                      return (
                        <a
                          href={domNode.attribs?.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent underline hover:text-accent/80"
                        >
                          {children}
                        </a>
                      );
                    }

                    // Strong/Bold
                    if (domNode.name === 'strong' || domNode.name === 'b') {
                      return (
                        <strong className="font-semibold text-primary">
                          {children}
                        </strong>
                      );
                    }

                    // Code
                    if (domNode.name === 'code') {
                      return (
                        <code className="px-1.5 py-0.5 rounded bg-muted/30 text-xs font-mono">
                          {children}
                        </code>
                      );
                    }

                    // Horizontal rule
                    if (domNode.name === 'hr') {
                      return <hr className="my-4 border-border" />;
                    }
                  },
                })}
              </div>
            ) : (
              <p className="text-sm text-primary whitespace-pre-wrap p-4 rounded border border-border">
                {job.description}
              </p>
            )}
          </div>
        </div>
      </ScrollShadow>
    </div>
  );
};
