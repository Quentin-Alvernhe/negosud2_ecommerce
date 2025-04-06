import type { Category } from "./Category";
import type { Supplier } from "./Supplier";

export type Product = {
  id: string;
  reference: string;
  nom: string;
  referenceFournisseur: string;
  quantite: number;
  category: Category;
  quantiteMinimum: number;
  description: string;
  quantitePrevisionnelle: number;
  photo: string;
  actif: boolean;
  prix: number;
  tauxTva: number;
  supplier: Supplier;
};
