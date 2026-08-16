import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { seedDatabase } from './seed/seedData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data_store.json');

class DatabaseStore {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Verify key tables exist
        if (!this.data.providers || !this.data.users || !this.data.menuItems || !this.data.mealPlans) {
          console.log('🔄 Re-seeding database with complete HomeFeast models...');
          this.data = seedDatabase();
          this.save();
        }
      } else {
        console.log('🌱 Initializing fresh HomeFeast database with rich seed data...');
        this.data = seedDatabase();
        this.save();
      }
    } catch (err) {
      console.error('⚠️ Error reading database store, recreating fresh seed:', err);
      this.data = seedDatabase();
      this.save();
    }
  }

  get() {
    if (!this.data) {
      this.init();
    }
    return this.data;
  }

  save(customData = null) {
    if (customData) {
      this.data = customData;
    }
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('❌ Failed to persist database:', err);
      return false;
    }
  }

  resetToSeed() {
    this.data = seedDatabase();
    this.save();
    return this.data;
  }
}

export const db = new DatabaseStore();
export default db;
