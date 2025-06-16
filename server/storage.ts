import { 
  users, 
  announcements, 
  galleryPhotos, 
  weeklyService,
  type User, 
  type InsertUser,
  type Announcement,
  type InsertAnnouncement,
  type GalleryPhoto,
  type InsertGalleryPhoto,
  type WeeklyService,
  type InsertWeeklyService
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCurrentAnnouncement(): Promise<Announcement | undefined>;
  updateAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  
  getAllGalleryPhotos(): Promise<GalleryPhoto[]>;
  getGalleryPhotosByCategory(category: string): Promise<GalleryPhoto[]>;
  addGalleryPhoto(photo: InsertGalleryPhoto): Promise<GalleryPhoto>;
  deleteGalleryPhoto(id: number): Promise<boolean>;
  
  getCurrentWeeklyService(): Promise<WeeklyService | undefined>;
  updateWeeklyService(service: InsertWeeklyService): Promise<WeeklyService>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private announcements: Map<number, Announcement>;
  private galleryPhotos: Map<number, GalleryPhoto>;
  private weeklyServices: Map<number, WeeklyService>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.announcements = new Map();
    this.galleryPhotos = new Map();
    this.weeklyServices = new Map();
    this.currentId = 1;
    
    // Initialize with current announcement
    const initialAnnouncement: Announcement = {
      id: this.currentId++,
      title: "2024년 신년 특별새벽기도회 안내",
      content: `사랑하는 예람교회 성도 여러분, 새해를 맞아 특별새벽기도회를 개최합니다.

• 기간: 2024년 1월 15일(월) ~ 1월 19일(금)
• 시간: 매일 새벽 5:30 ~ 6:30
• 장소: 본당
• 주제: "새해, 새로운 비전"

많은 성도님들의 참여를 부탁드립니다. 새해에 하나님의 축복이 충만하기를 기도합니다.`,
      author: "담임목사 김목사",
      createdAt: new Date(),
    };
    this.announcements.set(initialAnnouncement.id, initialAnnouncement);

    // Initialize with current weekly service
    const initialService: WeeklyService = {
      id: this.currentId++,
      title: "2024년 1월 둘째 주 주일예배",
      sermonTitle: "새해, 새로운 시작",
      scripture: "마태복음 5:13-16",
      youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      date: "2024.01.14",
      createdAt: new Date(),
    };
    this.weeklyServices.set(initialService.id, initialService);

    // Initialize with sample gallery photos
    const samplePhotos: GalleryPhoto[] = [
      {
        id: this.currentId++,
        url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        alt: "주일 예배 모습",
        category: "worship",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        url: "https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        alt: "교회 교제 시간",
        category: "fellowship",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        alt: "청년부 활동",
        category: "youth",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        url: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        alt: "교회 행사",
        category: "events",
        createdAt: new Date(),
      },
    ];
    
    samplePhotos.forEach(photo => {
      this.galleryPhotos.set(photo.id, photo);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCurrentAnnouncement(): Promise<Announcement | undefined> {
    const announcements = Array.from(this.announcements.values());
    return announcements[announcements.length - 1]; // Get the latest
  }

  async updateAnnouncement(announcementData: InsertAnnouncement): Promise<Announcement> {
    // Clear existing announcements and add new one
    this.announcements.clear();
    const id = this.currentId++;
    const announcement: Announcement = {
      ...announcementData,
      id,
      createdAt: new Date(),
    };
    this.announcements.set(id, announcement);
    return announcement;
  }

  async getAllGalleryPhotos(): Promise<GalleryPhoto[]> {
    return Array.from(this.galleryPhotos.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getGalleryPhotosByCategory(category: string): Promise<GalleryPhoto[]> {
    return Array.from(this.galleryPhotos.values())
      .filter(photo => photo.category === category)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async addGalleryPhoto(photoData: InsertGalleryPhoto): Promise<GalleryPhoto> {
    const id = this.currentId++;
    const photo: GalleryPhoto = {
      ...photoData,
      id,
      createdAt: new Date(),
    };
    this.galleryPhotos.set(id, photo);
    return photo;
  }

  async deleteGalleryPhoto(id: number): Promise<boolean> {
    return this.galleryPhotos.delete(id);
  }

  async getCurrentWeeklyService(): Promise<WeeklyService | undefined> {
    const services = Array.from(this.weeklyServices.values());
    return services[services.length - 1]; // Get the latest
  }

  async updateWeeklyService(serviceData: InsertWeeklyService): Promise<WeeklyService> {
    // Clear existing services and add new one
    this.weeklyServices.clear();
    const id = this.currentId++;
    const service: WeeklyService = {
      ...serviceData,
      id,
      createdAt: new Date(),
    };
    this.weeklyServices.set(id, service);
    return service;
  }
}

export const storage = new MemStorage();
