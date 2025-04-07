import { useEffect, lazy, Suspense } from 'react';
import Header from '@/components/layout/header/Header';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load components for better performance
const Hero = lazy(() => import('@/components/Hero'));
const Features = lazy(() => import('@/components/Features'));
const Footer = lazy(() => import('@/components/Footer'));

// Loading fallbacks
const HeroFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6">
    <Skeleton className="h-8 w-52 mb-6" />
    <Skeleton className="h-16 w-full max-w-lg mb-4" />
    <Skeleton className="h-16 w-full max-w-lg mb-8" />
    <Skeleton className="h-12 w-40" />
  </div>
);

const FeaturesFallback = () => (
  <div className="py-20 px-6">
    <div className="max-w-3xl mx-auto mb-16">
      <Skeleton className="h-8 w-32 mb-4 mx-auto" />
      <Skeleton className="h-12 w-full max-w-md mb-6 mx-auto" />
      <Skeleton className="h-20 w-full max-w-lg mx-auto" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-72 w-full rounded-2xl" />
      ))}
    </div>
  </div>
);

const FooterFallback = () => (
  <div className="bg-secondary/50 py-12 px-6">
    <Skeleton className="h-40 w-full max-w-4xl mx-auto" />
  </div>
);

const Index = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Check for URL params that might indicate scrolling to features
    const hash = window.location.hash;
    if (hash === '#features') {
      const featuresElement = document.getElementById('features');
      if (featuresElement) {
        featuresElement.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Preload other routes for faster navigation when needed
    const preloadRoutes = () => {
      const links = [
        import('@/pages/Auth'),
        import('@/pages/Salary'),
        import('@/pages/Budgeting'),
        import('@/pages/Profile'),
        import('@/pages/Settings')
      ];
      return Promise.all(links);
    };

    // Preload after initial render is complete
    const timer = setTimeout(() => {
      preloadRoutes();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<HeroFallback />}>
          <Hero />
        </Suspense>
        <div id="features">
          <Suspense fallback={<FeaturesFallback />}>
            <Features />
          </Suspense>
        </div>
      </main>
      <Suspense fallback={<FooterFallback />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
