
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  User, Briefcase, School, GraduationCap, Wallet, 
  Bell, FileText, BookOpen, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  teacher_id: string | null;
  school: string | null;
  avatar_url: string | null;
}

interface FinancialData {
  salary: number;
  tda_balance: number;
  pension_status: string;
  qpp_balance: number;
  student_loans: number;
  pay_differentials: { name: string; progress: number; total: number }[];
  education_courses: { name: string; status: string; credits: number }[];
}

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // This would normally come from API but for demonstration we'll use mock data
  const [financialData, setFinancialData] = useState<FinancialData>({
    salary: 75000,
    tda_balance: 48000,
    pension_status: 'Tier 6 - 5 years of service',
    qpp_balance: 15000,
    student_loans: 25000,
    pay_differentials: [
      { name: 'Masters +30', progress: 24, total: 30 },
      { name: 'Language Acquisition', progress: 10, total: 16 }
    ],
    education_courses: [
      { name: 'Special Education Certification', status: 'In Progress', credits: 12 },
      { name: 'Technology Integration', status: 'Completed', credits: 3 },
      { name: 'Leadership in Education', status: 'Planned', credits: 6 }
    ]
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const getUserInitials = () => {
    if (!profileData) return user?.email?.[0].toUpperCase() || 'U';
    return `${profileData.first_name[0]}${profileData.last_name[0]}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container max-w-5xl mx-auto px-4 py-20">
          <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-20">
        <div className="space-y-8">
          {/* Profile Header */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage src={profileData?.avatar_url || ''} alt={profileData?.first_name || ''} />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <h1 className="text-2xl font-bold">{profileData?.first_name} {profileData?.last_name}</h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {profileData?.teacher_id ? `Teacher ID: ${profileData.teacher_id}` : 'Teacher ID: Not set'}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <School className="h-3 w-3" />
                      {profileData?.school || 'School: Not set'}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      Tier 6
                    </Badge>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 md:mt-0"
                  onClick={() => navigate('/settings')}
                >
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="finance">Financial</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Salary Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-primary" />
                      Current Salary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">${financialData.salary.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground mt-1">Annual before taxes</p>
                  </CardContent>
                </Card>
                
                {/* Pension Status */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Pension Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-medium">{financialData.pension_status}</div>
                    <p className="text-sm text-muted-foreground mt-1">Retirement system</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Recent Notifications
                  </CardTitle>
                  <CardDescription>Important updates about your finances and career</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">TDA Contribution Update</h4>
                        <p className="text-sm text-muted-foreground">Your TDA contribution rate was updated to 7% of your salary.</p>
                        <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Pay Date Reminder</h4>
                        <p className="text-sm text-muted-foreground">Your next paycheck will be deposited on Friday, July 15th.</p>
                        <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Financial Tab */}
            <TabsContent value="finance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TDA Balance */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-primary" />
                      TDA Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">${financialData.tda_balance.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground mt-1">Current tax-deferred annuity</p>
                  </CardContent>
                </Card>
                
                {/* QPP Balance */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-primary" />
                      QPP Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">${financialData.qpp_balance.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground mt-1">Qualified Pension Plan</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Student Loans */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Student Loans
                  </CardTitle>
                  <CardDescription>Outstanding education loans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Federal Student Loans</span>
                      <span className="font-bold">${financialData.student_loans.toLocaleString()}</span>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span>PSLF Progress</span>
                        <span>36/120 payments</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Pay Differentials */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Pay Differentials
                  </CardTitle>
                  <CardDescription>Progress towards salary differentials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {financialData.pay_differentials.map((diff, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{diff.name}</span>
                          <span>{diff.progress}/{diff.total} credits</span>
                        </div>
                        <Progress value={(diff.progress / diff.total) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Education Tab */}
            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Education Courses
                  </CardTitle>
                  <CardDescription>Your professional development</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {financialData.education_courses.map((course, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{course.name}</h4>
                            <p className="text-sm text-muted-foreground">{course.credits} credits</p>
                          </div>
                          <Badge variant={
                            course.status === 'Completed' ? 'default' :
                            course.status === 'In Progress' ? 'secondary' : 'outline'
                          }>
                            {course.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* CTLE Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    CTLE Hours
                  </CardTitle>
                  <CardDescription>Continuing Teacher and Leader Education</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span>Current Period (2020-2025)</span>
                        <span>75/100 hours</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You need 25 more hours by June 30, 2025 to maintain your professional certification.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
