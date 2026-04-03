export function getPublicProofUrl(path: string | null): string | null {
  if (!path) return null;

  return `https://huzfqoalodnqvxwvsuaf.supabase.co/storage/v1/object/public/payment_proofs/${path}`;
}
