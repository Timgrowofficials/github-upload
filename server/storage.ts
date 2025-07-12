import {
  users,
  businesses,
  services,
  clients,
  bookings,
  reviews,
  availability,
  teamMembers,
  websiteProjects,
  websiteTemplates,
  notifications,
  pushSubscriptions,
  clientSessions,
  clientCustomizations,
  businessIntegrations,
  type User,
  type UpsertUser,
  type Business,
  type Service,
  type Client,
  type Booking,
  type Review,
  type Availability,
  type TeamMember,
  type WebsiteProject,
  type WebsiteTemplate,
  type ClientSession,
  type ClientCustomization,
  type BusinessIntegration,
  type InsertBusiness,
  type InsertService,
  type InsertClient,
  type InsertBooking,
  type InsertReview,
  type InsertAvailability,
  type InsertTeamMember,
  type InsertWebsiteProject,
  type InsertWebsiteTemplate,
  type InsertClientSession,
  type InsertClientCustomization,
  type InsertBusinessIntegration,
  type Notification,
  type InsertNotification,
  type PushSubscription,
  type InsertPushSubscription,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc, count } from "drizzle-orm";

export interface IStorage {
  // User operations - required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Business operations
  createBusiness(business: InsertBusiness): Promise<Business>;
  getBusinessByUserId(userId: string): Promise<Business | undefined>;
  getBusinessBySlug(slug: string): Promise<Business | undefined>;
  updateBusiness(id: number, updates: Partial<InsertBusiness>): Promise<Business>;
  
  // Service operations
  createService(service: InsertService): Promise<Service>;
  getServicesByBusinessId(businessId: number): Promise<Service[]>;
  updateService(id: number, updates: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;
  
  // Client operations
  createClient(client: InsertClient): Promise<Client>;
  getClientByPhone(phone: string): Promise<Client | undefined>;
  getClientsByBusinessId(businessId: number): Promise<Client[]>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  getClientById(id: number): Promise<Client | undefined>;
  updateClient(id: number, updates: Partial<InsertClient>): Promise<Client>;
  
  // Client authentication operations
  createClientSession(session: InsertClientSession): Promise<ClientSession>;
  getClientSessionByToken(token: string): Promise<ClientSession | undefined>;
  deleteClientSession(token: string): Promise<void>;
  getClientBySessionToken(token: string): Promise<Client | undefined>;
  
  // Client customization operations
  createClientCustomization(customization: InsertClientCustomization): Promise<ClientCustomization>;
  getClientCustomizationByBusinessId(businessId: number): Promise<ClientCustomization | undefined>;
  updateClientCustomization(businessId: number, updates: Partial<InsertClientCustomization>): Promise<ClientCustomization>;
  deleteClientCustomization(businessId: number): Promise<void>;
  
  // Client dashboard operations
  getClientBookingsByClientId(clientId: number): Promise<Booking[]>;
  getClientUpcomingBookingsByClientId(clientId: number): Promise<Booking[]>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByBusinessId(businessId: number, startDate?: Date, endDate?: Date): Promise<Booking[]>;
  getBookingsByDate(businessId: number, date: Date): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByBusinessId(businessId: number): Promise<Review[]>;
  
  // Team operations
  createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  getTeamMembersByBusinessId(businessId: number): Promise<TeamMember[]>;
  updateTeamMember(id: number, updates: Partial<InsertTeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: number): Promise<void>;
  
  // Availability operations
  setAvailability(availability: InsertAvailability[]): Promise<Availability[]>;
  getAvailabilityByBusinessId(businessId: number): Promise<Availability[]>;
  
  // Admin operations
  getAllBusinesses(): Promise<Business[]>;
  getAllUsers(): Promise<User[]>;
  updateBusinessStatus(id: number, status: string): Promise<Business>;
  
  // Website builder operations
  createWebsiteProject(project: InsertWebsiteProject): Promise<WebsiteProject>;
  getWebsiteProjectsByUserId(userId: string): Promise<WebsiteProject[]>;
  getWebsiteProjectById(id: number): Promise<WebsiteProject | undefined>;
  updateWebsiteProject(id: number, updates: Partial<InsertWebsiteProject>): Promise<WebsiteProject>;
  updateWebsiteProjectStatus(id: number, status: string, replitUrl?: string, deployedUrl?: string): Promise<WebsiteProject>;
  
  // Website template operations
  getWebsiteTemplates(): Promise<WebsiteTemplate[]>;
  getWebsiteTemplateById(id: number): Promise<WebsiteTemplate | undefined>;
  createWebsiteTemplate(template: InsertWebsiteTemplate): Promise<WebsiteTemplate>;
  updateWebsiteTemplate(id: number, updates: Partial<InsertWebsiteTemplate>): Promise<WebsiteTemplate>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByBusinessId(businessId: number, limit?: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<Notification>;
  markAllNotificationsAsRead(businessId: number): Promise<void>;
  deleteNotification(id: number): Promise<void>;
  getUnreadNotificationCount(businessId: number): Promise<number>;
  
  // Push subscription operations
  createPushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription>;
  getPushSubscriptionsByUserId(userId: string): Promise<PushSubscription[]>;
  getPushSubscriptionsByBusinessId(businessId: number): Promise<PushSubscription[]>;
  deletePushSubscription(id: number): Promise<void>;
  updatePushSubscriptionLastUsed(id: number): Promise<void>;
  
  // Business integration operations
  createBusinessIntegration(integration: InsertBusinessIntegration): Promise<BusinessIntegration>;
  getBusinessIntegrationsByBusinessId(businessId: number): Promise<BusinessIntegration[]>;
  getBusinessIntegrationByIdAndBusinessId(integrationId: string, businessId: number): Promise<BusinessIntegration | undefined>;
  updateBusinessIntegration(id: number, updates: Partial<InsertBusinessIntegration>): Promise<BusinessIntegration>;
  deleteBusinessIntegration(id: number): Promise<void>;
  toggleBusinessIntegrationStatus(id: number): Promise<BusinessIntegration>;
}

export class DatabaseStorage implements IStorage {
  // User operations - required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Business operations
  async createBusiness(businessData: InsertBusiness): Promise<Business> {
    const [business] = await db
      .insert(businesses)
      .values(businessData)
      .returning();
    return business;
  }

  async getBusinessByUserId(userId: string): Promise<Business | undefined> {
    const [business] = await db
      .select()
      .from(businesses)
      .where(eq(businesses.userId, userId));
    return business;
  }

  async getBusinessBySlug(slug: string): Promise<Business | undefined> {
    const [business] = await db
      .select()
      .from(businesses)
      .where(eq(businesses.slug, slug));
    return business;
  }

  async updateBusiness(id: number, updates: Partial<InsertBusiness>): Promise<Business> {
    const [business] = await db
      .update(businesses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(businesses.id, id))
      .returning();
    return business;
  }

  // Service operations
  async createService(serviceData: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values(serviceData)
      .returning();
    return service;
  }

  async getServicesByBusinessId(businessId: number): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(and(eq(services.businessId, businessId), eq(services.isActive, true)))
      .orderBy(asc(services.name));
  }

  async updateService(id: number, updates: Partial<InsertService>): Promise<Service> {
    const [service] = await db
      .update(services)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: number): Promise<void> {
    await db
      .update(services)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(services.id, id));
  }

