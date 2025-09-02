export interface Problem {
  id: number;
  title: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Topic {
  title: string;
  problems: Problem[];
}
