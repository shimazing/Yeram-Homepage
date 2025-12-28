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
import fs from "fs";
import path from "path";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getCurrentAnnouncement(): Promise<Announcement | undefined>;
  getAllAnnouncements(): Promise<Announcement[]>;
  addAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: InsertAnnouncement): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;

  getAllGalleryPhotos(): Promise<GalleryPhoto[]>;
  getGalleryPhotosByCategory(category: string): Promise<GalleryPhoto[]>;
  addGalleryPhoto(photo: InsertGalleryPhoto): Promise<GalleryPhoto>;
  deleteGalleryPhoto(id: number): Promise<boolean>;

  getCurrentWeeklyService(): Promise<WeeklyService | undefined>;
  getAllWeeklyServices(): Promise<WeeklyService[]>;
  addWeeklyService(service: InsertWeeklyService): Promise<WeeklyService>;
  updateWeeklyService(id: number, service: InsertWeeklyService): Promise<WeeklyService | undefined>;
  deleteWeeklyService(id: number): Promise<boolean>;
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
    const announcements = Array.from(this.announcements.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return announcements[0]; // Get the most recent
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async addAnnouncement(announcementData: InsertAnnouncement): Promise<Announcement> {
    const id = this.currentId++;
    const announcement: Announcement = {
      ...announcementData,
      id,
      createdAt: new Date(),
    };
    this.announcements.set(id, announcement);
    return announcement;
  }

  async updateAnnouncement(id: number, announcementData: InsertAnnouncement): Promise<Announcement | undefined> {
    const existingAnnouncement = this.announcements.get(id);
    if (!existingAnnouncement) {
      return undefined;
    }
    const updatedAnnouncement: Announcement = {
      ...announcementData,
      id,
      createdAt: existingAnnouncement.createdAt, // Keep original creation date
    };
    this.announcements.set(id, updatedAnnouncement);
    return updatedAnnouncement;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    return this.announcements.delete(id);
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
    const services = Array.from(this.weeklyServices.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return services[0]; // Get the most recent
  }

  async getAllWeeklyServices(): Promise<WeeklyService[]> {
    return Array.from(this.weeklyServices.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async addWeeklyService(serviceData: InsertWeeklyService): Promise<WeeklyService> {
    const id = this.currentId++;
    const service: WeeklyService = {
      ...serviceData,
      id,
      createdAt: new Date(),
    };
    this.weeklyServices.set(id, service);
    return service;
  }

  async updateWeeklyService(id: number, serviceData: InsertWeeklyService): Promise<WeeklyService | undefined> {
    const existingService = this.weeklyServices.get(id);
    if (!existingService) {
      return undefined;
    }
    const updatedService: WeeklyService = {
      ...serviceData,
      id,
      createdAt: existingService.createdAt, // Keep original creation date
    };
    this.weeklyServices.set(id, updatedService);
    return updatedService;
  }

  async deleteWeeklyService(id: number): Promise<boolean> {
    return this.weeklyServices.delete(id);
  }
}

// File-based storage using JSON
export class FileStorage implements IStorage {
  private dataFile: string;
  private data: {
    users: Map<number, User>;
    announcements: Map<number, Announcement>;
    galleryPhotos: Map<number, GalleryPhoto>;
    weeklyServices: Map<number, WeeklyService>;
    currentId: number;
  };

  constructor(dataFile: string = 'data.json') {
    this.dataFile = path.join(process.cwd(), dataFile);
    console.log('📁 FileStorage initialized. Data file path:', this.dataFile);
    this.data = this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        console.log('✅ Found existing data.json, loading data...');
        const fileContent = fs.readFileSync(this.dataFile, 'utf-8');
        const parsed = JSON.parse(fileContent);

        // Convert arrays back to Maps and restore Date objects
        const loadedData = {
          users: new Map<number, User>(parsed.users?.map((u: any) => [u.id, u]) || []),
          announcements: new Map<number, Announcement>(parsed.announcements?.map((a: any) => [a.id, { ...a, createdAt: new Date(a.createdAt) }]) || []),
          galleryPhotos: new Map<number, GalleryPhoto>(parsed.galleryPhotos?.map((p: any) => [p.id, { ...p, createdAt: new Date(p.createdAt) }]) || []),
          weeklyServices: new Map<number, WeeklyService>(parsed.weeklyServices?.map((s: any) => [s.id, { ...s, createdAt: new Date(s.createdAt) }]) || []),
          currentId: parsed.currentId || 1,
        };
        console.log(`📊 Loaded: ${loadedData.announcements.size} announcements, ${loadedData.galleryPhotos.size} photos, ${loadedData.weeklyServices.size} services`);
        return loadedData;
      } else {
        console.log('⚠️  No data.json found, creating initial data...');
      }
    } catch (error) {
      console.error('❌ Error loading data file:', error);
    }

    // Return initial data if file doesn't exist or error occurred
    const initialData = this.getInitialData();
    console.log('💾 Saving initial data to file...');
    this.data = initialData;
    this.saveData();
    return initialData;
  }

  private getInitialData() {
    const currentId = { value: 1 };

    const initialAnnouncement: Announcement = {
      id: currentId.value++,
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

    const initialService: WeeklyService = {
      id: currentId.value++,
      title: "2024년 1월 둘째 주 주일예배",
      sermonTitle: "새해, 새로운 시작",
      scripture: "마태복음 5:13-16",
      youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      date: "2024.01.14",
      createdAt: new Date(),
    };

    const samplePhotos: GalleryPhoto[] = [
      {
        id: currentId.value++,
        url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        alt: "주일 예배 모습",
        category: "worship",
        createdAt: new Date(),
      },
      {
        id: currentId.value++,
        url: "https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        alt: "교회 교제 시간",
        category: "fellowship",
        createdAt: new Date(),
      },
      {
        id: currentId.value++,
        url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        alt: "청년부 활동",
        category: "youth",
        createdAt: new Date(),
      },
      {
        id: currentId.value++,
        url: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        alt: "교회 행사",
        category: "events",
        createdAt: new Date(),
      },
    ];

    const announcements = new Map<number, Announcement>();
    announcements.set(initialAnnouncement.id, initialAnnouncement);

    const weeklyServices = new Map<number, WeeklyService>();
    weeklyServices.set(initialService.id, initialService);

    const galleryPhotos = new Map<number, GalleryPhoto>();
    samplePhotos.forEach(photo => galleryPhotos.set(photo.id, photo));

    return {
      users: new Map<number, User>(),
      announcements,
      galleryPhotos,
      weeklyServices,
      currentId: currentId.value,
    };
  }

  private saveData() {
    try {
      const dataToSave = {
        users: Array.from(this.data.users.values()),
        announcements: Array.from(this.data.announcements.values()),
        galleryPhotos: Array.from(this.data.galleryPhotos.values()),
        weeklyServices: Array.from(this.data.weeklyServices.values()),
        currentId: this.data.currentId,
      };
      console.log(`💾 Saving data to ${this.dataFile}...`);
      console.log(`   - ${dataToSave.announcements.length} announcements`);
      console.log(`   - ${dataToSave.galleryPhotos.length} photos`);
      console.log(`   - ${dataToSave.weeklyServices.length} services`);
      fs.writeFileSync(this.dataFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      console.log('✅ Data saved successfully!');
    } catch (error) {
      console.error('❌ Error saving data file:', error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.data.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.data.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.data.currentId++;
    const user: User = { ...insertUser, id };
    this.data.users.set(id, user);
    this.saveData();
    return user;
  }

  async getCurrentAnnouncement(): Promise<Announcement | undefined> {
    const announcements = Array.from(this.data.announcements.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return announcements[0];
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.data.announcements.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async addAnnouncement(announcementData: InsertAnnouncement): Promise<Announcement> {
    const id = this.data.currentId++;
    const announcement: Announcement = {
      ...announcementData,
      id,
      createdAt: new Date(),
    };
    this.data.announcements.set(id, announcement);
    this.saveData();
    return announcement;
  }

  async updateAnnouncement(id: number, announcementData: InsertAnnouncement): Promise<Announcement | undefined> {
    const existingAnnouncement = this.data.announcements.get(id);
    if (!existingAnnouncement) {
      return undefined;
    }
    const updatedAnnouncement: Announcement = {
      ...announcementData,
      id,
      createdAt: existingAnnouncement.createdAt,
    };
    this.data.announcements.set(id, updatedAnnouncement);
    this.saveData();
    return updatedAnnouncement;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const result = this.data.announcements.delete(id);
    if (result) {
      this.saveData();
    }
    return result;
  }

  async getAllGalleryPhotos(): Promise<GalleryPhoto[]> {
    return Array.from(this.data.galleryPhotos.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getGalleryPhotosByCategory(category: string): Promise<GalleryPhoto[]> {
    return Array.from(this.data.galleryPhotos.values())
      .filter(photo => photo.category === category)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async addGalleryPhoto(photoData: InsertGalleryPhoto): Promise<GalleryPhoto> {
    const id = this.data.currentId++;
    const photo: GalleryPhoto = {
      ...photoData,
      id,
      createdAt: new Date(),
    };
    this.data.galleryPhotos.set(id, photo);
    this.saveData();
    return photo;
  }

  async deleteGalleryPhoto(id: number): Promise<boolean> {
    const result = this.data.galleryPhotos.delete(id);
    if (result) {
      this.saveData();
    }
    return result;
  }

  async getCurrentWeeklyService(): Promise<WeeklyService | undefined> {
    const services = Array.from(this.data.weeklyServices.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return services[0];
  }

  async getAllWeeklyServices(): Promise<WeeklyService[]> {
    return Array.from(this.data.weeklyServices.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async addWeeklyService(serviceData: InsertWeeklyService): Promise<WeeklyService> {
    const id = this.data.currentId++;
    const service: WeeklyService = {
      ...serviceData,
      id,
      createdAt: new Date(),
    };
    this.data.weeklyServices.set(id, service);
    this.saveData();
    return service;
  }

  async updateWeeklyService(id: number, serviceData: InsertWeeklyService): Promise<WeeklyService | undefined> {
    const existingService = this.data.weeklyServices.get(id);
    if (!existingService) {
      return undefined;
    }
    const updatedService: WeeklyService = {
      ...serviceData,
      id,
      createdAt: existingService.createdAt,
    };
    this.data.weeklyServices.set(id, updatedService);
    this.saveData();
    return updatedService;
  }

  async deleteWeeklyService(id: number): Promise<boolean> {
    const result = this.data.weeklyServices.delete(id);
    if (result) {
      this.saveData();
    }
    return result;
  }
}

// PostgreSQL storage using Drizzle ORM
export class DrizzleStorage implements IStorage {
  private db;

  constructor(databaseUrl: string) {
    const queryClient = postgres(databaseUrl);
    this.db = drizzle(queryClient);
    console.log('🔌 PostgreSQL connected via Drizzle ORM');
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getCurrentAnnouncement(): Promise<Announcement | undefined> {
    const result = await this.db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt))
      .limit(1);
    return result[0];
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return await this.db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt));
  }

  async addAnnouncement(announcementData: InsertAnnouncement): Promise<Announcement> {
    const result = await this.db
      .insert(announcements)
      .values(announcementData)
      .returning();
    return result[0];
  }

  async updateAnnouncement(id: number, announcementData: InsertAnnouncement): Promise<Announcement | undefined> {
    const result = await this.db
      .update(announcements)
      .set(announcementData)
      .where(eq(announcements.id, id))
      .returning();
    return result[0];
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const result = await this.db
      .delete(announcements)
      .where(eq(announcements.id, id))
      .returning();
    return result.length > 0;
  }

  async getAllGalleryPhotos(): Promise<GalleryPhoto[]> {
    return await this.db
      .select()
      .from(galleryPhotos)
      .orderBy(desc(galleryPhotos.createdAt));
  }

  async getGalleryPhotosByCategory(category: string): Promise<GalleryPhoto[]> {
    return await this.db
      .select()
      .from(galleryPhotos)
      .where(eq(galleryPhotos.category, category))
      .orderBy(desc(galleryPhotos.createdAt));
  }

  async addGalleryPhoto(photoData: InsertGalleryPhoto): Promise<GalleryPhoto> {
    const result = await this.db
      .insert(galleryPhotos)
      .values(photoData)
      .returning();
    return result[0];
  }

  async deleteGalleryPhoto(id: number): Promise<boolean> {
    const result = await this.db
      .delete(galleryPhotos)
      .where(eq(galleryPhotos.id, id))
      .returning();
    return result.length > 0;
  }

  async getCurrentWeeklyService(): Promise<WeeklyService | undefined> {
    const result = await this.db
      .select()
      .from(weeklyService)
      .orderBy(desc(weeklyService.createdAt))
      .limit(1);
    return result[0];
  }

  async getAllWeeklyServices(): Promise<WeeklyService[]> {
    return await this.db
      .select()
      .from(weeklyService)
      .orderBy(desc(weeklyService.createdAt));
  }

  async addWeeklyService(serviceData: InsertWeeklyService): Promise<WeeklyService> {
    const result = await this.db
      .insert(weeklyService)
      .values(serviceData)
      .returning();
    return result[0];
  }

  async updateWeeklyService(id: number, serviceData: InsertWeeklyService): Promise<WeeklyService | undefined> {
    const result = await this.db
      .update(weeklyService)
      .set(serviceData)
      .where(eq(weeklyService.id, id))
      .returning();
    return result[0];
  }

  async deleteWeeklyService(id: number): Promise<boolean> {
    const result = await this.db
      .delete(weeklyService)
      .where(eq(weeklyService.id, id))
      .returning();
    return result.length > 0;
  }
}

// Use DrizzleStorage if DATABASE_URL is set, otherwise use FileStorage
// For Railway deployment with Volume: set DATA_FILE_PATH=/data/data.json
export const storage = process.env.DATABASE_URL
  ? new DrizzleStorage(process.env.DATABASE_URL)
  : new FileStorage(process.env.DATA_FILE_PATH || 'data.json');
