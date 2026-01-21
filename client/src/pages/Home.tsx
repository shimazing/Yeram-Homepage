import { useQuery } from "@tanstack/react-query";
import { Phone, MapPin, Clock, Users, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { WeeklyService } from "@shared/schema";

export default function Home() {
  const { data: weeklyService, isLoading } = useQuery<WeeklyService>({
    queryKey: ["/api/weekly-service"],
  });

  const extractVideoId = (url: string) => {
    // Handle various YouTube URL formats:
    // - https://www.youtube.com/watch?v=VIDEO_ID
    // - https://www.youtube.com/live/VIDEO_ID
    // - https://www.youtube.com/embed/VIDEO_ID
    // - https://youtu.be/VIDEO_ID
    // - https://www.youtube.com/v/VIDEO_ID
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&\s]+)/,           // watch?v=
      /(?:youtube\.com\/live\/)([^?\s]+)/,              // live/
      /(?:youtube\.com\/embed\/)([^?\s]+)/,             // embed/
      /(?:youtu\.be\/)([^?\s]+)/,                       // youtu.be/
      /(?:youtube\.com\/v\/)([^?\s]+)/,                 // v/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const getYouTubeWatchUrl = (url: string) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-church-dark-green mb-6 font-serif">
            예수사랑 예수사람 예수자랑<br />
            <span className="text-church-accent-green"> 예수님과 동행하는 예람교회</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            "내가 그리스도와 함께 십자가에 못 박혔나니<br />
            그런 즉 이제는 내가 사는 것이 아니요<br />
            오직 내 안에 그리스도께서 사시는 것이라<br />
            이제 내가 육체 가운데 사는 것은<br />
            나를 사랑하사 나를 위하여 자기 자신을 버리신<br />
            하나님의 아들을 믿는 믿음 안에서 사는 것이라" (갈 2:20)<br />
            예람교회에 오신 것을 환영합니다.
          </p>
        </div>

        {/* Weekly Service Video */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-church-dark-green mb-4">금주의 예배</h3>
            <p className="text-gray-600">이번 주 예배 말씀을 함께 나누어요</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-lg">
              {isLoading ? (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-church-green mx-auto mb-4"></div>
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
                    <h4 className="text-xl font-bold text-church-dark-green mb-2">
                      {weeklyService.sermonTitle}
                    </h4>
                    <p className="text-gray-600 mb-4">{weeklyService.scripture}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{weeklyService.date}</span>
                      <Button
                        className="bg-church-accent-green text-white hover:bg-green-600"
                        asChild
                      >
                        <a
                          href={getYouTubeWatchUrl(weeklyService.youtubeUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Play className="mr-2" size={16} />
                          YouTube에서 보기
                        </a>
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
              <div className="w-16 h-16 bg-church-accent-green bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-church-accent-green text-2xl" size={32} />
              </div>
              <h4 className="text-xl font-bold text-church-dark-green mb-2">예배시간</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                주일 오전 11시 / 오후 2시30분<br />
                수요일 오후 7시30분 / 금요일 오후 8시30분
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-church-green bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-church-green text-2xl" size={32} />
              </div>
              <h4 className="text-xl font-bold text-church-dark-green mb-2">찾아오시는 길</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                예람교회<br />
                인천 계양구 경명대로 1116 하나상가 3층
              </p>
              <a
                href="https://naver.me/xLsA42hQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-church-green hover:text-church-dark-green underline text-sm"
              >
                네이버 지도 보기
              </a>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-church-light-green bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-church-light-green text-2xl" size={32} />
              </div>
              <h4 className="text-xl font-bold text-church-dark-green mb-2">연락처</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                전화: 032)553-6041<br />
                이메일: yerammethodistchurch@gmail.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
