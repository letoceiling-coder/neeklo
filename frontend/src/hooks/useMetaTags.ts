import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  keywords?: string;
}

export function useMetaTags(
  title: string,
  description: string,
  image?: string,
  canonical?: string,
  keywords?: string
) {
  useEffect(() => {
    // Update document title
    document.title = title.includes('Neeklo') ? title : `${title} | Neeklo Studio`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update meta keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }
    }
    
    // Update Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    // Update Open Graph description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    
    // Update Open Graph image
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && image) {
      ogImage.setAttribute('content', image);
    }
    
    // Update Open Graph URL
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl && canonical) {
      ogUrl.setAttribute('content', canonical);
    }
    
    // Update Twitter card
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }
    
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage && image) {
      twitterImage.setAttribute('content', image);
    }
    
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl && canonical) {
      twitterUrl.setAttribute('content', canonical);
    }
    
    // Update canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonical);
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute('href', canonical);
        document.head.appendChild(canonicalLink);
      }
    }
  }, [title, description, image, canonical, keywords]);
}

// Alternative hook with object parameter
export function useSEO(options: SEOOptions) {
  return useMetaTags(
    options.title,
    options.description,
    options.image,
    options.canonical,
    options.keywords
  );
}
