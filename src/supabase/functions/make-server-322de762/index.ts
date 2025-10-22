import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.ts";
import { initializeDemoData } from "./init-demo-data.ts";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Supabase client helper
const getSupabaseClient = (authHeader?: string) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = authHeader?.split(' ')[1] || Deno.env.get('SUPABASE_ANON_KEY')!;
  return createClient(supabaseUrl, supabaseKey);
};

// Admin Supabase client
const getAdminClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
};

// Initialize Storage Buckets on startup
const initializeStorage = async () => {
  const supabase = getAdminClient();
  const bucketName = 'make-322de762-files';
  
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true, // Make bucket public for easier access
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'audio/mpeg',
          'audio/mp3',
          'audio/wav',
        ]
      });
      
      if (error) {
        console.error('❌ Error creating storage bucket:', error);
      } else {
        console.log('✅ Storage bucket created:', bucketName);
      }
    } else {
      console.log('✅ Storage bucket exists:', bucketName);
      
      // Try to update bucket to public if it exists
      try {
        await supabase.storage.updateBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800,
        });
        console.log('✅ Storage bucket updated to public');
      } catch (err) {
        console.log('Note: Could not update bucket (may already be public)');
      }
    }
  } catch (error) {
    console.error('❌ Error initializing storage:', error);
  }
};

// Initialize storage on startup (with retry logic)
const initStorageWithRetry = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await initializeStorage();
      console.log('✅ Storage initialized successfully');
      return;
    } catch (err) {
      console.error(`❌ Storage init attempt ${i + 1} failed:`, err);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      }
    }
  }
  console.error('❌ Storage initialization failed after all retries');
};

initStorageWithRetry();

// Initialize demo data on first request (lazy loading)
let demoDataInitialized = false;
async function ensureDemoData() {
  if (!demoDataInitialized) {
    try {
      await initializeDemoData();
      demoDataInitialized = true;
    } catch (error) {
      console.error('Demo data init error:', error);
    }
  }
}

// Health check endpoint
app.get("/make-server-322de762/health", async (c) => {
  await ensureDemoData();
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ========== PUBLICATIONS API ==========

// Get all publications
app.get("/make-server-322de762/api/publications", async (c) => {
  try {
    const category = c.req.query('category');
    const search = c.req.query('search');
    
    let publications = await kv.getByPrefix('publication:') || [];
    
    // Filter by category
    if (category && category !== 'all') {
      publications = publications.filter((p: any) => p.category === category);
    }
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      publications = publications.filter((p: any) => 
        p.title?.toLowerCase().includes(searchLower) || 
        p.description?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by date descending
    publications.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return c.json(publications);
  } catch (error) {
    console.error('Error getting publications:', error);
    return c.json({ error: 'Server error while getting publications' }, 500);
  }
});

// Get single publication
app.get("/make-server-322de762/api/publications/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const publication = await kv.get(`publication:${id}`);
    
    if (!publication) {
      return c.json({ error: 'Publication not found' }, 404);
    }
    
    return c.json(publication);
  } catch (error) {
    console.error('Error getting publication:', error);
    return c.json({ error: 'Server error while getting publication' }, 500);
  }
});

// Create publication
app.post("/make-server-322de762/api/publications", async (c) => {
  try {
    const body = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('📝 Creating publication with data:', body);
    
    const publication = {
      id,
      title: body.title,
      description: body.description,
      category: body.category,
      image: body.image || body.cover_image || '',
      cover_image: body.cover_image || body.image || '',
      file_url: body.file_url || null,
      date: body.date || new Date().toISOString(),
    };
    
    console.log('💾 Saving publication:', publication);
    
    await kv.set(`publication:${id}`, publication);
    
    console.log('✅ Publication created successfully with id:', id);
    
    return c.json({ id, message: 'Publication created' });
  } catch (error) {
    console.error('Error creating publication:', error);
    return c.json({ error: 'Server error while creating publication' }, 500);
  }
});

// Update publication
app.put("/make-server-322de762/api/publications/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    console.log(`📝 Updating publication ${id} with data:`, body);
    
    const existing = await kv.get(`publication:${id}`);
    if (!existing) {
      console.error(`❌ Publication ${id} not found`);
      return c.json({ error: 'Publication not found' }, 404);
    }
    
    const updated = {
      ...existing,
      title: body.title,
      description: body.description,
      category: body.category,
      date: body.date || existing.date,
    };
    
    // Update file_url if provided
    if (body.file_url !== undefined) {
      updated.file_url = body.file_url;
      console.log('📄 Updated file_url:', body.file_url);
    }
    
    // Update cover_image and image if provided
    if (body.cover_image !== undefined) {
      updated.cover_image = body.cover_image;
      updated.image = body.cover_image;
      console.log('🖼️ Updated cover_image:', body.cover_image);
    }
    
    console.log('💾 Saving updated publication:', updated);
    
    await kv.set(`publication:${id}`, updated);
    
    console.log('✅ Publication updated successfully');
    
    return c.json({ message: 'Publication updated' });
  } catch (error) {
    console.error('Error updating publication:', error);
    return c.json({ error: 'Server error while updating publication' }, 500);
  }
});

