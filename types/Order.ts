import type { Address } from "./Address";

export type OrderLine = {
  id?: string;
  article: {
    id: string;
    nom?: string;  // Ajout du nom qui pourrait être disponible
  };
  quantite: number;
  prixLigne?: number;
  prixUnitaire?: number;
  horodatageCreation?: string;
  prixHistorique?: {
    id: string;
    prix: number;
    tauxTVA: number;
    horodatageCreation: string;
    article: {
      id: string;
      nom?: string;
    }
  };
};

export type Order = {
  adresseFacturation: {
    id: string;
  };
  adresseLivraison: {
    id: string;
  };
  horodatagePrevisionLivraison: string;
  lignesCommandeClient: OrderLine[];
};

export type OrderResponse = {
  id: string;
  numeroCommande: string;
  horodatageCreationCommande: string | any[]; // Format de date flexible
  horodatagePrevisionLivraison: string | any[];
  horodatageLivraison?: string | any[];
  statutCommande: string;
  prixTotal: number;
  adresseLivraison: Address;
  adresseFacturation: Address;
  lignesCommandeClient: OrderLine[];
  client?: {   // Ajout du client qui pourrait être présent
    id: string;
    nom?: string;
    prenom?: string;
    email?: string;
  };
};