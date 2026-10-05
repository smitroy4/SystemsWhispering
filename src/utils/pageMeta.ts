import { useEffect } from 'react';

const SITE_NAME = 'Systems Whispering';

function setMeta(selector: string, attr: 'name' | 'property', key: string, value: string) {
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', value);
}

function setMetaDescription(description: string) {
  setMeta('meta[name="description"]', 'name', 'description', description);
}

function setSocialTags(title: string, description?: string) {
  setMeta('meta[property="og:title"]', 'property', 'og:title', `${title} | ${SITE_NAME}`);
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', `${title} | ${SITE_NAME}`);
  if (description) {
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  }
}

/** Per-page document title + meta description (+ social tags) for SEO. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`;
    if (description) setMetaDescription(description);
    setSocialTags(title, description);
  }, [title, description]);
}
