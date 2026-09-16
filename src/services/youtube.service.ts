import { supabase } from "@/lib/supabaseClient";

export interface YoutubeVideo {
  id: string;
  part: "I" | "II" | "III";
  order_num: number;
  tema: string;
  invitado: string | null;
  youtube_link: string | null;
  note: string | null;
  created_at: string;
}

export const youtubeService = {
  async getVideos(): Promise<YoutubeVideo[]> {
    const { data, error } = await supabase
      .from("youtube_playlist")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async createVideo(payload: Omit<YoutubeVideo, "id" | "created_at">): Promise<YoutubeVideo> {
    const { data, error } = await supabase
      .from("youtube_playlist")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateVideo(
    id: string,
    payload: Partial<Omit<YoutubeVideo, "id" | "created_at">>,
  ): Promise<YoutubeVideo> {
    const { data, error } = await supabase
      .from("youtube_playlist")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteVideo(id: string): Promise<void> {
    const { error } = await supabase.from("youtube_playlist").delete().eq("id", id);

    if (error) throw error;
  },
};
