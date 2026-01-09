import { Button } from '@common/components/button';
import { NumberChip } from '@common/components/chips/NumberChip';
import {
  Dropdown,
  type DropdownItemDataType,
} from '@common/components/dropdown/Dropdown';
import type { ModalRefType } from '@common/components/Modal';
import { Modal } from '@common/components/Modal';
import { PdfUploader } from '@common/components/pdf/PdfUploader';
import { H4 } from '@common/components/typography';
import { CoverLetterIcon } from '@common/icons/CoverletterIcon';
import { ResumeIcon } from '@common/icons/ResumeIcon';
import {
  FunnelIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn, DropdownItem, DropdownMenu, Tab, Tabs } from '@heroui/react';
import { backend } from '@ruby/shared/backend';
import { useAuth } from '@ruby/shared/hooks';
import type {
  CoverLetterType,
  ResumeBuilderType,
  ResumeType,
} from '@sdk/types';
import { useMemo, useRef, useState } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from 'react-router';
import {
  useCoverLetters,
  useResumeBuilders,
  useResumes,
} from './resumes/hooks';
import { DeleteResourceModal } from './resumes/modals/DeleteResourceModal';
import {
  coverLetterFilterConfig,
  filterAndSortResources,
  ResourceFilterSidebar,
  resumeFilterConfig,
  useFilterStore,
} from './shared';
import { useDeleteStore } from './store';

export type ResourceOutletContext = {
  filteredResumes: ResumeType[];
  filteredCoverLetters: CoverLetterType[];
  resumeBuilders: ResumeBuilderType[];
  resumesLoading: boolean;
  resumeBuildersLoading: boolean;
  coverlettersLoading: boolean;
  totalResumes: number;
  totalCoverLetters: number;
};

export const useResourceContext = () =>
  useOutletContext<ResourceOutletContext>();

