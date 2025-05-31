// src/stores/wishlistStore.js
import { create } from 'zustand';
import axios from 'axios';

import { getWishlistSer, addToWishlistSer } from '../services/wishListService';

const useWishlistStore = create((set, get) => ({
  wishlist: [], // Lưu bookSaleId
  hasLoaded: false,

  // Load từ API
  fetchWishlist: async (userId) => {
    try {
      if (!userId) {
        const wishlistLocal = JSON.parse(localStorage.getItem('wishlist')) || [];
        set({ wishlist: wishlistLocal, hasLoaded: true });
        return;
      }
      const res = await getWishlistSer(userId);
      const ids = res.data.items.map(item => item.bookId);
      set({ wishlist: ids, hasLoaded: true });
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    }
  },

  // Thêm hoặc xóa (toggle)
  toggleWishlist: async (userId, bookId) => {
    const { wishlist } = get();
    if (!userId) {
      // Nếu không có userId, lưu vào localStorage
      const wishlistLocal = JSON.parse(localStorage.getItem('wishlist')) || [];
      const exists = wishlistLocal.includes(bookId);
      const updated = exists
        ? wishlistLocal.filter(id => id !== bookId)
        : [...wishlistLocal, bookId];

      localStorage.setItem('wishlist', JSON.stringify(updated));
      set({ wishlist: updated });
      return;
    }
    const exists = wishlist.includes(bookId);
    const updated = exists
      ? wishlist.filter(id => id !== bookId)
      : [...wishlist, bookId];

    set({ wishlist: updated });

    try {
      await addToWishlistSer(userId, bookId);
    } catch (err) {
      console.error('Failed to update wishlist:', err);
    }
  },
}));

export default useWishlistStore;
