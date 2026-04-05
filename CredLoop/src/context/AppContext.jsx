import { createContext, useContext, useState, useEffect } from 'react';
import { USERS, LISTINGS, REQUESTS } from '../data/mockData';

const AppContext = createContext(null);

const USER_PASSWORDS = {
  'aryan.sharma@kiet.edu':    'demo123',
  'priya.mehta@kiet.edu':     'demo123',
  'rahul.nair@kiet.edu':      'demo123',
  'sneha.iyer@kiet.edu':      'demo123',
  'karan.patel@kiet.edu':     'demo123',
  'tejash.25002338@kiet.edu': 'tejash@123',
  'yash.25002338@kiet.edu':   'yash@123',
  'yash.25002377@kiet.edu':   'yash@123',
  'shreya.25002313@kiet.edu': 'shreya@123',
};

export function AppProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      const s = localStorage.getItem('cc_users');
      if (!s) return USERS;
      const stored = JSON.parse(s);
      // Ensure all seed users exist (in case new ones were added to mockData)
      const storedIds = new Set(stored.map(u => u.id));
      const newSeedUsers = USERS.filter(u => !storedIds.has(u.id));
      return [...stored, ...newSeedUsers];
    } catch { return USERS; }
  });
  const [listings, setListings] = useState(() => {
    try {
      const s = localStorage.getItem('cc_listings');
      if (!s) return LISTINGS;
      const stored = JSON.parse(s);
      // Merge: keep all stored listings, but ensure seed listings with real images are included
      const storedIds = new Set(stored.map(l => l.id));
      const seedOnly  = LISTINGS.filter(l => !storedIds.has(l.id));
      // Also update seed listings that exist in stored but might have no image
      const merged = stored.map(l => {
        const seed = LISTINGS.find(sl => sl.id === l.id);
        if (seed && !l.image && seed.image) return { ...l, image: seed.image };
        return l;
      });
      return [...merged, ...seedOnly];
    } catch { return LISTINGS; }
  });
  const [requests, setRequests] = useState(() => {
    try { const s = localStorage.getItem('cc_requests'); return s ? JSON.parse(s) : REQUESTS; } catch { return REQUESTS; }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try { const s = localStorage.getItem('cc_currentUser'); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [notification, setNotification] = useState(null);

  // Persist to localStorage whenever state changes
  useEffect(() => { localStorage.setItem('cc_users',    JSON.stringify(users));    }, [users]);
  useEffect(() => { localStorage.setItem('cc_listings', JSON.stringify(listings)); }, [listings]);
  useEffect(() => { localStorage.setItem('cc_requests', JSON.stringify(requests)); }, [requests]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('cc_currentUser', JSON.stringify(currentUser));
    else             localStorage.removeItem('cc_currentUser');
  }, [currentUser]);

  // Keep currentUser in sync if credits change in users array
  useEffect(() => {
    if (currentUser) {
      const updated = users.find(u => u.id === currentUser.id);
      if (updated && updated.credits !== currentUser.credits) {
        setCurrentUser(updated);
      }
    }
  }, [users]);

  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const login = (email, password) => {
    const lowerEmail = email.toLowerCase().trim();

    // Must be @kiet.edu
    if (!lowerEmail.endsWith('@kiet.edu')) {
      showNotif('Only @kiet.edu email addresses are allowed', 'error');
      return false;
    }

    const user = users.find(u => u.email.toLowerCase() === lowerEmail);
    const correctPassword = USER_PASSWORDS[lowerEmail] || 'demo123';

    if (user && password === correctPassword) {
      setCurrentUser(user);
      return true;
    }

    // Auto-register new @kiet.edu students
    if (!user && password.length >= 6) {
      const namePart = lowerEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const newUser = {
        id: 'u' + Date.now(),
        name: namePart,
        email: lowerEmail,
        college: 'KIET Group of Institutions',
        avatar: namePart.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        credits: 100,
        rating: 0,
        reviews: 0,
        skills: [],
        bio: '',
        joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      USER_PASSWORDS[lowerEmail] = password;
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cc_currentUser');
  };

  const addListing = (listing) => {
    const newListing = {
      ...listing,
      id: 'l' + Date.now(),
      sellerId: currentUser.id,
      rating: 0,
      reviews: 0,
      available: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setListings(prev => [newListing, ...prev]);
    showNotif('Listing created successfully!');
    return newListing;
  };

  const sendRequest = (listingId, message) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;
    if (currentUser.id === listing.sellerId) { showNotif("You can't request your own listing", 'error'); return; }
    if (currentUser.credits < listing.credits) { showNotif('Not enough credits!', 'error'); return; }
    const existing = requests.find(r => r.listingId === listingId && r.buyerId === currentUser.id);
    if (existing) { showNotif('You already sent a request for this listing', 'error'); return; }
    const newReq = {
      id: 'r' + Date.now(),
      listingId,
      buyerId: currentUser.id,
      sellerId: listing.sellerId,
      status: 'pending',
      message,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRequests(prev => [...prev, newReq]);
    showNotif('Request sent!');
  };

  const respondRequest = (reqId, accept) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== reqId) return r;
      if (accept) {
        const listing = listings.find(l => l.id === r.listingId);
        setUsers(prev2 => prev2.map(u => {
          if (u.id === r.buyerId)  return { ...u, credits: u.credits - listing.credits };
          if (u.id === r.sellerId) return { ...u, credits: u.credits + listing.credits };
          return u;
        }));
        showNotif(`Accepted! +${listing.credits} credits earned`);
      } else {
        showNotif('Request declined.');
      }
      return { ...r, status: accept ? 'accepted' : 'rejected' };
    }));
  };

  const addReview = (listingId, rating) => {
    setListings(prev => prev.map(l => {
      if (l.id !== listingId) return l;
      const newRating = l.reviews === 0 ? rating : ((l.rating * l.reviews + rating) / (l.reviews + 1));
      return { ...l, rating: Math.round(newRating * 10) / 10, reviews: l.reviews + 1 };
    }));
    showNotif('Review submitted!');
  };

  const getUserById   = (id) => users.find(u => u.id === id);
  const getListingById = (id) => listings.find(l => l.id === id);

  return (
    <AppContext.Provider value={{
      currentUser, users, listings, requests,
      login, logout, addListing, sendRequest, respondRequest, addReview,
      getUserById, getListingById, notification, showNotif,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
