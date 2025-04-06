import { defineStore } from "pinia";
import { nextTick } from "vue";
import type { User } from "~/types/User";

export type AuthState = {
  user: Partial<User>;
  token?: string;
  isAuthenticated: boolean;
};

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: {"prenom":'',
      "nom":'',
      "email":'',
      "role":''
    },
    token: undefined,
    isAuthenticated: false,
  }),

  actions: {
    async login(credentials: { email?: string; motDePasse?: string }) {
      console.log(credentials);
      const token = await $fetch<string>("http://localhost:8080/api/utilisateur/connect", {
        method: "POST",
        body: credentials,
      });
  
      if (token) {
        this.token = token;
        this.isAuthenticated = true;  
        const test = JSON.parse(atob(token.split(".")[1]));
        console.log("token",test);
        this.user.prenom = test.Nom;
        this.user.nom = test.Prenom;
        this.user.role = test.Role[0].authority;
        this.user.email = credentials.email;
        await nextTick();
      }
    },
    disconnect() {
      this.user = {"prenom":'',
        "nom":'',
        "email":'',
        "role":''
      };
      this.token = undefined;
      this.isAuthenticated = false;
      navigateTo('/')
    },
  },

  persist: true,
});


