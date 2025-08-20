export function productPlaceholder(seed: string, w = 640, h = 480) {
  // stable, nice-looking placeholder per product
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

export function fallbackPlaceholder(w = 640, h = 480, text = 'Product') {
  return `https://placehold.co/${w}x${h}/EEE/AAA?text=${encodeURIComponent(text)}`;
}
