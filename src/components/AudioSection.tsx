import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Headphones, Play, Pause, SkipBack, SkipForward, Volume2, Download, Music, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { toast } from "sonner";
import { audioApi } from "../utils/supabase/client";

export default function AudioSection() {
  const [audioTracks, setAudioTracks] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadAudioTracks();
  }, []);

  const loadAudioTracks = async () => {
    try {
      const data = await audioApi.getAll();
      setAudioTracks(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading audio:', error);
      setAudioTracks([]);
    }
  };

  const filteredTracks = audioTracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      // Auto-play next track
      if (currentTrack < audioTracks.length - 1) {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, audioTracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const trackUrl = audioTracks[currentTrack]?.file_url || audioTracks[currentTrack]?.url;
    
    if (trackUrl) {
      audio.src = trackUrl;
      audio.load();
      
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error("Playback failed:", err);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentTrack, audioTracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error("Playback failed:", err);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume[0] / 100;
    }
  }, [volume]);

  const playPause = () => {
    const trackUrl = audioTracks[currentTrack]?.file_url || audioTracks[currentTrack]?.url;
    if (trackUrl) {
      setIsPlaying(!isPlaying);
    } else {
      toast.error("Аудиофайл не загружен. Добавьте файлы через админ-панель.");
    }
  };

  const nextTrack = () => {
    if (audioTracks.length > 0) {
      const newTrack = (currentTrack + 1) % audioTracks.length;
      setCurrentTrack(newTrack);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const prevTrack = () => {
    if (audioTracks.length > 0) {
      const newTrack = (currentTrack - 1 + audioTracks.length) % audioTracks.length;
      setCurrentTrack(newTrack);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const selectTrack = (index: number) => {
    if (audioTracks[index]) {
      setCurrentTrack(index);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio && duration && !isNaN(duration)) {
      const newTime = (value[0] / 100) * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleDownload = async (track: any) => {
    const trackUrl = track.file_url || track.url;
    if (!trackUrl) {
      toast.error("Файл не доступен для скачивания");
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = trackUrl;
      link.download = `${track.title}.mp3`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Скачивание началось!");
    } catch (error) {
      toast.error("Ошибка скачивания");
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTrackColor = (category: string) => {
    const colors: Record<string, string> = {
      "Детские песни": "from-orange-500 to-yellow-500",
      "Физминутки": "from-green-500 to-teal-500",
      "Релаксация": "from-blue-500 to-purple-500",
      "Танцы": "from-pink-500 to-red-500",
      "Игры": "from-purple-500 to-pink-500",
      "Праздники": "from-blue-500 to-cyan-500",
    };
    return colors[category] || "from-purple-500 to-pink-500";
  };

  const track = audioTracks[currentTrack];

  if (!track) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Music className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">Нет доступных аудиотреков</p>
          <p className="text-sm text-gray-500 mt-2">Добавьте треки через админ-панель</p>
        </div>
      </div>
    );
  }

  const progressPercentage = duration && !isNaN(duration) ? (currentTime / duration) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <Headphones className="w-12 h-12 md:w-16 md:h-16 text-purple-600" />
          </motion.div>
          <h2 className="text-3xl md:text-5xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Аудиотека
          </h2>
          <p className="text-lg md:text-xl text-gray-600">Музыка для занятий и праздников</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl sticky top-24">
              {/* Album Art */}
              <motion.div
                animate={{
                  rotate: isPlaying ? 360 : 0,
                }}
                transition={{
                  duration: 10,
                  repeat: isPlaying ? Infinity : 0,
                  ease: "linear",
                }}
                className={`w-full aspect-square rounded-3xl bg-gradient-to-br ${getTrackColor(track.category)} mb-6 flex items-center justify-center shadow-lg`}
              >
                <Music className="w-16 h-16 md:w-24 md:h-24 text-white" />
              </motion.div>

              {/* Track Info */}
              <div className="text-center mb-6">
                <h3 className="text-xl md:text-2xl text-gray-800 mb-2 line-clamp-2">{track.title}</h3>
                <p className="text-purple-600 mb-1">{track.artist}</p>
                <p className="text-sm text-gray-500">{track.category}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="relative mb-2">
                  <Slider
                    value={[progressPercentage]}
                    onValueChange={handleSeek}
                    max={100}
                    step={0.1}
                    className="mb-2"
                  />
                  {/* Animated progress indicator */}
                  {isPlaying && (
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-purple-600 rounded-full shadow-lg"
                      style={{ left: `${progressPercentage}%` }}
                      animate={{
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <motion.span
                    key={currentTime}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formatTime(currentTime)}
                  </motion.span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 md:gap-4 mb-6">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={prevTrack}
                    variant="outline"
                    className="rounded-full w-10 h-10 md:w-12 md:h-12 border-2 border-purple-300"
                  >
                    <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    onClick={playPause}
                    className="rounded-full w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 md:w-7 md:h-7" />
                    ) : (
                      <Play className="w-6 h-6 md:w-7 md:h-7 ml-1" />
                    )}
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={nextTrack}
                    variant="outline"
                    className="rounded-full w-10 h-10 md:w-12 md:h-12 border-2 border-purple-300"
                  >
                    <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{
                    scale: volume[0] > 50 ? [1, 1.1, 1] : 1
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: volume[0] > 50 ? Infinity : 0
                  }}
                >
                  <Volume2 className="w-5 h-5 text-gray-600 flex-shrink-0" />
                </motion.div>
                <div className="flex-1 relative">
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                  />
                  {/* Volume level indicator */}
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`flex-1 h-1 rounded-full ${
                          i < Math.floor(volume[0] / 10) 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                            : 'bg-gray-200'
                        }`}
                        animate={{
                          opacity: i < Math.floor(volume[0] / 10) ? [0.5, 1, 0.5] : 0.3
                        }}
                        transition={{
                          duration: 0.5 + i * 0.1,
                          repeat: i < Math.floor(volume[0] / 10) && isPlaying ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </div>
                <motion.span 
                  className="text-sm text-gray-600 w-10"
                  key={volume[0]}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  {volume[0]}%
                </motion.span>
              </div>

              {/* Download Button */}
              <Button 
                onClick={() => handleDownload(track)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full"
              >
                <Download className="w-5 h-5 mr-2" />
                Скачать трек
              </Button>

              {/* Hidden Audio Element */}
              <audio 
                ref={audioRef}
                preload="metadata"
              />
            </div>
          </motion.div>

          {/* Playlist */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl md:text-2xl mb-6 text-gray-800">Плейлист ({audioTracks.length})</h3>
              
              {/* Search Bar */}
              <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Поиск по названию или исполнителю..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-5 rounded-full border-2 border-purple-200 focus:border-purple-400"
                />
              </div>

              <div className="space-y-3">
                {filteredTracks.map((audioTrack, index) => {
                  const realIndex = audioTracks.indexOf(audioTrack);
                  return (
                    <motion.div
                      key={audioTrack.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => selectTrack(realIndex)}
                      className={`
                        bg-white rounded-2xl p-4 md:p-6 shadow-lg cursor-pointer transition-all
                        ${currentTrack === realIndex ? 'ring-2 ring-purple-500' : 'hover:shadow-xl'}
                      `}
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        {/* Track Number / Play Icon */}
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${getTrackColor(audioTrack.category)} flex items-center justify-center text-white flex-shrink-0`}>
                          {currentTrack === realIndex && isPlaying ? (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                            >
                              <Pause className="w-5 h-5 md:w-6 md:h-6" />
                            </motion.div>
                          ) : (
                            <span className="text-base md:text-lg">{realIndex + 1}</span>
                          )}
                        </div>

                        {/* Track Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base md:text-lg text-gray-800 mb-1 truncate">{audioTrack.title}</h4>
                          <p className="text-xs md:text-sm text-gray-600 truncate">{audioTrack.artist} • {audioTrack.category}</p>
                        </div>

                        {/* Duration */}
                        <motion.div 
                          className="text-gray-500 text-xs md:text-sm flex-shrink-0 flex items-center gap-1"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Music className="w-3 h-3 md:w-4 md:h-4" />
                          {audioTrack.duration || currentTrack === realIndex && duration ? formatTime(duration) : "—:—"}
                        </motion.div>

                        {/* Download */}
                        <Button
                          variant="ghost"
                          className="rounded-full flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(audioTrack);
                          }}
                        >
                          <Download className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                      </div>

                      {/* Waveform visualization */}
                      {currentTrack === realIndex && isPlaying && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-1 mt-4 h-8"
                        >
                          {[...Array(40)].map((_, i) => (
                            <motion.div
                              key={i}
                              className={`flex-1 bg-gradient-to-t ${getTrackColor(audioTrack.category)} rounded-full`}
                              animate={{
                                height: [
                                  `${20 + Math.random() * 80}%`,
                                  `${20 + Math.random() * 80}%`,
                                ],
                              }}
                              transition={{
                                duration: 0.5 + Math.random() * 0.5,
                                repeat: Infinity,
                                repeatType: "reverse",
                              }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
