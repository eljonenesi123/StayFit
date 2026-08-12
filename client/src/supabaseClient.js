import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gcrioflbvmyhtmqsrtzz.supabase.co'
const supabaseAnonKey = 'sb_publishable_Mk8vyWLlooEzXn-MP9iHQA_Il6yMqy3'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
