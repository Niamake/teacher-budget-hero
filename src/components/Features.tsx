
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BarChart3, Briefcase, LineChart, Calculator, DollarSign } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  const features: Feature[] = [
    {
      title: "Salary Estimator",
      description: "Store and estimate your salary based on your salary step, education, and years of experience as an NYC teacher.",
      icon: DollarSign,
      path: "/salary",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Budget Management",
      description: "Create and track your monthly budget with tools tailored to a teacher's salary structure and pay schedule.",
      icon: BarChart3,
      path: "/budgeting",
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "Job Information",
      description: "Store and organize your teaching credentials, salary steps, longevity bonuses, and career advancement opportunities.",
      icon: Briefcase,
      path: "/job-info",
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Retirement Planning",
      description: "Track your TRS pension progress, TDA investments, and other retirement accounts with specialized calculators.",
      icon: LineChart,
      path: "/retirement",
      color: "bg-rose-50 text-rose-600"
    },
    {
      title: "Tax Estimation",
      description: "Get a clearer picture of your tax obligations with calculators designed for NYC teachers' unique tax situations.",
      icon: Calculator,
      path: "/tax-estimate",
      color: "bg-amber-50 text-amber-600"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const featureElements = document.querySelectorAll('.feature-card');
    featureElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      featureElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section className="py-20 px-6" ref={featuresRef}>
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block mb-4 px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Everything you need to secure your financial future
          </h2>
          <p className="text-lg text-foreground/70">
            Our comprehensive suite of tools is designed specifically for NYC teachers, taking into account your unique salary structure, benefits, and retirement options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              aria-label={`Explore ${feature.title}`}
              className="feature-card opacity-0 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="glass-card h-full p-8 hover:shadow-lg hover:translate-y-[-5px]">
                <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6`} aria-hidden="true">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-foreground/70 mb-6">{feature.description}</p>
                <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform duration-200">
                  Explore <ChevronRight size={16} className="ml-1" aria-hidden="true" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
