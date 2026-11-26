import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Clapperboard, Play, X, ChevronLeft, ChevronRight, Film, Wrench, Folder, FolderOpen } from 'lucide-react';
import { VideoItem } from '../types';
import { VIDEO_TYPES } from '../videoData';

interface VideosSectionProps {
  videos: VideoItem[];
}

type Source =
  | { kind: 'file'; src: string }
  | { kind: 'embed'; src: string };

/** Turn a stored videoUrl into something playable: a local/remote MP4, a YouTube embed, or a Drive preview. */
function resolveSource(url: string): Source | null {
  const u = (url || '').trim();
  if (!u) return null;
  if (u.startsWith('/')) return { kind: 'file', src: u };
  if (!u.startsWith('https://')) return null;

  const yt =
    u.match(/youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)([\w-]{11})/) ||
    u.match(/youtu\.be\/([\w-]{11})/);
  if (yt) return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0` };

  const drive = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/);
  if (drive) return { kind: 'embed', src: `https://drive.google.com/file/d/${drive[1]}/preview` };

  return { kind: 'file', src: u };
}

function youTubeThumb(url: string): string | undefined {
  const m = url.match(/youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)([\w-]{11})/) || url.match(/youtu\.be\/([\w-]{11})/);
  return m ? `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` : undefined;
}

const ASPECT_CLASS: Record<VideoItem['aspect'], string> = {
  '9:16': 'aspect-[9/16]',
  '16:9': 'aspect-video',
  '1:1': 'aspect-square',
  '4:5': 'aspect-[4/5]',
};

const isVertical = (v: VideoItem) => v.aspect === '9:16' || v.aspect === '4:5';