// Delete publication
app.delete("/make-server-322de762/api/publications/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`publication:${id}`);
    return c.json({ message: 'Publication deleted' });
  } catch (error) {
    console.error('Error deleting publication:', error);
    return c.json({ error: 'Server error while deleting publication' }, 500);
  }
});

// ========== ALBUMS API ==========

// Get all albums
app.get("/make-server-322de762/api/albums", async (c) => {
  try {
    const albums = await kv.getByPrefix('album:') || [];
    albums.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return c.json(albums);
  } catch (error) {
    console.error('Error getting albums:', error);
    return c.json({ error: 'Server error while getting albums' }, 500);
  }
});

// Create album
app.post("/make-server-322de762/api/albums", async (c) => {
  try {
    const body = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const album = {
      id,
      title: body.title,
      cover: body.cover || '',
      photos: [],
      date: new Date().toISOString(),
    };
    
    await kv.set(`album:${id}`, album);
    
    return c.json({ id, message: 'Album created' });
  } catch (error) {
    console.error('Error creating album:', error);
    return c.json({ error: 'Server error while creating album' }, 500);
  }
});

// Update album
app.put("/make-server-322de762/api/albums/:id", async (c) => {
  try {
    const albumId = c.req.param('id');
    const body = await c.req.json();
    
    console.log(`📝 Updating album ${albumId}:`, body);
    
    const album = await kv.get(`album:${albumId}`);
    if (!album) {
      console.error(`❌ Album ${albumId} not found`);
      return c.json({ error: 'Album not found' }, 404);
    }
    
    console.log(`📖 Current album data:`, album);
    
    // Update album properties
    album.title = body.title !== undefined ? body.title : album.title;
    album.cover = body.cover !== undefined ? body.cover : album.cover;
    album.photos = body.photos !== undefined ? body.photos : album.photos;
    
    console.log(`💾 Saving updated album:`, album);
    
    await kv.set(`album:${albumId}`, album);
    
    console.log(`✅ Album ${albumId} updated successfully`);
    
    return c.json({ id: albumId, message: 'Album updated' });
  } catch (error) {
    console.error('Error updating album:', error);
    return c.json({ error: 'Server error while updating album' }, 500);
  }
});

// Add photo to album
app.post("/make-server-322de762/api/albums/:id/photos", async (c) => {
  try {
    const albumId = c.req.param('id');
    const body = await c.req.json();
    
    const album = await kv.get(`album:${albumId}`);
    if (!album) {
      return c.json({ error: 'Album not found' }, 404);
    }
    
    const photoId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const photo = {
      id: photoId,
      album_id: albumId,
      url: body.url,
    };
    
    album.photos = album.photos || [];
    album.photos.push(photo);
    
    await kv.set(`album:${albumId}`, album);
    
    return c.json({ id: photoId, message: 'Photo added' });
  } catch (error) {
    console.error('Error adding photo:', error);
    return c.json({ error: 'Server error while adding photo' }, 500);
  }
});

// Delete album
app.delete("/make-server-322de762/api/albums/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`album:${id}`);
    return c.json({ message: 'Album deleted' });
  } catch (error) {
    console.error('Error deleting album:', error);
    return c.json({ error: 'Server error while deleting album' }, 500);
  }
});

// ========== ACHIEVEMENTS API ==========

