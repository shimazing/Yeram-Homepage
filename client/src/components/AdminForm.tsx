import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminFormProps {
  type: 'announcement' | 'service';
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function AdminForm({ type, initialData, onSave, onCancel }: AdminFormProps) {
  const [formData, setFormData] = useState(initialData || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  if (type === 'announcement') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>공지사항 수정</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="공지사항 제목을 입력하세요"
                required
              />
            </div>
            <div>
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="공지사항 내용을 입력하세요"
                className="min-h-[200px]"
                required
              />
            </div>
            <div>
              <Label htmlFor="author">작성자</Label>
              <Input
                id="author"
                value={formData.author || ''}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="작성자명을 입력하세요"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                취소
              </Button>
              <Button type="submit" className="bg-church-dark-green hover:bg-green-800">
                저장
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (type === 'service') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>금주 예배 수정</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">예배 제목</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="예배 제목을 입력하세요"
                required
              />
            </div>
            <div>
              <Label htmlFor="sermonTitle">설교 제목</Label>
              <Input
                id="sermonTitle"
                value={formData.sermonTitle || ''}
                onChange={(e) => handleInputChange('sermonTitle', e.target.value)}
                placeholder="설교 제목을 입력하세요"
                required
              />
            </div>
            <div>
              <Label htmlFor="scripture">성경 구절</Label>
              <Input
                id="scripture"
                value={formData.scripture || ''}
                onChange={(e) => handleInputChange('scripture', e.target.value)}
                placeholder="성경 구절을 입력하세요"
                required
              />
            </div>
            <div>
              <Label htmlFor="youtubeUrl">유튜브 URL</Label>
              <Input
                id="youtubeUrl"
                value={formData.youtubeUrl || ''}
                onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                placeholder="유튜브 영상 URL을 입력하세요"
                required
              />
            </div>
            <div>
              <Label htmlFor="date">날짜</Label>
              <Input
                id="date"
                value={formData.date || ''}
                onChange={(e) => handleInputChange('date', e.target.value)}
                placeholder="날짜를 입력하세요 (예: 2025.01.14)"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                취소
              </Button>
              <Button type="submit" className="bg-church-dark-green hover:bg-green-800">
                저장
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return null;
}
