export interface GenreIds {
  genre_ids: number[];
}

export interface Movie extends GenreIds {
  backdrop_path: string;
  id: number;
  title?: string;
  name?: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  adult: boolean;
  original_language: string;
  popularity: number;
  release_date?: string;
  first_air_date?: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface ApiResponse {
  page: number;
  results: Movie[];
  total_pages?: number;
  total_results?: number;
}

export interface SingleMovie {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: BelongsToCollection;
  budget: number;
  genres: Genre[];
  homepage: string;
  tagline: string;
  title: string;
  type: string;
  name: string;
  id: number;
  imdb_id: string;
  vote_average: number;
  air_date: string;
  first_air_date: string;
  status?: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
}

export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface CastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface CrewMember {
  adult: boolean;
  credit_id: string;
  department: string;
  gender: number;
  id: number;
  job: string;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
}

export interface MovieCast {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface ApiResponsePerson {
  page: number;
  results: Person[];
  total_pages: number;
  total_results: number;
}

export interface Person {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  known_for: KnownForItem[];
}

export interface SinglePerson {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  known_for_department: string;
  name: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
}

export type KnownForItem = KnownForMovie | KnownForTv;

export interface BaseKnownFor {
  adult: boolean;
  name: string;
  title: string;
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
  original_language: string;
  genre_ids: number[];
  popularity: number;
  vote_average: number;
  vote_count: number;
}

export interface KnownForMovie extends BaseKnownFor {
  media_type: 'movie';
  title: string;
  original_title: string;
  release_date: string;
  video: boolean;
}

export interface KnownForTv extends BaseKnownFor {
  media_type: 'tv';
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country: string[];
}

export interface Backdrop {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface ImagesResponse {
  backdrops: Backdrop[];
  posters: Backdrop[];
}

export interface CastCredits {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string | number;
  title: string;
  name: string;
  first_air_date: string | number;
  first_credit_air_date: string | number;
  video: boolean;
  vote_average: number;
  vote_count: number;
  character: string;
  credit_id: string;
  order: number;
  media_type: string;
}

export interface CastCombined {
  cast: CastCredits[];
}

export interface VideoResponse {
  id: number;
  results: VideoResult[];
}

export interface VideoResult {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: 'YouTube' | string;
  size: number;
  type: 'Trailer' | 'Teaser' | 'Featurette' | string;
  official: boolean;
  published_at: string;
  id: string | number;
}

export interface MovieSearchResponse {
  page: number;
  results: MovieResult[];
  total_pages: number;
  total_results: number
}

export interface MovieResult {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  first_air_date: string;
  title: string;
  name: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface PopularConfig {
  link: string[];
  type: string[];
  title: string;
  mediaType?: string;
  bgData?: boolean;
}

export interface HasRating {
  vote_average: number;
}

export interface ReviewsResponse {
  id: number;
  page: number;
  results: ReviewItem[];
  total_pages: number,
  total_results: number
}

export interface ReviewItem {
  author: string;
  author_details: AuthorDetails;
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export interface AuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

export interface ShortReviewItem {
  id: string;
  content: string;
}