// Get all achievements
app.get("/make-server-322de762/api/achievements", async (c) => {
  try {
    const achievements = await kv.getByPrefix('achievement:') || [];
    achievements.sort((a: any, b: any) => b.year - a.year);
    return c.json(achievements);
  } catch (error) {
    console.error('Error getting achievements:', error);
    return c.json({ error: 'Server error while getting achievements' }, 500);
  }
});

// Create achievement
app.post("/make-server-322de762/api/achievements", async (c) => {
  try {
    const body = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const achievement = {
      id,
      title: body.title,
      year: body.year,
      type: body.type,
      icon: body.icon,
      color: body.color,
    };
    
    await kv.set(`achievement:${id}`, achievement);
    
    return c.json({ id, message: 'Achievement added' });
  } catch (error) {
    console.error('Error creating achievement:', error);
    return c.json({ error: 'Server error while creating achievement' }, 500);
  }
});

// Delete achievement
app.delete("/make-server-322de762/api/achievements/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`achievement:${id}`);
    return c.json({ message: 'Achievement deleted' });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return c.json({ error: 'Server error while deleting achievement' }, 500);
  }
});

// ========== PORTFOLIO API ==========

// Get all portfolio items
app.get("/make-server-322de762/api/portfolio", async (c) => {
  try {
    const items = await kv.getByPrefix('portfolio:') || [];
    items.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return c.json(items);
  } catch (error) {
    console.error('Error getting portfolio:', error);
    return c.json({ error: 'Server error while getting portfolio' }, 500);
  }
});

// Create portfolio item
app.post("/make-server-322de762/api/portfolio", async (c) => {
  try {
    const body = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Use image_url as the primary field, fallback to image for compatibility
    const imageUrl = body.image_url || body.image || '';
    
    const item = {
      id,
      title: body.title,
      organization: body.organization,
      category: body.category,
      image: imageUrl, // Keep both fields in sync
      image_url: imageUrl,
      date: body.date || new Date().toISOString(),
    };
    
    console.log('📝 Creating portfolio item:', item);
    
    await kv.set(`portfolio:${id}`, item);
    
    return c.json({ id, message: 'Portfolio item added' });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return c.json({ error: 'Server error while creating portfolio item' }, 500);
  }
});

// Update portfolio item
app.put("/make-server-322de762/api/portfolio/:id", async (c) => {
  try {
    const portfolioId = c.req.param('id');
    const body = await c.req.json();
    
    const item = await kv.get(`portfolio:${portfolioId}`);
    if (!item) {
      return c.json({ error: 'Portfolio item not found' }, 404);
    }
    
    // Update item properties
    item.title = body.title !== undefined ? body.title : item.title;
    item.organization = body.organization !== undefined ? body.organization : item.organization;
    item.category = body.category !== undefined ? body.category : item.category;
    item.date = body.date !== undefined ? body.date : item.date;
    
    // Handle image update - keep both fields in sync
    if (body.image_url !== undefined) {
      item.image_url = body.image_url;
      item.image = body.image_url; // Keep both fields in sync
    } else if (body.image !== undefined) {
      item.image = body.image;
      item.image_url = body.image; // Keep both fields in sync
    }
    
    console.log('📝 Updating portfolio item:', item);
    
    await kv.set(`portfolio:${portfolioId}`, item);
    
    return c.json({ id: portfolioId, message: 'Portfolio item updated' });
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return c.json({ error: 'Server error while updating portfolio item' }, 500);
  }
});

// Delete portfolio item
app.delete("/make-server-322de762/api/portfolio/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`portfolio:${id}`);
    return c.json({ message: 'Portfolio item deleted' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return c.json({ error: 'Server error while deleting portfolio item' }, 500);
  }
});

// ========== REVIEWS API ==========

// Get reviews
app.get("/make-server-322de762/api/reviews", async (c) => {
  try {
    const status = c.req.query('status');
    let reviews = await kv.getByPrefix('review:') || [];
    
    if (status) {
      reviews = reviews.filter((r: any) => r.status === status);
    }
    
    reviews.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return c.json(reviews);
  } catch (error) {
    console.error('Error getting reviews:', error);
    return c.json({ error: 'Server error while getting reviews' }, 500);
  }
});

