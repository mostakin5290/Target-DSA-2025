
export interface Problem {
  id: number;
  title: string;
  url: string;
}

export interface Topic {
  title: string;
  problems: Problem[];
}
