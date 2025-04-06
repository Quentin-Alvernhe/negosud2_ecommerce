import fs from 'fs';
import path from 'path';
import crypto, { generateKeyPair } from 'crypto';

export function utilities() {
    
  const statutMessage: Ref<string> = ref('');
  const formatDate = (dateArray: any, format: 'YYYY-MM-DD' | 'DD-MM-YYYY' = 'YYYY-MM-DD'): string => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return "Date inconnue";
    }
  
    try {
      // Convertir le tableau en un objet Date
      const [year, month, day, hour, minute, second] = dateArray;
      const date = new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
  
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        return "Date invalide";
      }
  
      // Formater la date en fonction du format demandé
      if (format === 'YYYY-MM-DD') {
        const formattedDate = date.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        });
  
        // Reverser et joindre pour obtenir le format YYYY-MM-DD
        return formattedDate.split('/').reverse().join('-');
      } else if (format === 'DD-MM-YYYY') {
        const formattedDate = date.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
  
        // Retourner la date au format DD-MM-YYYY
        return formattedDate;
      }
  
      // Si aucun format valide n'est sélectionné, on peut aussi retourner une valeur par défaut
      return "Date inconnue";
  
    } catch (error) {
      console.error("Erreur lors de la conversion de la date :", error);
      return "Date invalide";
    }
  };
  
    const JSONResponseToString = (rawData: object): string => {
        const cleanedData = JSON.stringify(rawData)
            .replace(/[{}"]/g, '') // Retire les accolades, guillemets
            .replace(/,/g, '\n'); // Remplace les virgules par des retours à la ligne
        return cleanedData;
    };


    

    return {
        JSONResponseToString,
        formatDate
    };
}
