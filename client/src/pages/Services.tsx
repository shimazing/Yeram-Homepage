import { Sun, Moon, Star, Users, Clock, CheckCircle, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Services() {
  const services = [
    {
      title: "새벽예배",
      titleEn: "Early Morning Service",
      time: "월~금 새벽 5:30",
      audience: "전 연령 대상",
      description: "하루를 하나님과 함께 시작하는 은혜로운 시간입니다. 새벽의 고요함 속에서 말씀과 기도로 영적 힘을 얻으세요.",
      icon: Star,
      gradient: "from-sky-50 to-sky-100",
      iconColor: "text-sky-600",
    },
    {
      title: "주일 낮예배",
      titleEn: "Sunday Morning",
      time: "오전 11:00",
      audience: "전 연령 대상",
      description: "주일 대예배로 함께 모여 하나님을 찬양하고 말씀을 듣는 시간입니다.",
      icon: Sun,
      gradient: "from-blue-50 to-blue-100",
      iconColor: "text-church-blue",
    },
    {
      title: "주일 오후예배",
      titleEn: "Sunday Afternoon",
      time: "오후 2:30",
      audience: "전 연령 대상",
      description: "성도의 영적 성장을 위한 교육을 진행합니다.",
      icon: Sun,
      gradient: "from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "학생 예배",
      titleEn: "Student & Children",
      time: "오전 9:00",
      audience: "유치부~초등부",
      description: "아이들이 신앙을 기를 수 있도록 말씀과 놀이 활동을 통해 교육합니다",
      icon: Users,
      gradient: "from-green-50 to-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "수요예배",
      titleEn: "Wednesday Service",
      time: "저녁 7:30",
      audience: "전 연령 대상",
      description: "주중에 드리는 예배로 말씀 묵상과 기도의 시간을 통해 영성을 키웁니다.",
      icon: Moon,
      gradient: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "금요기도회",
      titleEn: "Friday Service",
      time: "저녁 9:00",
      audience: "전 연령 대상",
      description: "말씀과 깊은 기도의 시간을 통해 하나님과 더 가까워집니다.",
      icon: Star,
      gradient: "from-indigo-50 to-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];

  const guidelines = [
    "예배 10분 전까지 입장 부탁드립니다",
    "주차장은 교회 지하 1층에 있습니다",
    "처음 오시는 분은 안내데스크에서 도움을 받으실 수 있습니다",
    "유아실과 수유실이 준비되어 있습니다",
  ];

  return (
    <section className="min-h-screen bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-church-dark-green mb-6 font-serif">예배 안내</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            하나님을 예배하는 거룩한 시간에 함께하세요. 모든 분들을 환영합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className={`bg-gradient-to-br ${service.gradient} hover:shadow-lg transition-shadow`}>
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-church-dark-green rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="text-church-accent-green" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-church-dark-green">{service.title}</h3>
                      <p className="text-church-accent-green font-medium">{service.titleEn}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className={`${service.iconColor} mr-3`} size={16} />
                      <span className="font-medium">{service.time}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className={`${service.iconColor} mr-3`} size={16} />
                      <span>{service.audience}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Service Guidelines */}
          {/* <Card className="bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-church-dark-green rounded-full flex items-center justify-center mr-4">
                  <Info className="text-church-accent-green" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-church-dark-green">예배 안내사항</h3>
                  <p className="text-church-accent-green font-medium">Service Guidelines</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {guidelines.map((guideline, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>{guideline}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </section>
  );
}
