export type CreateShortUrlRequest = {
  originalUrl: string;
};

export type CreateShortUrlResponse = {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt?: string | null;
  countClick?: number | null;
  ip?: string | null;
};

export type UrlItem = {
  shortCode: string;
  shortUrl?: string;
  originalUrl: string;
  createdAt?: string | null;
  countClick?: number | null;
  ip?: string | null;
};

export type ClickCountResponse = {
  shortCode: string;
  countClick: number;
};
