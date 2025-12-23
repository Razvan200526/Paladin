import { Button } from '@common/components/button/Button';
import { InputName } from '@common/components/input/InputFirstName';
import { H3, H5, H6 } from '@common/components/typography';
import { EducationIcon } from '@common/icons/EducationIcon';
import { TrashIcon } from '@heroicons/react/24/outline';
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  GripVertical,
  MapPin,
  SchoolIcon,
  Star,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import type { EducationEntry } from '../types/resume-builder';
import { RichTextEditor } from './RichTextEditor';

interface EducationSectionProps {
  entries: EducationEntry[];
  onChange: (entries: EducationEntry[]) => void;
}

export const EducationSection = ({
  entries,
  onChange,
}: EducationSectionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addEntry = () => {
    const newEntry: EducationEntry = {
      id: nanoid(10),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
    };
    onChange([...entries, newEntry]);
    setExpandedId(newEntry.id);
  };

  const updateEntry = (id: string, updates: Partial<EducationEntry>) => {
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
        <H3 className="text-lg font-semibold text-foreground">Education</H3>
        <Button
          color="primary"
          variant="flat"
          onClick={addEntry}
          startContent={<EducationIcon className="size-4.5" />}
        >
          <p className="">Add Education</p>
        </Button>
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
          <p>No education entries yet.</p>
          <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      )}

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="border border-border rounded overflow-y-scroll bg-background"
          >
            <div
              className="flex items-center justify-between p-3 bg-background cursor-pointer hover:bg-background "
              onClick={() =>
                setExpandedId(expandedId === entry.id ? null : entry.id)
              }
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-primary" />
                <div>
                  <H5>
                    {entry.degree || 'New Degree'}
                    {entry.field && ` in ${entry.field}`}
                  </H5>
                  <H6>
                    {entry.institution || 'Institution'} •{' '}
                    {entry.startDate || 'Start'} - {entry.endDate || 'End'}
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
                  onClick={() => {
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
                  onClick={() => {
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
                      <SchoolIcon className="size-5 text-secondary-text" />
                      <H6>Institution</H6>
                    </div>
                    <InputName
                      hasLabel={false}
                      hasIcon={false}
                      placeholder="e.g., Stanford University"
                      value={entry.institution}
                      onChange={(e) =>
                        updateEntry(entry.id, { institution: e })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-start gap-2">
                      <MapPin className="size-5 text-secondary-text" />
                      <H6>Location</H6>
                    </div>
                    <InputName
                      hasLabel={false}
                      hasIcon={false}
                      placeholder="e.g., Stanford, CA"
                      value={entry.location}
                      onChange={(e) => updateEntry(entry.id, { location: e })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-start gap-2">
                      <GraduationCap className="size-5 text-secondary-text" />
                      <H6>Degree *</H6>
                    </div>
                    <InputName
                      hasLabel={false}
                      hasIcon={false}
                      placeholder="e.g., Bachelor of Science"
                      value={entry.degree}
                      onChange={(e) => updateEntry(entry.id, { degree: e })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-start gap-2">
                      <BookOpen className="size-5 text-secondary-text" />
                      <H6>Field of Study</H6>
                    </div>
                    <InputName
                      hasLabel={false}
                      hasIcon={false}
                      placeholder="e.g., Computer Science"
                      value={entry.field}
                      onChange={(e) => updateEntry(entry.id, { field: e })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                    <InputName
                      hasLabel={false}
                      hasIcon={false}
                      placeholder="End Date"
                      value={entry.endDate}
                      onChange={(e) => updateEntry(entry.id, { endDate: e })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-start gap-2">
                      <Star className="size-5 text-secondary-text" />
                      <H6>GPA (optional)</H6>
                    </div>
                    <InputName
                      hasLabel={false}
                      hasIcon={false}
                      placeholder="e.g., 3.8/4.0"
                      value={entry.gpa}
                      onChange={(e) => updateEntry(entry.id, { gpa: e })}
                    />
                  </div>
                </div>

                {/* Rich text description with Tiptap */}
                <div>
                  <H5 className="mb-1">Description</H5>
                  <H6 className="text-secondary-text py-1">
                    Add relevant coursework, honors, activities, or
                    achievements.
                  </H6>
                  <RichTextEditor
                    content={entry.description}
                    placeholder="• Relevant coursework: Data Structures, Algorithms...
• Dean's List, Magna Cum Laude
• President of Computer Science Club"
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
