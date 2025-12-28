import fs from "fs";
import path from "path";
import { DrizzleStorage } from "../server/storage";

async function migrateData() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set!");
    process.exit(1);
  }

  const dataFilePath = path.join(process.cwd(), "data.json");

  if (!fs.existsSync(dataFilePath)) {
    console.log("⚠️  No data.json file found. Nothing to migrate.");
    process.exit(0);
  }

  console.log("📂 Reading data.json...");
  const fileContent = fs.readFileSync(dataFilePath, "utf-8");
  const data = JSON.parse(fileContent);

  console.log("🔌 Connecting to PostgreSQL...");
  const storage = new DrizzleStorage(databaseUrl);

  try {
    // Migrate announcements
    console.log(`\n📢 Migrating ${data.announcements?.length || 0} announcements...`);
    for (const announcement of data.announcements || []) {
      await storage.addAnnouncement({
        title: announcement.title,
        content: announcement.content,
        author: announcement.author,
      });
      console.log(`  ✓ ${announcement.title}`);
    }

    // Migrate gallery photos
    console.log(`\n🖼️  Migrating ${data.galleryPhotos?.length || 0} gallery photos...`);
    for (const photo of data.galleryPhotos || []) {
      await storage.addGalleryPhoto({
        url: photo.url,
        alt: photo.alt,
        category: photo.category,
      });
      console.log(`  ✓ ${photo.alt} (${photo.category})`);
    }

    // Migrate weekly services
    console.log(`\n⛪ Migrating ${data.weeklyServices?.length || 0} weekly services...`);
    for (const service of data.weeklyServices || []) {
      await storage.addWeeklyService({
        title: service.title,
        sermonTitle: service.sermonTitle,
        scripture: service.scripture,
        youtubeUrl: service.youtubeUrl,
        date: service.date,
      });
      console.log(`  ✓ ${service.title}`);
    }

    console.log("\n✅ Migration completed successfully!");
    console.log("\n💡 You can now:");
    console.log("   1. Run 'npm run dev' to test the application");
    console.log("   2. Backup data.json if you want to keep it");
    console.log("   3. The app will now use PostgreSQL automatically");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateData();
