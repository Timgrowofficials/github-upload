import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  time,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business profiles
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  description: text("description"),
  businessType: varchar("business_type").notNull(),
  phone: varchar("phone"),
  email: varchar("email"),
  address: text("address"),
  slug: varchar("slug").unique().notNull(),
  isActive: boolean("is_active").default(true),
  status: varchar("status").default("active"), // active, suspended, cancelled, trial
  subscriptionTier: varchar("subscription_tier").default("starter"), // starter, business, premium
  monthlyRevenue: decimal("monthly_revenue", { precision: 10, scale: 2 }).default("0"),
  totalBookings: integer("total_bookings").default(0),
  commissionGenerated: decimal("commission_generated", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services offered by businesses
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  name: varchar("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration: integer("duration").notNull(), // in minutes
  imageUrl: varchar("image_url"), // Service photo
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team members
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  name: varchar("name").notNull(),
  email: varchar("email"),
  phone: varchar("phone"),
  role: varchar("role").notNull().default("staff"), // owner, manager, staff
  specialties: text("specialties").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business availability schedules (updated to support team member schedules)
export const availability = pgTable("availability", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  teamMemberId: integer("team_member_id").references(() => teamMembers.id), // null for business-wide availability
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isActive: boolean("is_active").default(true),
});

// Time off/breaks for team members
export const timeOff = pgTable("time_off", {
  id: serial("id").primaryKey(),
  teamMemberId: integer("team_member_id").notNull().references(() => teamMembers.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: varchar("reason"), // vacation, sick, break, etc.
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Client information
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  phone: varchar("phone").notNull(),
  email: varchar("email"),
  password: varchar("password"), // For client authentication
  hasAccount: boolean("has_account").default(false),
  profileImageUrl: varchar("profile_image_url"),
  dateOfBirth: timestamp("date_of_birth"),
  notes: text("notes"),
  preferences: jsonb("preferences"), // Client preferences like notifications, language, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Client sessions for authentication
export const clientSessions = pgTable("client_sessions", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Client dashboard customizations per business
export const clientCustomizations = pgTable("client_customizations", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  
  // Branding customizations
  logoUrl: varchar("logo_url"),
  bannerUrl: varchar("banner_url"),
  primaryColor: varchar("primary_color").default("#10b981"), // Default Tim Grow green
  secondaryColor: varchar("secondary_color").default("#1e40af"), // Default Tim Grow navy
  accentColor: varchar("accent_color").default("#f59e0b"), // Default Tim Grow amber
  backgroundColor: varchar("background_color").default("#ffffff"),
  textColor: varchar("text_color").default("#111827"),
  
  // Layout customizations
  layoutStyle: varchar("layout_style").default("modern"), // modern, minimal, classic
  showServices: boolean("show_services").default(true),
  showBookingHistory: boolean("show_booking_history").default(true),
  showUpcomingBookings: boolean("show_upcoming_bookings").default(true),
  showReviewsSection: boolean("show_reviews_section").default(true),
  showProfileSection: boolean("show_profile_section").default(true),
  showNotifications: boolean("show_notifications").default(true),
  
  // Content customizations
  welcomeMessage: text("welcome_message"),
  footerText: text("footer_text"),
  businessDescription: text("business_description"),
  contactInfo: jsonb("contact_info"),
  
  // Feature toggles
  enableOnlineBooking: boolean("enable_online_booking").default(true),
  enableCancelBooking: boolean("enable_cancel_booking").default(true),
  enableRescheduleBooking: boolean("enable_reschedule_booking").default(true),
  enablePaymentHistory: boolean("enable_payment_history").default(false),
  enableLoyaltyProgram: boolean("enable_loyalty_program").default(false),
  
  // Notification settings
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business integrations - tracks connected third-party services
export const businessIntegrations = pgTable("business_integrations", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  integrationId: varchar("integration_id").notNull(), // e.g., 'stripe', 'mailchimp', 'twilio'
  integrationName: varchar("integration_name").notNull(), // Display name
  isConnected: boolean("is_connected").default(true),
  configuration: jsonb("configuration"), // Store API keys, settings, etc.
  connectedAt: timestamp("connected_at").defaultNow(),
  lastSyncAt: timestamp("last_sync_at"),
  status: varchar("status").default("active"), // active, inactive, error
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings/appointments
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  clientId: integer("client_id").notNull().references(() => clients.id),
  teamMemberId: integer("team_member_id").references(() => teamMembers.id), // optional assignment to specific team member
  appointmentDate: timestamp("appointment_date").notNull(),
  status: varchar("status").notNull().default("confirmed"), // confirmed, completed, cancelled, no_show
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews and ratings
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  bookingId: integer("booking_id").references(() => bookings.id),
  clientName: varchar("client_name").notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Website builder projects
export const websiteProjects = pgTable("website_projects", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  businessId: integer("business_id").references(() => businesses.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  businessType: text("business_type").notNull(),
  requirements: text("requirements").notNull(),
  status: text("status").default("pending").notNull(), // pending, in_progress, completed, failed
  replitUrl: text("replit_url"),
  deployedUrl: text("deployed_url"),
  commission: decimal("commission", { precision: 10, scale: 2 }).default("0.00"),
  pricing: decimal("pricing", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Website templates
export const websiteTemplates = pgTable("website_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  features: text("features").array(),
  pricing: decimal("pricing", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => businesses.id),
  type: text("type").notNull(), // "booking", "payment", "review", "reminder", "system", "message"
  title: text("title").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull().default("medium"), // "low", "medium", "high"
  read: boolean("read").notNull().default(false),
  actionUrl: text("action_url"),
  data: jsonb("data"), // Additional data payload
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Push subscriptions for web push notifications
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  businessId: integer("business_id").references(() => businesses.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
  lastUsed: timestamp("last_used").defaultNow(),
});

// Relations
export const businessRelations = relations(businesses, ({ one, many }) => ({
  user: one(users, {
    fields: [businesses.userId],
    references: [users.id],
  }),
  services: many(services),
  bookings: many(bookings),
  availability: many(availability),
  reviews: many(reviews),
  teamMembers: many(teamMembers),
  integrations: many(businessIntegrations),
}));

export const teamMemberRelations = relations(teamMembers, ({ one, many }) => ({
  business: one(businesses, {
    fields: [teamMembers.businessId],
    references: [businesses.id],
  }),
  bookings: many(bookings),
  availability: many(availability),
  timeOff: many(timeOff),
}));

export const serviceRelations = relations(services, ({ one, many }) => ({
  business: one(businesses, {
    fields: [services.businessId],
    references: [businesses.id],
  }),
  bookings: many(bookings),
}));

export const clientRelations = relations(clients, ({ many }) => ({
  bookings: many(bookings),
  sessions: many(clientSessions),
}));

export const clientSessionRelations = relations(clientSessions, ({ one }) => ({
  client: one(clients, {
    fields: [clientSessions.clientId],
    references: [clients.id],
  }),
}));

export const clientCustomizationRelations = relations(clientCustomizations, ({ one }) => ({
  business: one(businesses, {
    fields: [clientCustomizations.businessId],
    references: [businesses.id],
  }),
}));

export const businessIntegrationRelations = relations(businessIntegrations, ({ one }) => ({
  business: one(businesses, {
    fields: [businessIntegrations.businessId],
    references: [businesses.id],
  }),
}));

export const bookingRelations = relations(bookings, ({ one }) => ({
  business: one(businesses, {
    fields: [bookings.businessId],
    references: [businesses.id],
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
  client: one(clients, {
    fields: [bookings.clientId],
    references: [clients.id],
  }),
  teamMember: one(teamMembers, {
    fields: [bookings.teamMemberId],
    references: [teamMembers.id],
  }),
}));

export const reviewRelations = relations(reviews, ({ one }) => ({
  business: one(businesses, {
    fields: [reviews.businessId],
    references: [businesses.id],
  }),
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
}));

export const availabilityRelations = relations(availability, ({ one }) => ({
  business: one(businesses, {
    fields: [availability.businessId],
    references: [businesses.id],
  }),
  teamMember: one(teamMembers, {
    fields: [availability.teamMemberId],
    references: [teamMembers.id],
  }),
}));

export const timeOffRelations = relations(timeOff, ({ one }) => ({
  teamMember: one(teamMembers, {
    fields: [timeOff.teamMemberId],
    references: [teamMembers.id],
  }),
}));

export const websiteProjectRelations = relations(websiteProjects, ({ one }) => ({
  user: one(users, {
    fields: [websiteProjects.userId],
    references: [users.id],
  }),
  business: one(businesses, {
    fields: [websiteProjects.businessId],
    references: [businesses.id],
  }),
}));

export const notificationRelations = relations(notifications, ({ one }) => ({
  business: one(businesses, {
    fields: [notifications.businessId],
    references: [businesses.id],
  }),
}));

export const pushSubscriptionRelations = relations(pushSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [pushSubscriptions.userId],
    references: [users.id],
  }),
  business: one(businesses, {
    fields: [pushSubscriptions.businessId],
    references: [businesses.id],
  }),
}));

// Insert schemas
export const insertBusinessSchema = createInsertSchema(businesses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertAvailabilitySchema = createInsertSchema(availability).omit({
  id: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTimeOffSchema = createInsertSchema(timeOff).omit({
  id: true,
  createdAt: true,
});

export const insertWebsiteProjectSchema = createInsertSchema(websiteProjects).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertWebsiteTemplateSchema = createInsertSchema(websiteTemplates).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPushSubscriptionSchema = createInsertSchema(pushSubscriptions).omit({
  id: true,
  createdAt: true,
  lastUsed: true,
});

export const insertClientSessionSchema = createInsertSchema(clientSessions).omit({
  id: true,
  createdAt: true,
});

export const insertClientCustomizationSchema = createInsertSchema(clientCustomizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBusinessIntegrationSchema = createInsertSchema(businessIntegrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const upsertUserSchema = createInsertSchema(users);

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Business = typeof businesses.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Availability = typeof availability.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type TimeOff = typeof timeOff.$inferSelect;
export type WebsiteProject = typeof websiteProjects.$inferSelect;
export type WebsiteTemplate = typeof websiteTemplates.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type ClientSession = typeof clientSessions.$inferSelect;
export type ClientCustomization = typeof clientCustomizations.$inferSelect;
export type BusinessIntegration = typeof businessIntegrations.$inferSelect;

export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type InsertTimeOff = z.infer<typeof insertTimeOffSchema>;
export type InsertWebsiteProject = z.infer<typeof insertWebsiteProjectSchema>;
export type InsertWebsiteTemplate = z.infer<typeof insertWebsiteTemplateSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertPushSubscription = z.infer<typeof insertPushSubscriptionSchema>;
export type InsertClientSession = z.infer<typeof insertClientSessionSchema>;
export type InsertClientCustomization = z.infer<typeof insertClientCustomizationSchema>;
export type InsertBusinessIntegration = z.infer<typeof insertBusinessIntegrationSchema>;
