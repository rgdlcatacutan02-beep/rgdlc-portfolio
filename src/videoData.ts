import { VideoItem } from './types';

/**
 * Video types used as filter tabs, in display order. A tab only appears when at
 * least one video carries that type. Add new types here to control their order;
 * any other type used on a video still gets a tab (after these).
 */
export const VIDEO_TYPES: { id: string; label: string; hint: string }[] = [
  { id: 'Short-form', label: 'Short-form', hint: 'Reels, TikTok & YouTube Shorts (under 90s)' },
  { id: 'Long-form', label: 'Long-form', hint: 'YouTube videos, vlogs & full episodes' },
  { id: 'UGC', label: 'UGC', hint: 'Creator-style, user-generated content' },
  { id: 'Ad', label: 'Ads', hint: 'Paid social & performance ads' },
  { id: 'Talking Head', label: 'Talking Head', hint: 'Speaker-led edits with captions & b-roll' },
  { id: 'Podcast Clip', label: 'Podcast Clips', hint: 'Clips cut from long conversations' },
  { id: 'Motion Graphics', label: 'Motion Graphics', hint: 'Kinetic type, animated graphics & titles' },
  { id: 'Cinematic', label: 'Cinematic', hint: 'Product, car & travel showcases' },
  { id: 'Motivational', label: 'Motivational', hint: 'Quote, commentary & motivation edits' },
  { id: 'AI-Generated', label: 'AI-Generated', hint: 'Edits built with AI voice, visuals or automation' },
];

/**
 * The videos shown on the site. Web copies live in public/videos/ (H.264, 720p, under ~8 MB)
 * with a poster JPG beside each; YouTube and Google Drive links also work in videoUrl.
 */
export const defaultVideos: VideoItem[] = [];
