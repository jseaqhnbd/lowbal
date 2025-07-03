import React from 'react';

interface BackgroundLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'gradient';
}

const BackgroundLayout: React.FC<BackgroundLayoutProps> = ({ children, variant = 'default' }) => {
  const backgrounds = {
    default: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    dark: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
    gradient: 'bg-gradient-to-br from-emerald-600 via-cyan-600 to-blue-600'
  };

  return (
    <div className={`min-h-screen ${backgrounds[variant]} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1920&h=1080&fit=crop&auto=format"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default BackgroundLayout;