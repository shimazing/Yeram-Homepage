import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Edit, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminForm from "@/components/AdminForm";
import type { Announcement } from "@shared/schema";

export default function Announcements() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: announcement, isLoading } = useQuery<Announcement>({
    queryKey: ["/api/announcements/current"],
  });

  const updateAnnouncementMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/announcements", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements/current"] });
      toast({ title: "공지사항이 업데이트되었습니다." });
      setIsEditing(false);
    },
    onError: () => {
      toast({ title: "업데이트에 실패했습니다.", variant: "destructive" });
    },
  });

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <p key={index} className="mb-2">
        {line}
      </p>
    ));
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <AdminForm
            type="announcement"
            initialData={announcement}
            onSave={(data) => updateAnnouncementMutation.mutate(data)}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-church-navy mb-6 font-serif">교회 소식</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            예람교회의 최신 소식과 공지사항을 확인하세요.
          </p>
        </div>

        {/* Admin Edit Button */}
        <div className="mb-8 text-center">
          <Button 
            className="bg-church-gold text-white hover:bg-yellow-600"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="mr-2" size={16} />
            공지사항 수정
          </Button>
        </div>

        {/* Current Announcement */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-church-navy to-church-blue p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">주요 공지사항</h3>
              <p className="text-blue-100">Important Announcement</p>
            </div>
            <CardContent className="p-8">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-church-navy mx-auto mb-4"></div>
                  <p className="text-gray-600">로딩 중...</p>
                </div>
              ) : announcement ? (
                <>
                  <h4 className="text-xl font-bold text-church-navy mb-4">
                    {announcement.title}
                  </h4>
                  <div className="prose max-w-none text-gray-600 mb-6">
                    {formatContent(announcement.content)}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-2" size={16} />
                      {new Date(announcement.createdAt).toLocaleDateString('ko-KR')} 게시
                    </div>
                    <div className="flex items-center text-sm text-church-navy font-medium">
                      <User className="mr-2" size={16} />
                      {announcement.author}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">현재 공지사항이 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
              alt="Church evening service" 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-6">
              <h4 className="text-lg font-bold text-church-navy mb-2">청년부 겨울수련회</h4>
              <p className="text-gray-600 text-sm mb-4">
                강원도 평창에서 진행되는 2박 3일 청년부 겨울수련회에 많은 참여 부탁드립니다.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-church-gold font-medium">2024.01.26-28</span>
                <span className="text-xs text-gray-500">청년부</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
              alt="Church fellowship meal" 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-6">
              <h4 className="text-lg font-bold text-church-navy mb-2">사랑의 떡나눔</h4>
              <p className="text-gray-600 text-sm mb-4">
                매달 셋째 주 주일, 예배 후 모든 성도님들과 함께하는 사랑의 식사시간입니다.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-church-gold font-medium">매월 셋째주</span>
                <span className="text-xs text-gray-500">전체</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
              alt="Children Sunday school activity" 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-6">
              <h4 className="text-lg font-bold text-church-navy mb-2">어린이 성경학교</h4>
              <p className="text-gray-600 text-sm mb-4">
                여름방학을 맞아 어린이들을 위한 특별한 성경학교가 열립니다. 많은 참여 부탁드립니다.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-church-gold font-medium">2024.07.22-26</span>
                <span className="text-xs text-gray-500">어린이부</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
