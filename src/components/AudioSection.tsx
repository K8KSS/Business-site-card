import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Headphones, Play, Pause, SkipBack, SkipForward, Volume2, Download, Music, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";
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

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      nextTrack();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Ensure audio element is ready
    const playAudio = async () => {
      if (isPlaying && audioTracks[currentTrack]?.file_url) {
        try {
          await audio.play();
        } catch (err) {
          console.error("Playback failed:", err);
          setIsPlaying(false);
        }
      } else {
        audio.pause();
      }
    };

    playAudio();
  }, [isPlaying, currentTrack, audioTracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume[0] / 100;
    }
  }, [volume]);

  const playPause = () => {
    if (audioTracks[currentTrack]?.file_url) {
      setIsPlaying(!isPlaying);
    } else {
      toast.error("Аудиофайл не загружен. Добавьте файлы через админ-панель.");
    }
  };

  const nextTrack = () => {
    if (audioTracks.length > 0) {
      setCurrentTrack((prev) => (prev + 1) % audioTracks.length);
      setIsPlaying(true);
    }
  };

  const prevTrack = () => {
    if (audioTracks.length > 0) {
      setCurrentTrack((prev) => (prev - 1 + audioTracks.length) % audioTracks.length);
      setIsPlaying(true);
    }
  };

  const selectTrack = (index: number) => {
    if (audioTracks[index]) {
      setCurrentTrack(index);
      setIsPlaying(true);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio && duration) {
      const newTime = (value[0] / 100) * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleDownload = async (track: any) => {
    if (!track.file_url) {
      toast.error("Файл не доступен для скачивания");
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = track.file_url;
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
    if (isNaN(time)) return "0:00";
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

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
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
            <Headphones className="w-16 h-16 text-purple-600" />
          </motion.div>
          <h2 className="text-5xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Аудиотека
          </h2>
          <p className="text-xl text-gray-600">Музыка для занятий и праздников</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl sticky top-24">
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
                <Music className="w-24 h-24 text-white" />
              </motion.div>

              {/* Track Info */}
              <div className="text-center mb-6">
                <h3 className="text-2xl text-gray-800 mb-2">{track.title}</h3>
                <p className="text-purple-600 mb-1">{track.artist}</p>
                <p className="text-sm text-gray-500">{track.category}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <Slider
                  value={[duration ? (currentTime / duration) * 100 : 0]}
                  onValueChange={handleSeek}
                  max={100}
                  step={0.1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={prevTrack}
                    variant="outline"
                    className="rounded-full w-12 h-12 border-2 border-purple-300"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    onClick={playPause}
                    className="rounded-full w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7" />
                    ) : (
                      <Play className="w-7 h-7 ml-1" />
                    )}
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={nextTrack}
                    variant="outline"
                    className="rounded-full w-12 h-12 border-2 border-purple-300"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3 mb-6">
                <Volume2 className="w-5 h-5 text-gray-600" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-10">{volume[0]}%</span>
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
                src={track.file_url || undefined}
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
              <h3 className="text-2xl mb-6 text-gray-800">Плейлист ({audioTracks.length})</h3>
              
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
                {filteredTracks.map((audioTrack, index) => (
                  <motion.div
                    key={audioTrack.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => selectTrack(index)}
                    className={`
                      bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all
                      ${currentTrack === index ? 'ring-2 ring-purple-500' : 'hover:shadow-xl'}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      {/* Track Number / Play Icon */}
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getTrackColor(audioTrack.category)} flex items-center justify-center text-white flex-shrink-0`}>
                        {currentTrack === index && isPlaying ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          >
                            <Pause className="w-6 h-6" />
                          </motion.div>
                        ) : (
                          <span className="text-lg">{index + 1}</span>
                        )}
                      </div>

                      {/* Track Info */}
                      <div className="flex-1">
                        <h4 className="text-lg text-gray-800 mb-1">{audioTrack.title}</h4>
                        <p className="text-sm text-gray-600">{audioTrack.artist} • {audioTrack.category}</p>
                      </div>

                      {/* Duration */}
                      <div className="text-gray-500 text-sm">
                        {audioTrack.duration || "0:00"}
                      </div>

                      {/* Download */}
                      <Button
                        variant="ghost"
                        className="rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(audioTrack);
                        }}
                      >
                        <Download className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Waveform visualization */}
                    {currentTrack === index && isPlaying && (
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
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}