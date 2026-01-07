export interface EmployeeComment {
  id: string;
  user: string;
  content: string;
  date: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  photoUrl?: string;
  date?: string;
  achievement?: string;
  fromDepartment?: string;
  toDepartment?: string;
  comments?: EmployeeComment[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface NewsletterData {
  month: string;
  year: string;
  newHires: Employee[];
  promotions: Employee[];
  transfers: Employee[];
  birthdays: Employee[];
  anniversaries: Employee[];
  events: Event[];
  bestEmployee: Employee | null;
  bestPerformer: Employee | null;
  exitingEmployees: Employee[];
}

export type ViewMode = 'editor' | 'preview';

export type CategoryKey = keyof Omit<NewsletterData, 'month' | 'year'>;

export interface EditorSectionProps {
  title: string;
  icon: any;
  category: CategoryKey;
  items: Employee[] | Event[] | Employee | null;
  showFromTo?: boolean;
  showAchievement?: boolean;
  isSingle?: boolean;
  color?: string;
}