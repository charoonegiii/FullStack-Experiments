// Platform-specific rules used for dynamic validation in the composer.
// Add a new platform by adding one object here — the UI adapts automatically.

export const PLATFORMS = [
  {
    id: "twitter",
    label: "X (Twitter)",
    color: "#1d9bf0",
    charLimit: 280,
    maxMedia: 4,
    allowedMedia: ["image", "gif", "video"],
    hashtagLimit: 10,
    notes: "Links count as 23 characters regardless of length.",
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "#e1306c",
    charLimit: 2200,
    maxMedia: 10,
    allowedMedia: ["image", "video"],
    hashtagLimit: 30,
    requiresMedia: true,
    notes: "At least one image or video is required.",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "#0a66c2",
    charLimit: 3000,
    maxMedia: 9,
    allowedMedia: ["image", "video", "document"],
    hashtagLimit: 5,
    notes: "Posts over ~210 characters get truncated behind 'see more'.",
  },
  {
    id: "facebook",
    label: "Facebook",
    color: "#1877f2",
    charLimit: 63206,
    maxMedia: 10,
    allowedMedia: ["image", "video", "gif"],
    hashtagLimit: 30,
    notes: "Very high limit, but posts over ~500 characters see lower reach.",
  },
];

export const getPlatform = (id) => PLATFORMS.find((p) => p.id === id);
