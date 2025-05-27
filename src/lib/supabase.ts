import { createClient } from '@supabase/supabase-js';

// @alex u should prolly use  env vars for this
// i had it hardcoded cuz im a baws

export const supabase = createClient('https://.supabase.co', '..--');

// console.log("Supabase Instance: ", supabase);
