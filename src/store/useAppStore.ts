import { create } from 'zustand';
import { GradingDraft, Student, Submission } from '../types/types';

interface AppState {
  students: Student[];
  submissions: Submission[];
  currentStudentIndex: number;
  draft: GradingDraft | null;

  // Actions
  setStudents: (students: Student[]) => void;
  setSubmissions: (submissions: Submission[]) => void;
  nextStudent: () => void;
  prevStudent: () => void;
  updateDraft: (draft: Partial<GradingDraft>) => void;
  resetDraft: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  students: [],
  submissions: [],
  currentStudentIndex: 0,
  draft: null,

  setStudents: (students) => set({ students }),
  setSubmissions: (submissions) => set({ submissions }),

  nextStudent: () => {
    const { currentStudentIndex, students } = get();
    if (currentStudentIndex < students.length - 1) {
      set({ currentStudentIndex: currentStudentIndex + 1, draft: null });
    }
  },

  prevStudent: () => {
    const { currentStudentIndex } = get();
    if (currentStudentIndex > 0) {
      set({ currentStudentIndex: currentStudentIndex - 1, draft: null });
    }
  },

  updateDraft: (newDraft) => set((state) => {
    const currentDraft = state.draft || {
      submissionId: '',
      score: 0,
      feedback: '',
      criteria: {},
      isComplete: false
    };
    
    return {
      draft: { ...currentDraft, ...newDraft }
    };
  }),

  resetDraft: () => set({ draft: null }),
}));
