import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import FeedbackForm from '@/components/FeedbackForm';
import AnimeAvatar from '@/components/AnimeAvatar';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  LogOut,
  Brain,
  Heart,
  MessageCircle,
  FileText,
  BarChart3,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import animeCounselor from '@/assets/anime-counselor.jpg';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  latest_phq9?: number;
  latest_gad7?: number;
  latest_phq9_severity?: string;
  latest_gad7_severity?: string;
  last_assessment?: string;
  journal_entries_count?: number;
}

interface WeeklyStats {
  total_users: number;
  high_risk_users: number;
  assessments_completed: number;
  average_phq9: number;
  average_gad7: number;
}

export default function CounselorDashboard() {
  const { user, profile, signOut } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUsers();
      fetchWeeklyStats();
    }
  }, [user]);

  const fetchUsers = async () => {
    if (!user) return;

    try {
      // Get users assigned to this counselor
      const { data: relationships } = await supabase
        .from('counselor_patients')
        .select('patient_id')
        .eq('counselor_id', user.id)
        .eq('is_active', true);

      if (!relationships?.length) {
        setUsers([]);
        setLoading(false);
        return;
      }

      const userIds = relationships.map(r => r.patient_id);

      // Get user profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      // Get latest assessment scores for each user
      const usersWithData: UserData[] = [];

      for (const profile of profiles || []) {
        // Get latest PHQ-9 score
        const { data: phq9Data } = await supabase
          .from('questionnaire_responses')
          .select('total_score, severity_level, completed_at')
          .eq('user_id', profile.user_id)
          .eq('questionnaire_type', 'PHQ9')
          .order('completed_at', { ascending: false })
          .limit(1);

        // Get latest GAD-7 score
        const { data: gad7Data } = await supabase
          .from('questionnaire_responses')
          .select('total_score, severity_level, completed_at')
          .eq('user_id', profile.user_id)
          .eq('questionnaire_type', 'GAD7')
          .order('completed_at', { ascending: false })
          .limit(1);

        // Get journal entries count
        const { count: journalCount } = await supabase
          .from('journal_entries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.user_id);

        usersWithData.push({
          id: profile.user_id,
          email: profile.email,
          full_name: profile.full_name || 'Unknown',
          created_at: profile.created_at,
          latest_phq9: phq9Data?.[0]?.total_score,
          latest_gad7: gad7Data?.[0]?.total_score,
          latest_phq9_severity: phq9Data?.[0]?.severity_level,
          latest_gad7_severity: gad7Data?.[0]?.severity_level,
          last_assessment: phq9Data?.[0]?.completed_at || gad7Data?.[0]?.completed_at,
          journal_entries_count: journalCount || 0
        });
      }

      setUsers(usersWithData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyStats = async () => {
    if (!user) return;

    try {
      // Get all users for this counselor
      const { data: relationships } = await supabase
        .from('counselor_patients')
        .select('patient_id')
        .eq('counselor_id', user.id)
        .eq('is_active', true);

      if (!relationships?.length) {
        setWeeklyStats({
          total_users: 0,
          high_risk_users: 0,
          assessments_completed: 0,
          average_phq9: 0,
          average_gad7: 0
        });
        return;
      }

      const userIds = relationships.map(r => r.patient_id);

      // Get assessments from the last week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: recentAssessments, count: assessmentCount } = await supabase
        .from('questionnaire_responses')
        .select('total_score, questionnaire_type, severity_level', { count: 'exact' })
        .in('user_id', userIds)
        .gte('completed_at', oneWeekAgo.toISOString());

      const phq9Scores = recentAssessments?.filter(a => a.questionnaire_type === 'PHQ9') || [];
      const gad7Scores = recentAssessments?.filter(a => a.questionnaire_type === 'GAD7') || [];

      const avgPhq9 = phq9Scores.length > 0 
        ? phq9Scores.reduce((sum, a) => sum + a.total_score, 0) / phq9Scores.length 
        : 0;

      const avgGad7 = gad7Scores.length > 0 
        ? gad7Scores.reduce((sum, a) => sum + a.total_score, 0) / gad7Scores.length 
        : 0;

      const highRiskCount = recentAssessments?.filter(a => 
        a.severity_level === 'Severe' || a.severity_level === 'Moderately Severe'
      ).length || 0;

      setWeeklyStats({
        total_users: userIds.length,
        high_risk_users: highRiskCount,
        assessments_completed: assessmentCount || 0,
        average_phq9: Math.round(avgPhq9 * 10) / 10,
        average_gad7: Math.round(avgGad7 * 10) / 10
      });
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Minimal': return 'bg-green-100 text-green-800';
      case 'Mild': return 'bg-yellow-100 text-yellow-800';
      case 'Moderate': return 'bg-orange-100 text-orange-800';
      case 'Moderately Severe': return 'bg-red-100 text-red-800';
      case 'Severe': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen counselor-page">
      {/* Professional Anime Header */}
      <header className="relative overflow-hidden gradient-counselor">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="floating-animation">
                <img src={animeCounselor} alt="Counselor Avatar" className="w-16 h-16 rounded-full shadow-anime" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  <Stethoscope className="inline w-8 h-8 mr-2" />
                  Nirwaan - Counselor Portal ✨
                </h1>
                <p className="text-white/90">Professional mental health support dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <AnimeAvatar 
                name={profile?.full_name || user?.email || 'Dr. Counselor'}
                size="lg"
                showMoodBadge={false}
                isOnline={true}
                imageUrl={animeCounselor}
              />
              <div className="text-right text-white">
                <p className="font-semibold">
                  Dr. {profile?.full_name || user?.email}
                </p>
                <Button onClick={signOut} variant="outline" size="sm" className="mt-2 border-white/30 text-white hover:bg-white/20">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Weekly Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weeklyStats?.total_users || 0}</div>
                  <p className="text-xs text-muted-foreground">Active users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weeklyStats?.high_risk_users || 0}</div>
                  <p className="text-xs text-muted-foreground">Severe/Mod. Severe cases</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Weekly Assessments</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weeklyStats?.assessments_completed || 0}</div>
                  <p className="text-xs text-muted-foreground">Last 7 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Scores</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div>PHQ-9: {weeklyStats?.average_phq9 || 0}</div>
                    <div>GAD-7: {weeklyStats?.average_gad7 || 0}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent User Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Recent User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                      {user.latest_phq9_severity && (
                        <Badge className={getSeverityColor(user.latest_phq9_severity)}>
                          PHQ-9: {user.latest_phq9_severity}
                          </Badge>
                        )}
                      {user.latest_gad7_severity && (
                        <Badge className={getSeverityColor(user.latest_gad7_severity)}>
                          GAD-7: {user.latest_gad7_severity}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <Card key={user.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="text-lg">
                              {user.full_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                          <h3 className="font-semibold">{user.full_name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground">
                              User since: {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex gap-2">
                          {user.latest_phq9 !== undefined && (
                            <Badge className={getSeverityColor(user.latest_phq9_severity || '')}>
                              PHQ-9: {user.latest_phq9}/27 ({user.latest_phq9_severity})
                              </Badge>
                            )}
                          {user.latest_gad7 !== undefined && (
                            <Badge className={getSeverityColor(user.latest_gad7_severity || '')}>
                              GAD-7: {user.latest_gad7}/21 ({user.latest_gad7_severity})
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              Journal entries: {user.journal_entries_count}
                            </div>
                            {user.last_assessment && (
                              <div>
                                Last assessment: {new Date(user.last_assessment).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  {users.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No users assigned yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Weekly Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Assessment Distribution</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Minimal Risk</span>
                        <span className="font-medium">
                        {users.filter(p =>
                            p.latest_phq9_severity === 'Minimal' || p.latest_gad7_severity === 'Minimal'
                          ).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mild Risk</span>
                        <span className="font-medium">
                        {users.filter(p =>
                            p.latest_phq9_severity === 'Mild' || p.latest_gad7_severity === 'Mild'
                          ).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Moderate Risk</span>
                        <span className="font-medium">
                        {users.filter(p =>
                            p.latest_phq9_severity === 'Moderate' || p.latest_gad7_severity === 'Moderate'
                          ).length}
                        </span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>High Risk</span>
                        <span className="font-medium">
                        {users.filter(p =>
                            p.latest_phq9_severity === 'Severe' || 
                            p.latest_phq9_severity === 'Moderately Severe' ||
                            p.latest_gad7_severity === 'Severe'
                          ).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Engagement Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Active Journalists</span>
                        <span className="font-medium">
                          {users.filter(p => (p.journal_entries_count || 0) > 0).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recent Assessments</span>
                        <span className="font-medium">
                          {users.filter(p => {
                            if (!p.last_assessment) return false;
                            const lastWeek = new Date();
                            lastWeek.setDate(lastWeek.getDate() - 7);
                            return new Date(p.last_assessment) > lastWeek;
                          }).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}