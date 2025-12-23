const ID_REGEX = /^[0-9a-f]+$/;
const DEFAULT_ID_LENGTH = 15;

export const isIdValid = (id: string, length?: number): boolean => {
  if (typeof id !== 'string') {
    return false;
  }

  if (id.trim().length === 0) {
    return false;
  }

  const expectedLength = length ?? DEFAULT_ID_LENGTH;

  if (id.length !== expectedLength) {
    return false;
  }

  return ID_REGEX.test(id);
};