const VideoCard: React.FC<{ video: VideoItem; onOpen: () => void }> = ({ video, onOpen }) => {
  const source = resolveSource(video.videoUrl);
  const poster = video.posterUrl || youTubeThumb(video.videoUrl);
  const previewRef = useRef<HTMLVideoElement>(null);
  const canHoverPreview = source?.kind === 'file';

  const startPreview = () => {
    const el = previewRef.current;
    if (el) el.play().catch(() => undefined);
  };
  const stopPreview = () => {
    const el = previewRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={canHoverPreview ? startPreview : undefined}
      onMouseLeave={canHoverPreview ? stopPreview : undefined}
      onFocus={canHoverPreview ? startPreview : undefined}
      onBlur={canHoverPreview ? stopPreview : undefined}
      className="group text-left w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#028090]"
      aria-label={`Play ${video.title}`}
    >
      <div className={`relative ${ASPECT_CLASS[video.aspect]} bg-slate-900 overflow-hidden`}>
        {canHoverPreview ? (
          <video
            ref={previewRef}
            src={source.src}
            poster={poster}
            muted
            loop
            playsInline
            preload={poster ? 'none' : 'metadata'}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : poster ? (
          <img src={poster} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500">
            <Film className="h-10 w-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-90 group-hover:opacity-60 transition-opacity" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#004643] shadow-lg scale-95 group-hover:scale-105 group-hover:opacity-0 transition-all">
            <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
          </span>
        </span>
        {video.duration && (
          <span className="absolute top-2.5 right-2.5 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-mono-code font-bold text-white">
            {video.duration}
          </span>
        )}
        <span className="absolute top-2.5 left-2.5 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-mono-code font-bold text-white/90">
          {video.aspect}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex flex-wrap gap-1">
            {video.types.slice(0, 3).map((t) => (
              <span key={t} className="rounded-full bg-[#2dd4bf]/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#04201f]">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="text-sm font-bold text-[#004643] dark:text-white leading-snug line-clamp-2">{video.title}</h3>
        {video.client && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">for {video.client}</p>}
        {video.tools && video.tools.length > 0 && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
            <Wrench className="h-3 w-3 shrink-0" />
            {video.tools.join(' · ')}
          </p>
        )}
      </div>
    </button>
  );
};

const VideoLightbox: React.FC<{
  video: VideoItem;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}> = ({ video, onClose, onPrev, onNext }) => {
  const source = resolveSource(video.videoUrl);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  const vertical = isVertical(video);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Close">
        <X className="h-5 w-5" />
      </button>
      {onPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          aria-label="Previous video"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {onNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          aria-label="Next video"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      <div
        className={`flex w-full gap-5 ${vertical ? 'max-w-3xl flex-col md:flex-row md:items-center' : 'max-w-5xl flex-col'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`${ASPECT_CLASS[video.aspect]} bg-black rounded-xl overflow-hidden shadow-2xl ${
            vertical ? 'w-full max-w-[min(100%,calc(80vh*9/16))] mx-auto md:mx-0 shrink-0' : 'w-full max-h-[70vh]'
          }`}
        >
          {source?.kind === 'file' && (
            <video key={video.id} src={source.src} poster={video.posterUrl} controls autoPlay playsInline className="h-full w-full bg-black" />
          )}
          {source?.kind === 'embed' && (
            <iframe
              key={video.id}
              src={source.src}
              title={video.title}
              className="h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          )}
        </div>
        <div className="text-white min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {video.types.map((t) => (
              <span key={t} className="rounded-full bg-[#2dd4bf]/20 border border-[#2dd4bf]/40 px-2.5 py-0.5 text-[11px] font-bold text-[#2dd4bf]">
                {t}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-extrabold font-['Space_Grotesk']">{video.title}</h3>
          {video.client && <p className="text-sm text-white/60 mt-0.5">for {video.client}</p>}
          <p className="text-sm text-white/80 mt-3 leading-relaxed whitespace-pre-line">{video.description}</p>
          {video.tools && video.tools.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-wider text-white/50 font-bold mb-1.5">Tools</p>
              <div className="flex flex-wrap gap-1.5">
                {video.tools.map((tool) => (
                  <span key={tool} className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/85">{tool}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const VideosSection: React.FC<VideosSectionProps> = ({ videos }) => {
  const [activeType, setActiveType] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = useMemo(
    () =>
      [...videos].sort(
        (a, b) => Number(!!b.featured) - Number(!!a.featured) || Number(a.order || 99) - Number(b.order || 99)
      ),
    [videos]
  );

  // Tabs: known types in their defined order, then any custom types, each only if used.
  const tabs = useMemo(() => {
    const counts = new Map<string, number>();
    sorted.forEach((v) => v.types.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
    // Every type folder is always shown (even with 0 videos) so new videos only need to be added to the list.
    const known = VIDEO_TYPES.map((t) => ({ ...t, count: counts.get(t.id) || 0 }));
    const custom = [...counts.keys()]
      .filter((t) => !VIDEO_TYPES.some((k) => k.id === t))
      .map((t) => ({ id: t, label: t, hint: '', count: counts.get(t)! }));
    return [{ id: 'All', label: 'All', hint: 'Every edit, newest favourites first. Pick a type to filter.', count: sorted.length }, ...known, ...custom];
  }, [sorted]);

  const visible = activeType === 'All' ? sorted : sorted.filter((v) => v.types.includes(activeType));
  const openIndex = openId ? visible.findIndex((v) => v.id === openId) : -1;
  const openVideo = openIndex >= 0 ? visible[openIndex] : null;


  const activeHint = tabs.find((t) => t.id === activeType)?.hint;

  return (
    <section id="videos" className="py-20 bg-white dark:bg-[#0a1020] border-b border-slate-200/80 dark:border-slate-800/80 relative transition-colors duration-250">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004643]/10 dark:bg-[#028090]/20 text-[#004643] dark:text-[#2dd4bf] text-xs font-mono-code font-bold uppercase tracking-wider mb-3">
            <Clapperboard className="w-3.5 h-3.5 text-[#028090] dark:text-[#2dd4bf]" />
            <span>// 03 . VIDEO EDITING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#004643] dark:text-white font-['Space_Grotesk']">
            Video Editing Portfolio
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Short-form, long-form, UGC and ad edits: pacing, captions, motion graphics, sound design and color. Filter by the kind of video you need.
          </p>
        </div>

        {/* Type filter tabs */}
        <div
          className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto md:overflow-visible pb-2 mb-2 no-scrollbar"
          role="tablist"
          aria-label="Filter videos by type"
        >
          <div className="flex gap-2 w-max md:w-auto md:flex-wrap">
            {tabs.map((tab) => {
              const active = tab.id === activeType;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveType(tab.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap border transition-all ${
                    active
                      ? 'bg-[#004643] dark:bg-[#028090] text-white border-transparent shadow-md'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#028090] hover:text-[#004643] dark:hover:text-[#2dd4bf]'
                  }`}
                >
                  {tab.label}
                  <span className={`rounded-full px-1.5 text-[10px] ${active ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>{tab.count}</span>
                </button>
              );
            })}
          </div>
        </div>
        {activeHint && <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{activeHint}</p>}

        {visible.length > 0 ? (
          /* Grid: vertical videos take one column, wide videos take two */
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 grid-flow-row-dense items-start">
            {visible.map((video) => (
              <div key={video.id} className={isVertical(video) ? 'col-span-1' : 'col-span-2'}>
                <VideoCard video={video} onOpen={() => setOpenId(video.id)} />
              </div>
            ))}
          </div>
        ) : activeType === 'All' ? (
          /* No videos yet: show every type as a folder */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {tabs.filter((t) => t.id !== 'All').map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveType(tab.id)}
                className="group text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 hover:border-[#028090] hover:-translate-y-0.5 hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#028090]"
              >
                <Folder className="h-8 w-8 text-[#028090] dark:text-[#2dd4bf] mb-3 group-hover:hidden" />
                <FolderOpen className="h-8 w-8 text-[#028090] dark:text-[#2dd4bf] mb-3 hidden group-hover:block" />
                <p className="text-sm font-bold text-[#004643] dark:text-white">{tab.label}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{tab.hint}</p>
                <p className="mt-2 text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-400">
                  {tab.count > 0 ? `${tab.count} video${tab.count === 1 ? '' : 's'}` : 'Coming soon'}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 py-14 px-6 text-center">
            <FolderOpen className="mx-auto h-10 w-10 text-slate-400 mb-3" />
            <p className="text-sm font-bold text-[#004643] dark:text-white">
              {tabs.find((t) => t.id === activeType)?.label} videos coming soon
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">New edits are being added. Check back shortly.</p>
          </div>
        )}
      </div>

      {openVideo && (
        <VideoLightbox
          video={openVideo}
          onClose={() => setOpenId(null)}
          onPrev={openIndex > 0 ? () => setOpenId(visible[openIndex - 1].id) : undefined}
          onNext={openIndex < visible.length - 1 ? () => setOpenId(visible[openIndex + 1].id) : undefined}
        />
      )}
    </section>
  );
};
