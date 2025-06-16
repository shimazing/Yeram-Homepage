import { Church, MapPin, Phone, Mail, Train } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-church-navy text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Church Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-church-gold rounded-full flex items-center justify-center">
                <Church className="text-church-navy text-lg" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold">예람교회</h3>
                <p className="text-blue-200 text-sm">Yerim Church</p>
              </div>
            </div>
            <p className="text-blue-200 leading-relaxed mb-4">
              하나님의 사랑 안에서 함께 성장하는 예람교회에 오신 것을 환영합니다.
            </p>
            <p className="text-blue-200 text-sm">
              "여호와는 나의 목자시니 내게 부족함이 없으리로다" (시편 23:1)
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">연락처</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="text-church-gold" size={16} />
                <span className="text-blue-200">서울시 강남구 예람로 123</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-church-gold" size={16} />
                <span className="text-blue-200">02-1234-5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-church-gold" size={16} />
                <span className="text-blue-200">info@yerimchurch.org</span>
              </div>
              <div className="flex items-center space-x-3">
                <Train className="text-church-gold" size={16} />
                <span className="text-blue-200">지하철 2호선 예람역 3번 출구</span>
              </div>
            </div>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="text-lg font-bold mb-6">예배시간</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-church-gold font-medium">주일 낮예배</span>
                <span className="text-blue-200">11:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-church-gold font-medium">주일 오후예배</span>
                <span className="text-blue-200">14:30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-church-gold font-medium">학생부/어린이</span>
                <span className="text-blue-200">09:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-church-gold font-medium">수요예배</span>
                <span className="text-blue-200">19:30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-church-gold font-medium">금요예배</span>
                <span className="text-blue-200">21:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-12 pt-8 text-center">
          <p className="text-blue-200 text-sm">
            © 2024 예람교회 (Yerim Church). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
