import fs from 'fs';
import path from 'path';


export default defineEventHandler(async (event) => {
  try {
    // Lire les fichiers envoyés en multipart/form-data
    const files = await readMultipartFormData(event);
    if (!files || files.length === 0) {
      return createError({ statusCode: 400, statusMessage: 'Aucun fichier reçu' });
    }

    const uploadedFilePaths: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public/images/users');

    // Vérifier et créer le dossier de destination s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    files.forEach((file) => {
      const filePath = path.join(uploadDir, file.filename as string);
      fs.writeFileSync(filePath, file.data);
      uploadedFilePaths.push(`/images/users/${file.filename}`);
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Fichiers téléchargés avec succès',
      files: uploadedFilePaths,
    };
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    return createError({ statusCode: 500, statusMessage: 'Erreur interne du serveur' });
  }
});
