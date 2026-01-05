import { Church, MapPin, Phone, Mail, Train } from "lucide-react";
import logo from "@assets/logo.jpeg";

export default function Footer() {
  return (
    <footer className="bg-church-dark-green text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Church Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={logo} 
                alt="예람교회 로고" 
                className="w-12 h-12 object-contain bg-white rounded-full p-2"
              />
              <div>
                <h3 className="text-xl font-bold">예람교회</h3>
                <p className="text-green-200 text-sm">Yeram Church</p>
              </div>
            </div>
            <p className="text-green-200 leading-relaxed mb-4">
              하나님의 사랑 안에서 함께 성장하는 예람교회에 오신 것을 환영합니다.
            </p>
            <p className="text-green-200 text-sm">
              "여호와는 나의 목자시니 내게 부족함이 없으리로다" (시편 23:1)
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">연락처</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="text-church-accent-green" size={16} />
                <span className="text-green-200">인천 계양구 경명대로 1116 3층</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-church-accent-green" size={16} />
                <span className="text-green-200">010-2653-2440 (담임목사 강용희)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-church-accent-green" size={16} />
                <span className="text-green-200">yerammethodistchurch@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Train className="text-church-accent-green" size={16} />
                <span className="text-green-200">지하철 인천1호선 계산역 1번 출구</span>
              </div>
            </div>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="text-lg font-bold mb-6">예배시간</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-church-accent-green font-medium">새벽예배</span>
                <span className="text-green-200">월~금 05:30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-church-accent-green font-medium">주일 낮예배</span>
                <span className="text-green-200">주일 11:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-church-accent-green font-medium">주일 오후예배</span>
                <span className="text-green-200">주일 14:30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-church-accent-green font-medium">학생부/어린이</span>
                <span className="text-green-200">주일 09:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-church-accent-green font-medium">수요예배</span>
                <span className="text-green-200">수요일 19:30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-church-accent-green font-medium">금요예배</span>
                <span className="text-green-200">금요일 21:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-12 pt-8 text-center">
          <p className="text-green-200 text-sm">
            © 2024 예람교회 (Yeram Church). All rights reserved.
          </p>
          <a href="/admin" className="text-green-300 hover:text-white text-xs mt-2 inline-block opacity-50 hover:opacity-100 transition-opacity">
            관리자
          </a>
        </div>
      </div>
    </footer>
  );
}