// Create review
app.post("/make-server-322de762/api/reviews", async (c) => {
  try {
    const body = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const review = {
      id,
      author: body.author,
      role: body.role,
      text: body.text,
      rating: body.rating,
      status: 'pending',
      likes: 0,
      date: new Date().toISOString(),
    };
    
    await kv.set(`review:${id}`, review);
    
    return c.json({ id, message: 'Review sent for moderation' });
  } catch (error) {
    console.error('Error creating review:', error);
    return c.json({ error: 'Server error while creating review' }, 500);
  }
});

// Approve review
app.put("/make-server-322de762/api/reviews/:id/approve", async (c) => {
  try {
    const id = c.req.param('id');
    const review = await kv.get(`review:${id}`);
    
    if (!review) {
      return c.json({ error: 'Review not found' }, 404);
    }
    
    review.status = 'approved';
    await kv.set(`review:${id}`, review);
    
    return c.json({ message: 'Review approved' });
  } catch (error) {
    console.error('Error approving review:', error);
    return c.json({ error: 'Server error while approving review' }, 500);
  }
});

// Like review
app.put("/make-server-322de762/api/reviews/:id/like", async (c) => {
  try {
    const id = c.req.param('id');
    const review = await kv.get(`review:${id}`);
    
    if (!review) {
      return c.json({ error: 'Review not found' }, 404);
    }
    
    review.likes = (review.likes || 0) + 1;
    await kv.set(`review:${id}`, review);
    
    return c.json({ message: 'Like added' });
  } catch (error) {
    console.error('Error liking review:', error);
    return c.json({ error: 'Server error while liking review' }, 500);
  }
});

// Delete review
app.delete("/make-server-322de762/api/reviews/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`review:${id}`);
    return c.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return c.json({ error: 'Server error while deleting review' }, 500);
  }
});

// ========== MESSAGES API ==========

// Get messages
app.get("/make-server-322de762/api/messages", async (c) => {
  try {
    const messages = await kv.getByPrefix('message:') || [];
    messages.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return c.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    return c.json({ error: 'Server error while getting messages' }, 500);
  }
});

// Create message
app.post("/make-server-322de762/api/messages", async (c) => {
  try {
    const body = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const message = {
      id,
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      subject: body.subject,
      message: body.message,
      status: 'new',
      date: new Date().toISOString(),
    };
    
    await kv.set(`message:${id}`, message);
    
    return c.json({ id, message: 'Message sent' });
  } catch (error) {
    console.error('Error creating message:', error);
    return c.json({ error: 'Server error while creating message' }, 500);
  }
});

// Mark message as read
app.put("/make-server-322de762/api/messages/:id/read", async (c) => {
  try {
    const id = c.req.param('id');
    const message = await kv.get(`message:${id}`);
    
    if (!message) {
      return c.json({ error: 'Message not found' }, 404);
    }
    
    message.status = 'read';
    await kv.set(`message:${id}`, message);
    
    return c.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return c.json({ error: 'Server error while marking message as read' }, 500);
  }
});

// Delete message
app.delete("/make-server-322de762/api/messages/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`message:${id}`);
    return c.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return c.json({ error: 'Server error while deleting message' }, 500);
  }
});

// ========== AUDIO API ==========

// Get all audio
app.get("/make-server-322de762/api/audio", async (c) => {
  try {
    const audio = await kv.getByPrefix('audio:') || [];
    return c.json(audio);
  } catch (error) {
    console.error('Error getting audio:', error);
    return c.json({ error: 'Server error while getting audio' }, 500);
  }
});

// Create audio
app.post("/make-server-322de762/api/audio", async (c) => {
  try {
    const body = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const audio = {
      id,
      title: body.title,
      artist: body.artist,
      category: body.category,
      file_url: body.file_url || '',
      duration: body.duration || '0:00',
    };
    
    await kv.set(`audio:${id}`, audio);
    
    return c.json({ id, message: 'Audio track added' });
  } catch (error) {
    console.error('Error creating audio:', error);
    return c.json({ error: 'Server error while creating audio' }, 500);
  }
});

// Delete audio
app.delete("/make-server-322de762/api/audio/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`audio:${id}`);
    return c.json({ message: 'Audio track deleted' });
  } catch (error) {
    console.error('Error deleting audio:', error);
    return c.json({ error: 'Server error while deleting audio' }, 500);
  }
});

// ========== VIDEOS API ==========

