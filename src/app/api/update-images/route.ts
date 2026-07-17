import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    let updated = 0;
    for (const document of snapshot.docs) {
      const data = document.data();
      let newImage = '';
      if (data.name.includes('Laptop')) {
        newImage = 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80';
      } else if (data.name.includes('Keyboard')) {
        newImage = 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80';
      } else if (data.name.includes('Mouse')) {
        newImage = 'https://images.unsplash.com/photo-1527814050087-179f376dd0e7?w=800&q=80';
      } else if (data.name.includes('Headset')) {
        newImage = 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80';
      }

      if (newImage) {
        await updateDoc(doc(db, 'products', document.id), { image: newImage });
        updated++;
      }
    }
    
    return NextResponse.json({ success: true, updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}
