// Демо-данные для работы сайта без подключения к Supabase

export const demoPublications = [
  {
    id: 1,
    title: "Музыкально-ритмическое занятие 'Веселые нотки'",
    category: "music",
    description: "Конспект музыкально-ритмического занятия для детей старшей группы",
    file_url: "#",
    file_type: "pdf",
    views: 245,
    downloads: 87,
    created_at: "2024-01-15"
  },
  {
    id: 2,
    title: "Сценарий новогоднего утренника",
    category: "scenarios",
    description: "Праздничный сценарий для подготовительной группы",
    file_url: "#",
    file_type: "docx",
    views: 312,
    downloads: 156,
    created_at: "2023-12-01"
  },
  {
    id: 3,
    title: "Консультация для родителей: Музыка в жизни ребенка",
    category: "parents",
    description: "Рекомендации по музыкальному развитию детей в домашних условиях",
    file_url: "#",
    file_type: "pdf",
    views: 189,
    downloads: 92,
    created_at: "2024-02-20"
  }
];

export const demoAlbums = [
  {
    id: 1,
    title: "Новогодний утренник 2024",
    description: "Фотографии с новогоднего праздника",
    cover_image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=80",
    created_at: "2024-01-10",
    photos: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=80",
        caption: "Праздничное выступление"
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=800&q=80",
        caption: "Танцевальный номер"
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
        caption: "Музыкальное поздравление"
      }
    ]
  },
  {
    id: 2,
    title: "Весенний концерт",
    description: "Весенний праздник для мам",
    cover_image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    created_at: "2024-03-05",
    photos: [
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
        caption: "Выступление хора"
      },
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
        caption: "Музыкальные инструменты"
      }
    ]
  }
];

export const demoAchievements = [
  {
    id: 1,
    title: "Победитель районного конкурса 'Лучший педагог года'",
    description: "Диплом победителя в номинации 'Музыкальное воспитание'",
    image_url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&q=80",
    date: "2024",
    category: "personal"
  },
  {
    id: 2,
    title: "1 место во Всероссийском конкурсе методических разработок",
    description: "За авторскую методику музыкального развития дошкольников",
    image_url: "https://images.unsplash.com/photo-1569705460033-cfaa4bf9f822?w=400&q=80",
    date: "2023",
    category: "professional"
  },
  {
    id: 3,
    title: "Благодарность от Министерства образования",
    description: "За вклад в развитие дошкольного образования",
    image_url: "https://images.unsplash.com/photo-1586953208270-a0a4076b86a4?w=400&q=80",
    date: "2023",
    category: "personal"
  }
];

export const demoPortfolio = [
  {
    id: 1,
    title: "Диплом о высшем образовании",
    description: "Педагогический университет, специальность 'Музыкальное образование'",
    image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80",
    category: "diploma",
    date: "2008"
  },
  {
    id: 2,
    title: "Сертификат повышения квалификации",
    description: "Современные технологии музыкального воспитания",
    image_url: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=600&q=80",
    category: "certificate",
    date: "2023"
  },
  {
    id: 3,
    title: "Благодарность руководства",
    description: "За многолетний добросовестный труд",
    image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
    category: "gratitude",
    date: "2024"
  }
];

export const demoReviews = [
  {
    id: 1,
    author_name: "Мария Иванова",
    author_role: "Родитель",
    content: "Елена Юрьевна - замечательный педагог! Мой ребенок с удовольствием посещает музыкальные занятия. Спасибо за профессионализм и любовь к детям!",
    rating: 5,
    status: "approved",
    created_at: "2024-01-20"
  },
  {
    id: 2,
    author_name: "Светлана Петрова",
    author_role: "Коллега",
    content: "Работать с Еленой Юрьевной - одно удовольствие. Всегда готова помочь, поделиться опытом. Настоящий профессионал своего дела!",
    rating: 5,
    status: "approved",
    created_at: "2024-02-10"
  },
  {
    id: 3,
    author_name: "Анна Сидорова",
    author_role: "Родитель",
    content: "Благодарю за чудесные праздники! Дети всегда в восторге от выступлений. Видно, что педагог вкладывает душу в свою работу.",
    rating: 5,
    status: "approved",
    created_at: "2024-03-05"
  }
];

export const demoAudio = [
  {
    id: 1,
    title: "Утренняя зарядка",
    artist: "Детские песни",
    file_url: "#",
    duration: 180,
    category: "exercises"
  },
  {
    id: 2,
    title: "Танец маленьких утят",
    artist: "Детская классика",
    file_url: "#",
    duration: 150,
    category: "dance"
  },
  {
    id: 3,
    title: "Колыбельная",
    artist: "Музыка для сна",
    file_url: "#",
    duration: 210,
    category: "relaxation"
  }
];

export const demoVideos = [
  {
    id: 1,
    title: "Новогодний утренник 2024",
    description: "Праздничное выступление детей",
    vk_url: "https://vk.com/video_ext.php",
    thumbnail: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80",
    category: "Праздники",
    views: 145,
    created_at: "2024-01-15"
  },
  {
    id: 2,
    title: "Музыкальное занятие 'Веселые нотки'",
    description: "Открытое занятие по музыкальному развитию",
    vk_url: "https://vk.com/video_ext.php",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
    category: "Занятия",
    views: 98,
    created_at: "2024-02-20"
  }
];
