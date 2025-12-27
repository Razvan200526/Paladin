import { H4, H6 } from "@common/components/typography"
import { Icon } from "@iconify/react"
import type { ApplicationType } from "@sdk/types"

export const JobInformation = ({ application }: { application: ApplicationType }) => {
  return (
    <div className="bg-light border border-border rounded-lg p-4">
      <H4 className="mb-4">Job Information</H4>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <H6 className="text-sm font-semibold text-muted mb-1">
              Company
            </H6>
            <p className="text-primary font-medium">
              {application.employer}
            </p>
          </div>
          <div>
            <H6 className="text-sm font-semibold text-muted mb-1">
              Position
            </H6>
            <p className="text-primary font-medium">
              {application.jobTitle}
            </p>
          </div>
          <div>
            <H6 className="text-sm font-semibold text-muted mb-1">
              Location
            </H6>
            <p className="text-secondary-text">
              {application.location}
            </p>
          </div>
          {application.salaryRange && (
            <div>
              <H6 className="text-sm font-semibold text-muted mb-1">
                Salary Range
              </H6>
              <p className="text-secondary-text">
                {application.salaryRange}
              </p>
            </div>
          )}
        </div>

        {application.jobUrl && (
          <div>
            <H6 className="text-sm font-semibold text-muted mb-1">
              Job Posting
            </H6>
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              <Icon icon="heroicons:link" className="size-4" />
              View Original Posting
            </a>
          </div>
        )}

        {application.contact && (
          <div>
            <H6 className="text-sm font-semibold text-muted mb-1">
              Contact Person
            </H6>
            <p className="text-secondary-text">
              {application.contact}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
