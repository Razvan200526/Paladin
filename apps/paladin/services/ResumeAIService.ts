import { GoogleGenAI } from '@google/genai';
import { inject, service } from '@razvan11/paladin';

export interface GenerateSummaryParams {
  jobTitle: string;
  yearsOfExperience: number;
  skills?: string[];
  industry?: string;
}

export interface GenerateExperienceBulletsParams {
  position: string;
  company: string;
  responsibilities?: string;
  achievements?: string;
}

export interface SuggestSkillsParams {
  jobTitle: string;
  industry?: string;
  existingSkills?: string[];
}

export interface ImproveContentParams {
  content: string;
  type: 'summary' | 'experience' | 'education' | 'project';
}

export interface GenerateProjectDescriptionParams {
  projectName: string;
  technologies: string[];
  role?: string;
  outcomes?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

@service()
export class ResumeAIService {
  private geminiClient: GoogleGenAI;

  constructor(@inject('GEMINI_API_KEY') private apiKey: string) {
    this.geminiClient = new GoogleGenAI({ apiKey: this.apiKey });
  }

  /**
   * Generate a professional summary for a resume
   */
  async generateSummary(params: GenerateSummaryParams): Promise<string> {
    const { jobTitle, yearsOfExperience, skills, industry } = params;

    const skillsText = skills?.length ? `Key skills: ${skills.join(', ')}` : '';
    const industryText = industry ? `Industry: ${industry}` : '';

    const prompt = `Generate a professional resume summary for the following profile:

Job Title: ${jobTitle}
Years of Experience: ${yearsOfExperience}
${skillsText}
${industryText}

Requirements:
- Write 2-4 concise sentences
- Highlight key qualifications and value proposition
- Use strong action-oriented language
- Make it ATS-friendly
- Do not include any placeholder text or brackets
- Write in first person implied (no "I" at the start)

Return ONLY the summary text, no additional formatting or explanation.`;

    const response = await this.geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 300,
        temperature: 0.7,
      },
    });

    return response.text?.trim() || '';
  }

  /**
   * Generate bullet points for an experience entry
   */
  async generateExperienceBullets(
    params: GenerateExperienceBulletsParams,
  ): Promise<string[]> {
    const { position, company, responsibilities, achievements } = params;

    const responsibilitiesText = responsibilities
      ? `General responsibilities: ${responsibilities}`
      : '';
    const achievementsText = achievements
      ? `Key achievements to highlight: ${achievements}`
      : '';

    const prompt = `Generate 4-6 impactful bullet points for a resume experience section:

Position: ${position}
Company: ${company}
${responsibilitiesText}
${achievementsText}

Requirements:
- Start each bullet with a strong action verb
- Include quantifiable achievements where possible (use realistic percentages/numbers)
- Focus on impact and results, not just duties
- Make them ATS-friendly with relevant keywords
- Each bullet should be 1-2 lines maximum

Return ONLY the bullet points, one per line, without bullet characters or numbers. No additional explanation.`;

    const response = await this.geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const text = response.text?.trim() || '';
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  /**
   * Suggest skills based on job title and industry
   */
  async suggestSkills(params: SuggestSkillsParams): Promise<SkillCategory[]> {
    const { jobTitle, industry, existingSkills } = params;

    const existingText = existingSkills?.length
      ? `Already has these skills (don't repeat): ${existingSkills.join(', ')}`
      : '';
    const industryText = industry ? `Industry: ${industry}` : '';

    const prompt = `Suggest relevant skills for a resume with the following profile:

Job Title: ${jobTitle}
${industryText}
${existingText}

Requirements:
- Organize skills into 3-4 categories (e.g., Technical Skills, Tools & Technologies, Soft Skills, etc.)
- Include 4-8 skills per category
- Focus on in-demand, ATS-friendly skills
- Be specific, not generic

Return the response in this EXACT JSON format only, no additional text:
[
  {"name": "Category Name", "skills": ["Skill 1", "Skill 2", "Skill 3"]},
  {"name": "Another Category", "skills": ["Skill A", "Skill B"]}
]`;

    const response = await this.geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 500,
        temperature: 0.6,
      },
    });

    const text = response.text?.trim() || '[]';

    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as SkillCategory[];
      }
      return [];
    } catch {
      console.error('Failed to parse skills response:', text);
      return [];
    }
  }

  /**
   * Improve existing content with AI suggestions
   */
  async improveContent(
    params: ImproveContentParams,
  ): Promise<{ improved: string; changes: string[] }> {
    const { content, type } = params;

    const typeInstructions: Record<string, string> = {
      summary:
        'Improve this professional summary to be more impactful and ATS-friendly.',
      experience:
        'Improve these experience bullet points to better highlight achievements and use stronger action verbs.',
      education:
        'Improve this education description to highlight relevant coursework, achievements, or activities.',
      project:
        'Improve this project description to better showcase technical skills and impact.',
    };

    const prompt = `${typeInstructions[type] || 'Improve this resume content.'}

Original content:
${content}

Requirements:
- Maintain the same general meaning and facts
- Use stronger, more professional language
- Make it more concise if possible
- Ensure it's ATS-friendly
- Keep any HTML formatting tags that exist

Return the response in this EXACT JSON format only:
{
  "improved": "The improved content here with any HTML tags preserved",
  "changes": ["Brief description of change 1", "Brief description of change 2"]
}`;

    const response = await this.geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 800,
        temperature: 0.6,
      },
    });

    const text = response.text?.trim() || '';

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          improved: parsed.improved || content,
          changes: parsed.changes || [],
        };
      }
      return { improved: content, changes: [] };
    } catch {
      console.error('Failed to parse improve response:', text);
      return { improved: content, changes: [] };
    }
  }

  /**
   * Generate a project description
   */
  async generateProjectDescription(
    params: GenerateProjectDescriptionParams,
  ): Promise<string> {
    const { projectName, technologies, role, outcomes } = params;

    const techText = technologies.length
      ? `Technologies used: ${technologies.join(', ')}`
      : '';
    const roleText = role ? `Role: ${role}` : '';
    const outcomesText = outcomes ? `Key outcomes: ${outcomes}` : '';

    const prompt = `Generate a concise project description for a resume:

Project Name: ${projectName}
${techText}
${roleText}
${outcomesText}

Requirements:
- Write 2-3 sentences maximum
- Highlight the technologies used
- Focus on your contribution and impact
- Include any measurable outcomes if mentioned
- Make it engaging and professional

Return ONLY the description text, no additional formatting or explanation.`;

    const response = await this.geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 250,
        temperature: 0.7,
      },
    });

    return response.text?.trim() || '';
  }
}
