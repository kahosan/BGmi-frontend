export interface WeekCalendar {
  id: string;
  cover: string;
  name: string;
  update_day: string;
  status: boolean;
  episode: null | number;
}

export type Calendar = Record<'sun' | 'fri' | 'sat' | 'wed' | 'mon' | 'thu' | 'tue' | 'unknown', WeekCalendar[]>;
