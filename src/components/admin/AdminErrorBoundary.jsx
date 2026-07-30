import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // NotFoundError "removeChild" : le plus souvent causé par une extension navigateur
    // (traduction, etc.) qui modifie le DOM en dehors du contrôle de React.
    console.error('Erreur capturée dans l\'admin :', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold admin-text-primary mb-2">Une erreur d'affichage est survenue</h2>
          <p className="admin-text-secondary max-w-md mb-6">
            Cela vient souvent d'une extension de navigateur (traduction, etc.) qui modifie la page. Essayez de recharger, ou désactivez vos extensions pour cette page.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;