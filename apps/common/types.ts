import type { RESOURCE_STATES } from './constants';

export type ResourceReadyState = (typeof RESOURCE_STATES)[number];

import type { Editor as EditorType } from '@tiptap/react';
export type EditorRefType = {
  getContent: () => string;
  getEditor: () => EditorType;
  setContent: (content: string) => void;
  insertContent: (content: string) => void;
  insertContentAt: (position: number, content: string) => void;
  deleteSelection: () => void;
  focus: () => void;
  blur: () => void;
};

export type ApiResponse = {
  message: string;
  success: true;
};
