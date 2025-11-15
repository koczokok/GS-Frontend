export interface TodoItem {
  id: number;
  text: string;
  done: boolean;
  deadline: string | null;
  userId: number;
  challenge?: {
    id: number;
    title: string;
    description: string;
    rules: string;
    deadline: string;
  } | null;
}

