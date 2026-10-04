import { useEffect } from 'react';

const SITE_NAME = 'Systems Whispering';

function setMetaDescription(description: string) {
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', 'description');
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', description);
}

/** Per-page document title + meta description for SEO. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`;
    if (description) setMetaDescription(description);
  }, [title, description]);
}
