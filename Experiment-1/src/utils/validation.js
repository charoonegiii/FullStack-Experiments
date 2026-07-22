import { getPlatform } from "../data/platforms";

// Returns { errors: string[], warnings: string[], charCount, charLimit }
// errors block publishing; warnings are advisory only.
export function validatePostForPlatform(content, mediaCount, platformId) {
  const platform = getPlatform(platformId);
  const errors = [];
  const warnings = [];

  const charCount = content.length;
  const hashtagCount = (content.match(/#[\w]+/g) || []).length;

  if (charCount === 0) {
    errors.push("Post content cannot be empty.");
  }

  if (charCount > platform.charLimit) {
    errors.push(
      `Exceeds ${platform.label} limit by ${charCount - platform.charLimit} characters.`
    );
  } else if (charCount > platform.charLimit * 0.9) {
    warnings.push(`Approaching the ${platform.label} character limit.`);
  }

  if (platform.requiresMedia && mediaCount === 0) {
    errors.push(`${platform.label} requires at least one media attachment.`);
  }

  if (mediaCount > platform.maxMedia) {
    errors.push(
      `${platform.label} allows a maximum of ${platform.maxMedia} media items (you have ${mediaCount}).`
    );
  }

  if (hashtagCount > platform.hashtagLimit) {
    warnings.push(
      `${hashtagCount} hashtags used — ${platform.label} recommends up to ${platform.hashtagLimit}.`
    );
  }

  return {
    errors,
    warnings,
    charCount,
    charLimit: platform.charLimit,
    isValid: errors.length === 0,
  };
}

// Runs validation across every selected platform at once.
// Returns a map: { [platformId]: validationResult }
export function validateAllPlatforms(content, mediaCount, platformIds) {
  const result = {};
  platformIds.forEach((id) => {
    result[id] = validatePostForPlatform(content, mediaCount, id);
  });
  return result;
}
