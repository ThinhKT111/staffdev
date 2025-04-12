// src/app/core/models/submission.ts
export interface Submission {
    id: number; // submission_id
    assignmentId: number; // assignment_id
    userId: number; // user_id
    submissionContent: string; // submission_content
    submittedAt: Date; // submitted_at
    testcasePassed?: number; // testcase_passed
    totalTestcases?: number; // total_testcases
  }