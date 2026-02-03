import fs from 'fs';
import path from 'path';

class MaintenanceService {
  constructor() {
    this.configPath = path.join(process.cwd(), 'maintenance-config.json');
    this.defaultConfig = {
      enabled: false,
      message: "Texnik ishlar olib borilmoqda. Iltimos, keyinroq urinib ko'ring.",
      features: {
        dashboard: true,
        tasks: true,
        exams: true,
        quizzes: true,
        payments: true,
        attendance: true,
        market: true,
        events: true,
        rating: true
      },
      accessCode: "infast2024", // Default code
      lastUpdated: null
    };
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf8');
        return { ...this.defaultConfig, ...JSON.parse(data) };
      }
      return this.defaultConfig;
    } catch (error) {
      console.error('Error loading maintenance config:', error);
      return this.defaultConfig;
    }
  }

  saveConfig() {
    try {
      this.config.lastUpdated = new Date().toISOString();
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving maintenance config:', error);
      return false;
    }
  }

  // Enable maintenance mode with code verification
  enableMaintenance(code, message = null) {
    if (code !== this.config.accessCode) {
      return { success: false, message: "Noto'g'ri kod" };
    }

    this.config.enabled = true;
    if (message) {
      this.config.message = message;
    }
    
    const saved = this.saveConfig();
    return { 
      success: saved, 
      message: saved ? "Texnik rejim yoqildi" : "Xatolik yuz berdi"
    };
  }

  // Disable maintenance mode with code verification
  disableMaintenance(code) {
    if (code !== this.config.accessCode) {
      return { success: false, message: "Noto'g'ri kod" };
    }

    this.config.enabled = false;
    
    const saved = this.saveConfig();
    return { 
      success: saved, 
      message: saved ? "Texnik rejim o'chirildi" : "Xatolik yuz berdi"
    };
  }

  // Toggle specific feature with code verification
  toggleFeature(feature, code) {
    if (code !== this.config.accessCode) {
      return { success: false, message: "Noto'g'ri kod" };
    }

    if (!this.config.features.hasOwnProperty(feature)) {
      return { success: false, message: "Bunday xususiyat topilmadi" };
    }

    this.config.features[feature] = !this.config.features[feature];
    this.saveConfig();
    
    return { 
      success: true, 
      message: `${feature} ${this.config.features[feature] ? 'yoqildi' : 'o\'chirildi'}`
    };
  }

  // Change access code (requires current code)
  changeAccessCode(currentCode, newCode) {
    if (currentCode !== this.config.accessCode) {
      return { success: false, message: "Joriy kod noto'g'ri" };
    }

    if (!newCode || newCode.length < 4) {
      return { success: false, message: "Yangi kamida 4 ta belgidan iborat bo'lishi kerak" };
    }

    this.config.accessCode = newCode;
    const saved = this.saveConfig();
    
    return { 
      success: saved, 
      message: saved ? "Kod muvaffaqiyatli o'zgartirildi" : "Xatolik yuz berdi"
    };
  }

  // Check if maintenance mode is enabled
  isMaintenanceEnabled() {
    return this.config.enabled;
  }

  // Check if specific feature is enabled
  isFeatureEnabled(feature) {
    if (this.config.enabled) {
      return false; // All features disabled during maintenance
    }
    return this.config.features[feature] !== false;
  }

  // Get maintenance status
  getStatus() {
    return {
      enabled: this.config.enabled,
      message: this.config.message,
      features: this.config.features,
      lastUpdated: this.config.lastUpdated
    };
  }

  // Get maintenance message
  getMaintenanceMessage() {
    return this.config.message;
  }

  // Middleware to check maintenance status
  checkMaintenance(feature = null) {
    return (req, res, next) => {
      // Skip maintenance check for admin users and maintenance endpoints
      if (req.user?.role === 'ADMIN' || req.path.includes('/maintenance') || req.path.includes('/health') || req.skipMaintenance) {
        return next();
      }

      // Check if maintenance mode is enabled
      if (this.config.enabled) {
        return res.status(503).json({
          message: this.config.message,
          maintenance: true
        });
      }

      // Check if specific feature is disabled
      if (feature && !this.isFeatureEnabled(feature)) {
        return res.status(503).json({
          message: "Bu xususiyat vaqtincha o'chirilgan",
          feature: feature,
          maintenance: true
        });
      }

      next();
    };
  }
}

export default new MaintenanceService();
