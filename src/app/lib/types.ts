// /app/lib/types.ts

export interface AffiliateLink {
    provider: string;
    url: string;
  }
  
  // The Author interface is no longer needed if the API sends strings
  // export interface Author {
  //   name: string;
  // }
  
  // The Genre interface is no longer needed if the API sends strings
  // export interface Genre {
  //   name: string;
  // }
  
  export interface Summary {
    summary_id: string;
    text_content: string;
  }
  
  export interface Book {
    book_id: string;
    title: string;
    authors: string[];
    genres: string[];
    description?: string;
    cover_image_url?: string;
  }
  
  export interface BookDetail {
    book_id: string;
    title: string;
    description: string | null;
    publication_date: string | null;
    cover_image_url: string | null;
    // FIX: Changed authors and genres to be string arrays
    authors: string[];
    genres: string[];
    affiliate_links: AffiliateLink[];
    summaries: Summary[];
  }
  
  export interface UserProfile {
    id: string;
    email: string;
    username: string | null;
    current_tier: string;
    is_student: boolean;
    stripe_customer_id?: string;
    had_trial?: boolean;
    subscriptions: {
      status?: string;
      cancel_at_period_end?: boolean;
      expires_at?: number;
    }[] | null;
    is_admin?: boolean;
  }
  
  export interface Review {
      review_id: string;
      rating: number;
      review_text: string;
      user_id: string;
      users: { username: string; }; // Assuming the backend joins this
      created_at: string;
  }
  
  export interface Quest {
      quest_id: string;
      name: string;
      description: string;
      xp_reward: number;
      is_completed: boolean;
  }
  
  export interface NftBadge {
      badge_id: string;
      name: string;
      description: string;
      image_url: string;
      is_animated: boolean;
  }
  
  export interface UserNftBadge {
      algorand_asset_id: number;
      nft_badges: NftBadge;
  }
  
  export interface ProfileData {
      reddit_username: string;
      game_stats?: any;
      user_nft_badges?: any[];
      [key: string]: any;
  }
  