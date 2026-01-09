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

export type TrendsPeriod =
  | 'last_week'
  | 'last_month'
  | 'last_3_months'
  | 'last_6_months'
  | 'last_year';

export type TrendDataPoint = {
  label: string;
  applications: number;
  responses: number;
  interviews: number;
  accepted: number;
  rejected: number;
};

export type TrendsData = {
  trends: TrendDataPoint[];
  period: {
    start: string;
    end: string;
    type: TrendsPeriod;
  };
};

export type StatusBreakdownItem = {
  name: string;
  value: number;
  color: string;
  percentage: number;
};

export type StatusBreakdownData = {
  breakdown: StatusBreakdownItem[];
  total: number;
};
