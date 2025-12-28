export interface SuggestionPillProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  prompt: string;
  onClick: () => void;
}

  export const SuggestionButton = ({
    icon: Icon,
    title,
    prompt,
    onClick,
  }: SuggestionPillProps) => (
    <button
      type="button"
      onClick={onClick}
      title={prompt}
      className="group cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-light  hover:border-secondary-text transition-all duration-200"
    >
      <Icon className="size-4 text-primary group-hover:text-secondary-text" />
      <span className="text-sm font-medium text-primary group-hover:text-secondary-text">{title}</span>
    </button>
 );
