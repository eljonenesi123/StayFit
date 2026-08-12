import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gcrioflbvmyhtmqsrtzz.supabase.co'
const supabaseAnonKey = 'PASTE_PUBLISHABLE_KEY_HERE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
