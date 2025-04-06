import { defineStore } from "pinia";
import type { Product } from "~/types/Product";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export const useCartStore = defineStore("cart", {
  state: (): CartState => ({
    items: [],
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    totalPrice: (state) => {
      return state.items.reduce(
        (total, item) => total + item.product.prix * item.quantity,
        0
      );
    },
  },

  actions: {
    addItem(product: Product, quantity: number = 1) {
      const existingItem = this.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          product,
          quantity,
        });
      }
    },

    removeItem(productId: string) {
      const index = this.items.findIndex(
        (item) => item.product.id === productId
      );
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },

    updateQuantity(productId: string, quantity: number) {
      const item = this.items.find((item) => item.product.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },

    clearCart() {
      this.items = [];
    },
  },

  persist: true,
});