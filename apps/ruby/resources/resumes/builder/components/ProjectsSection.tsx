import { Button } from '@common/components/button/Button';
import { InputName } from '@common/components/input/InputFirstName';
import { H3, H5, H6 } from '@common/components/typography';
import {
  ChevronDown,
  ChevronUp,
  Code,
  FolderGit2,
  GripVertical,
  Link as LinkIcon,
  Plus,
  Trash2,
  XIcon,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import type { ProjectEntry } from '../types/resume-builder';
import { RichTextEditor } from './RichTextEditor';

interface ProjectsSectionProps {
  entries: ProjectEntry[];
  onChange: (entries: ProjectEntry[]) => void;
}

export const ProjectsSection = ({
  entries,
  onChange,
}: ProjectsSectionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newTechInputs, setNewTechInputs] = useState<Record<string, string>>(
    {},
  );

  const addEntry = () => {
    const newEntry: ProjectEntry = {
      id: nanoid(10),
      name: '',
      url: '',
      technologies: [],
      description: '',
    };
    onChange([...entries, newEntry]);
    setExpandedId(newEntry.id);
  };

  const updateEntry = (id: string, updates: Partial<ProjectEntry>) => {
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
    setNewTechInputs((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
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

  const addTechnology = (entryId: string) => {
    const techName = newTechInputs[entryId]?.trim();
    if (!techName) return;

    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return;

    if (entry.technologies.includes(techName)) {
      setNewTechInputs((prev) => ({ ...prev, [entryId]: '' }));
      return;
    }

    updateEntry(entryId, {
      technologies: [...entry.technologies, techName],
    });
    setNewTechInputs((prev) => ({ ...prev, [entryId]: '' }));
  };

  const removeTechnology = (entryId: string, techIndex: number) => {
    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return;

    updateEntry(entryId, {
      technologies: entry.technologies.filter(
        (_, index) => index !== techIndex,
      ),
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    entryId: string,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology(entryId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <H3 className="text-lg font-semibold text-foreground">Projects</H3>
        <Button
          color="primary"
          variant="flat"
          onClick={addEntry}
          startContent={<FolderGit2 className="size-4.5" />}
        >
          <p>Add Project</p>
        </Button>
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
          <p>No projects yet.</p>
          <p className="text-sm mt-1">
            Showcase your personal projects, open source contributions, or side
            projects.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="border border-border rounded overflow-y-scroll bg-background"
          >
            {/* Header - always visible */}
            <div
              className="flex items-center justify-between p-3 bg-background cursor-pointer hover:bg-background"
              onClick={() =>
                setExpandedId(expandedId === entry.id ? null : entry.id)
              }
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-primary" />
                <div>
                  <div className="flex items-center gap-2">
                    <H5>{entry.name || 'New Project'}</H5>
                    {entry.url && (
                      <LinkIcon className="w-3 h-3 text-secondary-text" />
                    )}
                  </div>
                  <H6>
                    {entry.technologies.length > 0
                      ? entry.technologies.slice(0, 3).join(', ') +
                        (entry.technologies.length > 3
                          ? ` +${entry.technologies.length - 3} more`
                          : '')
                      : 'No technologies listed'}
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
                  color="primary"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Expanded content */}
            {expandedId === entry.id && (
              <div className="p-4 space-y-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-start gap-2">
                      <FolderGit2 className="size-5 text-secondary-text" />
                      <H6>Project Name *</H6>
                    </div>
                    <InputName
                      hasLabel={false}
                      hasIcon={false}
                      placeholder="e.g., My Awesome App"
                      value={entry.name}
                      onChange={(e) => updateEntry(entry.id, { name: e })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-start gap-2">
                      <LinkIcon className="size-5 text-secondary-text" />
                      <H6>Project URL</H6>
                    </div>
                    <InputName
                      hasLabel={false}
                      hasIcon={false}
                      placeholder="https://github.com/username/project"
                      value={entry.url || ''}
                      onChange={(e) => updateEntry(entry.id, { url: e })}
                    />
                  </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-start gap-2">
                    <Code className="size-5 text-secondary-text" />
                    <H6>Technologies Used</H6>
                  </div>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {entry.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(entry.id, techIndex)}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                          title="Remove technology"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {entry.technologies.length === 0 && (
                      <span className="text-sm text-secondary-text">
                        No technologies added yet
                      </span>
                    )}
                  </div>

                  {/* Add technology input */}
                  <div className="flex gap-2">
                    <InputName
                      hasLabel={false}
                      hasIcon={false}
                      placeholder="Type a technology and press Enter"
                      value={newTechInputs[entry.id] || ''}
                      onChange={(value) =>
                        setNewTechInputs((prev) => ({
                          ...prev,
                          [entry.id]: value,
                        }))
                      }
                      onKeyDown={(e) => handleKeyDown(e, entry.id)}
                      className="flex-1"
                    />
                    <Button
                      color="primary"
                      variant="flat"
                      onClick={() => addTechnology(entry.id)}
                      isDisabled={!newTechInputs[entry.id]?.trim()}
                      startContent={<Plus className="size-4" />}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Rich text description with Tiptap */}
                <div>
                  <H5 className="mb-1">Description</H5>
                  <H6 className="text-secondary-text py-1">
                    Describe what the project does, your role, and any notable
                    achievements.
                  </H6>
                  <RichTextEditor
                    content={entry.description}
                    placeholder="• Built a full-stack web application using React and Node.js
• Implemented user authentication and real-time notifications
• Deployed to AWS with CI/CD pipeline"
                    onChange={(html) =>
                      updateEntry(entry.id, { description: html })
                    }
                    minHeight="120px"
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
