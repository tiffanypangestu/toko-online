import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { Card } from './Card';
import { Button } from '../ui/Button';
import { formatRupiah } from '@/utils/format';
import { Eye, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onDetailClick: (product: Product) => void;
  onAddToCartClick: (product: Product) => void;
}

export function ProductCard({
  product,
  onDetailClick,
  onAddToCartClick,
}: ProductCardProps) {
  const isOutOfStock = product.stock === 0;

  // Stock Badge Render helper
  const renderStockBadge = () => {
    if (product.stock > 10) {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
          Tersedia
        </span>
      );
    } else if (product.stock > 0) {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/10">
          Stok Terbatas
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10">
          Stok Habis
        </span>
      );
    }
  };

  return (
    <Card className="group flex flex-col overflow-hidden h-full">
      {/* Product Image */}
      <div className="relative mb-4 aspect-square w-full overflow-hidden bg-slate-50 rounded-lg">
        <Image
          src={product.image || 'https://placehold.co/600x600'}
          alt={`Gambar ${product.name}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 rounded bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-white">
          {product.category}
        </span>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-800 line-clamp-2 transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <div className="shrink-0">{renderStockBadge()}</div>
        </div>

        <p className="mb-4 text-xs text-slate-500 line-clamp-2">
          {product.description}
        </p>

        {/* Price & Stock info */}
        <div className="mt-auto">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900">
              {formatRupiah(product.price)}
            </span>
            <span className="text-xs text-slate-500">
              Stok: <span className="font-medium text-slate-700">{product.stock}</span>
            </span>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onDetailClick(product)}
              variant="outline"
              size="sm"
              className="flex items-center justify-center gap-1.5 py-2 hover:border-primary hover:text-primary"
              aria-label={`Lihat detail produk ${product.name}`}
            >
              <Eye className="h-4 w-4" />
              Detail
            </Button>
            <Button
              onClick={() => onAddToCartClick(product)}
              variant="primary"
              size="sm"
              className="flex items-center justify-center gap-1.5 py-2 disabled:bg-slate-100 disabled:text-slate-400"
              disabled={isOutOfStock}
              aria-label={`Tambah ${product.name} ke keranjang`}
            >
              <ShoppingCart className="h-4 w-4" />
              Beli
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
export default ProductCard;