// Get all videos
app.get("/make-server-322de762/api/videos", async (c) => {
  try {
    const videos = await kv.getByPrefix('video:') || [];
    videos.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return c.json(videos);
  } catch (error) {
    console.error('Error getting videos:', error);
    return c.json({ error: 'Server error while getting videos' }, 500);
  }
});

// Create video
app.post("/make-server-322de762/api/videos", async (c) => {
  try {
    const body = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const video = {
      id,
      title: body.title,
      description: body.description,
      category: body.category,
      thumbnail: body.thumbnail || '',
      video_url: body.video_url || '',
      vk_iframe: body.vk_iframe || '',
      duration: body.duration || '0:00',
      views: 0,
      date: new Date().toISOString(),
    };
    
    await kv.set(`video:${id}`, video);
    
    return c.json({ id, message: 'Video added' });
  } catch (error) {
    console.error('Error creating video:', error);
    return c.json({ error: 'Server error while creating video' }, 500);
  }
});

// Increment video views
app.put("/make-server-322de762/api/videos/:id/view", async (c) => {
  try {
    const id = c.req.param('id');
    const video = await kv.get(`video:${id}`);
    
    if (!video) {
      return c.json({ error: 'Video not found' }, 404);
    }
    
    video.views = (video.views || 0) + 1;
    await kv.set(`video:${id}`, video);
    
    return c.json({ message: 'View counted' });
  } catch (error) {
    console.error('Error incrementing video views:', error);
    return c.json({ error: 'Server error while incrementing video views' }, 500);
  }
});

// Delete video
app.delete("/make-server-322de762/api/videos/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`video:${id}`);
    return c.json({ message: 'Video deleted' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return c.json({ error: 'Server error while deleting video' }, 500);
  }
});

// ========== PAGES API ==========

// Get page content
app.get("/make-server-322de762/api/pages/:pageId", async (c) => {
  try {
    await ensureDemoData();
    const pageId = c.req.param('pageId');
    const page = await kv.get(`page:${pageId}`);
    
    if (!page) {
      // Return default page structure if not found
      const defaultImage = 'https://images.unsplash.com/photo-1750924718882-33ee16ddf3a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwcG9ydHJhaXQlMjB3b21hbnxlbnwxfHx8fDE3NjA1NjY4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080';
      return c.json({
        id: pageId,
        title: '',
        content: '',
        image_url: defaultImage,
      });
    }
    
    return c.json(page);
  } catch (error) {
    console.error('Error getting page:', error);
    return c.json({ error: 'Server error while getting page' }, 500);
  }
});

// Update page content
app.put("/make-server-322de762/api/pages/:pageId", async (c) => {
  try {
    const pageId = c.req.param('pageId');
    const body = await c.req.json();
    
    console.log(`📝 Updating page ${pageId} with data:`, body);
    
    // Get existing page data or create new
    const existingPage = await kv.get(`page:${pageId}`) || {};
    
    const page = {
      ...existingPage,
      id: pageId,
      title: body.title !== undefined ? body.title : existingPage.title || '',
      content: body.content !== undefined ? body.content : existingPage.content || '',
      image_url: body.image_url !== undefined ? body.image_url : existingPage.image_url || '',
      updated_at: new Date().toISOString(),
    };
    
    console.log(`💾 Saving page ${pageId}:`, page);
    
    await kv.set(`page:${pageId}`, page);
    
    console.log(`✅ Page ${pageId} updated successfully`);
    
    return c.json({ id: pageId, message: 'Page updated successfully' });
  } catch (error) {
    console.error('Error updating page:', error);
    return c.json({ error: 'Server error while updating page' }, 500);
  }
});

// ========== ADMIN API ==========

