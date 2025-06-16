import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnnouncementSchema, insertGalleryPhotoSchema, insertWeeklyServiceSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Announcements routes
  app.get("/api/announcements/current", async (req, res) => {
    try {
      const announcement = await storage.getCurrentAnnouncement();
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch announcement" });
    }
  });

  app.put("/api/announcements", async (req, res) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.updateAnnouncement(validatedData);
      res.json(announcement);
    } catch (error) {
      res.status(400).json({ message: "Invalid announcement data" });
    }
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const category = req.query.category as string;
      const photos = category && category !== 'all' 
        ? await storage.getGalleryPhotosByCategory(category)
        : await storage.getAllGalleryPhotos();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery photos" });
    }
  });

  app.post("/api/gallery", async (req, res) => {
    try {
      const validatedData = insertGalleryPhotoSchema.parse(req.body);
      const photo = await storage.addGalleryPhoto(validatedData);
      res.json(photo);
    } catch (error) {
      res.status(400).json({ message: "Invalid photo data" });
    }
  });

  app.delete("/api/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGalleryPhoto(id);
      if (success) {
        res.json({ message: "Photo deleted successfully" });
      } else {
        res.status(404).json({ message: "Photo not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete photo" });
    }
  });

  // Weekly service routes
  app.get("/api/weekly-service", async (req, res) => {
    try {
      const service = await storage.getCurrentWeeklyService();
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weekly service" });
    }
  });

  app.put("/api/weekly-service", async (req, res) => {
    try {
      const validatedData = insertWeeklyServiceSchema.parse(req.body);
      const service = await storage.updateWeeklyService(validatedData);
      res.json(service);
    } catch (error) {
      res.status(400).json({ message: "Invalid service data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
