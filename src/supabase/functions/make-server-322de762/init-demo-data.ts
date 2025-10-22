// Script to initialize demo data in Supabase KV Store
// This can be called from the frontend admin panel or run separately

import * as kv from './kv_store.ts';

export async function initializeDemoData() {
  console.log('🎵 Initializing demo data...');
  
  try {
    // Check if data already exists
    const existingPublications = await kv.getByPrefix('publication:').catch(() => []);
    if (existingPublications && existingPublications.length > 0) {
      console.log('✅ Demo data already exists, skipping initialization');
      return { success: true, message: 'Demo data already exists' };
    }
    
    // Check if pages already exist
    const existingPages = await kv.getByPrefix('page:').catch(() => []);
    if (existingPages && existingPages.length > 0) {
      console.log('✅ Pages already exist, skipping pages initialization');
    }
    
    // Sample Publications
    const publications = [
      {
        id: 'pub-1',
        title: 'Музыкальное развитие дошкольников',
        description: 'Конспект занятия по музыкальному развитию для старшей группы',
        category: 'Конспекты занятий',
        image: '',
        file_url: null,
        date: new Date('2024-01-15').toISOString(),
      },
      {
        id: 'pub-2',
        title: 'Сценарий праздника Осени',
        description: 'Праздничный сценарий для детей подготовительной группы',
        category: 'Сценарии',
        image: '',
        file_url: null,
        date: new Date('2024-02-20').toISOString(),
      },
      {
        id: 'pub-3',
        title: 'Музыкальные игры для малышей',
        description: 'Картотека музыкальных игр для младшей группы',
        category: 'Картотека',
        image: '',
        file_url: null,
        date: new Date('2024-03-10').toISOString(),
      },
    ];
    
    for (const pub of publications) {
      await kv.set(`publication:${pub.id}`, pub);
    }
    console.log(`✅ Created ${publications.length} publications`);
    
    // Sample Albums
    const albums = [
      {
        id: 'album-1',
        title: 'Праздник Осени 2024',
        cover: '',
        photos: [],
        date: new Date('2024-09-15').toISOString(),
      },
      {
        id: 'album-2',
        title: 'Новогодний утренник',
        cover: '',
        photos: [],
        date: new Date('2024-12-25').toISOString(),
      },
    ];
    
    for (const album of albums) {
      await kv.set(`album:${album.id}`, album);
    }
    console.log(`✅ Created ${albums.length} albums`);
    
    // Sample Achievements
    const achievements = [
      {
        id: 'ach-1',
        title: 'Лауреат городского конкурса',
        year: 2024,
        type: 'award',
        icon: 'Award',
        color: 'text-yellow-500',
      },
      {
        id: 'ach-2',
        title: 'Благодарность от администрации',
        year: 2023,
        type: 'thanks',
        icon: 'Heart',
        color: 'text-pink-500',
      },
      {
        id: 'ach-3',
        title: 'Участие в методическом объединении',
        year: 2024,
        type: 'participation',
        icon: 'Users',
        color: 'text-blue-500',
      },
    ];
    
    for (const ach of achievements) {
      await kv.set(`achievement:${ach.id}`, ach);
    }
    console.log(`✅ Created ${achievements.length} achievements`);
    
    // Sample Portfolio
    const portfolio = [
      {
        id: 'port-1',
        title: 'Диплом о высшем образовании',
        organization: 'Педагогический университет',
        category: 'diploma',
        image: '',
        image_url: '',
        date: new Date('2010-06-20').toISOString(),
      },
      {
        id: 'port-2',
        title: 'Сертификат повышения квалификации',
        organization: 'Институт развития образования',
        category: 'certificate',
        image: '',
        image_url: '',
        date: new Date('2023-05-15').toISOString(),
      },
    ];
    
    for (const item of portfolio) {
      await kv.set(`portfolio:${item.id}`, item);
    }
    console.log(`✅ Created ${portfolio.length} portfolio items`);
    
    // Sample Reviews
    const reviews = [
      {
        id: 'rev-1',
        author: 'Анна Петрова',
        role: 'Родитель',
        text: 'Прекрасный музыкальный руководитель! Дети с удовольствием ходят на занятия.',
        rating: 5,
        status: 'approved',
        likes: 12,
        date: new Date('2024-08-10').toISOString(),
      },
      {
        id: 'rev-2',
        author: 'Мария Иванова',
        role: 'Воспитатель',
        text: 'Профессионал своего дела. Отличная организация праздников!',
        rating: 5,
        status: 'approved',
        likes: 8,
        date: new Date('2024-09-05').toISOString(),
      },
    ];
    
    for (const review of reviews) {
      await kv.set(`review:${review.id}`, review);
    }
    console.log(`✅ Created ${reviews.length} reviews`);
    
    // Sample Audio
    const audio = [
      {
        id: 'audio-1',
        title: 'Осенняя песенка',
        artist: 'Детский хор',
        category: 'Песни',
        file_url: '',
        duration: '2:30',
      },
      {
        id: 'audio-2',
        title: 'Танец с листочками',
        artist: 'Инструментальная музыка',
        category: 'Танцы',
        file_url: '',
        duration: '3:15',
      },
    ];
    
    for (const track of audio) {
      await kv.set(`audio:${track.id}`, track);
    }
    console.log(`✅ Created ${audio.length} audio tracks`);
    
    // Sample Videos
    const videos = [
      {
        id: 'video-1',
        title: 'Праздник Осени - выступление старшей группы',
        description: 'Видеозапись осеннего праздника 2024',
        category: 'Праздники',
        thumbnail: '',
        video_url: '',
        vk_iframe: '',
        duration: '15:30',
        views: 45,
        date: new Date('2024-09-20').toISOString(),
      },
      {
        id: 'video-2',
        title: 'Открытое занятие по музыке',
        description: 'Музыкальное занятие для подготовительной группы',
        category: 'Занятия',
        thumbnail: '',
        video_url: '',
        vk_iframe: '',
        duration: '25:00',
        views: 32,
        date: new Date('2024-10-05').toISOString(),
      },
    ];
    
    for (const video of videos) {
      await kv.set(`video:${video.id}`, video);
    }
    console.log(`✅ Created ${videos.length} videos`);
    
    // Sample Pages (only create if they don't exist)
    const pages = [
      {
        id: 'home',
        title: 'Главная страница',
        content: '',
        image_url: 'https://images.unsplash.com/photo-1750924718882-33ee16ddf3a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwcG9ydHJhaXQlMjB3b21hbnxlbnwxfHx8fDE3NjA1NjY4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        updated_at: new Date().toISOString(),
      },
      {
        id: 'about',
        title: 'О себе',
        content: '',
        image_url: 'https://images.unsplash.com/photo-1750924718882-33ee16ddf3a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NjA1NjY4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        updated_at: new Date().toISOString(),
      },
    ];
    
    let pagesCreated = 0;
    if (existingPages.length === 0) {
      for (const page of pages) {
        await kv.set(`page:${page.id}`, page);
        pagesCreated++;
      }
      console.log(`✅ Created ${pagesCreated} pages`);
    }
    
    console.log('✅ Demo data initialization completed!');
    
    return {
      success: true,
      message: 'Demo data initialized successfully',
      stats: {
        publications: publications.length,
        albums: albums.length,
        achievements: achievements.length,
        portfolio: portfolio.length,
        reviews: reviews.length,
        audio: audio.length,
        videos: videos.length,
        pages: pagesCreated,
      }
    };
    
  } catch (error) {
    console.error('❌ Error initializing demo data:', error);
    return {
      success: false,
      message: `Failed to initialize demo data: ${error.message}`,
    };
  }
}
