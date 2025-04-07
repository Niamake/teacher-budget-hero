
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { FileTextIcon } from 'lucide-react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <FileTextIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-lg text-foreground/80 mb-8">
            Last updated: April 7, 2025
          </p>
          
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using TeacherFinance, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            
            <Separator className="my-6" />
            
            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily use the materials on TeacherFinance's website for personal, non-commercial use only. 
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on TeacherFinance's website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
            <p>
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by TeacherFinance at any time.
            </p>
            
            <Separator className="my-6" />
            
            <h2>3. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and up-to-date information. 
              You are responsible for maintaining the confidentiality of your account and password, and for restricting access to your computer or mobile device. 
              You agree to accept responsibility for all activities that occur under your account.
            </p>
            
            <Separator className="my-6" />
            
            <h2>4. Content</h2>
            <p>
              Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. 
              You retain any and all of your rights to any content you submit, post or display on or through the service, and you are responsible for protecting those rights.
            </p>
            
            <Separator className="my-6" />
            
            <h2>5. Accuracy of Information</h2>
            <p>
              The financial information, calculations, and recommendations provided by TeacherFinance are for general informational purposes only. 
              While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, 
              about the completeness, accuracy, reliability, suitability or availability of the information contained on the site. 
              Users should consult with qualified financial professionals before making important financial decisions.
            </p>
            
            <Separator className="my-6" />
            
            <h2>6. Limitations</h2>
            <p>
              In no event shall TeacherFinance or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, 
              or due to business interruption) arising out of the use or inability to use the materials on TeacherFinance's website, 
              even if TeacherFinance or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
            
            <Separator className="my-6" />
            
            <h2>7. Disclaimer</h2>
            <p>
              The materials on TeacherFinance's website are provided on an 'as is' basis. TeacherFinance makes no warranties, expressed or implied, 
              and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, 
              fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            
            <Separator className="my-6" />
            
            <h2>8. Changes to Terms</h2>
            <p>
              TeacherFinance reserves the right, at its sole discretion, to modify or replace these Terms at any time. 
              We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date. 
              Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
            
            <Separator className="my-6" />
            
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
              <a href="mailto:legal@teacherfinance.com" className="text-primary">
                legal@teacherfinance.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
