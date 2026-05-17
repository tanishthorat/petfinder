import { supabase, isSupabaseConfigured } from './supabaseClient';

type PetsQuery = {
  type?: string;
  gender?: string;
  age?: string;
  size?: string;
  limit?: number;
  page?: number;
};

export async function getPetsFromSupabase(query: PetsQuery = {}) {
  if (!isSupabaseConfigured()) return null;

  let qb = supabase.from('pets').select('*');

  if (query.type) qb = qb.eq('type', query.type);
  if (query.gender) qb = qb.eq('gender', query.gender);
  if (query.age) qb = qb.eq('age_string', query.age);
  if (query.size) qb = qb.eq('size', query.size);

  const limit = query.limit ?? 50;
  const page = Math.max(0, (query.page ?? 1) - 1);
  const from = page * limit;
  const to = from + limit - 1;

  qb = qb.range(from, to).order('created_at', { ascending: false });

  const { data, error, count } = await qb;
  if (error) throw error;

  return {
    animals: data ?? [],
    pagination: {
      count: (data ?? []).length,
      total_count: count ?? (data ?? []).length,
      current_page: page + 1,
      total_pages: 1,
    },
  };
}

export async function getLikedPetIdsForUser(userId: string) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('likes').select('pet_id').eq('user_id', userId);
  if (error) throw error;
  return (data || []).map((r: any) => r.pet_id);
}

export async function toggleLike(userId: string, petId: string, like = true) {
  if (!isSupabaseConfigured()) return null;
  if (like) {
    const { error } = await supabase.from('likes').insert({ user_id: userId, pet_id: petId }).maybeSingle();
    if (error) throw error;
    return { liked: true };
  } else {
    const { error } = await supabase.from('likes').delete().match({ user_id: userId, pet_id: petId });
    if (error) throw error;
    return { liked: false };
  }
}
