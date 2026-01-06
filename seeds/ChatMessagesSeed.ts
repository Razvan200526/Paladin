import { random } from '../apps/common/utils';
import { PrimaryDatabase } from '../apps/paladin/shared/database/PrimaryDatabase';
import { ChatMessageEntity } from '../apps/paladin/entities/ChatMessageEntity';
import { ChatSessionEntity } from '../apps/paladin/entities/ChatSessionEntity';

const userMessages = [
  'How can I improve my resume?',
  'What skills should I highlight?',
  'Can you help me write a better summary?',
  'What format should I use?',
  'Should I include this experience?',
  'How do I make my resume stand out?',
  'What keywords should I add?',
  'Can you review my cover letter?',
  'How long should my cover letter be?',
  'What tone should I use?',
  'Should I mention salary expectations?',
  'How do I address employment gaps?',
  'What should I include in my summary?',
  'Can you help me tailor this for a specific job?',
  'What are common resume mistakes?',
];

const aiMessages = [
  'Based on your resume, I recommend highlighting your technical skills in the summary section. This will help recruiters quickly identify your expertise.',
  'Consider adding quantifiable achievements to your experience section. For example, instead of "worked on projects," try "led a team of 5 developers to deliver 3 major features."',
  'Your cover letter should be concise, typically 3-4 paragraphs. Focus on why you are interested in the role and what value you can bring to the company.',
  'I notice you have strong experience in JavaScript and React. Make sure these are prominently featured in your skills section and mentioned in your work experience.',
  'For the job you are applying to, I recommend emphasizing your leadership experience and project management skills, as these align well with the job requirements.',
  'Consider using action verbs like "developed," "implemented," "managed," or "led" to start your bullet points. This makes your experience more impactful.',
  'Your resume looks good overall, but I suggest adding a section for certifications or professional development courses if you have any.',
  'The tone of your cover letter should be professional yet personable. Show enthusiasm for the role while maintaining a professional demeanor.',
  'I recommend tailoring your resume for each application. Highlight the most relevant experience and skills for each specific role.',
  'Your resume would benefit from a stronger opening statement. Consider starting with a compelling summary that showcases your unique value proposition.',
];

const senderTypes = ['user', 'ai'] as const;

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

export async function seedChatMessages(
  db: PrimaryDatabase,
): Promise<number> {
  const sessionRepo = await db.open(ChatSessionEntity);
  const messageRepo = await db.open(ChatMessageEntity);

  const sessions = await sessionRepo.find();
  if (sessions.length === 0) {
    throw new Error(
      'No chat sessions found. Please seed chat sessions first.',
    );
  }

  const messages: ChatMessageEntity[] = [];

  // Generate 100 messages per session (10,000 total messages)
  for (const session of sessions) {
    const messageCount = 100;
    let lastTimestamp = session.createdAt;

    for (let i = 0; i < messageCount; i++) {
      const sender = i % 2 === 0 ? 'user' : 'ai'; // Alternate between user and AI
      const content =
        sender === 'user'
          ? getRandomElement(userMessages)
          : getRandomElement(aiMessages);

      // Increment timestamp by 1-10 minutes for each message
      const timestamp = new Date(
        lastTimestamp.getTime() +
          Math.floor(Math.random() * 10 + 1) * 60 * 1000,
      );
      lastTimestamp = timestamp;

      const message = new ChatMessageEntity();
      message.id = random.nanoid(15);
      message.chatSession = session;
      message.content = content;
      message.sender = sender;
      message.timestamp = timestamp;

      messages.push(message);
    }
  }

  // Save in batches to avoid memory issues
  const batchSize = 1000;
  for (let i = 0; i < messages.length; i += batchSize) {
    const batch = messages.slice(i, i + batchSize);
    await messageRepo.save(batch);
  }

  return messages.length;
}

