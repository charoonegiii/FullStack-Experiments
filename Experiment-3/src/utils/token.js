export function encodePayload(payload) {
  try {
    return btoa(JSON.stringify(payload));
  } catch (error) {
    return '';
  }
}

export function decodePayload(encoded) {
  try {
    return JSON.parse(atob(encoded));
  } catch (error) {
    return null;
  }
}
