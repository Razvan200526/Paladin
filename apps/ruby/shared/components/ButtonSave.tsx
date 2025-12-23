import { Button } from '@common/components/button';
import { SaveIcon } from '@common/icons/SaveIcon';

export const ButtonSave = ({
  onPress,
  isLoading,
  className,
  disabled,
  type = 'button',
}: {
  onPress?: () => void;
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) => {
  return (
    <Button
      color="primary"
      size="sm"
      className={className}
      startContent={<SaveIcon className="size-3.5" />}
      onPress={onPress}
      isLoading={isLoading}
      disabled={disabled}
      isDisabled={disabled}
      type={type}
    >
      Save
    </Button>
  );
};
