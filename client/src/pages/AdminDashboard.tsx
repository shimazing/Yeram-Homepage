import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Megaphone, Image, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

export default function AdminDashboard() {
  const { isAdmin, logout } = useAdmin();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 인증 확인
  if (!isAdmin) {
    setLocation('/admin');
    return null;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: '로그아웃',
      description: '관리자 페이지에서 로그아웃되었습니다.',
    });
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-church-dark-green">관리자 대시보드</h1>
            <p className="text-gray-600 mt-2">예람교회 웹사이트 관리</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            로그아웃
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="announcements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Megaphone size={16} />
              교회소식
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image size={16} />
              사진첩
            </TabsTrigger>
            <TabsTrigger value="service" className="flex items-center gap-2">
              <Calendar size={16} />
              주간예배
            </TabsTrigger>
          </TabsList>

          {/* 교회소식 관리 */}
          <TabsContent value="announcements">
            <AnnouncementsEditor />
          </TabsContent>

          {/* 사진첩 관리 */}
          <TabsContent value="gallery">
            <GalleryManager />
          </TabsContent>

          {/* 주간예배 관리 */}
          <TabsContent value="service">
            <WeeklyServiceEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// 교회소식 편집기
function AnnouncementsEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: announcements = [] } = useQuery<Array<{ id: number; title: string; content: string; author: string }>>({
    queryKey: ['/api/announcements'],
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('예람교회');

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setAuthor('예람교회');
  };

  const addMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; author: string }) => {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add announcement');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      queryClient.invalidateQueries({ queryKey: ['/api/announcements/current'] });
      toast({
        title: '추가 완료',
        description: '새 공지사항이 추가되었습니다.',
      });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { title: string; content: string; author: string } }) => {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update announcement');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      queryClient.invalidateQueries({ queryKey: ['/api/announcements/current'] });
      toast({
        title: '수정 완료',
        description: '공지사항이 수정되었습니다.',
      });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete announcement');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      queryClient.invalidateQueries({ queryKey: ['/api/announcements/current'] });
      toast({
        title: '삭제 완료',
        description: '공지사항이 삭제되었습니다.',
      });
    },
  });

  const handleEdit = (announcement: any) => {
    setEditingId(announcement.id);
    setTitle(announcement.title);
    setContent(announcement.content);
    setAuthor(announcement.author || '예람교회');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (!title || !content || !author) {
      toast({
        title: '입력 오류',
        description: '모든 필드를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    const data = { title, content, author };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      addMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* 공지사항 추가/수정 */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? '공지사항 수정' : '새 공지사항 추가'}</CardTitle>
          <CardDescription>
            {editingId ? '공지사항 내용을 수정하세요' : '새로운 공지사항을 작성하세요'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 2025년 새해 인사"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="교회소식 내용을 입력하세요..."
              rows={10}
              className="resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              작성자
            </label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="예람교회"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-church-dark-green hover:bg-church-accent-green"
              disabled={addMutation.isPending || updateMutation.isPending}
            >
              {editingId
                ? (updateMutation.isPending ? '수정 중...' : '공지사항 수정')
                : (addMutation.isPending ? '추가 중...' : '공지사항 추가')
              }
            </Button>
            {editingId && (
              <Button
                onClick={resetForm}
                variant="outline"
                disabled={updateMutation.isPending}
              >
                취소
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 기존 공지사항 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>기존 공지사항 관리</CardTitle>
          <CardDescription>작성된 공지사항을 확인하고 수정 또는 삭제할 수 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <p className="text-gray-500 text-center py-8">아직 공지사항이 없습니다.</p>
            ) : (
              announcements.map((announcement: any) => (
                <div
                  key={announcement.id}
                  className={`flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 ${
                    editingId === announcement.id ? 'ring-2 ring-church-accent-green bg-green-50' : ''
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-church-dark-green">{announcement.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{announcement.content}</p>
                    <p className="text-xs text-gray-500 mt-2">작성자: {announcement.author}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleEdit(announcement)}
                      variant="outline"
                      size="sm"
                      disabled={editingId === announcement.id}
                    >
                      수정
                    </Button>
                    <Button
                      onClick={() => deleteMutation.mutate(announcement.id)}
                      variant="destructive"
                      size="sm"
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 사진첩 관리
function GalleryManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<'worship' | 'fellowship' | 'youth' | 'events'>('worship');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { data: photos = [] } = useQuery<Array<{ id: number; url: string; alt: string; category: string }>>({
    queryKey: [`/api/gallery?category=${category}`],
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);

      console.log('Sending upload request...');
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
        console.error('Upload failed:', errorData);
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      return result;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: { url: string; alt: string; category: string }) => {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add photo');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/gallery?category=${category}`] });
      toast({
        title: '사진 추가 완료',
        description: '새 사진이 사진첩에 추가되었습니다.',
      });
      setSelectedFile(null);
      setAlt('');
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete photo');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/gallery?category=${category}`] });
      toast({
        title: '사진 삭제 완료',
        description: '사진이 삭제되었습니다.',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: '파일 크기 초과',
          description: '파일 크기는 10MB를 초과할 수 없습니다.',
          variant: 'destructive',
        });
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: '잘못된 파일 형식',
          description: '이미지 파일만 업로드 가능합니다.',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAddPhoto = async () => {
    if (!selectedFile || !alt) {
      toast({
        title: '입력 오류',
        description: '이미지 파일과 설명을 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      // First upload the image
      console.log('Uploading file:', selectedFile.name, selectedFile.type, selectedFile.size);
      const uploadResult = await uploadImageMutation.mutateAsync(selectedFile);
      console.log('Upload result:', uploadResult);

      // Then add to gallery
      addMutation.mutate({ url: uploadResult.url, alt, category });
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error?.message || error?.toString() || '이미지 업로드에 실패했습니다.';
      toast({
        title: '업로드 실패',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 사진 추가 */}
      <Card>
        <CardHeader>
          <CardTitle>새 사진 추가</CardTitle>
          <CardDescription>사진첩에 새로운 사진을 추가하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-dark-green"
            >
              <option value="worship">주일예배</option>
              <option value="fellowship">친교활동</option>
              <option value="youth">청년부</option>
              <option value="events">특별행사</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이미지 파일
            </label>
            <Input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-2">
                선택된 파일: {selectedFile.name}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <Input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="사진 설명을 입력하세요"
            />
          </div>
          <Button
            onClick={handleAddPhoto}
            className="w-full bg-church-dark-green hover:bg-church-accent-green"
            disabled={isUploading || addMutation.isPending}
          >
            {isUploading ? '업로드 중...' : addMutation.isPending ? '추가 중...' : '사진 추가'}
          </Button>
        </CardContent>
      </Card>

      {/* 기존 사진 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>기존 사진 관리</CardTitle>
          <CardDescription>카테고리별 사진을 확인하고 삭제할 수 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos?.map((photo: any) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                  <Button
                    onClick={() => deleteMutation.mutate(photo.id)}
                    variant="destructive"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    삭제
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-1">{photo.alt}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 주간예배 관리
function WeeklyServiceEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services = [] } = useQuery<Array<{ id: number; title: string; sermonTitle: string; scripture: string; youtubeUrl: string; date: string }>>({
    queryKey: ['/api/weekly-services'],
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [sermonTitle, setSermonTitle] = useState('');
  const [scripture, setScripture] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [date, setDate] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSermonTitle('');
    setScripture('');
    setYoutubeUrl('');
    setDate('');
  };

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/weekly-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add service');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/weekly-services'] });
      queryClient.invalidateQueries({ queryKey: ['/api/weekly-service'] });
      toast({
        title: '추가 완료',
        description: '새 예배 영상이 추가되었습니다.',
      });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/weekly-service/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update service');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/weekly-services'] });
      queryClient.invalidateQueries({ queryKey: ['/api/weekly-service'] });
      toast({
        title: '수정 완료',
        description: '예배 영상이 수정되었습니다.',
      });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/weekly-service/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete service');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/weekly-services'] });
      queryClient.invalidateQueries({ queryKey: ['/api/weekly-service'] });
      toast({
        title: '삭제 완료',
        description: '예배 영상이 삭제되었습니다.',
      });
    },
  });

  const handleEdit = (service: any) => {
    console.log('Editing service:', service);
    setEditingId(service.id);
    setTitle(service.title);
    setSermonTitle(service.sermonTitle);
    setScripture(service.scripture);
    setYoutubeUrl(service.youtubeUrl);
    setDate(service.date);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (!title || !sermonTitle || !scripture || !youtubeUrl || !date) {
      toast({
        title: '입력 오류',
        description: '모든 필드를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    const data = { title, sermonTitle, scripture, youtubeUrl, date };

    if (editingId) {
      console.log('Updating service:', editingId, data);
      updateMutation.mutate({ id: editingId, data });
    } else {
      console.log('Adding new service:', data);
      addMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* 예배 추가/수정 */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? '예배 영상 수정' : '새 예배 영상 추가'}</CardTitle>
          <CardDescription>
            {editingId ? '예배 영상 정보를 수정하세요' : '새로운 예배 영상을 업로드하세요'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 (예: 2025년 1월 첫째 주)
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="2025년 1월 첫째 주"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설교 제목
            </label>
            <Input
              value={sermonTitle}
              onChange={(e) => setSermonTitle(e.target.value)}
              placeholder="하나님의 사랑"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              본문 말씀
            </label>
            <Input
              value={scripture}
              onChange={(e) => setScripture(e.target.value)}
              placeholder="요한복음 3:16"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube URL
            </label>
            <Input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              예배 날짜
            </label>
            <Input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="2025년 1월 7일"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-church-dark-green hover:bg-church-accent-green"
              disabled={addMutation.isPending || updateMutation.isPending}
            >
              {editingId
                ? (updateMutation.isPending ? '수정 중...' : '예배 영상 수정')
                : (addMutation.isPending ? '추가 중...' : '예배 영상 추가')
              }
            </Button>
            {editingId && (
              <Button
                onClick={resetForm}
                variant="outline"
                disabled={updateMutation.isPending}
              >
                취소
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 기존 예배 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>기존 예배 영상 관리</CardTitle>
          <CardDescription>업로드된 예배 영상을 확인하고 수정 또는 삭제할 수 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.length === 0 ? (
              <p className="text-gray-500 text-center py-8">아직 예배 영상이 없습니다.</p>
            ) : (
              services.map((service: any) => (
                <div
                  key={service.id}
                  className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 ${
                    editingId === service.id ? 'ring-2 ring-church-accent-green bg-green-50' : ''
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-church-dark-green">{service.sermonTitle}</h4>
                    <p className="text-sm text-gray-600">{service.scripture}</p>
                    <p className="text-xs text-gray-500 mt-1">{service.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(service)}
                      variant="outline"
                      size="sm"
                      disabled={editingId === service.id}
                    >
                      수정
                    </Button>
                    <Button
                      onClick={() => deleteMutation.mutate(service.id)}
                      variant="destructive"
                      size="sm"
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
