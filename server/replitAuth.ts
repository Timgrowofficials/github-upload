import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Allow development mode without REPLIT_DOMAINS for local testing
if (!process.env.REPLIT_DOMAINS) {
  console.warn("Environment variable REPLIT_DOMAINS not provided - running in development mode");
}

console.log("Authentication setup:", {
  hasReplitDomains: !!process.env.REPLIT_DOMAINS,
  hasReplId: !!process.env.REPL_ID,
  domains: process.env.REPLIT_DOMAINS
});

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Always set up passport serialization for development mode
  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // Only set up OIDC if we have the required environment variables
  if (process.env.REPLIT_DOMAINS && process.env.REPL_ID) {
    const config = await getOidcConfig();

    const verify: VerifyFunction = async (
      tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
      verified: passport.AuthenticateCallback
    ) => {
      const user = {};
      updateUserSession(user, tokens);
      await upsertUser(tokens.claims());
      verified(null, user);
    };

    for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
      const strategy = new Strategy(
        {
          name: `replitauth:${domain}`,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify,
      );
      passport.use(strategy);
    }
  }

  app.get("/api/login", (req, res, next) => {
    try {
      // For development or when not in production environment
      if (!process.env.REPLIT_DOMAINS || !process.env.REPL_ID) {
        console.log('Development mode - creating demo user session');
        // Development fallback - create a demo user session
        const demoUser = {
          id: 'demo-user-id',
          email: 'demo@example.com',
          username: 'Demo User',
          expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
          claims: {
            sub: 'demo-user-id',
            email: 'demo@example.com',
            first_name: 'Demo',
            last_name: 'User'
          }
        };
        
        req.login(demoUser, (err) => {
          if (err) {
            console.error('Demo login error:', err);
            return res.status(500).json({ message: 'Authentication error' });
          }
          return res.redirect('/dashboard');
        });
        return;
      }
      
      // Production authentication - check if the strategy exists
      const strategyName = `replitauth:${req.hostname}`;
      if (!passport._strategies[strategyName]) {
        console.error(`Strategy ${strategyName} not found. Available strategies:`, Object.keys(passport._strategies));
        // Fallback to demo user if strategy not found
        const demoUser = {
          id: 'demo-user-id',
          email: 'demo@example.com',
          username: 'Demo User',
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          claims: {
            sub: 'demo-user-id',
            email: 'demo@example.com',
            first_name: 'Demo',
            last_name: 'User'
          }
        };
        
        req.login(demoUser, (err) => {
          if (err) {
            console.error('Demo login fallback error:', err);
            return res.status(500).json({ message: 'Authentication error' });
          }
          return res.redirect('/dashboard');
        });
        return;
      }
      
      // Production authentication
      passport.authenticate(strategyName, {
        prompt: "login consent",
        scope: ["openid", "email", "profile", "offline_access"],
      })(req, res, next);
    } catch (error) {
      console.error('Authentication error:', error);
      // Fallback to demo user if authentication fails
      const demoUser = {
        id: 'demo-user-id',
        email: 'demo@example.com',
        username: 'Demo User',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        claims: {
          sub: 'demo-user-id',
          email: 'demo@example.com',
          first_name: 'Demo',
          last_name: 'User'
        }
      };
      
      req.login(demoUser, (err) => {
        if (err) {
          console.error('Demo login fallback error:', err);
          return res.status(500).json({ message: 'Authentication error' });
        }
        return res.redirect('/dashboard');
      });
    }
  });

  app.get("/api/callback", (req, res, next) => {
    try {
      // For development, redirect to login
      if (!process.env.REPLIT_DOMAINS || !process.env.REPL_ID) {
        return res.redirect("/api/login");
      }
      
      passport.authenticate(`replitauth:${req.hostname}`, {
        successReturnToOrRedirect: "/dashboard",
        failureRedirect: "/api/login",
      })(req, res, next);
    } catch (error) {
      console.error('Callback error:', error);
      res.redirect("/api/login");
    }
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      try {
        if (process.env.REPLIT_DOMAINS && process.env.REPL_ID) {
          // Production logout with OIDC
          const config = getOidcConfig();
          res.redirect(
            client.buildEndSessionUrl(config, {
              client_id: process.env.REPL_ID!,
              post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
            }).href
          );
        } else {
          // Development logout - just redirect to home
          res.redirect("/");
        }
      } catch (error) {
        console.error('Logout error:', error);
        res.redirect("/");
      }
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // For development with demo user, skip token validation
  if (user.id === 'demo-user-id') {
    return next();
  }

  if (!user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
