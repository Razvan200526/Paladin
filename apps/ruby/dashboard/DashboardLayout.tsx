import {
  ActionsSection,
  ActivitySection,
  ChartsSection,
  DashboardHeader,
  GoalsSection,
  StatsSection,
} from './sections';

export const DashboardLayout = () => {
  return (
    <div className="h-[calc(100dvh)] bg-background flex flex-col">
      <DashboardHeader />
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-5 md:space-y-6">
          <StatsSection />
          <ChartsSection />
          <ActivitySection />
          <GoalsSection />
          <ActionsSection />
        </div>
      </div>
    </div>
  );
};
