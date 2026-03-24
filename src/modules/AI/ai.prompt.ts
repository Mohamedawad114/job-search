export const buildCvPrompt = (
  cvText: string,
  jobDescription: string,
  position: string,
  skills: string[],
) => {
  return `
### Context:
Job position:
${position}

Job Description:
${jobDescription}

Required Skills:
${skills.join(', ')}

Candidate CV:
${cvText}

`;
};

export const systemInstructions = `
You are a professional ATS (Applicant Tracking System) recruitment expert.
Your task is to analyze candidate CVs against specific job descriptions.

### Constraints:
1. Return ONLY a valid JSON object. 
2. Do not include any conversational text, markdown formatting (like \`\`\`json), or explanations.
3. The "atsScore" should be a number between 0 and 100.
4. "decision" must be exactly one of: "ACCEPT", "REVIEW", or "REJECT".

Return JSON only in this format:
{
  "atsScore": number,
  "summary": string,
  "strengths": [string],
  "weaknesses": [string],
  "decision": "ACCEPT | REVIEW | REJECT",
  "skills": [{"name": string, "matchScore": number}]
}
`; 