// Admin login
app.post("/make-server-322de762/api/admin/login", async (c) => {
  try {
    const body = await c.req.json();
    const { password } = body;
    
    // Get admin password from environment or use default
    const adminPassword = Deno.env.get('ADMIN_PASSWORD') || 'admin';
    
    if (password === adminPassword) {
      return c.json({ success: true, message: 'Login successful' });
    } else {
      return c.json({ success: false, message: 'Invalid password' }, 401);
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    return c.json({ success: false, message: 'Server error during login' }, 500);
  }
});

// Get stats
app.get("/make-server-322de762/api/stats", async (c) => {
  try {
    await ensureDemoData();
    const publications = await kv.getByPrefix('publication:') || [];
    const albums = await kv.getByPrefix('album:') || [];
    const reviews = await kv.getByPrefix('review:') || [];
    const messages = await kv.getByPrefix('message:') || [];
    const videos = await kv.getByPrefix('video:') || [];
    
    const pendingReviews = reviews.filter((r: any) => r.status === 'pending').length;
    const newMessages = messages.filter((m: any) => m.status === 'new').length;
    const totalViews = videos.reduce((sum: number, v: any) => sum + (v.views || 0), 0);
    
    const stats = {
      publications: publications.length,
      albums: albums.length,
      reviews: pendingReviews,
      messages: newMessages,
      totalViews,
    };
    
    return c.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    return c.json({ error: 'Server error while getting stats' }, 500);
  }
});

// Manual initialization endpoint (for debugging)
app.post("/make-server-322de762/api/admin/init-data", async (c) => {
  try {
    const result = await initializeDemoData();
    return c.json(result);
  } catch (error: any) {
    console.error('Error initializing data:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Manual bucket creation endpoint (for debugging)
app.post("/make-server-322de762/api/admin/init-storage", async (c) => {
  try {
    await initializeStorage();
    return c.json({ success: true, message: 'Storage initialization attempted' });
  } catch (error: any) {
    console.error('Error initializing storage:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Check storage status
app.get("/make-server-322de762/api/admin/storage-status", async (c) => {
  try {
    const supabase = getAdminClient();
    const bucketName = 'make-322de762-files';
    
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      return c.json({ error: error.message }, 500);
    }
    
    const bucket = buckets?.find(b => b.name === bucketName);
    
    return c.json({
      exists: !!bucket,
      bucket: bucket || null,
      allBuckets: buckets?.map(b => ({ name: b.name, public: b.public }))
    });
  } catch (error: any) {
    console.error('Error checking storage:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ========== FILE UPLOAD API ==========

// Upload file to Supabase Storage
app.post("/make-server-322de762/api/upload", async (c) => {
  try {
    console.log('📤 Upload request received');
    
    // Ensure storage is initialized before upload
    const supabase = getAdminClient();
    const bucketName = 'make-322de762-files';
    
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        console.log('⚠️ Bucket not found, initializing storage...');
        await initializeStorage();
        console.log('✅ Storage initialized on-demand');
      }
    } catch (initError) {
      console.error('⚠️ Could not check/initialize bucket:', initError);
      // Continue anyway - might still work
    }
    
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('❌ No file in request');
      return c.json({ error: 'No file provided' }, 400);
    }
    
    console.log('📁 File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    const bucketName2 = 'make-322de762-files';
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 9);
    const ext = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomStr}.${ext}`;
    
    console.log('📝 Generated filename:', fileName);
    
    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    console.log('⬆️ Uploading to storage...');
    
    const { data, error } = await supabase.storage
      .from(bucketName2)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });
    
    if (error) {
      console.error('❌ Upload error:', error);
      return c.json({ error: `Upload failed: ${error.message}` }, 500);
    }
    
    console.log('✅ File uploaded successfully:', data);
    
    // Get public URL (bucket is public)
    const { data: publicUrlData } = supabase.storage
      .from(bucketName2)
      .getPublicUrl(fileName);
    
    const publicUrl = publicUrlData?.publicUrl;
    
    if (!publicUrl) {
      console.error('❌ Failed to get public URL');
      return c.json({ error: 'Failed to generate file URL' }, 500);
    }
    
    console.log('✅ Public URL generated:', publicUrl);
    
    return c.json({ 
      url: publicUrl,
      path: fileName,
      message: 'File uploaded successfully' 
    });
  } catch (error: any) {
    console.error('❌ Error uploading file:', error);
    return c.json({ 
      error: 'Server error while uploading file',
      details: error.message || String(error)
    }, 500);
  }
});

// Get signed URL for file
app.get("/make-server-322de762/api/files/:path", async (c) => {
  try {
    const path = c.req.param('path');
    const supabase = getAdminClient();
    const bucketName = 'make-322de762-files';
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(path, 3600); // 1 hour
    
    if (error) {
      return c.json({ error: 'File not found' }, 404);
    }
    
    return c.json({ url: data.signedUrl });
  } catch (error) {
    console.error('Error getting file URL:', error);
    return c.json({ error: 'Server error while getting file URL' }, 500);
  }
});

Deno.serve(app.fetch);
