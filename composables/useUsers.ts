// src/composables/useCategories.ts
import { ref } from 'vue';
import type { Ref } from 'vue'; // Import du type Ref
import type { Employee } from '~/types/Employee';
import { useNuxtApp } from '#app';
import { utilities } from './utilities';
export function useUsers() {
  const employees: Ref<Employee[]> = ref([]); // Typage explicite pour les catégories
  const isLoading: Ref<boolean> = ref(true);
  const statutCode: Ref<number> = ref(0); // Typage explicite pour le code statut
  const statutMessage: Ref<string> = ref('');
  let employee: Ref<Employee | null> = ref(null); // Typage explicite pour récupérer une seule catégorie
  const {JSONResponseToString,formatDate} = utilities();
    const mapEmployeeFromApi = (apiEmployee: any): Employee => {
      return {
        id: apiEmployee.id,
        prenom: apiEmployee.prenom,
        nom: apiEmployee.nom,
        email: apiEmployee.email,
        dateNaissance:  apiEmployee.dateNaissance,
        genreUtilisateur: apiEmployee.genreUtilisateur,
        employePhotoReference: apiEmployee.employePhotoReference,
        role: apiEmployee.role,
        photoFile: null,
        motDePasse:null,
        confirmationMotDePasse:null
      };
    };
    const mapEmployeeForApi = (Employee: Partial<Employee>): any => {
      const mappedData: any = {};
    
      // Mapper uniquement les champs définis
      if (Employee.nom !== undefined) mappedData.nom = Employee.nom;
      if (Employee.email !== undefined) mappedData.email = Employee.email;
      if (Employee.prenom !== undefined) mappedData.prenom = Employee.prenom;
      if (Employee.dateNaissance !== undefined) mappedData.dateNaissance = Employee.dateNaissance;
      if (Employee.genreUtilisateur !== undefined) mappedData.genreUtilisateur = Employee.genreUtilisateur;
      if (Employee.employePhotoReference !== undefined) mappedData.employePhotoReference = Employee.employePhotoReference;
      if (Employee.role !== undefined) mappedData.role = Employee.role;
      if (Employee.motDePasse !== null && Employee.motDePasse !== '') mappedData.motDePasse = Employee.motDePasse;
    
      return mappedData;
    };
  const fetchEmployee = async (): Promise<void> => {
    try {
      const { $axios } = useNuxtApp();
      const response = await $axios.get<[]>('utilisateur/employe/all');
      employees.value = response.data.map(mapEmployeeFromApi);

      // Succès : enregistrer le statut et le message
      statutCode.value = response.status;
      statutMessage.value = 'Les employées ont été chargés avec succès.';
     
    } catch (err: any) {
      // Gestion des erreurs : extraire statut et message
      if (err.response) {
        statutCode.value = err.response.status;
        statutMessage.value = err.response.data.message || 'Une erreur est survenue lors du chargement des employés.';
      } else {
        statutCode.value = 500;
        statutMessage.value = 'Erreur réseau ou serveur.';
      }

      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

    const updateEmployee = async (id: string, data: Partial<Employee>): Promise<void> => {

      try {

        const { $axios } = useNuxtApp();
        const mappedData = mapEmployeeForApi(data);
        console.log("Données mappées ",mappedData);
        const response = await $axios.put<any>(`utilisateur/employe/${id}/edit`, mappedData);
        
        statutCode.value = response.status;
        statutMessage.value = 'L\'employé a été modifié avec succès.';
        //employee = response.data.map(mapEmployeeFromApi);
        console.log('employé ajouté : ',response.data);
      } catch (err: any) {
        // Gestion des erreurs : extraire statut et message
        if (err.response) {
          console.log(err.response);
          statutCode.value = err.response.status;
          statutMessage.value = JSONResponseToString(err.response.data) || 'Une erreur est survenue lors de la mise à jour de l\'employé.';
        } else {
          statutCode.value = 500;
          statutMessage.value = 'Erreur réseau ou serveur.';
        }
  
        console.error(err);
      }
    };
    const addEmployee = async (data: Partial<Employee>): Promise<void> => {
      try {
        employee.value = null;
        const { $axios } = useNuxtApp();
        const mappedData = mapEmployeeForApi(data);
        const response = await $axios.post<any>(`utilisateur/employe/new`, mappedData);
        //supplier.value = response.data;
        //Pour le moment pas de retour de l'api en cas de création donc simulation de l'objet
        //supplier.value = {id:"rffdd",email: data.email||"",nom:data.nom||"",};
        // Succès : enregistrer le statut et le message
        statutCode.value = response.status;
        statutMessage.value = 'L\'utilisateur a été ajouté avec succés.';
        
        employee.value = mapEmployeeFromApi(response.data);
      } catch (err: any) {
        // Gestion des erreurs : extraire statut et message
        if (err.response) {
          statutCode.value = err.response.status;
          statutMessage.value = JSONResponseToString(err.response.data) || 'Une erreur est survenue lors de l\'ajout de l\'employé.';

        } else {
          statutCode.value = 500;
          statutMessage.value = 'Erreur réseau ou serveur.';
        }
  
        console.error(err);
      }
    };
    const deleteEmployee = async (id: string): Promise<void> => {
      statutMessage.value = "Non implémenté";
    
  };

  return {
    employees,
    employee,
    isLoading,
    statutCode,
    statutMessage,
    fetchEmployee,
    updateEmployee,
    addEmployee,
    deleteEmployee
  
  };
}
