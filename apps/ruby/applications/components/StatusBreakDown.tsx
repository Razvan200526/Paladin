import { Dropdown } from "@common/components/dropdown/Dropdown"
import { DropdownMenu, DropdownTrigger, Spinner } from "@heroui/react"
import type { ApplicationType } from "@sdk/types"
import { platformConfig, statusConfig } from "../utils/applicationData";
import { useUpdateApplicationStatus } from "../hooks/applicationHooks";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "@ruby/shared/hooks";
type ApplicationStatus = 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';

export const StatusBreakDown = ({ application }: { application: ApplicationType }) => {

    const { data: user } = useAuth();
    const handleStatusChange = (newStatus: ApplicationStatus) => {
        if (!application || !user?.id) return;
        setSelectedStatus(newStatus);
        updateStatus(
            {
                applicationId: application.id,
                userId: user.id,
                status: newStatus,
            },
            {
                onSettled: () => {
                    setSelectedStatus(null);
                },
            },
        );
    };
    const { mutate: updateStatus, isPending: isUpdatingStatus } =
        useUpdateApplicationStatus();
    const statusInfo =
        statusConfig[application.status as keyof typeof statusConfig];
    const platformInfo =
        platformConfig[application.platform as keyof typeof platformConfig];
    const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null);
    return (
        <Dropdown>
            <DropdownTrigger>
                <button
                    type="button"
                    className={`${statusInfo.color} border font-semibold px-4 py-2.5 rounded-xl text-sm cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2 shrink-0`}
                    disabled={isUpdatingStatus}
                >
                    {isUpdatingStatus && selectedStatus ? (
                        <Spinner size="sm" />
                    ) : (
                        <Icon icon={statusInfo.icon} className="size-4" />
                    )}
                    {statusInfo.label}
                    <Icon icon="heroicons:chevron-down" className="size-3" />
                </button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Change application status"
                onAction={(key) =>
                    handleStatusChange(key as ApplicationStatus)
                }
                disabledKeys={[application.status]}
            >
                <DropdownItem
                    key="Applied"
                    startContent={
                        <Icon icon="heroicons:document-text" className="size-4" />
                    }
                >
                    Applied
                </DropdownItem>
                <DropdownItem
                    key="Interviewing"
                    startContent={
                        <Icon
                            icon="heroicons:chat-bubble-left-right"
                            className="size-4"
                        />
                    }
                >
                    Interviewing
                </DropdownItem>
                <DropdownItem
                    key="Accepted"
                    startContent={
                        <Icon icon="heroicons:check-circle" className="size-4" />
                    }
                >
                    Accepted
                </DropdownItem>
                <DropdownItem
                    key="Rejected"
                    startContent={
                        <Icon icon="heroicons:x-circle" className="size-4" />
                    }
                >
                    Rejected
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}