import { Card } from '@common/components/card';
import { H6 } from '@common/components/typography';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  bgColor?: string;
  borderColor?: string;
  hoverColor?: string;
  iconBgColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  className?: string;
}

export const ActionCard = ({
  title,
  description,
  icon,
  onClick,
  bgColor = 'bg-background',
  borderColor = 'border-border',
  hoverColor = 'hover:border-border-hover',
  iconBgColor = 'bg-primary',
  titleColor = 'text-secondary',
  descriptionColor = 'text-primary',
  className,
}: ActionCardProps) => {
  return (
    <button type="button" onClick={onClick} className="text-left w-full">
      <Card
        className={`${bgColor} ${borderColor} cursor-pointer ${hoverColor} transition-colors ${className || ''}`}
      >
        <div className="text-center space-y-2">
          <div
            className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center mx-auto`}
          >
            <span className="text-xl">{icon}</span>
          </div>
          <H6 className={titleColor}>{title}</H6>
          <p className={`text-sm ${descriptionColor}`}>{description}</p>
        </div>
      </Card>
    </button>
  );
};
