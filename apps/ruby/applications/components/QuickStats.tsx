import { Button } from "@common/components/button";
import { H4 } from "@common/components/typography";
import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { ApplicationType } from "@sdk/types";

export const QuickStats = ({ application, statusInfo }: { application: ApplicationType, statusInfo: { color: string, label: string } }) => {
  return (
    <div className="bg-light border border-border rounded-lg p-4">
      <H4 className="mb-4">Quick Info</H4>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Applied</span>
          <span className="text-sm font-medium">
            {new Date(application.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Last Updated</span>
          <span className="text-sm font-medium">
            {new Date(application.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Status</span>
          <Chip
            size="sm"
            className={`${statusInfo.color} border font-semibold`}
          >
            {statusInfo.label}
          </Chip>
        </div>
      </div>
    </div>
  )
}
