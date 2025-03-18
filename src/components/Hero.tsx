
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/10 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-blue-400/10 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-40 h-40 rounded-full bg-sky-300/10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container px-6 mx-auto">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-8'}`}>
            <span className="inline-block mb-6 px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full">
              Designed for NYC Teachers
            </span>
          </div>
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-8'}`}>
            Take control of your
            <span className="text-gradient block">financial future</span>
          </h1>
          
          <p className={`mt-6 text-lg md:text-xl text-foreground/80 max-w-2xl transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-8'}`}>
            A comprehensive financial planning platform built specifically for NYC teachers to manage budgeting, retirement planning, pre-tax benefits, and tax estimates.
          </p>
          
          <div className={`mt-10 flex flex-col sm:flex-row items-center gap-4 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-8'}`}>
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-base font-medium px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate('/budget')}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto text-base font-medium px-8 py-6 border-2"
            >
              Learn More
            </Button>
          </div>

          <div className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-8'}`}>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">100%</div>
              <p className="text-sm text-foreground/60 mt-2">Tailored for NYC Teachers</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">5</div>
              <p className="text-sm text-foreground/60 mt-2">Financial Tools</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">TRS</div>
              <p className="text-sm text-foreground/60 mt-2">Pension Tracking</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">403(b)</div>
              <p className="text-sm text-foreground/60 mt-2">Retirement Planning</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
