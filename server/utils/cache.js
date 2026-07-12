import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'cache.json');
// Cache module - restarted to flush memory cache
let cache = new Map();
const activePromises = new Map();

// Load cache from disk on startup
try {
  if (fs.existsSync(CACHE_FILE)) {
    const rawData = fs.readFileSync(CACHE_FILE, 'utf-8');
    const parsed = JSON.parse(rawData);
    cache = new Map(Object.entries(parsed));
  }
} catch (err) {
  console.error("Failed to load cache from file:", err.message);
}

const saveCacheToFile = () => {
  try {
    const obj = Object.fromEntries(cache);
    fs.writeFileSync(CACHE_FILE, JSON.stringify(obj), 'utf-8');
  } catch (err) {
    console.error("Failed to save cache to file:", err.message);
  }
};

export const getCachedReport = (company) => {
  const normalizedKey = company.toLowerCase().trim();
  if (cache.has(normalizedKey)) {
    const entry = cache.get(normalizedKey);
    // Allow cache to live for a long time to save the demo
    if (Date.now() < entry.expiry) {
      console.log(`[Cache Hit] Report for ${normalizedKey} loaded from disk`);
      return entry.data;
    } else {
      console.log(`[Cache Expired] Report for ${normalizedKey}`);
      cache.delete(normalizedKey);
      saveCacheToFile();
    }
  } else {
    console.log(`[Cache Miss] Report for ${normalizedKey}`);
  }
  return null;
};

export const setCachedReport = (company, data) => {
  const normalizedKey = company.toLowerCase().trim();
  // Set TTL to 24 hours to guarantee the demo works tomorrow if they get a good run today
  const ttlMin = process.env.CACHE_TTL_MINUTES ? parseInt(process.env.CACHE_TTL_MINUTES, 10) : 1440; 
  const ttlMs = ttlMin * 60 * 1000;
  
  cache.set(normalizedKey, {
    data,
    expiry: Date.now() + ttlMs
  });
  saveCacheToFile();
};

export const withDeduplication = (company, fetchPromiseFn) => {
  const normalizedKey = company.toLowerCase().trim();
  if (activePromises.has(normalizedKey)) {
    console.log(`[Cache Deduplication] Awaiting existing request for ${normalizedKey}`);
    return activePromises.get(normalizedKey);
  }

  const promise = fetchPromiseFn().finally(() => {
    activePromises.delete(normalizedKey);
  });

  activePromises.set(normalizedKey, promise);
  return promise;
};
