'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductById, updateProduct } from '@/services/product.service';
import { createAuditLog } from '@/services/audit.service';
import { storage } from '@/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { generateSlug } from '@/utils/generateSlug';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { toast } from 'sonner';
import Image from 'next/image';
import { ChevronLeft, Save, Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface AdminProductEditProps {
  productId: string;
}

export function AdminProductEdit({ productId }: AdminProductEditProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  // Image mode states
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [imageUrl, setImageUrl] = useState<string>('');

  // Fetch initial product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(productId);
        if (product) {
          setName(product.name);
          setSlug(product.slug);
          setCategory(product.category);
          setPrice(String(product.price));
          setStock(String(product.stock));
          setDescription(product.description);
          setImageUrl(product.image);
        } else {
          toast.error('Produk tidak ditemukan.');
          router.push('/admin/products');
        }
      } catch (err) {
        console.error('Error fetching product for edit:', err);
        toast.error('Gagal mengambil detail produk.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, router]);

  // Generate slug dynamically when name changes
  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(generateSlug(val));
  };

  // Upload image to Firebase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!storage) {
      toast.error('Firebase Storage tidak aktif. Silakan gunakan opsi URL Gambar.');
      return;
    }

    try {
      setUploading(true);
      const fileRef = ref(storage, `products/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      setImageUrl(downloadUrl);
      toast.success('Gambar berhasil diunggah!');
    } catch (err) {
      console.error('File upload error:', err);
      toast.error('Gagal mengunggah gambar. Coba input URL secara manual.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Nama produk wajib diisi.');
      return;
    }
    if (!category.trim()) {
      toast.error('Kategori wajib diisi.');
      return;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      toast.error('Harga harus berupa angka lebih besar dari 0.');
      return;
    }
    const numStock = Number(stock);
    if (isNaN(numStock) || numStock < 0) {
      toast.error('Stok minimal 0.');
      return;
    }
    if (!description.trim()) {
      toast.error('Deskripsi produk wajib diisi.');
      return;
    }

    try {
      setSubmitting(true);

      const updatedProduct = {
        name: name.trim(),
        slug: slug.trim() || generateSlug(name),
        description: description.trim(),
        category: category.trim(),
        price: numPrice,
        stock: numStock,
        image: imageUrl.trim(),
        updatedAt: new Date().toISOString(),
      };

      await updateProduct(productId, updatedProduct);
      
      // Record Audit Log
      await createAuditLog({
        action: 'PRODUCT_UPDATE',
        user: 'admin@example.com',
        ipAddress: 'client-browser',
        description: `Memperbarui produk: ${updatedProduct.name} (ID: ${productId})`,
      });

      toast.success('Produk berhasil diperbarui.');
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error('Gagal memperbarui produk. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <LoadingSkeleton variant="circle" className="h-6 w-6" />
          <LoadingSkeleton variant="title" className="w-48" />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-6">
          <LoadingSkeleton variant="rect" className="h-10" />
          <LoadingSkeleton variant="rect" className="h-10" />
          <div className="grid grid-cols-2 gap-4">
            <LoadingSkeleton variant="rect" className="h-10" />
            <LoadingSkeleton variant="rect" className="h-10" />
          </div>
          <LoadingSkeleton variant="rect" className="h-28" />
          <LoadingSkeleton variant="rect" className="h-16" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Back button header navigation */}
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-extrabold text-white">Edit Informasi Produk</h1>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-sm space-y-6">
        
        {/* Name input */}
        <Input
          label="Nama Produk"
          placeholder="Contoh: Asus ROG Strix G15"
          required
          disabled={submitting}
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
        />

        {/* Slug input */}
        <Input
          label="Product Slug (URL-friendly)"
          placeholder="asus-rog-strix-g15"
          required
          disabled={submitting}
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category input */}
          <Input
            label="Kategori"
            placeholder="Contoh: Laptop"
            required
            disabled={submitting}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          {/* Price input */}
          <Input
            label="Harga (Rupiah)"
            type="number"
            placeholder="Contoh: 18500000"
            required
            disabled={submitting}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          {/* Stock input */}
          <div className="sm:col-span-2">
            <Input
              label="Jumlah Stok"
              type="number"
              placeholder="Contoh: 10"
              required
              disabled={submitting}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </div>

        {/* Description textarea */}
        <Textarea
          label="Deskripsi Produk"
          placeholder="Tulis deskripsi detail produk di sini..."
          required
          disabled={submitting}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Image Attachment selection */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">Gambar Produk</label>
          
          <div className="flex gap-4 border-b border-slate-800 pb-2.5">
            <button
              type="button"
              onClick={() => setImageMode('url')}
              className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition-all border-b-2 ${
                imageMode === 'url' ? 'border-primary text-white' : 'border-transparent text-slate-400'
              }`}
            >
              <LinkIcon className="h-4 w-4" />
              Input URL Gambar
            </button>
            <button
              type="button"
              onClick={() => setImageMode('upload')}
              className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition-all border-b-2 ${
                imageMode === 'upload' ? 'border-primary text-white' : 'border-transparent text-slate-400'
              }`}
            >
              <Upload className="h-4 w-4" />
              Unggah File (Firebase Storage)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8">
              {imageMode === 'url' ? (
                <Input
                  placeholder="Contoh: https://images.unsplash.com/photo-..."
                  disabled={submitting}
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  aria-label="URL Gambar"
                />
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={submitting || uploading}
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
                  />
                  {uploading && <span className="absolute right-3 top-2 text-[10px] text-slate-400">Mengunggah...</span>}
                </div>
              )}
            </div>

            {/* Image Preview Box */}
            <div className="md:col-span-4 flex items-center justify-center border border-slate-800 bg-slate-950 rounded-lg h-24 overflow-hidden relative">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-600">
                  <ImageIcon className="h-6 w-6 mb-1" />
                  <span className="text-[10px]">Preview Gambar</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
          <Link href="/admin/products">
            <Button type="button" variant="outline" disabled={submitting} className="border-slate-800 text-slate-300 hover:bg-slate-800">
              Batal
            </Button>
          </Link>
          <Button type="submit" disabled={submitting || uploading} className="flex items-center gap-2 font-bold bg-primary hover:bg-primary/95 text-white">
            <Save className="h-4 w-4" />
            {submitting ? 'Menyimpan...' : 'Perbarui Produk'}
          </Button>
        </div>
      </form>
    </div>
  );
}
export default AdminProductEdit;
