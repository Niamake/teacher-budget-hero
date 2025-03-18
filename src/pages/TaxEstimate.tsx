
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TaxEstimate = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Tax Estimation</h1>
          <p className="text-lg text-foreground/80 mb-8">
            Get a clearer picture of your tax obligations with calculators designed for NYC teachers.
          </p>
          
          <div className="glass-card p-8 mb-8">
            <p className="text-center text-lg text-foreground/60">
              Tax estimation tools coming soon...
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TaxEstimate;
