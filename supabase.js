const SUPABASE_URL =
    "https://barziuretntaduhwdimz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_e03qh-Uq3OvuUqzRm_qFJg_7_czhVGY";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );