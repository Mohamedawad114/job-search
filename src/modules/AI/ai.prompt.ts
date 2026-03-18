export const buildCvPrompt = (
  cvText: string,
  jobDescription: string,
  position: string,
  skills: string[],
) => {
  return `
You are an ATS recruitment system.

Analyze the candidate CV against the job.

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
  "skills":[
     {
       "name": string,
       "matchScore": number
     }
  ]
}

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
