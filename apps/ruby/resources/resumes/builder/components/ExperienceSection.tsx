import { Button } from '@common/components/button/Button';
import { InputName } from '@common/components/input/InputFirstName';
import { H3, H5, H6 } from '@common/components/typography';
import { TrashIcon } from '@heroicons/react/24/outline';
import {
  Briefcase,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  GripVertical,
  MapPin,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import type { ExperienceEntry } from '../types/resume-builder';
import { RichTextEditor } from './RichTextEditor';

interface ExperienceSectionProps {
  entries: ExperienceEntry[];
  onChange: (entries: ExperienceEntry[]) => void;
}

export const ExperienceSection = ({
  entries,
  onChange,
}: ExperienceSectionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addEntry = () => {
    const newEntry: ExperienceEntry = {
      id: nanoid(10),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    onChange([...entries, newEntry]);
    setExpandedId(newEntry.id);
  };

  const updateEntry = (id: string, updates: Partial<ExperienceEntry>) => {
    onChange(
      entries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry,
      ),
    );
  };

  const removeEntry = (id: string) => {
    onChange(entries.filter((entry) => entry.id !== id));
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const moveEntry = (index: number, direction: 'up' | 'down') => {
    const newEntries = [...entries];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= entries.length) return;

    const temp = newEntries[index];
    newEntries[index] = newEntries[targetIndex];
    newEntries[targetIndex] = temp;
    onChange(newEntries);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <H3 className="text-lg font-semibold text-foreground">Experience</H3>
        <Button
          color="primary"
          variant="flat"
          onClick={addEntry}
          startContent={<Briefcase className="size-4.5" />}
        >
          <p className="">Add Experience</p>
        </Button>
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
          <p>No experience entries yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      )}

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="border border-border rounded overflow-y-scroll bg-background"
          >
            <div
              className="flex items-center justify-between p-3 bg-background cursor-pointer hover:bg-background"
              onClick={() =>
                setExpandedId(expandedId === entry.id ? null : entry.id)
              }
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-primary" />
                <div>
                  <H5>
                    {entry.position || 'New Position'}
                    {entry.company && ` at ${entry.company}`}
                  </H5>
                  <H6>
                    {entry.startDate || 'Start'} -{' '}
                    {entry.current ? 'Present' : entry.endDate || 'End'}
                  </H6>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="flat"
                  className="rounded-full"
                  color="primary"
                  isIconOnly
                  onClick={(e) => {
                    e.stopPropagation();
                    moveEntry(index, 'up');
                  }}
                  disabled={index === 0}
                  title="Move up"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button
                  className="rounded-full"
                  isIconOnly
                  onClick={(e) => {
                    e.stopPropagation();
                    moveEntry(index, 'down');
                  }}
                  disabled={index === entries.length - 1}
                  variant="flat"
                  color="primary"
                  title="Move down"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <Button
                  isIconOnly
                  className="rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeEntry(entry.id);
                  }}
                  variant="flat"
                  color="danger"
                  title="Remove"
                  startContent={<TrashIcon className="size-3.5" />}
                />
              </div>
            </div>

            {expandedId === entry.id && (
              <div className="p-4 space-y-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-start gap-2">
                      <Briefcase className="size-5 text-secondary-text" />
                      <H6>Position</H6>
                    </div>
                    <InputName
                      hasLabel={false}
                      hasIcon={false}
                      placeholder="e.g., Senior Software Engineer"
                      value={entry.position}
                      onChange={(e) => updateEntry(entry.id, { position: e })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-start gap-2">
                      <Building2 className="size-5 text-secondary-text" />
                      <H6>Company</H6>
                    </div>
                    <InputName
                      hasLabel={false}
                      hasIcon={false}
                      placeholder="e.g., Google"
                      value={entry.company}
                      onChange={(e) => updateEntry(entry.id, { company: e })}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-start gap-2">
                    <MapPin className="size-5 text-secondary-text" />
                    <H6>Location</H6>
                  </div>
                  <InputName
                    hasLabel={false}
                    hasIcon={false}
                    placeholder="e.g., Mountain View, CA"
                    value={entry.location}
                    onChange={(e) => updateEntry(entry.id, { location: e })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-start gap-2">
                      <Calendar className="size-5 text-secondary-text" />
                      <H6>Start Date</H6>
                    </div>
                    <InputName
                      hasLabel={false}
                      hasIcon={false}
                      placeholder="Start Date"
                      value={entry.startDate}
                      onChange={(e) => updateEntry(entry.id, { startDate: e })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-start gap-2">
                      <Calendar className="size-5 text-secondary-text" />
                      <H6>End Date</H6>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <InputName
                          hasLabel={false}
                          hasIcon={false}
                          placeholder="End Date"
                          value={entry.endDate}
                          onChange={(e) =>
                            updateEntry(entry.id, { endDate: e })
                          }
                          disabled={entry.current}
                        />
                      </div>
                      <label className="flex items-center gap-1.5 text-sm whitespace-nowrap cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={entry.current}
                          onChange={(e) =>
                            updateEntry(entry.id, {
                              current: e.target.checked,
                              endDate: e.target.checked ? '' : entry.endDate,
                            })
                          }
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        Current
                      </label>
                    </div>
                  </div>
                </div>

                {/* Rich text description with Tiptap */}
                <div>
                  <H5 className="mb-1">Description</H5>
                  <H6 className="text-secondary-text py-1">
                    Describe your responsibilities and achievements.
                  </H6>
                  <RichTextEditor
                    content={entry.description}
                    placeholder="• Led a team of 5 developers...
• Improved system performance by 20%...
• Designed and implemented new features..."
                    onChange={(html) =>
                      updateEntry(entry.id, { description: html })
                    }
                    minHeight="100px"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
