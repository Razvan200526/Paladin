import { Button } from '@common/components/button/Button';
import { InputName } from '@common/components/input/InputFirstName';
import { H3, H5, H6 } from '@common/components/typography';
import { TrashIcon } from '@heroicons/react/24/outline';
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Tag,
  Wrench,
  X,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import type { SkillCategory } from '../types/resume-builder';

interface SkillsSectionProps {
  categories: SkillCategory[];
  onChange: (categories: SkillCategory[]) => void;
}

export const SkillsSection = ({ categories, onChange }: SkillsSectionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>(
    {},
  );

  const addCategory = () => {
    const newCategory: SkillCategory = {
      id: nanoid(10),
      name: '',
      skills: [],
    };
    onChange([...categories, newCategory]);
    setExpandedId(newCategory.id);
  };

  const updateCategory = (id: string, updates: Partial<SkillCategory>) => {
    onChange(
      categories.map((category) =>
        category.id === id ? { ...category, ...updates } : category,
      ),
    );
  };

  const removeCategory = (id: string) => {
    onChange(categories.filter((category) => category.id !== id));
    setNewSkillInputs((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;
    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = temp;
    onChange(newCategories);
  };

  const addSkill = (categoryId: string) => {
    const skillName = newSkillInputs[categoryId]?.trim();
    if (!skillName) return;

    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    if (category.skills.includes(skillName)) {
      setNewSkillInputs((prev) => ({ ...prev, [categoryId]: '' }));
      return;
    }

    updateCategory(categoryId, {
      skills: [...category.skills, skillName],
    });
    setNewSkillInputs((prev) => ({ ...prev, [categoryId]: '' }));
  };

  const removeSkill = (categoryId: string, skillIndex: number) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    updateCategory(categoryId, {
      skills: category.skills.filter((_, index) => index !== skillIndex),
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    categoryId: string,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(categoryId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <H3 className="text-lg font-semibold text-foreground">Skills</H3>
        <Button
          color="primary"
          variant="flat"
          onClick={addCategory}
          startContent={<Wrench className="size-4.5" />}
        >
          <p className="">Add Category</p>
        </Button>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
          <p>No skill categories yet.</p>
          <p className="text-sm">
            Add categories like "Programming Languages", "Frameworks", "Tools",
            etc.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="border border-border rounded overflow-y-scroll bg-background"
          >
            <div
              className="flex items-center justify-between p-3 bg-background cursor-pointer hover:bg-background"
              onClick={() =>
                setExpandedId(expandedId === category.id ? null : category.id)
              }
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-primary" />
                <div>
                  <H5>{category.name || 'New Category'}</H5>
                  <H6>
                    {category.skills.length} skill
                    {category.skills.length !== 1 ? 's' : ''}
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
                    moveCategory(index, 'up');
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
                    moveCategory(index, 'down');
                  }}
                  disabled={index === categories.length - 1}
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
                    removeCategory(category.id);
                  }}
                  variant="flat"
                  color="danger"
                  title="Remove"
                  startContent={<TrashIcon className="size-3.5" />}
                />
              </div>
            </div>

            {expandedId === category.id && (
              <div className="p-4 space-y-4 border-t border-border">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-start gap-2">
                    <Tag className="size-5 text-secondary-text" />
                    <H6>Category Name</H6>
                  </div>
                  <InputName
                    hasLabel={false}
                    hasIcon={false}
                    placeholder="e.g., Programming Languages, Frameworks, Tools"
                    value={category.name}
                    onChange={(e) => updateCategory(category.id, { name: e })}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-start gap-2">
                    <Wrench className="size-5 text-secondary-text" />
                    <H6>Skills</H6>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(category.id, skillIndex)}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                          title="Remove skill"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {category.skills.length === 0 && (
                      <span className="text-sm text-muted-foreground">
                        No skills added yet
                      </span>
                    )}
                  </div>

                  {/* Add skill input */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <InputName
                        hasLabel={false}
                        hasIcon={false}
                        placeholder="Type a skill and press Enter"
                        value={newSkillInputs[category.id] || ''}
                        onChange={(e) =>
                          setNewSkillInputs((prev) => ({
                            ...prev,
                            [category.id]: e,
                          }))
                        }
                        onKeyDown={(e) => handleKeyDown(e, category.id)}
                      />
                    </div>
                    <Button
                      onClick={() => addSkill(category.id)}
                      disabled={!newSkillInputs[category.id]?.trim()}
                      color="primary"
                      variant="flat"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Quick add suggestions */}
                {category.name.toLowerCase().includes('programming') && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">
                      Quick add:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {[
                        'JavaScript',
                        'TypeScript',
                        'Python',
                        'Java',
                        'C++',
                        'Go',
                        'Rust',
                        'Ruby',
                      ].map(
                        (lang) =>
                          !category.skills.includes(lang) && (
                            <Button
                              key={lang}
                              size="sm"
                              variant="bordered"
                              className="h-6 text-xs px-2 min-w-0"
                              onClick={() =>
                                updateCategory(category.id, {
                                  skills: [...category.skills, lang],
                                })
                              }
                            >
                              + {lang}
                            </Button>
                          ),
                      )}
                    </div>
                  </div>
                )}
                {category.name.toLowerCase().includes('framework') && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">
                      Quick add:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {[
                        'React',
                        'Vue',
                        'Angular',
                        'Next.js',
                        'Node.js',
                        'Express',
                        'Django',
                        'Spring',
                      ].map(
                        (fw) =>
                          !category.skills.includes(fw) && (
                            <Button
                              key={fw}
                              size="sm"
                              variant="bordered"
                              className="h-6 text-xs px-2 min-w-0"
                              onClick={() =>
                                updateCategory(category.id, {
                                  skills: [...category.skills, fw],
                                })
                              }
                            >
                              + {fw}
                            </Button>
                          ),
                      )}
                    </div>
                  </div>
                )}
                {category.name.toLowerCase().includes('tool') && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">
                      Quick add:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {[
                        'Git',
                        'Docker',
                        'Kubernetes',
                        'AWS',
                        'GCP',
                        'Linux',
                        'VS Code',
                        'Figma',
                      ].map(
                        (tool) =>
                          !category.skills.includes(tool) && (
                            <Button
                              key={tool}
                              size="sm"
                              variant="bordered"
                              className="h-6 text-xs px-2 min-w-0"
                              onClick={() =>
                                updateCategory(category.id, {
                                  skills: [...category.skills, tool],
                                })
                              }
                            >
                              + {tool}
                            </Button>
                          ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
