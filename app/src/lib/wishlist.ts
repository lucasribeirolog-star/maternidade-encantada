const STORAGE_KEY = "wishlist";
const EVENT_NAME = "wishlist-change";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function getWishlist(): string[] {
  return read();
}

export function isInWishlist(productId: string): boolean {
  return read().includes(productId);
}

export function toggleWishlist(productId: string): boolean {
  const ids = read();
  const index = ids.indexOf(productId);
  if (index === -1) {
    ids.push(productId);
    write(ids);
    return true;
  }
  ids.splice(index, 1);
  write(ids);
  return false;
}

export function subscribeWishlist(callback: () => void): () => void {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}
