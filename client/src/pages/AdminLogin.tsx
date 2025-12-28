import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const { login } = useAdmin();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (login(password)) {
      toast({
        title: '로그인 성공',
        description: '관리자 페이지에 접속합니다.',
      });
      setLocation('/admin/dashboard');
    } else {
      toast({
        title: '로그인 실패',
        description: '비밀번호가 올바르지 않습니다.',
        variant: 'destructive',
      });
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-church-dark-green to-church-accent-green flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-church-dark-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-church-accent-green" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold text-church-dark-green">
            관리자 로그인
          </CardTitle>
          <p className="text-gray-600 mt-2">
            예람교회 웹사이트 관리자 페이지
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="관리자 비밀번호를 입력하세요"
                className="w-full"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full bg-church-dark-green hover:bg-church-accent-green">
              로그인
            </Button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-6">
            비밀번호를 분실하셨나요? 담당자에게 문의하세요.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
