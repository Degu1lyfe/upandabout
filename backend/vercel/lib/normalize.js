export function aff(url, tag = 'UPA001') {
  if (!url) return url;
  return url + (url.includes('?') ? '&' : '?') + 'aff=' + encodeURIComponent(tag);
}