export const ResourceLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useAuth();
  const deleteModalRef = useRef<ModalRefType | null>(null);
  const uploadResumeRef = useRef<ModalRefType | null>(null);
  const uploadCoverLetterRef = useRef<ModalRefType | null>(null);
  const createResumeRef = useRef<ModalRefType | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: resumes, isLoading: resumesLoading } = useResumes(
    user?.id || '',
  );
  const { data: resumeBuilders, isLoading: resumeBuildersLoading } =
    useResumeBuilders(user?.id || '');
  const { data: coverletters, isLoading: coverlettersLoading } =
    useCoverLetters(user?.id || '');
  const {
    state,
    startDeleting,
    stopDeleting,
    deletingResumeIds,
    deletingCoverletterIds,
  } = useDeleteStore();

  const resumeFilters = useFilterStore((state) => state.resumeFilters);
  const coverLetterFilters = useFilterStore(
    (state) => state.coverLetterFilters,
  );

  const filteredResumes = useMemo(() => {
    if (!resumes) return [];
    return filterAndSortResources(resumes, resumeFilters);
  }, [resumes, resumeFilters]);

  const filteredCoverLetters = useMemo(() => {
    if (!coverletters) return [];
    return filterAndSortResources(coverletters, coverLetterFilters);
  }, [coverletters, coverLetterFilters]);

  const handleUploadResume = async (urls: string[]) => {
    backend.resume.create({
      url: urls[0] || '',
    });
  };

  const handleUploadCoverLetter = async (urls: string[]) => {
    await backend.coverLetter.create({
      url: urls[0] || '',
    });
  };

  const dropdownItems: DropdownItemDataType[] = [
    {
      key: 'resume',
      label: 'Resume',
      subMenu: (
        <DropdownMenu
          aria-label="Resume actions"
          variant="flat"
          color="primary"
          className="p-1"
        >
          <DropdownItem
            key="upload"
            className="rounded text-resume data-[hover=true]:bg-resume/10 data-[hover=true]:text-secondary-text"
            startContent={<ResumeIcon className="size-4" />}
            onPress={() => uploadResumeRef.current?.open()}
          >
            Upload
          </DropdownItem>
          <DropdownItem
            key="create"
            className="rounded text-resume data-[hover=true]:bg-resume/10 data-[hover=true]:text-secondary-text"
            startContent={<ResumeIcon className="size-4" />}
            onPress={() => navigate('/home/resources/resumes/builder')}
          >
            Create
          </DropdownItem>
        </DropdownMenu>
      ),
      className:
        'text-resume data-[hover=true]:bg-resume/10 data-[hover=true]:text-secondary-text',
      icon: <ResumeIcon className="size-4" />,
      endContent: <span className="text-xs text-muted-foreground">▶</span>,
    },
    {
      key: 'cover-letter',
      label: 'Cover Letter',
      className:
        'text-coverletter data-[hover=true]:bg-coverletter/10 data-[hover=true]:text-secondary-text',
      icon: <CoverLetterIcon className="size-4" />,
      onAction: () => uploadCoverLetterRef.current?.open(),
    },
  ];

  const resourceItems = [
    {
      key: 'resume',
      label: 'Resumes',
      href: '.',
      className: 'text-primary data-[hover=true]:bg-primary/10',
      activeClassName: 'bg-primary/15 border-primary',
      count: resumes?.length || 0,
    },
    {
      key: 'cover',
      label: 'Cover Letters',
      href: 'coverletter',
      className: 'text-primary data-[hover=true]:bg-primary/10 ',
      activeClassName: 'bg-primary/15 border-primary',
      count: coverletters?.length || 0,
    },
  ];

  const activeTabKey = useMemo(() => {
    const pathEnd = location.pathname.split('/').pop();
    if (pathEnd === 'resources') return 'resume';
    if (pathEnd === 'coverletter') return 'cover';
    if (pathEnd === 'chats') return 'chats';
    return 'resume';
  }, [location.pathname]);

  const activeTabItem = resourceItems.find((item) => item.key === activeTabKey);

  const handleSelectionChange = (key: string | number) => {
    const item = resourceItems.find((i) => i.key === key);
    if (item) {
      navigate(item.href);
    }
  };

  const isInspectPage =
    location.pathname.includes('/resumes/') ||
    location.pathname.includes('/coverletters/');
  const showFilterSidebar =
    !isInspectPage && (activeTabKey === 'resume' || activeTabKey === 'cover');
  const currentFilterConfig =
    activeTabKey === 'resume' ? resumeFilterConfig : coverLetterFilterConfig;

  const sidebarFilteredCount =
    activeTabKey === 'resume'
      ? filteredResumes.length
      : filteredCoverLetters.length;
  const sidebarLoading =
    activeTabKey === 'resume' ? resumesLoading : coverlettersLoading;

  const deleteItemsCount =
    deletingResumeIds.length + deletingCoverletterIds.length;

  return (
    <div className="h-[calc(100dvh)] bg-background flex flex-col">
      {/* Navigation Bar */}
      <nav className="px-2 sm:px-4 py-2 flex flex-row items-center justify-between w-full border-b border-border bg-background gap-1 sm:gap-2">
        {/* Title - hidden on very small screens when tabs are visible */}
        <H4 className="text-base font-primary hidden sm:block shrink-0">
          Resources
        </H4>

        {/* Tabs - flexible width */}
        <Tabs
          onSelectionChange={handleSelectionChange}
          selectedKey={activeTabKey}
          classNames={{
            base: 'flex-1 sm:flex-none px-1 sm:px-4 py-1',
            tabContent: 'text-primary',
            cursor: cn('rounded border-none', activeTabItem?.activeClassName),
            tab: cn(
              'rounded data-[hover-unselected=true]:bg-primary-100/80 py-3 sm:py-4 shadow-none',
              'border-none transition-all duration-300 data-[hover-unselected=true]:opacity-100',
            ),
            panel: 'p-0',
          }}
          aria-label="resource-tabs"
          variant="light"
          radius="sm"
          size="sm"
        >
          {resourceItems.map((item) => (
            <Tab
              key={item.key}
              title={
                <div
                  className={cn(
                    'flex items-center space-x-1 font-medium text-xs sm:text-sm',
                    item.className,
                  )}
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count !== null && (
                    <NumberChip
                      className={cn(
                        item.activeClassName,
                        'text-secondary-text text-xs',
                      )}
                      value={item.count}
                    />
                  )}
                </div>
              }
            />
          ))}
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Delete button - shows count when items selected */}
          {deleteItemsCount > 0 ? (
            <Button
              variant="solid"
              color="danger"
              className="px-2 sm:px-4 text-xs sm:text-sm"
              size="sm"
              onPress={() => {
                deleteModalRef.current?.open();
              }}
            >
              <span className="hidden sm:inline">Delete </span>
              {deleteItemsCount}
              <span className="hidden sm:inline">
                {deleteItemsCount === 1 ? ' item' : ' items'}
              </span>
            </Button>
          ) : null}

          {/* Trash toggle button */}
          {resumes?.length || coverletters?.length ? (
            <Button
              variant="light"
              isIconOnly={true}
              color="danger"
              radius="full"
              size="sm"
              onPress={() => {
                state ? stopDeleting() : startDeleting();
              }}
            >
              <TrashIcon className="size-3.5" />
            </Button>
          ) : null}

          {/* Filter toggle button - visible on mobile only */}
          {showFilterSidebar && (
            <Button
              variant="light"
              isIconOnly={true}
              color="primary"
              radius="full"
              size="sm"
              className="lg:hidden"
              onPress={() => setShowMobileFilters(!showMobileFilters)}
            >
              <FunnelIcon className="size-4" />
            </Button>
          )}

          {/* Add dropdown */}
          <Dropdown
            items={dropdownItems}
            onAction={(key) => {
              const item = dropdownItems.find((i) => i.key === key);
              item?.onAction?.();
            }}
            trigger={
              <Button variant="flat" isIconOnly={true} radius="md" size="sm">
                <PlusIcon className="size-4" />
              </Button>
            }
          />
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <Outlet
            context={
              {
                filteredResumes,
                filteredCoverLetters,
                resumeBuilders: resumeBuilders || [],
                resumesLoading,
                resumeBuildersLoading,
                coverlettersLoading: coverlettersLoading,
                totalResumes: resumes?.length || 0,
                totalCoverLetters: coverletters?.length || 0,
              } satisfies ResourceOutletContext
            }
          />
        </div>

        {/* Filter Sidebar - Desktop (always visible on lg+) */}
        {showFilterSidebar && (
          <div className="hidden lg:block py-2 pr-2 shrink-0">
            <ResourceFilterSidebar
              config={currentFilterConfig}
              filteredCount={sidebarFilteredCount}
              isLoading={sidebarLoading}
              onServerFilterChange={() => {}}
            />
          </div>
        )}

        {/* Mobile Filter Overlay */}
        {showFilterSidebar && showMobileFilters && (
          <>
            {/* Backdrop */}
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowMobileFilters(false)}
            />
            {/* Slide-in Panel */}
            <div
              className="lg:hidden fixed right-0 top-0 bottom-0 z-50 w-[85vw] max-w-xs bg-background shadow-xl overflow-y-auto"
              style={{ animation: 'slideInFromRight 0.2s ease-out' }}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-semibold text-sm">Filters</span>
                <Button
                  variant="light"
                  isIconOnly={true}
                  radius="full"
                  size="sm"
                  onPress={() => setShowMobileFilters(false)}
                >
                  <XMarkIcon className="size-5" />
                </Button>
              </div>
              <div className="p-2">
                <ResourceFilterSidebar
                  config={currentFilterConfig}
                  filteredCount={sidebarFilteredCount}
                  isLoading={sidebarLoading}
                  onServerFilterChange={() => {
                    setShowMobileFilters(false);
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <DeleteResourceModal modalRef={deleteModalRef} />
      <Modal
        modalRef={uploadResumeRef}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
        hideCloseButton={true}
        className="bg-light p-4 rounded max-w-[95vw] sm:max-w-md"
      >
        <PdfUploader
          type="resume"
          onUpload={(urls) => handleUploadResume(urls)}
        />
      </Modal>
      <Modal
        modalRef={uploadCoverLetterRef}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
        hideCloseButton={true}
        className="bg-light p-4 rounded max-w-[95vw] sm:max-w-md"
      >
        <PdfUploader
          type="coverLetter"
          onUpload={(urls) => handleUploadCoverLetter(urls)}
        />
      </Modal>
      <Modal
        modalRef={createResumeRef}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
        hideCloseButton={true}
        className="bg-light p-4 rounded max-w-[95vw] sm:max-w-md"
      >
        <div className="text-center py-8">
          <p className="text-lg font-medium mb-2">Create Resume</p>
          <p className="text-muted-foreground text-sm mb-4">
            Build your resume from scratch with our builder
          </p>
          <Button
            variant="solid"
            color="primary"
            onPress={() => {
              createResumeRef.current?.close();
              navigate('/home/resources/resumes/builder');
            }}
          >
            Open Resume Builder
          </Button>
        </div>
      </Modal>
    </div>
  );
};
