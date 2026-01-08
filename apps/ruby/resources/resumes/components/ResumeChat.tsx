import { Button } from '@common/components/button';
import {
  Dropdown,
  type DropdownItemDataType,
} from '@common/components/dropdown/Dropdown';
import { EmptyChat } from '@common/components/empty/EmptyChat';
import {
  InputChat,
  type InputChatRefType,
} from '@common/components/input/InputChat';
import type { ModalRefType } from '@common/components/Modal';
import { H1, H2, H3, H6 } from '@common/components/typography';
import { AiChatIcon } from '@common/icons/AiChatIcon';
import { MoreIcon } from '@common/icons/MoreIcon';
import { ThinkingIcon } from '@common/icons/ThinkingIcon';
import type { EditorRefType } from '@common/types';
import { formatDate } from '@common/utils';
import { Avatar, cn, ScrollShadow, Tab, Tabs } from '@heroui/react';
import { Icon } from '@iconify/react';
import { backend } from '@ruby/shared/backend';
import { useAuth } from '@ruby/shared/hooks';
import type { Socket } from '@sdk/Socket';
import type { ResumeType } from '@sdk/types';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DeleteResumeModal } from '../modals/DeleteResumeModal';
import { RenameResumeModal } from '../modals/RenameResumeModal';
import { useResumeChatStore } from '../resumeStore';

const items: DropdownItemDataType[] = [
  {
    key: 'rename',
    label: 'Rename',
    className: 'text-primary data-[hover=true]:bg-primary/20',
    icon: <Icon icon="heroicons:cursor-arrow-rays" className="size-4" />,
    shortcut: '⌘R',
  },
  {
    key: 'delete',
    label: 'Delete file',
    icon: <Icon icon="heroicons:trash" className="size-4" />,
    className:
      'text-danger data-[hover=true]:bg-danger/20 data-[hover=true]:text-danger',
    shortcut: '⌘⌫',
  },
];
const tabItems = [
  {
    key: 'chat',
    label: 'Chat',
    icon: AiChatIcon,
    className: 'text-secondary-text data-[hover=true]:bg-secondary/10',
    activeClassname: 'bg-secondary/15 border-border',
  },
];

