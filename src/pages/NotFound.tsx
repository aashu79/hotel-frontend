import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen cosmic-bg flex items-center justify-center pt-24">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="glass-card p-8">
          <h1 className="mb-4 text-6xl font-futuristic font-bold text-neon">404</h1>
          <p className="mb-6 text-xl text-gray-300">Oops! This page doesn't exist in our universe</p>
          <a 
            href="/" 
            className="btn-neon inline-flex items-center px-6 py-3 font-semibold rounded-lg transition-all duration-300 hover:scale-105"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
