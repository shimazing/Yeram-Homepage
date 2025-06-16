import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PhotoModal from "@/components/PhotoModal";
import type { GalleryPhoto } from "@shared/schema";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; alt: string } | null>(null);
  const [uploadForm, setUploadForm] = useState({
    url: '',
    alt: '',
    category: 'worship'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photos = [], isLoading } = useQuery<GalleryPhoto[]>({
    queryKey: ["/api/gallery", selectedCategory],
  });

  const addPhotoMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/gallery", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "사진이 추가되었습니다." });
      setIsUploadDialogOpen(false);
      setUploadForm({ url: '', alt: '', category: 'worship' });
    },
    onError: () => {
      toast({ title: "사진 추가에 실패했습니다.", variant: "destructive" });
    },
  });

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'worship', label: '예배' },
    { value: 'events', label: '행사' },
    { value: 'fellowship', label: '교제' },
    { value: 'youth', label: '청년부' },
  ];

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.url || !uploadForm.alt) {
      toast({ title: "모든 필드를 입력해주세요.", variant: "destructive" });
      return;
    }
    addPhotoMutation.mutate(uploadForm);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <section className="min-h-screen bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-church-navy mb-6 font-serif">사진첩</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            예람교회의 소중한 순간들을 함께 나누어요.
          </p>
        </div>

        {/* Photo Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              className={`px-6 py-3 rounded-full font-medium ${
                selectedCategory === category.value 
                  ? "bg-church-navy text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-church-gold hover:text-white"
              }`}
              onClick={() => handleCategoryChange(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Upload Button */}
        <div className="text-center mb-8">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-church-gold text-white hover:bg-yellow-600">
                <Upload className="mr-2" size={16} />
                사진 업로드
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 사진 추가</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <Label htmlFor="url">이미지 URL</Label>
                  <Input
                    id="url"
                    value={uploadForm.url}
                    onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                    placeholder="이미지 URL을 입력하세요"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="alt">사진 설명</Label>
                  <Input
                    id="alt"
                    value={uploadForm.alt}
                    onChange={(e) => setUploadForm({ ...uploadForm, alt: e.target.value })}
                    placeholder="사진 설명을 입력하세요"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Select value={uploadForm.category} onValueChange={(value) => setUploadForm({ ...uploadForm, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worship">예배</SelectItem>
                      <SelectItem value="events">행사</SelectItem>
                      <SelectItem value="fellowship">교제</SelectItem>
                      <SelectItem value="youth">청년부</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    취소
                  </Button>
                  <Button type="submit" className="bg-church-navy hover:bg-blue-800">
                    추가
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Photo Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-church-navy mx-auto mb-4"></div>
            <p className="text-gray-600">사진을 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedPhoto({ url: photo.url, alt: photo.alt })}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* Add Photo Placeholder */}
            <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-church-gold transition-colors cursor-pointer flex items-center justify-center">
              <div className="text-center" onClick={() => setIsUploadDialogOpen(true)}>
                <Plus className="text-2xl text-gray-400 mb-2 mx-auto" size={32} />
                <p className="text-gray-500 text-sm">사진 추가</p>
              </div>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {photos.length > 0 && (
          <div className="text-center mt-12">
            <Button className="bg-church-navy text-white hover:bg-blue-800">
              더 많은 사진 보기
            </Button>
          </div>
        )}

        {/* Photo Modal */}
        <PhotoModal
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          imageUrl={selectedPhoto?.url || ''}
          imageAlt={selectedPhoto?.alt || ''}
        />
      </div>
    </section>
  );
}
