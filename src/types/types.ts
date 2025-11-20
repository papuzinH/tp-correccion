export interface Student {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Submission {
  id: string;
  studentId: string;
  title: string;
  repositoryUrl: string;
  submittedAt: string;
  status: 'pending' | 'graded';
}

export interface GradingDraft {
  submissionId: string;
  score: number;
  feedback: string;
  criteria: Record<string, number>;
  isComplete: boolean;
}
