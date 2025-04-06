export enum AddressStatus {
    PRINCIPALE = "PRINCIPALE",
    SECONDAIRE = "SECONDAIRE",
    FACTURATION = "FACTURATION"
  }
  
  export type Address = {
    id?: string;
    codeCommune: string;
    codePostal: string;
    nomRue: string;
    nomVille: string;
    numeroAppartement: string;
    numeroBatiment: string;
    statut: AddressStatus;
    horodatageAjout?: string;
  };

  