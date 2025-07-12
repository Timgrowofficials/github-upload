// Service Worker for Tim Grow Push Notifications
const CACHE_NAME = 'tim-grow-v1';

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push event - Handle incoming push notifications
self.addEventListener('push', event => {
  console.log('Service Worker: Push received', event);
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error('Error parsing push data:', e);
      data = { title: 'Tim Grow', body: 'You have a new notification' };
    }
  }

  const options = {
    body: data.body || 'You have a new booking notification',
    icon: data.icon || '/icon-192x192.png',
    badge: data.badge || '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/dashboard',
      bookingId: data.bookingId,
      businessId: data.businessId,
      ...data.data
    },
    actions: [
      {
        action: 'view',
        title: 'View Booking',
        icon: '/icon-192x192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: true,
    tag: data.tag || 'booking-notification'
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'New Booking!', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  // Open or focus the app
  const urlToOpen = event.notification.data.url || '/dashboard';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      // Try to find an existing window
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window found, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync (for offline support)
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('Background sync completed')
    );
  }
});

// Message event (for communication with main thread)
self.addEventListener('message', event => {
  console.log('Service Worker: Message received', event);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});