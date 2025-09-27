import z from "zod";

export const LocationSchema = z.object({
  name: z.string(),
  country: z.string(),
  state: z.string().optional(),
  lat: z.number(),
  lon: z.number(),
  display_name: z.string(),
});

export const WeatherSchema = z.object({
  temperature: z.number(),
  description: z.string(),
  humidity: z.number(),
  wind_speed: z.number(),
  feels_like: z.number(),
  icon: z.string(),
});

export const TimeInfoSchema = z.object({
  timezone: z.string(),
  current_time: z.string(),
  utc_offset: z.string(),
});

export const PlaceInfoSchema = z.object({
  title: z.string(),
  extract: z.string(),
  thumbnail: z.string().optional(),
  page_url: z.string().optional(),
});

export type LocationType = z.infer<typeof LocationSchema>;
export type WeatherType = z.infer<typeof WeatherSchema>;
export type TimeInfoType = z.infer<typeof TimeInfoSchema>;
export type PlaceInfoType = z.infer<typeof PlaceInfoSchema>;

export interface SearchResult {
  location: LocationType;
  weather: WeatherType | null;
  timeInfo: TimeInfoType | null;
  placeInfo: PlaceInfoType | null;
  loading: boolean;
  error: string | null;
}