export const ResumeChat = ({ resume }: { resume: ResumeType }) => {
  const { data: user } = useAuth();
  const { setData: setStoredResume } = useResumeChatStore(resume.id);
  const editRef = useRef<ModalRefType | null>(null);
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([]);
  const messageRef = useRef<InputChatRefType | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const deleteResumeRef = useRef<ModalRefType | null>(null);
  const editorRef = useRef<EditorRefType | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<Socket | null>(null);

  const handleStop = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsThinking(false);
    }
  };

  const handleSubmit = (value: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: value }]);
    messageRef.current?.setValue('');
    setIsThinking(true);

    wsRef.current = backend.resume.chat({
      resumeId: resume.id,
      query: value,
      onMessage: (response: any, ws: any) => {
        if (!wsRef.current) wsRef.current = ws;
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (!response.success) {
          ws.close();
        }

        if (!response.success || response.isNotFound) {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: response.message || '' },
          ]);
          setIsThinking(false);
          return;
        }

        if (response.data.status === 'progress') {
          setIsThinking(true);
          setMessages((prev) => {
            if (
              prev.length > 0 &&
              prev[prev.length - 1]?.role === 'assistant'
            ) {
              return [
                ...prev.slice(0, -1),
                { role: 'assistant', content: response.data.text },
              ];
            }
            return [
              ...prev,
              { role: 'assistant', content: response.data.text },
            ];
          });
          editorRef.current?.setContent(response.data.text);
          return;
        }

        if (response.data.status === 'completed') {
          setIsThinking(false);
          setMessages((prev) => {
            if (
              prev.length > 0 &&
              prev[prev.length - 1]?.role === 'assistant'
            ) {
              return [
                ...prev.slice(0, -1),
                { role: 'assistant', content: response.data.text },
              ];
            }
            return [
              ...prev,
              { role: 'assistant', content: response.data.text },
            ];
          });
          ws.close();
          setStoredResume({
            message: {
              user: value,
              assistant: response.data.text,
            },
            pages: response.data.pages,
          });
          scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      },
    });
  };

  resume.isReady = true;

  return (
    <>
      <div
        className={cn(
          'flex h-full w-full max-w-full flex-col gap-4 rounded border border-border',
        )}
      >
        <nav className="px-4 py-2 rounded sticky top-0 z-50 bg-light flex items-center justify-between border-b border-resume/20 shrink-0">
          <div className="flex-col items-center">
            <H6 className="text-primary truncate">
              {resume.name.split('.')[0]}
            </H6>
            <p className="text-xs text-secondary-text">
              Uploaded {formatDate(resume.uploadedAt)}
            </p>
          </div>

          <Tabs
            classNames={{
              base: 'w-full px-4 py-1 flex justify-end',
              tabContent: 'text-primary',
              cursor: cn('rounded border-none', tabItems[0]?.activeClassname),
              tab: cn(
                'rounded py-4 shadow-none',
                'border-none transition-all duration-300 data-[hover-unselected=true]:opacity-100',
              ),
              panel: 'p-0',
            }}
            aria-label="resume-tabs"
            variant="light"
            radius="sm"
            size="sm"
          >
            {tabItems.map((item) => (
              <Tab
                key={item.key}
                title={
                  <div
                    className={cn(
                      'flex items-center space-x-1 gap-2 font-medium',
                      item.className,
                    )}
                  >
                    {item.icon && <item.icon className="size-4" />}
                    {item.label}
                  </div>
                }
              />
            ))}
          </Tabs>

          <div className="flex items-center gap-2">
            <Dropdown
              items={items}
              onAction={async (action) => {
                if (action === 'rename') {
                  editRef.current?.open();
                }
                if (action === 'delete') {
                  deleteResumeRef.current?.open();
                }
              }}
              trigger={
                <Button
                  variant="light"
                  isIconOnly={true}
                  radius="full"
                  type="button"
                >
                  <MoreIcon className="text-primary size-4" />
                </Button>
              }
            />
          </div>
        </nav>
        <div className="grow flex flex-col overflow-y-scroll">
          {resume.isReady ? (
            <>
              <ScrollShadow className="grow p-4" size={8}>
                {messages.length === 0 ? (
                  <EmptyChat resourceType="resume" />
                ) : (
                  <>
                    <div className="flex flex-col gap-4 px-1">
                      {messages.map(({ role, content }, index) => (
                        <div
                          className={cn(
                            'flex gap-3',
                            role === 'user' ? 'flex-row-reverse' : '',
                          )}
                          key={index}
                        >
                          <div>
                            {role === 'user' ? (
                              <Avatar
                                src={user?.image}
                                size="sm"
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              <AiChatIcon className="rounded size-3.5 text-primary" />
                            )}
                          </div>
                          <div
                            className={cn(
                              role === 'user'
                                ? 'w-fit rounded-full bg-secondary/5 text-secondary-text text-sm px-4 py-3'
                                : 'w-full prose prose-sm dark:prose-invert max-w-none',
                            )}
                          >
                            {role === 'user' ? (
                              content
                            ) : (
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  h1: ({ children }) => (
                                    <H1 className="text-xs font-semibold text-primary mt-4 mb-2">
                                      {children}
                                    </H1>
                                  ),
                                  h2: ({ children }) => (
                                    <H2 className="text-xs font-semibold text-primary mt-3 mb-2">
                                      {children}
                                    </H2>
                                  ),
                                  h3: ({ children }) => (
                                    <H3 className="text-xs text-primary font-semibold mt-2 mb-1">
                                      {children}
                                    </H3>
                                  ),
                                  p: ({ children }) => (
                                    <p className="mb-2 text-secondary-text leading-relaxed">
                                      {children}
                                    </p>
                                  ),
                                  strong: ({ children }) => (
                                    <strong className="font-xs text-secondary-text">
                                      {children}
                                    </strong>
                                  ),
                                  ul: ({ children }) => (
                                    <ul className="list-disc ml-5 mb-2 space-y-1">
                                      {children}
                                    </ul>
                                  ),
                                  ol: ({ children }) => (
                                    <ol className="list-decimal ml-5 mb-2 space-y-1">
                                      {children}
                                    </ol>
                                  ),
                                  li: ({ children }) => (
                                    <li className="leading-relaxed">
                                      {children}
                                    </li>
                                  ),
                                  code: ({ children }) => (
                                    <code className="bg-secondary/10 px-1.5 py-0.5 rounded text-sm">
                                      {children}
                                    </code>
                                  ),
                                }}
                              >
                                {content}
                              </ReactMarkdown>
                            )}
                          </div>
                        </div>
                      ))}
                      {isThinking ? (
                        <div className={cn('flex gap-3')}>
                          <ThinkingIcon className="text-primary" />
                        </div>
                      ) : null}
                    </div>
                    <div ref={scrollRef} />
                  </>
                )}
              </ScrollShadow>
              <div className="p-4 pt-1">
                <InputChat
                  ref={messageRef}
                  placeholder="Chat about your resume..."
                  value={messageRef.current?.getValue()}
                  onChange={(e) => messageRef.current?.setValue(e)}
                  onSubmit={handleSubmit}
                  isPending={isThinking}
                  onStop={handleStop}
                  showStopButton={isThinking}
                />
              </div>
            </>
          ) : (
            <div
              className={cn(
                'w-full p-8',
                'h-full flex flex-col justify-center items-center gap-2',
              )}
            >
              <p className="text-muted">
                {resume.state === 'failed'
                  ? 'Failed to process your document. Please try again.'
                  : 'Processing your document, please wait...'}
              </p>
            </div>
          )}
        </div>
      </div>
      <RenameResumeModal modalRef={editRef} resume={resume} />
      <DeleteResumeModal modalRef={deleteResumeRef} resume={resume} />
    </>
  );
};