  // Client operations
  async createClient(clientData: InsertClient): Promise<Client> {
    const [client] = await db
      .insert(clients)
      .values(clientData)
      .returning();
    return client;
  }

  async getClientByPhone(phone: string): Promise<Client | undefined> {
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.phone, phone));
    return client;
  }

  async getClientsByBusinessId(businessId: number): Promise<Client[]> {
    return await db
      .select({
        id: clients.id,
        firstName: clients.firstName,
        lastName: clients.lastName,
        phone: clients.phone,
        email: clients.email,
        createdAt: clients.createdAt,
      })
      .from(clients)
      .innerJoin(bookings, eq(bookings.clientId, clients.id))
      .where(eq(bookings.businessId, businessId))
      .groupBy(clients.id)
      .orderBy(desc(clients.createdAt));
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.email, email));
    return client;
  }

  async getClientById(id: number): Promise<Client | undefined> {
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id));
    return client;
  }

  async updateClient(id: number, updates: Partial<InsertClient>): Promise<Client> {
    const [client] = await db
      .update(clients)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return client;
  }

  // Client authentication operations
  async createClientSession(sessionData: InsertClientSession): Promise<ClientSession> {
    const [session] = await db
      .insert(clientSessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async getClientSessionByToken(token: string): Promise<ClientSession | undefined> {
    const [session] = await db
      .select()
      .from(clientSessions)
      .where(eq(clientSessions.token, token));
    return session;
  }

  async deleteClientSession(token: string): Promise<void> {
    await db
      .delete(clientSessions)
      .where(eq(clientSessions.token, token));
  }

  async getClientBySessionToken(token: string): Promise<Client | undefined> {
    const result = await db
      .select({
        id: clients.id,
        firstName: clients.firstName,
        lastName: clients.lastName,
        phone: clients.phone,
        email: clients.email,
        hasAccount: clients.hasAccount,
        profileImageUrl: clients.profileImageUrl,
        dateOfBirth: clients.dateOfBirth,
        notes: clients.notes,
        preferences: clients.preferences,
        createdAt: clients.createdAt,
        updatedAt: clients.updatedAt,
      })
      .from(clients)
      .innerJoin(clientSessions, eq(clientSessions.clientId, clients.id))
      .where(eq(clientSessions.token, token))
      .limit(1);
    
    return result[0] || undefined;
  }

  // Client customization operations
  async createClientCustomization(customizationData: InsertClientCustomization): Promise<ClientCustomization> {
    const [customization] = await db
      .insert(clientCustomizations)
      .values(customizationData)
      .returning();
    return customization;
  }

  async getClientCustomizationByBusinessId(businessId: number): Promise<ClientCustomization | undefined> {
    const [customization] = await db
      .select()
      .from(clientCustomizations)
      .where(eq(clientCustomizations.businessId, businessId));
    return customization;
  }

  async updateClientCustomization(businessId: number, updates: Partial<InsertClientCustomization>): Promise<ClientCustomization> {
    const [customization] = await db
      .update(clientCustomizations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(clientCustomizations.businessId, businessId))
      .returning();
    return customization;
  }

  async deleteClientCustomization(businessId: number): Promise<void> {
    await db
      .delete(clientCustomizations)
      .where(eq(clientCustomizations.businessId, businessId));
  }

  // Client dashboard operations
  async getClientBookingsByClientId(clientId: number): Promise<Booking[]> {
    return await db
      .select({
        id: bookings.id,
        businessId: bookings.businessId,
        serviceId: bookings.serviceId,
        clientId: bookings.clientId,
        teamMemberId: bookings.teamMemberId,
        appointmentDate: bookings.appointmentDate,
        status: bookings.status,
        notes: bookings.notes,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        service: {
          name: services.name,
          price: services.price,
          duration: services.duration,
        },
        business: {
          name: businesses.name,
          phone: businesses.phone,
          email: businesses.email,
          address: businesses.address,
        },
      })
      .from(bookings)
      .innerJoin(services, eq(bookings.serviceId, services.id))
      .innerJoin(businesses, eq(bookings.businessId, businesses.id))
      .where(eq(bookings.clientId, clientId))
      .orderBy(desc(bookings.appointmentDate));
  }

  async getClientUpcomingBookingsByClientId(clientId: number): Promise<Booking[]> {
    const now = new Date();
    return await db
      .select({
        id: bookings.id,
        businessId: bookings.businessId,
        serviceId: bookings.serviceId,
        clientId: bookings.clientId,
        teamMemberId: bookings.teamMemberId,
        appointmentDate: bookings.appointmentDate,
        status: bookings.status,
        notes: bookings.notes,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        service: {
          name: services.name,
          price: services.price,
          duration: services.duration,
        },
        business: {
          name: businesses.name,
          phone: businesses.phone,
          email: businesses.email,
          address: businesses.address,
        },
      })
      .from(bookings)
      .innerJoin(services, eq(bookings.serviceId, services.id))
      .innerJoin(businesses, eq(bookings.businessId, businesses.id))
      .where(
        and(
          eq(bookings.clientId, clientId),
          gte(bookings.appointmentDate, now)
        )
      )
      .orderBy(asc(bookings.appointmentDate));
  }

  // Booking operations
  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values(bookingData)
      .returning();
    return booking;
  }

  async getBookingsByBusinessId(businessId: number, startDate?: Date, endDate?: Date): Promise<any[]> {
    let whereConditions = [eq(bookings.businessId, businessId)];
    
    if (startDate && endDate) {
      whereConditions.push(
        gte(bookings.appointmentDate, startDate),
        lte(bookings.appointmentDate, endDate)
      );
    }

    const query = db
      .select({
        id: bookings.id,
        businessId: bookings.businessId,
        serviceId: bookings.serviceId,
        clientId: bookings.clientId,
        teamMemberId: bookings.teamMemberId,
        appointmentDate: bookings.appointmentDate,
        status: bookings.status,
        notes: bookings.notes,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        service: {
          name: services.name,
          price: services.price,
          duration: services.duration,
        },
        client: {
          firstName: clients.firstName,
          lastName: clients.lastName,
          phone: clients.phone,
          email: clients.email,
        },
      })
      .from(bookings)
      .innerJoin(services, eq(bookings.serviceId, services.id))
      .innerJoin(clients, eq(bookings.clientId, clients.id))
      .where(and(...whereConditions));

    return await query.orderBy(asc(bookings.appointmentDate));
  }

  async getBookingsByDate(businessId: number, date: Date): Promise<Booking[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.getBookingsByBusinessId(businessId, startOfDay, endOfDay);
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const [booking] = await db
      .update(bookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Review operations
  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(reviewData)
      .returning();
    return review;
  }

  async getReviewsByBusinessId(businessId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.businessId, businessId))
      .orderBy(desc(reviews.createdAt));
  }

  // Availability operations
  async setAvailability(availabilityData: InsertAvailability[]): Promise<Availability[]> {
    if (availabilityData.length === 0) return [];
    
    const businessId = availabilityData[0].businessId;
    
    // Clear existing availability
    await db
      .update(availability)
      .set({ isActive: false })
      .where(eq(availability.businessId, businessId));

    // Insert new availability
    const insertedAvailability = await db
      .insert(availability)
      .values(availabilityData)
      .returning();

    return insertedAvailability;
  }

  async getAvailabilityByBusinessId(businessId: number): Promise<Availability[]> {
    return await db
      .select()
      .from(availability)
      .where(and(eq(availability.businessId, businessId), eq(availability.isActive, true)))
      .orderBy(asc(availability.dayOfWeek), asc(availability.startTime));
  }

  // Team operations
  async createTeamMember(teamMemberData: InsertTeamMember): Promise<TeamMember> {
    const [teamMember] = await db
      .insert(teamMembers)
      .values(teamMemberData)
      .returning();
    return teamMember;
  }

  async getTeamMembersByBusinessId(businessId: number): Promise<TeamMember[]> {
    return await db
      .select()
      .from(teamMembers)
      .where(and(eq(teamMembers.businessId, businessId), eq(teamMembers.isActive, true)))
      .orderBy(asc(teamMembers.name));
  }

  async updateTeamMember(id: number, updates: Partial<InsertTeamMember>): Promise<TeamMember> {
    const [teamMember] = await db
      .update(teamMembers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(teamMembers.id, id))
      .returning();
    return teamMember;
  }

  async deleteTeamMember(id: number): Promise<void> {
    await db
      .update(teamMembers)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(teamMembers.id, id));
  }

  // Admin operations
  async getAllBusinesses(): Promise<Business[]> {
    const businessList = await db.select().from(businesses).orderBy(businesses.createdAt);
    return businessList;
  }

  async getAllUsers(): Promise<User[]> {
    const userList = await db.select().from(users).orderBy(users.createdAt);
    return userList;
  }

  async updateBusinessStatus(id: number, status: string): Promise<Business> {
    const [business] = await db
      .update(businesses)
      .set({ updatedAt: new Date() })
      .where(eq(businesses.id, id))
      .returning();
    return business;
  }

  // Website builder operations
  async createWebsiteProject(projectData: InsertWebsiteProject): Promise<WebsiteProject> {
    const [project] = await db
      .insert(websiteProjects)
      .values(projectData)
      .returning();
    return project;
  }

  async getWebsiteProjectsByUserId(userId: string): Promise<WebsiteProject[]> {
    return await db
      .select()
      .from(websiteProjects)
      .where(eq(websiteProjects.userId, userId))
      .orderBy(desc(websiteProjects.createdAt));
  }

  async getWebsiteProjectById(id: number): Promise<WebsiteProject | undefined> {
    const [project] = await db
      .select()
      .from(websiteProjects)
      .where(eq(websiteProjects.id, id));
    return project;
  }

  async updateWebsiteProject(id: number, updates: Partial<InsertWebsiteProject>): Promise<WebsiteProject> {
    const [project] = await db
      .update(websiteProjects)
      .set(updates)
      .where(eq(websiteProjects.id, id))
      .returning();
    return project;
  }

  async updateWebsiteProjectStatus(id: number, status: string, replitUrl?: string, deployedUrl?: string): Promise<WebsiteProject> {
    const updateData: any = { status };
    if (replitUrl) updateData.replitUrl = replitUrl;
    if (deployedUrl) updateData.deployedUrl = deployedUrl;
    if (status === 'completed') updateData.completedAt = new Date();

    const [project] = await db
      .update(websiteProjects)
      .set(updateData)
      .where(eq(websiteProjects.id, id))
      .returning();
    return project;
  }

  // Website template operations
  async getWebsiteTemplates(): Promise<WebsiteTemplate[]> {
    return await db
      .select()
      .from(websiteTemplates)
      .where(eq(websiteTemplates.isActive, true))
      .orderBy(asc(websiteTemplates.name));
  }

  async getWebsiteTemplateById(id: number): Promise<WebsiteTemplate | undefined> {
    const [template] = await db
      .select()
      .from(websiteTemplates)
      .where(eq(websiteTemplates.id, id));
    return template;
  }

  async createWebsiteTemplate(templateData: InsertWebsiteTemplate): Promise<WebsiteTemplate> {
    const [template] = await db
      .insert(websiteTemplates)
      .values(templateData)
      .returning();
    return template;
  }

  async updateWebsiteTemplate(id: number, updates: Partial<InsertWebsiteTemplate>): Promise<WebsiteTemplate> {
    const [template] = await db
      .update(websiteTemplates)
      .set(updates)
      .where(eq(websiteTemplates.id, id))
      .returning();
    return template;
  }

  // Notification operations
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }

  async getNotificationsByBusinessId(businessId: number, limit = 50): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.businessId, businessId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const [notification] = await db
      .update(notifications)
      .set({ read: true, updatedAt: new Date() })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }

  async markAllNotificationsAsRead(businessId: number): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true, updatedAt: new Date() })
      .where(and(eq(notifications.businessId, businessId), eq(notifications.read, false)));
  }

  async deleteNotification(id: number): Promise<void> {
    await db
      .delete(notifications)
      .where(eq(notifications.id, id));
  }

  async getUnreadNotificationCount(businessId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(notifications)
      .where(and(eq(notifications.businessId, businessId), eq(notifications.read, false)));
    return result.count;
  }

  // Push subscription operations
  async createPushSubscription(subscriptionData: InsertPushSubscription): Promise<PushSubscription> {
    const [subscription] = await db
      .insert(pushSubscriptions)
      .values(subscriptionData)
      .returning();
    return subscription;
  }

  async getPushSubscriptionsByUserId(userId: string): Promise<PushSubscription[]> {
    return await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, userId));
  }

  async getPushSubscriptionsByBusinessId(businessId: number): Promise<PushSubscription[]> {
    return await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.businessId, businessId));
  }

  async deletePushSubscription(id: number): Promise<void> {
    await db
      .delete(pushSubscriptions)
      .where(eq(pushSubscriptions.id, id));
  }

  async updatePushSubscriptionLastUsed(id: number): Promise<void> {
    await db
      .update(pushSubscriptions)
      .set({ lastUsed: new Date() })
      .where(eq(pushSubscriptions.id, id));
  }

  // Business integration operations
  async createBusinessIntegration(integrationData: InsertBusinessIntegration): Promise<BusinessIntegration> {
    const [integration] = await db
      .insert(businessIntegrations)
      .values(integrationData)
      .returning();
    return integration;
  }

  async getBusinessIntegrationsByBusinessId(businessId: number): Promise<BusinessIntegration[]> {
    return await db
      .select()
      .from(businessIntegrations)
      .where(eq(businessIntegrations.businessId, businessId))
      .orderBy(asc(businessIntegrations.integrationName));
  }

  async getBusinessIntegrationByIdAndBusinessId(integrationId: string, businessId: number): Promise<BusinessIntegration | undefined> {
    const [integration] = await db
      .select()
      .from(businessIntegrations)
      .where(and(eq(businessIntegrations.integrationId, integrationId), eq(businessIntegrations.businessId, businessId)));
    return integration;
  }

  async updateBusinessIntegration(id: number, updates: Partial<InsertBusinessIntegration>): Promise<BusinessIntegration> {
    const [integration] = await db
      .update(businessIntegrations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(businessIntegrations.id, id))
      .returning();
    return integration;
  }

  async deleteBusinessIntegration(id: number): Promise<void> {
    await db
      .delete(businessIntegrations)
      .where(eq(businessIntegrations.id, id));
  }

  async toggleBusinessIntegrationStatus(id: number): Promise<BusinessIntegration> {
    const integration = await db
      .select()
      .from(businessIntegrations)
      .where(eq(businessIntegrations.id, id))
      .limit(1);
    
    if (!integration[0]) {
      throw new Error('Integration not found');
    }

    const [updatedIntegration] = await db
      .update(businessIntegrations)
      .set({ 
        isConnected: !integration[0].isConnected, 
        status: integration[0].isConnected ? 'inactive' : 'active',
        updatedAt: new Date() 
      })
      .where(eq(businessIntegrations.id, id))
      .returning();
    
    return updatedIntegration;
  }
}

export const storage = new DatabaseStorage();
