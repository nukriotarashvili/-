export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    profile_image: {
      small: string;
    };
    links: {
      html: string;
    };
  };
  likes: number;
  created_at: string;
  width: number;
  height: number;
  downloads: number;
  views: number;
}

export interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

export interface UnsplashRandomResponse extends Array<UnsplashPhoto> {}

export interface PhotoCache<T> {
  data: T;
  timestamp: number;
} 