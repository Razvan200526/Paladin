import { ArrowTopRightOnSquareIcon, CalendarIcon, ClockIcon, UserIcon } from "@heroicons/react/24/outline"
import type { ApplicationType } from "@sdk/types"

export const QuickStats = ({application} : {application : ApplicationType}) => {
    return(
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-light border border-border">
                <div className="flex items-center gap-2 text-muted text-xs mb-1">
                  <CalendarIcon className="size-4" />
                  Applied
                </div>
                <p className="font-semibold text-primary text-sm">
                  {new Date(application.createdAt).toLocaleDateString(
                    undefined,
                    {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    },
                  )}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-light border border-border">
                <div className="flex items-center gap-2 text-muted text-xs mb-1">
                  <ClockIcon className="size-4" />
                  Last Updated
                </div>
                <p className="font-semibold text-primary text-sm">
                  {new Date(application.updatedAt).toLocaleDateString(
                    undefined,
                    {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    },
                  )}
                </p>
              </div>
              {application.contact && (
                <div className="p-4 rounded-xl bg-light border border-border">
                  <div className="flex items-center gap-2 text-muted text-xs mb-1">
                    <UserIcon className="size-4" />
                    Contact
                  </div>
                  <p className="font-semibold text-primary text-sm truncate">
                    {application.contact}
                  </p>
                </div>
              )}
              {application.jobUrl && (
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-light border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                >
                  <div className="flex items-center gap-2 text-muted text-xs mb-1">
                    <ArrowTopRightOnSquareIcon className="size-4" />
                    Job Posting
                  </div>
                  <p className="font-semibold text-primary text-sm group-hover:underline">
                    View Original
                  </p>
                </a>
              )}
            </div>
    )
}