/**
 * Formats a number into Indonesian Rupiah (IDR) currency format.
 * Example: 18500000 -> "Rp18.500.000"
 */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
