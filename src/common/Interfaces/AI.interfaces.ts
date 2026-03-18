export interface IAISkillMatch {
  id: number;
  reportId: number;
  skillName: String;
  matchScore: number;
}

export interface AIReport {
  id: number;
  applicationId: number;
  ATSScore: number;
  summary: string;
  strengths: string;
  weaknesses: string;
  decision: string;
}
