import express from 'express';
import maintenanceService from '../services/maintenanceService.js';

const router = express.Router();

// Skip maintenance middleware for maintenance routes
router.use((req, res, next) => {
  req.skipMaintenance = true;
  next();
});

// Get maintenance status (public endpoint)
router.get('/status', (req, res) => {
  res.json(maintenanceService.getStatus());
});

// Enable maintenance mode (requires code)
router.post('/enable', (req, res) => {
  const { code, message } = req.body;
  
  if (!code) {
    return res.status(400).json({ message: 'Kod talab qilinadi' });
  }

  const result = maintenanceService.enableMaintenance(code, message);
  res.json(result);
});

// Disable maintenance mode (requires code)
router.post('/disable', (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ message: 'Kod talab qilinadi' });
  }

  const result = maintenanceService.disableMaintenance(code);
  res.json(result);
});

// Toggle specific feature (requires code)
router.post('/toggle/:feature', (req, res) => {
  const { code } = req.body;
  const { feature } = req.params;
  
  if (!code) {
    return res.status(400).json({ message: 'Kod talab qilinadi' });
  }

  const result = maintenanceService.toggleFeature(feature, code);
  res.json(result);
});

// Change access code (requires current code)
router.post('/change-code', (req, res) => {
  const { currentCode, newCode } = req.body;
  
  if (!currentCode || !newCode) {
    return res.status(400).json({ message: 'Joriy va yangi kod talab qilinadi' });
  }

  const result = maintenanceService.changeAccessCode(currentCode, newCode);
  res.json(result);
});

// Quick toggle endpoints for common features
router.post('/quick-toggle/:feature/:code', (req, res) => {
  const { feature, code } = req.params;
  
  if (!feature || !code) {
    return res.status(400).json({ message: 'Xususiyat va kod talab qilinadi' });
  }

  const result = maintenanceService.toggleFeature(feature, code);
  res.json(result);
});

// Enable maintenance with quick code
router.post('/quick-enable/:code', (req, res) => {
  const { code } = req.params;
  const { message } = req.body;
  
  if (!code) {
    return res.status(400).json({ message: 'Kod talab qilinadi' });
  }

  const result = maintenanceService.enableMaintenance(code, message);
  res.json(result);
});

// Disable maintenance with quick code
router.post('/quick-disable/:code', (req, res) => {
  const { code } = req.params;
  
  if (!code) {
    return res.status(400).json({ message: 'Kod talab qilinadi' });
  }

  const result = maintenanceService.disableMaintenance(code);
  res.json(result);
});

export default router;
