import { PageLoader } from '../shared/components/PageLoader';
import { asset, LayoutView } from './LayoutView';

export interface IndexViewProps {
  apiUrl: string;
}

export const IndexView = ({ apiUrl }: IndexViewProps) => {
  return (
    <LayoutView
      favicon={asset('dist', 'logo.svg')}
      title="Azurite App"
      description="A full-stack application powered by Azurite framework"
      styles={[asset('dist', 'style.css'), asset('dist', 'app.css')]}
      scripts={[asset('dist', 'app.js')]}
      clientData={{ apiUrl }}
      className="font-primary text-primary font-medium bg-background text-base min-h-screen"
    >
      <div id="root">
        <PageLoader />
      </div>
    </LayoutView>
  );
};
