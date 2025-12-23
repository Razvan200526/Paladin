import { Button } from '@common/components/button';

export const ButtonCancel = ({
  onPress,
  isLoading,
  className,
  disabled,
}: {
  onPress: () => void;
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <Button
      color="danger"
      variant="solid"
      size="sm"
      className={className}
      onPress={onPress}
      isLoading={isLoading}
      disabled={disabled}
      isDisabled={disabled}
    >
      Cancel
    </Button>
  );
};
