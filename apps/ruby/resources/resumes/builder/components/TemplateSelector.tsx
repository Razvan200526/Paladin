import { H3, H5, H6 } from '@common/components/typography';
import { cn } from '@heroui/react';
import { CheckIcon, LayoutTemplateIcon } from 'lucide-react';
import {
  getAllTemplates,
  type TemplateConfig,
  type TemplateId,
} from '../types/templates';

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  onSelect: (templateId: TemplateId) => void;
}

// Template thumbnail previews - simplified visual representations
const TemplateThumbnail = ({
  template,
  isSelected,
}: {
  template: TemplateConfig;
  isSelected: boolean;
}) => {
  const { colors, layout } = template;

  // Render different layouts based on template type
  const renderLayout = () => {
    switch (layout.type) {
      case 'sidebar-left':
        return (
          <div className="flex h-full">
            <div
              className="w-1/3 p-1"
              style={{ backgroundColor: colors.headerBackground }}
            >
              <div
                className="h-2 w-3/4 rounded-sm mb-1"
                style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
              />
              <div
                className="h-1 w-1/2 rounded-sm"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              />
            </div>
            <div className="w-2/3 p-1.5 bg-white">
              <div
                className="h-1.5 w-3/4 rounded-sm mb-1"
                style={{ backgroundColor: colors.primary }}
              />
              <div
                className="h-1 w-full rounded-sm mb-0.5"
                style={{ backgroundColor: colors.sectionBorder }}
              />
              <div
                className="h-1 w-5/6 rounded-sm"
                style={{ backgroundColor: colors.textSecondary }}
              />
            </div>
          </div>
        );

      case 'two-column':
        return (
          <div className="p-1.5 h-full bg-white">
            <div
              className="h-3 w-full rounded-sm mb-1.5 flex items-center justify-center"
              style={{ backgroundColor: colors.headerBackground }}
            >
              <div
                className="h-1.5 w-1/2 rounded-sm"
                style={{
                  backgroundColor:
                    colors.headerBackground === '#ffffff'
                      ? colors.primary
                      : 'white',
                }}
              />
            </div>
            <div className="flex gap-1">
              <div className="w-1/2">
                <div
                  className="h-1 w-full rounded-sm mb-0.5"
                  style={{ backgroundColor: colors.sectionBorder }}
                />
                <div
                  className="h-0.5 w-3/4 rounded-sm"
                  style={{ backgroundColor: colors.textSecondary }}
                />
              </div>
              <div className="w-1/2">
                <div
                  className="h-1 w-full rounded-sm mb-0.5"
                  style={{ backgroundColor: colors.sectionBorder }}
                />
                <div
                  className="h-0.5 w-3/4 rounded-sm"
                  style={{ backgroundColor: colors.textSecondary }}
                />
              </div>
            </div>
          </div>
        );

      default:
        // Single column layout
        return (
          <div
            className="p-1.5 h-full"
            style={{ backgroundColor: colors.background }}
          >
            {/* Header */}
            <div
              className={cn(
                'mb-1.5 pb-1',
                layout.headerStyle === 'banner' && 'rounded-sm p-1',
              )}
              style={{
                backgroundColor:
                  layout.headerStyle === 'banner'
                    ? colors.headerBackground
                    : 'transparent',
              }}
            >
              <div
                className={cn(
                  'h-2 rounded-sm mb-0.5',
                  layout.headerStyle === 'centered' ? 'mx-auto w-1/2' : 'w-3/4',
                )}
                style={{
                  backgroundColor:
                    layout.headerStyle === 'banner' &&
                    colors.headerBackground !== '#ffffff'
                      ? 'rgba(255,255,255,0.9)'
                      : colors.primary,
                }}
              />
              <div
                className={cn(
                  'h-1 rounded-sm',
                  layout.headerStyle === 'centered' ? 'mx-auto w-2/3' : 'w-1/2',
                )}
                style={{
                  backgroundColor:
                    layout.headerStyle === 'banner' &&
                    colors.headerBackground !== '#ffffff'
                      ? 'rgba(255,255,255,0.5)'
                      : colors.textSecondary,
                }}
              />
            </div>

            {/* Section */}
            <div className="mb-1">
              <div
                className={cn(
                  'h-1 w-1/3 rounded-sm mb-0.5',
                  layout.borderStyle === 'accent-left' && 'border-l-2',
                  layout.borderStyle === 'accent-left' && 'pl-0.5',
                )}
                style={{
                  backgroundColor: colors.accent,
                  borderColor:
                    layout.borderStyle === 'accent-left'
                      ? colors.accent
                      : 'transparent',
                }}
              />
              <div
                className="h-0.5 w-full rounded-sm mb-0.5"
                style={{ backgroundColor: colors.sectionBorder }}
              />
              <div
                className="h-0.5 w-5/6 rounded-sm"
                style={{ backgroundColor: colors.textSecondary }}
              />
            </div>

            {/* Another section */}
            <div>
              <div
                className="h-1 w-1/4 rounded-sm mb-0.5"
                style={{ backgroundColor: colors.accent }}
              />
              <div
                className="h-0.5 w-full rounded-sm mb-0.5"
                style={{ backgroundColor: colors.sectionBorder }}
              />
              <div
                className="h-0.5 w-4/5 rounded-sm"
                style={{ backgroundColor: colors.textSecondary }}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        'relative w-full aspect-[8.5/11] rounded-lg overflow-hidden border-2 transition-all duration-200',
        isSelected
          ? 'border-primary shadow-lg ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50 hover:shadow-md',
      )}
    >
      {renderLayout()}

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 bg-primary text-white rounded-full p-0.5">
          <CheckIcon className="size-3" />
        </div>
      )}
    </div>
  );
};

export const TemplateSelector = ({
  selectedTemplate,
  onSelect,
}: TemplateSelectorProps) => {
  const templates = getAllTemplates();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutTemplateIcon className="size-5 text-primary" />
          <H3 className="text-lg font-semibold text-foreground">
            Choose Template
          </H3>
        </div>
      </div>

      <H6 className="text-secondary-text">
        Select a template that best represents your professional style. All
        templates are ATS-friendly.
      </H6>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <TemplateThumbnail
              template={template}
              isSelected={selectedTemplate === template.id}
            />
            <div className="mt-2 px-0.5">
              <H5
                className={cn(
                  'transition-colors',
                  selectedTemplate === template.id
                    ? 'text-primary'
                    : 'text-foreground group-hover:text-primary',
                )}
              >
                {template.name}
              </H5>
              <p className="text-xs text-secondary-text line-clamp-2 mt-0.5">
                {template.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
