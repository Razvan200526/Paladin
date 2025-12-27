import { H4 } from "@common/components/typography"
import type { ApplicationType } from "@sdk/types"


export const ActionTimeline = ({ application, statusInfo }: { application: ApplicationType, statusInfo: any }) => {
  return (
    <div className="bg-light border border-border rounded-lg p-4">
      <H4 className="mb-4">Timeline</H4>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
          <div>
            <p className="text-sm font-medium">
              Application Created
            </p>
            <p className="text-xs text-muted">
              {new Date(application.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0" />
          <div>
            <p className="text-sm font-medium">
              Status: {statusInfo.label}
            </p>
            <p className="text-xs text-muted">
              {new Date(application.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
