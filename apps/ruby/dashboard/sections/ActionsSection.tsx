import { AiChatIcon } from '@common/icons/AiChatIcon';
import { ResumeIcon } from '@common/icons/ResumeIcon';
import { PlusIcon } from '@heroicons/react/24/outline';
import { CreateApplicationModal } from '@ruby/applications/components/CreateApplicationModal';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ActionCard } from '../components/ActionCard';
import { AiQuickChat } from '../components/AiQuickChat';

export const ActionsSection = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const navigate = useNavigate();

  const actionCards = [
    {
      title: 'New Application',
      description: 'Submit a new job application',
      icon: <PlusIcon className="size-4" />,
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      hoverColor: 'hover:bg-primary-100',
      iconBgColor: 'bg-primary-200',
      titleColor: 'text-primary-800',
      descriptionColor: 'text-primary-600',
      onClick: () => setShowCreateModal(true),
    },
    {
      title: 'Update Resume',
      description: 'Edit your resume or upload new version',
      icon: <ResumeIcon className="size-4" />,
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-200',
      hoverColor: 'hover:bg-secondary-100',
      iconBgColor: 'bg-secondary-200',
      titleColor: 'text-secondary-800',
      descriptionColor: 'text-secondary-600',
      onClick: () => navigate('/home/resources', { replace: true }),
    },
    {
      title: 'AI Assistant',
      description: 'Get help with applications',
      icon: <AiChatIcon className="size-4" />,
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      hoverColor: 'hover:bg-success-100',
      iconBgColor: 'bg-success-200',
      titleColor: 'text-success-800',
      descriptionColor: 'text-success-600',
      onClick: () => setShowAiChat(true),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {actionCards.map((card, index) => (
          <ActionCard
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            bgColor={card.bgColor}
            borderColor={card.borderColor}
            hoverColor={card.hoverColor}
            iconBgColor={card.iconBgColor}
            titleColor={card.titleColor}
            descriptionColor={card.descriptionColor}
            onClick={card.onClick}
          />
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto animate-appearance-in">
            <CreateApplicationModal onClose={() => setShowCreateModal(false)} />
          </div>
        </div>
      )}

      {showAiChat && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setShowAiChat(false)}
            onKeyDown={(e) => e.key === 'Escape' && setShowAiChat(false)}
          />
          <AiQuickChat onClose={() => setShowAiChat(false)} />
        </>
      )}
    </>
  );
};
