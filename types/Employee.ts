export type Employee = {
    id: string,
    prenom: string,
    nom: string,
    email: string,
    motDePasse: string|null,
    confirmationMotDePasse: string|null,
    dateNaissance: string,
    genreUtilisateur: string,
    employePhotoReference: string,
    role: string
    photoFile: File|null
};