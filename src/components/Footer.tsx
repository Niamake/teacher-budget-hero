
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 py-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-bold text-gradient">TeacherFinance</span>
            </Link>
            <p className="text-sm text-foreground/70 mb-4 max-w-xs">
              The comprehensive financial platform designed specifically for NYC teachers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/budget" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Budget Management
                </Link>
              </li>
              <li>
                <Link to="/job-info" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Job Information
                </Link>
              </li>
              <li>
                <Link to="/retirement" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Retirement Planning
                </Link>
              </li>
              <li>
                <Link to="/pre-tax" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Pre-Tax Benefits
                </Link>
              </li>
              <li>
                <Link to="/tax-estimate" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Tax Estimation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Teacher Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Financial Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Retirement Information
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Tax Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Feedback
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-foreground/60">
            © {currentYear} TeacherFinance. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
