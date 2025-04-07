
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { ShieldIcon } from 'lucide-react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <ShieldIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-lg text-foreground/80 mb-8">
            Last updated: April 7, 2025
          </p>
          
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              TeacherFinance ("we", "our", or "us") is committed to protecting the privacy of our users. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
              you use our website and services.
            </p>
            
            <Separator className="my-6" />
            
            <h2>2. Information We Collect</h2>
            <p>
              We may collect information about you in various ways, including:
            </p>
            <h3>2.1 Personal Information</h3>
            <p>
              When you create an account or use certain features of our service, we may collect:
            </p>
            <ul>
              <li>Name and contact information (email address, phone number)</li>
              <li>Professional information (school district, years of teaching)</li>
              <li>Financial information (salary details, budget information)</li>
              <li>Authentication information (password, security questions)</li>
            </ul>
            
            <h3>2.2 Usage Information</h3>
            <p>
              We automatically collect certain information when you visit, use or navigate our platform:
            </p>
            <ul>
              <li>Device information (browser type, IP address)</li>
              <li>Usage patterns (pages visited, time spent)</li>
              <li>Interactions with features and tools</li>
            </ul>
            
            <Separator className="my-6" />
            
            <h2>3. How We Use Your Information</h2>
            <p>
              We may use the information we collect for various purposes, including:
            </p>
            <ul>
              <li>Providing and maintaining our services</li>
              <li>Personalizing your experience</li>
              <li>Communicating with you about service updates</li>
              <li>Analyzing usage patterns to improve our platform</li>
              <li>Detecting and preventing fraudulent activities</li>
            </ul>
            
            <Separator className="my-6" />
            
            <h2>4. Sharing Your Information</h2>
            <p>
              We do not sell or rent your personal information to third parties. 
              However, we may share information in the following circumstances:
            </p>
            <ul>
              <li>With service providers who help operate our platform</li>
              <li>To comply with legal obligations</li>
              <li>With your consent or at your direction</li>
              <li>In connection with a business transfer or merger</li>
            </ul>
            
            <Separator className="my-6" />
            
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information. 
              However, no method of transmission over the Internet or electronic storage is 100% secure, 
              so we cannot guarantee absolute security.
            </p>
            
            <Separator className="my-6" />
            
            <h2>6. User Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, 
              including:
            </p>
            <ul>
              <li>Access to your personal data</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your data</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
            </ul>
            
            <Separator className="my-6" />
            
            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            
            <Separator className="my-6" />
            
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:privacy@teacherfinance.com" className="text-primary">
                privacy@teacherfinance.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
