/* =====================================================
   LEILÃO! — SUPABASE.JS
   Inicialização da Conexão com o Supabase Realtime & Database
===================================================== */

// Credenciais do Projeto Supabase
const SUPABASE_URL = 'https://hjcgstqaowvrseucrkbd.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_83RQsnHWofcDexZ0VcCtHw_t0vH-s_9';

let supabaseClient = null;

try {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
        console.log('Supabase inicializado com sucesso.');
    } else {
        console.warn('Biblioteca Supabase não encontrada no escopo global. Usando objeto fallback/simulado.');
    }
} catch (error) {
    console.error('Erro ao inicializar o Supabase Client:', error);
}