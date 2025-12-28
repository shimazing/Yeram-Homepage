import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PhotoModal from "@/components/PhotoModal";
import type { GalleryPhoto } from "@shared/schema";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; alt: string } | null>(null);
  const [displayLimit, setDisplayLimit] = useState(12); // 처음에 12개만 표시

  const { data: photos = [], isLoading } = useQuery<GalleryPhoto[]>({
    queryKey: [`/api/gallery?category=${selectedCategory}`],
  });

  // 표시할 사진 목록 (제한된 개수만)
  const displayedPhotos = photos.slice(0, displayLimit);
  const hasMore = photos.length > displayLimit;

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'worship', label: '주일예배' },
    { value: 'fellowship', label: '친교활동' },
    { value: 'youth', label: '청년부' },
    { value: 'events', label: '특별행사' },
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setDisplayLimit(12); // 카테고리 변경 시 limit 초기화
  };

  const loadMore = () => {
    setDisplayLimit(prev => prev + 12); // 12개씩 추가로 로드
  };

  return (
    <section className="min-h-screen bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-church-dark-green mb-6 font-serif">사진첩</h2>
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
                  ? "bg-church-dark-green text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-church-accent-green hover:text-white"
              }`}
              onClick={() => handleCategoryChange(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Photo Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-church-green mx-auto mb-4"></div>
            <p className="text-gray-600">사진을 불러오는 중...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">아직 사진이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group relative"
                  onClick={() => setSelectedPhoto({ url: photo.url, alt: photo.alt })}
                >
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  {/* 마우스오버 시 설명 표시 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm line-clamp-2">
                        {photo.alt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button - 더 보여줄 사진이 있을 때만 표시 */}
            {hasMore && (
              <div className="text-center mt-12">
                <Button
                  onClick={loadMore}
                  className="bg-church-dark-green text-white hover:bg-green-800"
                >
                  더 많은 사진 보기 ({displayedPhotos.length} / {photos.length})
                </Button>
              </div>
            )}
          </>
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
