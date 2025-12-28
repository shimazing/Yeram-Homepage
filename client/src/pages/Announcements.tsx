import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Clock, User, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Announcement } from "@shared/schema";

export default function Announcements() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const { data: announcements = [], isLoading } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  // 자동으로 최신 공지사항 선택
  useEffect(() => {
    if (announcements.length > 0 && !selectedAnnouncement) {
      setSelectedAnnouncement(announcements[0]);
    }
  }, [announcements, selectedAnnouncement]);

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <p key={index} className="mb-2">
        {line}
      </p>
    ));
  };

  return (
    <section className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-church-dark-green mb-6 font-serif">교회 소식</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            예람교회의 최신 소식과 공지사항을 확인하세요.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-church-green mx-auto mb-4"></div>
            <p className="text-gray-600">공지사항을 불러오는 중...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">아직 공지사항이 없습니다.</p>
          </div>
        ) : (
          <>
            {/* 선택된 공지사항 */}
            {selectedAnnouncement && (
              <div className="mb-12">
                <Card className="overflow-hidden shadow-lg">
                  <CardContent className="p-0 px-6 pt-6 pb-6">
                    <h4 className="text-2xl font-bold text-church-dark-green mb-4">
                      {selectedAnnouncement.title}
                    </h4>
                    <div className="prose max-w-none text-gray-600 mb-6">
                      {formatContent(selectedAnnouncement.content)}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-2" size={16} />
                        {new Date(selectedAnnouncement.createdAt).toLocaleDateString('ko-KR')} 게시
                      </div>
                      <div className="flex items-center text-sm text-church-dark-green font-medium">
                        <User className="mr-2" size={16} />
                        {selectedAnnouncement.author}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 공지사항 목록 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <Card
                  key={announcement.id}
                  className={`cursor-pointer hover:shadow-xl transition-shadow ${
                    selectedAnnouncement?.id === announcement.id ? 'ring-2 ring-church-accent-green' : ''
                  }`}
                  onClick={() => setSelectedAnnouncement(announcement)}
                >
                  <CardContent className="p-5">
                    {/* 제목 - 제일 위 */}
                    <h4 className="font-bold text-church-dark-green mb-3 line-clamp-2 text-lg">
                      {announcement.title}
                    </h4>

                    {/* 내용 미리보기 */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {announcement.content}
                    </p>

                    {/* 하단: 날짜(왼쪽) + 작성자(오른쪽) */}
                    <div className="flex justify-between items-end pt-3 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="mr-1" size={12} />
                        {new Date(announcement.createdAt).toLocaleDateString('ko-KR')}
                      </div>
                      <div className="flex items-center text-xs text-church-dark-green font-medium">
                        <User className="mr-1" size={12} />
                        {announcement.author}
                      </div>
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
