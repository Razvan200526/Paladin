import { AnalyticsFetcher } from './AnalyticsFetcher';
import { ApplicationFetcher } from './ApplicationFetcher';
import { AuthFetcher } from './AuthFetcher';
import { ChatFetcher } from './ChatFetcher';
import { ChatHistoryFetcher } from './ChatHistoryFetcher';
import { CoverLetterFetcher } from './CoverLetterFetcher';
import type { Fetcher } from './Fetcher';
import { JobFetcher } from './JobFetcher';
import { MessageFetcher } from './MessageFetcher';
import { NotificationFetcher } from './NotificationFetcher';
import { ResumeFetcher } from './ResumeFetcher';
import { ResumeAIFetcher } from './ResumeAIFetcher';
import { ResumeBuilderFetcher } from './ResumeBuilderFetcher';
import { Socket } from './Socket';
import { UploadFetcher } from './UploadFetcher';
import { UserFetcher } from './UserFetcher';

export class Backend {
  public readonly auth: AuthFetcher;
  public readonly users: UserFetcher;
  public readonly upload: UploadFetcher;
  public readonly resume: ResumeFetcher;
  public readonly resumeAI: ResumeAIFetcher;
  public readonly resumeBuilder: ResumeBuilderFetcher;
  public readonly coverLetter: CoverLetterFetcher;
  public readonly message: MessageFetcher;
  public readonly chat: ChatFetcher;
  public readonly chatHistory: ChatHistoryFetcher;
  public readonly apps: ApplicationFetcher;
  public readonly analytics: AnalyticsFetcher;
  public readonly notifications: NotificationFetcher;
  public readonly jobs: JobFetcher;
  public readonly socket: Socket;
  constructor(readonly fetcher: Fetcher) {
    this.auth = new AuthFetcher(this.fetcher);
    this.users = new UserFetcher(this.fetcher);
    this.upload = new UploadFetcher(this.fetcher);
    this.resume = new ResumeFetcher(this.fetcher);
    this.resumeAI = new ResumeAIFetcher(this.fetcher);
    this.resumeBuilder = new ResumeBuilderFetcher(this.fetcher);
    this.coverLetter = new CoverLetterFetcher(this.fetcher);
    this.message = new MessageFetcher(this.fetcher);
    this.chat = new ChatFetcher(this.fetcher);
    this.chatHistory = new ChatHistoryFetcher(this.fetcher);
    this.apps = new ApplicationFetcher(this.fetcher);
    this.analytics = new AnalyticsFetcher(this.fetcher);
    this.notifications = new NotificationFetcher(this.fetcher);
    this.jobs = new JobFetcher(this.fetcher);
    this.socket = new Socket('ws://localhost:3000/ws');
  }
}
