import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertBusinessSchema,
  insertServiceSchema,
  insertClientSchema,
  insertBookingSchema,
  insertReviewSchema,
  insertAvailabilitySchema,
  insertWebsiteProjectSchema,
  insertWebsiteTemplateSchema,
  insertClientCustomizationSchema,
} from "@shared/schema";
import { z } from "zod";
import multer from 'multer';
import { cloudflareService } from './cloudflare';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

// S3 Client for serving images
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  // Configure multer for image uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    },
  });

  // Image upload route
  app.post('/api/upload/image', isAuthenticated, upload.single('image'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      const result = await cloudflareService.uploadImage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      // Return relative URL that points to our server instead of R2 directly
      const serverUrl = `/api/image/${result.key}`;
      res.json({ url: serverUrl, key: result.key });
    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({ message: 'Failed to upload image' });
    }
  });

  // Test endpoint to verify routing
  app.get('/api/test-image', (req, res) => {
    console.log('🧪 Test endpoint reached!');
    res.json({ message: 'API routing works!' });
  });

  // Serve images from R2 through our server  
  app.get('/api/image/:folder/:filename', async (req, res) => {
    try {
      // Reconstruct the full key from folder and filename
      const { folder, filename } = req.params;
      const key = `${folder}/${filename}`;
      console.log('🖼️ Serving image request for key:', key);
      
      // Validate key exists
      if (!key) {
        console.log('❌ No key provided');
        return res.status(400).json({ error: 'No image key provided' });
      }

      // Get the file from R2
      const command = new GetObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'timgrow',
        Key: key,
      });

      console.log('📡 Sending S3 command for bucket:', process.env.CLOUDFLARE_R2_BUCKET_NAME, 'key:', key);
      const response = await s3Client.send(command);
      console.log('✅ S3 response received:', {
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        etag: response.ETag
      });
      
      if (!response.Body) {
        console.log('❌ No response body from S3');
        return res.status(404).json({ error: 'Image not found - no body' });
      }

      // Set appropriate headers
      const contentType = response.ContentType || 'image/jpeg';
      res.set({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
        'ETag': response.ETag,
      });

      console.log('📤 Streaming image with content-type:', contentType);

      // Convert ReadableStream to Node.js readable stream and pipe to response
      const stream = response.Body as any;
      stream.pipe(res);
      
    } catch (error) {
      console.error('❌ Error serving image:', error);
      res.status(500).json({ 
        error: 'Failed to serve image',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Add a health check endpoint
  app.get("/api/auth/status", (req, res) => {
    res.json({
      authenticated: req.isAuthenticated(),
      hasEnvironmentVars: !!(process.env.REPLIT_DOMAINS && process.env.REPL_ID),
      developmentMode: !process.env.REPLIT_DOMAINS || !process.env.REPL_ID
    });
  });

  // Business registration route (no authentication required for new users)
  app.post('/api/register-business', async (req, res) => {
    try {
      // For registration, we need to create a demo user since we don't have auth
      // In a real app, this would be handled by the authentication system
      const userId = `user-${Date.now()}`;
      
      // First create the user
      await storage.upsertUser({
        id: userId,
        email: req.body.email || null,
        firstName: null,
        lastName: null,
        profileImageUrl: null,
      });
      
      // Create unique slug from business name
      const baseSlug = req.body.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      let slug = baseSlug;
      let counter = 1;
      
      // Ensure slug is unique
      while (await storage.getBusinessBySlug(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Now parse with all required fields including the generated slug
      const businessData = insertBusinessSchema.parse({
        ...req.body,
        userId,
        slug,
      });

      const business = await storage.createBusiness(businessData);
      
      res.json(business);
    } catch (error) {
      console.error("Error registering business:", error);
      res.status(400).json({ 
        message: "Failed to register business",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Business routes (authenticated)
  app.post('/api/businesses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Create unique slug from business name
      const baseSlug = req.body.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      let slug = baseSlug;
      let counter = 1;
      
      // Ensure slug is unique
      while (await storage.getBusinessBySlug(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Now parse with all required fields including the generated slug
      const businessData = insertBusinessSchema.parse({
        ...req.body,
        userId,
        slug,
      });

      const business = await storage.createBusiness(businessData);
      
      res.json(business);
    } catch (error) {
      console.error("Error creating business:", error);
      res.status(400).json({ message: "Failed to create business" });
    }
  });

  app.get('/api/businesses/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByUserId(userId);
      res.json(business);
    } catch (error) {
      console.error("Error fetching business:", error);
      res.status(500).json({ message: "Failed to fetch business" });
    }
  });

  app.get('/api/businesses/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const business = await storage.getBusinessBySlug(slug);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      res.json(business);
    } catch (error) {
      console.error("Error fetching business:", error);
      res.status(500).json({ message: "Failed to fetch business" });
    }
  });

  // Services routes
  app.post('/api/services', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByUserId(userId);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const serviceData = insertServiceSchema.parse({
        ...req.body,
        businessId: business.id,
      });

      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(400).json({ message: "Failed to create service" });
    }
  });

  app.get('/api/services', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByUserId(userId);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const services = await storage.getServicesByBusinessId(business.id);
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get('/api/businesses/:slug/services', async (req, res) => {
    try {
      const { slug } = req.params;
      const business = await storage.getBusinessBySlug(slug);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const services = await storage.getServicesByBusinessId(business.id);
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.put('/api/services/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const serviceData = insertServiceSchema.partial().parse(req.body);
      
      const service = await storage.updateService(parseInt(id), serviceData);
      res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(400).json({ message: "Failed to update service" });
    }
  });

  app.delete('/api/services/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteService(parseInt(id));
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Booking routes
  app.post('/api/bookings', async (req, res) => {
    try {
      const { businessSlug, serviceId, clientData, appointmentDate, notes } = req.body;
      
      const business = await storage.getBusinessBySlug(businessSlug);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      // Find or create client
      let client = await storage.getClientByPhone(clientData.phone);
      if (!client) {
        const clientSchema = insertClientSchema.parse(clientData);
        client = await storage.createClient(clientSchema);
      }

      // Parse the appointment date - client sends it in local Eastern Time format
      // Determine if it's EDT (-04:00) or EST (-05:00) based on the date
      const tempDate = new Date(appointmentDate);
      const isEDT = tempDate.getMonth() >= 2 && tempDate.getMonth() <= 10; // March through November (approximate)
      const timeZoneOffset = isEDT ? '-04:00' : '-05:00';
      
      console.log('Server Debug:', {
        receivedAppointmentDate: appointmentDate,
        isEDT,
        timeZoneOffset,
        withTimezone: appointmentDate + timeZoneOffset
      });
      
      const appointmentDateTime = new Date(appointmentDate + timeZoneOffset);
      console.log('Created DateTime:', appointmentDateTime.toISOString());
      
      const bookingData = insertBookingSchema.parse({
        businessId: business.id,
        serviceId: parseInt(serviceId),
        clientId: client.id,
        teamMemberId: null, // No specific team member assigned
        appointmentDate: appointmentDateTime,
        notes,
      });

      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(400).json({ message: "Failed to create booking" });
    }
  });

  // Get all bookings for authenticated user's business
  app.get('/api/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByUserId(userId);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const bookings = await storage.getBookingsByBusinessId(business.id);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get('/api/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByUserId(userId);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const { startDate, endDate } = req.query;
      const bookings = await storage.getBookingsByBusinessId(
        business.id,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get('/api/bookings/today', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByUserId(userId);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const today = new Date();
      const bookings = await storage.getBookingsByDate(business.id, today);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching today's bookings:", error);
      res.status(500).json({ message: "Failed to fetch today's bookings" });
    }
  });

  app.put('/api/bookings/:id/status', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const validStatuses = ['confirmed', 'completed', 'cancelled', 'no_show'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const booking = await storage.updateBookingStatus(parseInt(id), status);
      res.json(booking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Review routes
  app.post('/api/reviews', async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: "Failed to create review" });
    }
  });

  app.get('/api/businesses/:slug/reviews', async (req, res) => {
    try {
      const { slug } = req.params;
      const business = await storage.getBusinessBySlug(slug);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const reviews = await storage.getReviewsByBusinessId(business.id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByUserId(userId);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const [todayBookings, weekBookings] = await Promise.all([
        storage.getBookingsByDate(business.id, today),
        storage.getBookingsByBusinessId(business.id, weekStart, weekEnd),
      ]);

      const completedThisWeek = weekBookings.filter(b => b.status === 'completed');
      const weekRevenue = completedThisWeek.reduce((sum, booking) => {
        return sum + parseFloat((booking as any).service.price || '0');
      }, 0);

      const noShowCount = weekBookings.filter(b => b.status === 'no_show').length;
      const noShowRate = weekBookings.length > 0 ? Math.round((noShowCount / weekBookings.length) * 100) : 0;

      res.json({
        todayBookings: todayBookings.length,
        weekBookings: weekBookings.length,
        weekRevenue,
        noShowRate,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Today's bookings endpoint
  app.get('/api/bookings/today', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByUserId(userId);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const today = new Date();
      const todayBookings = await storage.getBookingsByDate(business.id, today);
      res.json(todayBookings);
    } catch (error) {
      console.error("Error fetching today's bookings:", error);
      res.status(500).json({ message: "Failed to fetch today's bookings" });
    }
  });

  // Upcoming bookings endpoint (next 30 days)
  app.get('/api/bookings/upcoming', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByUserId(userId);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 30); // Next 30 days
      
      const upcomingBookings = await storage.getBookingsByBusinessId(business.id, today, futureDate);
      res.json(upcomingBookings);
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
      res.status(500).json({ message: "Failed to fetch upcoming bookings" });
    }
  });

  // Get bookings for a specific business and date (for availability checking)
  app.get('/api/businesses/:businessId/bookings/:date', async (req, res) => {
    try {
      const { businessId, date } = req.params;
      const targetDate = new Date(date);
      
      // Set time to start of day in local timezone
      targetDate.setHours(0, 0, 0, 0);
      const endDate = new Date(targetDate);
      endDate.setHours(23, 59, 59, 999);
      
      const bookings = await storage.getBookingsByBusinessId(parseInt(businessId), targetDate, endDate);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings for date:", error);
      res.status(500).json({ message: "Failed to fetch bookings for date" });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      // Mock admin stats - in real app, aggregate from database
      const stats = {
        totalUsers: 2847,
        totalBusinesses: 1429,
        totalBookings: 18543,
        totalRevenue: 284750,
        activeUsers: 1893,
        newSignups: 127,
        completedBookings: 16234,
        pendingBookings: 2309
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get('/api/admin/businesses', isAuthenticated, async (req: any, res) => {
    try {
      // Get all businesses for admin view
      const businesses = await storage.getAllBusinesses();
      res.json(businesses);
    } catch (error) {
      console.error("Error fetching businesses for admin:", error);
      res.status(500).json({ message: "Failed to fetch businesses" });
    }
  });

  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      // Get all users for admin view  
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users for admin:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch('/api/admin/businesses/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const business = await storage.updateBusinessStatus(parseInt(id), status);
      res.json(business);
    } catch (error) {
      console.error("Error updating business status:", error);
      res.status(500).json({ message: "Failed to update business status" });
    }
  });

  // Website builder routes
  app.post('/api/website-projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projectData = insertWebsiteProjectSchema.parse({
        ...req.body,
        userId
      });
      const project = await storage.createWebsiteProject(projectData);
      res.json(project);
    } catch (error) {
      console.error("Error creating website project:", error);
      res.status(400).json({ message: "Failed to create website project" });
    }
  });

  app.get('/api/website-projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getWebsiteProjectsByUserId(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching website projects:", error);
      res.status(500).json({ message: "Failed to fetch website projects" });
    }
  });

  app.get('/api/website-projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getWebsiteProjectById(parseInt(id));
      
      if (!project) {
        return res.status(404).json({ message: "Website project not found" });
      }

      res.json(project);
    } catch (error) {
      console.error("Error fetching website project:", error);
      res.status(500).json({ message: "Failed to fetch website project" });
    }
  });

  app.put('/api/website-projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const project = await storage.updateWebsiteProject(parseInt(id), updates);
      res.json(project);
    } catch (error) {
      console.error("Error updating website project:", error);
      res.status(500).json({ message: "Failed to update website project" });
    }
  });

  app.put('/api/website-projects/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status, replitUrl, deployedUrl } = req.body;
      const project = await storage.updateWebsiteProjectStatus(parseInt(id), status, replitUrl, deployedUrl);
      res.json(project);
    } catch (error) {
      console.error("Error updating website project status:", error);
      res.status(500).json({ message: "Failed to update website project status" });
    }
  });

  // Website template routes
  app.get('/api/website-templates', async (req, res) => {
    try {
      const templates = await storage.getWebsiteTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching website templates:", error);
      res.status(500).json({ message: "Failed to fetch website templates" });
    }
  });

  app.get('/api/website-templates/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getWebsiteTemplateById(parseInt(id));
      
      if (!template) {
        return res.status(404).json({ message: "Website template not found" });
      }

      res.json(template);
    } catch (error) {
      console.error("Error fetching website template:", error);
      res.status(500).json({ message: "Failed to fetch website template" });
    }
  });

  app.post('/api/website-templates', isAuthenticated, async (req, res) => {
    try {
      const templateData = insertWebsiteTemplateSchema.parse(req.body);
      const template = await storage.createWebsiteTemplate(templateData);
      res.json(template);
    } catch (error) {
      console.error("Error creating website template:", error);
      res.status(400).json({ message: "Failed to create website template" });
    }
  });

  // Platform admin routes
  app.get('/api/platform/stats', isAuthenticated, async (req: any, res) => {
    try {
      const businesses = await storage.getAllBusinesses();
      const users = await storage.getAllUsers();
      const activeBusinesses = businesses.filter(b => b.status === 'active');
      
      // Calculate platform statistics
      const totalRevenue = businesses.reduce((sum, b) => sum + parseFloat(b.monthlyRevenue?.toString() || '0'), 0);
      const totalCommissions = businesses.reduce((sum, b) => sum + parseFloat(b.commissionGenerated?.toString() || '0'), 0);
      const avgRevenuePerBusiness = totalRevenue / businesses.length || 0;
      
      // Get current month's new signups
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const newSignupsThisMonth = users.filter(u => {
        const userDate = new Date(u.createdAt || '');
        return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
      }).length;

      const stats = {
        totalRevenue,
        monthlyRecurringRevenue: totalRevenue,
        totalBusinesses: businesses.length,
        activeBusinesses: activeBusinesses.length,
        totalUsers: users.length,
        newSignupsThisMonth,
        websiteProjectsCompleted: 0, // TODO: Count from website_projects
        totalCommissions,
        avgRevenuePerBusiness,
        churnRate: ((businesses.length - activeBusinesses.length) / businesses.length * 100) || 0
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      res.status(500).json({ error: 'Failed to fetch platform stats' });
    }
  });

  app.get('/api/platform/businesses', isAuthenticated, async (req: any, res) => {
    try {
      const businesses = await storage.getAllBusinesses();
      const businessAccounts = businesses.map(business => ({
        id: business.id,
        name: business.name,
        businessType: business.businessType,
        email: business.email,
        phone: business.phone,
        address: business.address,
        status: business.status,
        subscriptionTier: business.subscriptionTier || 'Starter',
        monthlyRevenue: business.monthlyRevenue || 0,
        totalBookings: business.totalBookings || 0,
        createdAt: business.createdAt?.toISOString() || new Date().toISOString(),
        lastLogin: business.updatedAt?.toISOString() || new Date().toISOString(),
        websiteProjects: 0, // TODO: Count from website_projects
        commissionGenerated: business.commissionGenerated || 0
      }));
      res.json(businessAccounts);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      res.status(500).json({ error: 'Failed to fetch businesses' });
    }
  });

  app.patch('/api/platform/businesses/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['active', 'suspended', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const updatedBusiness = await storage.updateBusinessStatus(parseInt(id), status);
      res.json(updatedBusiness);
    } catch (error) {
      console.error('Error updating business status:', error);
      res.status(500).json({ error: 'Failed to update business status' });
    }
  });

  app.get('/api/weather', async (req, res) => {
    try {
      const city = (req.query.city as string) || 'London'; // Default city
      
      // Using free wttr.in service - no API key required
      const weatherResponse = await fetch(
        `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
        {
          headers: {
            'User-Agent': 'TimGrow-Platform/1.0'
          }
        }
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Weather API failed');
      }
      
      const weatherData = await weatherResponse.json();
      const current = weatherData.current_condition[0];
      
      res.json({
        temperature: parseInt(current.temp_C),
        description: current.weatherDesc[0].value.toLowerCase(),
        location: weatherData.nearest_area[0].areaName[0].value,
        humidity: parseInt(current.humidity),
        windSpeed: parseFloat(current.windspeedKmph),
        feelsLike: parseInt(current.FeelsLikeC)
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Return realistic default weather data
      res.json({
        temperature: 22,
        description: 'partly cloudy',
        location: 'London',
        humidity: 68,
        windSpeed: 8.5,
        feelsLike: 24
      });
    }
  });

  // AI Assistant for Business Insights
  app.post('/api/ai/insights', isAuthenticated, async (req: any, res) => {
    try {
      const { question, businessData } = req.body;
      
      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      // Get business context from database
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByUserId(userId);
      
      // Get analytics data (using existing dashboard analytics endpoint logic)
      const analytics = {
        monthlyRevenue: business?.monthlyRevenue || 0,
        weeklyBookings: 0, // This would come from bookings count
        totalClients: 0, // This would come from clients count
        avgRating: 0 // This would come from reviews average
      };
      
      // Prepare business context for AI
      const businessContext = {
        businessName: business?.name || 'Your Business',
        businessType: business?.businessType || 'Service Business',
        monthlyRevenue: analytics.monthlyRevenue || 0,
        weeklyBookings: analytics.weeklyBookings || 0,
        totalClients: analytics.totalClients || 0,
        avgRating: analytics.avgRating || 0,
        location: business?.address || 'N/A',
        ...businessData
      };

      // Create system prompt for business insights
      const systemPrompt = `You are a business consultant AI assistant for ${businessContext.businessName}, a ${businessContext.businessType}. 

Current business metrics:
- Monthly Revenue: $${businessContext.monthlyRevenue}
- Weekly Bookings: ${businessContext.weeklyBookings}
- Total Clients: ${businessContext.totalClients}
- Average Rating: ${businessContext.avgRating}/5
- Location: ${businessContext.location}

Provide actionable business insights, recommendations, and strategies. Be specific, practical, and data-driven. Focus on growth opportunities, operational improvements, and competitive advantages.`;

      // Call DeepSeek via OpenRouter
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://timgrow.com',
          'X-Title': 'Tim Grow Business Assistant'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I cannot provide insights at this time.';

      res.json({
        response: aiResponse,
        businessContext: businessContext
      });

    } catch (error) {
      console.error('Error getting AI insights:', error);
      res.status(500).json({ 
        error: 'Failed to get AI insights',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Client Authentication Routes
  app.post('/api/client/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      // Check if client already exists
      const existingClient = await storage.getClientByEmail(email);
      if (existingClient && existingClient.hasAccount) {
        return res.status(400).json({ message: 'Client already has an account' });
      }

      // Create or update client with account
      let client;
      if (existingClient) {
        client = await storage.updateClient(existingClient.id, {
          password,
          hasAccount: true,
          email,
          firstName,
          lastName,
          phone
        });
      } else {
        client = await storage.createClient({
          email,
          password,
          firstName,
          lastName,
          phone,
          hasAccount: true
        });
      }

      // Create session token
      const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

      await storage.createClientSession({
        clientId: client.id,
        token: sessionToken,
        expiresAt
      });

      res.json({
        client: {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone
        },
        token: sessionToken
      });
    } catch (error) {
      console.error("Error registering client:", error);
      res.status(500).json({ message: "Failed to register client" });
    }
  });

  app.post('/api/client/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const client = await storage.getClientByEmail(email);
      if (!client || !client.hasAccount || client.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Create new session token
      const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

      await storage.createClientSession({
        clientId: client.id,
        token: sessionToken,
        expiresAt
      });

      res.json({
        client: {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone
        },
        token: sessionToken
      });
    } catch (error) {
      console.error("Error logging in client:", error);
      res.status(500).json({ message: "Failed to login client" });
    }
  });

  app.post('/api/client/logout', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        await storage.deleteClientSession(token);
      }
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error("Error logging out client:", error);
      res.status(500).json({ message: "Failed to logout" });
    }
  });

  // Client middleware for authentication
  const authenticateClient = async (req: any, res: any, next: any) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const client = await storage.getClientBySessionToken(token);
      if (!client) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      req.client = client;
      next();
    } catch (error) {
      console.error("Error authenticating client:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  };

  // Client Dashboard Routes
  app.get('/api/client/me', authenticateClient, async (req: any, res) => {
    try {
      res.json(req.client);
    } catch (error) {
      console.error("Error fetching client profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.get('/api/client/bookings', authenticateClient, async (req: any, res) => {
    try {
      const bookings = await storage.getClientBookingsByClientId(req.client.id);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching client bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get('/api/client/bookings/upcoming', authenticateClient, async (req: any, res) => {
    try {
      const bookings = await storage.getClientUpcomingBookingsByClientId(req.client.id);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
      res.status(500).json({ message: "Failed to fetch upcoming bookings" });
    }
  });

  // Client Customization Routes (for businesses)
  app.get('/api/client-customization', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByUserId(userId);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const customization = await storage.getClientCustomizationByBusinessId(business.id);
      
      if (!customization) {
        // Return default customization
        const defaultCustomization = {
          businessId: business.id,
          primaryColor: "#10b981",
          secondaryColor: "#1e40af", 
          accentColor: "#f59e0b",
          backgroundColor: "#ffffff",
          textColor: "#111827",
          layoutStyle: "modern",
          showServices: true,
          showBookingHistory: true,
          showUpcomingBookings: true,
          showReviewsSection: true,
          showProfileSection: true,
          showNotifications: true,
          enableOnlineBooking: true,
          enableCancelBooking: true,
          enableRescheduleBooking: true,
          enablePaymentHistory: false,
          enableLoyaltyProgram: false,
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: true
        };
        return res.json(defaultCustomization);
      }

      res.json(customization);
    } catch (error) {
      console.error("Error fetching client customization:", error);
      res.status(500).json({ message: "Failed to fetch customization" });
    }
  });

  app.post('/api/client-customization', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByUserId(userId);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const customizationData = insertClientCustomizationSchema.parse({
        ...req.body,
        businessId: business.id
      });

      // Check if customization already exists
      const existing = await storage.getClientCustomizationByBusinessId(business.id);
      
      let customization;
      if (existing) {
        customization = await storage.updateClientCustomization(business.id, customizationData);
      } else {
        customization = await storage.createClientCustomization(customizationData);
      }

      res.json(customization);
    } catch (error) {
      console.error("Error saving client customization:", error);
      res.status(500).json({ message: "Failed to save customization" });
    }
  });

  app.put('/api/client-customization', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByUserId(userId);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const updates = req.body;
      const customization = await storage.updateClientCustomization(business.id, updates);
      res.json(customization);
    } catch (error) {
      console.error("Error updating client customization:", error);
      res.status(500).json({ message: "Failed to update customization" });
    }
  });

  // Get client customization by business slug (public route for client dashboard)
  app.get('/api/businesses/:slug/client-customization', async (req, res) => {
    try {
      const { slug } = req.params;
      const business = await storage.getBusinessBySlug(slug);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const customization = await storage.getClientCustomizationByBusinessId(business.id);
      
      if (!customization) {
        // Return default customization with business info
        const defaultCustomization = {
          businessId: business.id,
          businessName: business.name,
          businessType: business.businessType,
          primaryColor: "#10b981",
          secondaryColor: "#1e40af",
          accentColor: "#f59e0b",
          backgroundColor: "#ffffff",
          textColor: "#111827",
          layoutStyle: "modern",
          showServices: true,
          showBookingHistory: true,
          showUpcomingBookings: true,
          showReviewsSection: true,
          showProfileSection: true,
          showNotifications: true,
          enableOnlineBooking: true,
          enableCancelBooking: true,
          enableRescheduleBooking: true,
          enablePaymentHistory: false,
          enableLoyaltyProgram: false,
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: true
        };
        return res.json(defaultCustomization);
      }

      // Add business info to customization
      const customizationWithBusiness = {
        ...customization,
        businessName: business.name,
        businessType: business.businessType
      };

      res.json(customizationWithBusiness);
    } catch (error) {
      console.error("Error fetching client customization by slug:", error);
      res.status(500).json({ message: "Failed to fetch customization" });
    }
  });

  // ====== BUSINESS INTEGRATIONS ROUTES ======
  
  // Get all integrations for a business
  app.get('/api/integrations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const business = await storage.getBusinessByUserId(userId);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const integrations = await storage.getBusinessIntegrationsByBusinessId(business.id);
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  // Connect an integration
  app.post('/api/integrations/connect', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { integrationId, integrationName, configuration } = req.body;
      
      const business = await storage.getBusinessByUserId(userId);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      // Check if integration already exists
      const existing = await storage.getBusinessIntegrationByIdAndBusinessId(integrationId, business.id);
      if (existing) {
        // Update existing integration
        const updatedIntegration = await storage.updateBusinessIntegration(existing.id, {
          isConnected: true,
          status: 'active',
          configuration: configuration || {},
          lastSyncAt: new Date()
        });
        return res.json(updatedIntegration);
      }

      // Create new integration
      const integration = await storage.createBusinessIntegration({
        businessId: business.id,
        integrationId,
        integrationName,
        isConnected: true,
        configuration: configuration || {},
        status: 'active'
      });

      res.json(integration);
    } catch (error) {
      console.error("Error connecting integration:", error);
      res.status(500).json({ message: "Failed to connect integration" });
    }
  });

  // Disconnect an integration
  app.post('/api/integrations/disconnect', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { integrationId } = req.body;
      
      const business = await storage.getBusinessByUserId(userId);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const integration = await storage.getBusinessIntegrationByIdAndBusinessId(integrationId, business.id);
      if (!integration) {
        return res.status(404).json({ message: "Integration not found" });
      }

      const updatedIntegration = await storage.updateBusinessIntegration(integration.id, {
        isConnected: false,
        status: 'inactive'
      });

      res.json(updatedIntegration);
    } catch (error) {
      console.error("Error disconnecting integration:", error);
      res.status(500).json({ message: "Failed to disconnect integration" });
    }
  });

  // Toggle integration status
  app.post('/api/integrations/:id/toggle', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const business = await storage.getBusinessByUserId(userId);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const integration = await storage.toggleBusinessIntegrationStatus(parseInt(id));
      res.json(integration);
    } catch (error) {
      console.error("Error toggling integration:", error);
      res.status(500).json({ message: "Failed to toggle integration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
