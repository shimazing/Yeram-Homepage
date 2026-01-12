import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Play, Calendar, Book } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { WeeklyService } from "@shared/schema";

export default function WatchServices() {
  const [selectedService, setSelectedService] = useState<WeeklyService | null>(null);

  const { data: services = [], isLoading } = useQuery<WeeklyService[]>({
    queryKey: ["/api/weekly-services"],
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

  const getYouTubeThumbnail = (url: string) => {
    const videoId = extractVideoId(url);
    // Use sddefault.jpg which is more reliable than maxresdefault.jpg
    // sddefault.jpg is available for most videos and provides good quality (640x480)
    return videoId ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg` : '';
  };

  return (
    <section className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-church-dark-green mb-6 font-serif">
            예배 다시보기
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            지난 예배 영상을 다시 보실 수 있습니다.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-church-green mx-auto mb-4"></div>
            <p className="text-gray-600">예배 영상을 불러오는 중...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">아직 예배 영상이 없습니다.</p>
          </div>
        ) : (
          <>
            {/* 선택된 예배 영상 */}
            {selectedService && (
              <div className="mb-12">
                <Card className="overflow-hidden shadow-lg">
                  <div className="aspect-video bg-gray-100">
                    <iframe
                      src={getYouTubeEmbedUrl(selectedService.youtubeUrl)}
                      title={selectedService.sermonTitle}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-church-dark-green mb-2">
                      {selectedService.sermonTitle}
                    </h3>
                    <p className="text-gray-600 mb-4">{selectedService.scripture}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-2" size={16} />
                        {selectedService.date}
                      </div>
                      <Button
                        className="bg-church-accent-green text-white hover:bg-green-600"
                        asChild
                      >
                        <a
                          href={getYouTubeWatchUrl(selectedService.youtubeUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Play className="mr-2" size={16} />
                          YouTube에서 보기
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 예배 영상 목록 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className={`cursor-pointer hover:shadow-xl transition-shadow ${
                    selectedService?.id === service.id ? 'ring-2 ring-church-accent-green' : ''
                  }`}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="aspect-video bg-gray-200 relative group overflow-hidden">
                    <img
                      src={getYouTubeThumbnail(service.youtubeUrl)}
                      alt={service.sermonTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/1280x720?text=예배+영상';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <Play className="text-church-dark-green ml-1" size={32} />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-church-dark-green mb-2 line-clamp-1">
                      {service.sermonTitle}
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Book className="mr-2" size={14} />
                      <span className="line-clamp-1">{service.scripture}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="mr-2" size={12} />
                      {service.date}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
