
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkIcon, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileNeeded = () => {
  const navigate = useNavigate();

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          We need some information to calculate your estimated salary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/80 mb-6">
          Please complete your job information profile to see your estimated salary and budget tools.
        </p>
        <Button onClick={() => navigate('/job-info')} className="flex items-center">
          <LinkIcon className="mr-2 h-4 w-4" />
          Go to Job Information
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileNeeded;
