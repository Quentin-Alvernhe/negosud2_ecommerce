import type { Address } from './Address';

export type Customer = {
  id?: string;
  prenom: string;
  nom: string;
  email: string;
  dateNaissance: string;
  genreUtilisateur: string;
  statut?: string;
  pseudo?: string;
  numeroTelephone?: string;
  clientPhotoReference?: string;
  adresses?: Address[];
};