import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnnouncementSchema, insertGalleryPhotoSchema, insertWeeklyServiceSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'attached_assets');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'gallery-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage_multer,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  console.log('Registering routes...');

  // File upload endpoint - MUST be before other routes that might conflict
  console.log('Registering upload endpoint: POST /api/upload-image');
  app.post("/api/upload-image", upload.single('image'), (req, res) => {
    console.log('Upload endpoint hit!', req.file ? `File: ${req.file.originalname}` : 'No file');

    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Return the file path relative to the assets folder
    const imageUrl = `/@assets/${req.file.filename}`;
    console.log('File uploaded successfully:', imageUrl);
    res.json({ url: imageUrl });
  });

  // Announcements routes
  app.get("/api/announcements/current", async (req, res) => {
    try {
      const announcement = await storage.getCurrentAnnouncement();
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch announcement" });
    }
  });

  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.addAnnouncement(validatedData);
      res.json(announcement);
    } catch (error) {
      res.status(400).json({ message: "Invalid announcement data" });
    }
  });

  app.put("/api/announcements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.updateAnnouncement(id, validatedData);
      if (announcement) {
        res.json(announcement);
      } else {
        res.status(404).json({ message: "Announcement not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid announcement data" });
    }
  });

  app.delete("/api/announcements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAnnouncement(id);
      if (success) {
        res.json({ message: "Announcement deleted successfully" });
      } else {
        res.status(404).json({ message: "Announcement not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete announcement" });
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

  app.get("/api/weekly-services", async (req, res) => {
    try {
      const services = await storage.getAllWeeklyServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weekly services" });
    }
  });

  app.post("/api/weekly-service", async (req, res) => {
    try {
      const validatedData = insertWeeklyServiceSchema.parse(req.body);
      const service = await storage.addWeeklyService(validatedData);
      res.json(service);
    } catch (error) {
      res.status(400).json({ message: "Invalid service data" });
    }
  });

  app.put("/api/weekly-service/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log('PUT /api/weekly-service/:id - ID:', id, 'Body:', req.body);
      const validatedData = insertWeeklyServiceSchema.parse(req.body);
      const service = await storage.updateWeeklyService(id, validatedData);
      console.log('Update result:', service);
      if (service) {
        res.json(service);
      } else {
        res.status(404).json({ message: "Service not found" });
      }
    } catch (error) {
      console.error('Update error:', error);
      res.status(400).json({ message: "Invalid service data" });
    }
  });

  app.delete("/api/weekly-service/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteWeeklyService(id);
      if (success) {
        res.json({ message: "Service deleted successfully" });
      } else {
        res.status(404).json({ message: "Service not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // SEO routes - robots.txt and sitemap.xml
  app.get("/robots.txt", (req, res) => {
    const siteUrl = process.env.VITE_SITE_URL || 'http://localhost:5173';
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`);
  });

  app.get("/sitemap.xml", (req, res) => {
    const siteUrl = process.env.VITE_SITE_URL || 'http://localhost:5173';
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/services</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/announcements</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/gallery</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/watch-services</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
`);
  });

  const httpServer = createServer(app);
  return httpServer;
}
