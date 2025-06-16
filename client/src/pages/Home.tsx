import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Calendar, Phone, MapPin, Clock, Users, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminForm from "@/components/AdminForm";
import type { WeeklyService } from "@shared/schema";

export default function Home() {
  const [isEditingService, setIsEditingService] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: weeklyService, isLoading } = useQuery<WeeklyService>({
    queryKey: ["/api/weekly-service"],
  });

  const updateServiceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/weekly-service", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/weekly-service"] });
      toast({ title: "예배 정보가 업데이트되었습니다." });
      setIsEditingService(false);
    },
    onError: () => {
      toast({ title: "업데이트에 실패했습니다.", variant: "destructive" });
    },
  });

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('embed/')) return url;
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

  if (isEditingService) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <AdminForm
            type="service"
            initialData={weeklyService}
            onSave={(data) => updateServiceMutation.mutate(data)}
            onCancel={() => setIsEditingService(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-church-navy mb-6 font-serif">
            하나님의 사랑 안에서<br />
            <span className="text-church-gold">함께하는 예람교회</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            "여호와는 나의 목자시니 내게 부족함이 없으리로다" (시편 23:1)<br />
            예람교회에 오신 것을 환영합니다. 하나님의 말씀과 사랑으로 함께 성장해가요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-church-navy text-white px-8 py-3 hover:bg-blue-800">
              <Calendar className="mr-2" size={16} />
              예배 참여하기
            </Button>
            <Button variant="outline" className="border-church-navy text-church-navy px-8 py-3 hover:bg-church-navy hover:text-white">
              <Phone className="mr-2" size={16} />
              교회 연락처
            </Button>
          </div>
        </div>

        {/* Weekly Service Video */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-church-navy mb-4">금주의 예배</h3>
            <p className="text-gray-600">이번 주 예배 말씀을 함께 나누어요</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsEditingService(true)}
            >
              예배 정보 수정
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-lg">
              {isLoading ? (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-church-navy mx-auto mb-4"></div>
                    <p className="text-gray-600">로딩 중...</p>
                  </div>
                </div>
              ) : weeklyService ? (
                <>
                  <div className="aspect-video bg-gray-100">
                    <iframe
                      src={getYouTubeEmbedUrl(weeklyService.youtubeUrl)}
                      title={weeklyService.sermonTitle}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-church-navy mb-2">
                      {weeklyService.sermonTitle}
                    </h4>
                    <p className="text-gray-600 mb-4">{weeklyService.scripture}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{weeklyService.date}</span>
                      <Button className="bg-church-gold text-white hover:bg-yellow-600">
                        <Play className="mr-2" size={16} />
                        YouTube에서 보기
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="text-6xl text-gray-400 mb-4 mx-auto" />
                    <p className="text-gray-600 font-medium">예배 영상이 준비되지 않았습니다</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-church-gold bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-church-gold text-2xl" size={32} />
              </div>
              <h4 className="text-xl font-bold text-church-navy mb-2">예배시간</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                주일 11시 / 오후 2시30분<br />
                수요일 7시30분 / 금요일 9시
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-church-blue bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-church-blue text-2xl" size={32} />
              </div>
              <h4 className="text-xl font-bold text-church-navy mb-2">찾아오시는 길</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                서울시 강남구 예람로 123<br />
                지하철 2호선 예람역 3번 출구
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-green-500 text-2xl" size={32} />
              </div>
              <h4 className="text-xl font-bold text-church-navy mb-2">연락처</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                전화: 02-1234-5678<br />
                이메일: info@yerimchurch.org
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
