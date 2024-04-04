export async function uploadJpgToFirebaseStorage(localJpgPath, destinationPath,bucket) {
    
    try {
      await bucket.upload(localJpgPath, {
        destination: destinationPath,
      });
  
      // Hacer el archivo público (opcional, depende de tus requisitos de privacidad)
      const file = bucket.file(destinationPath);
      await file.makePublic();
  
      // Obtener la URL pública (ajusta según tus necesidades de acceso)
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
      console.log(`Archivo JPEG subido con éxito. URL pública: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      console.error('Error al subir el archivo JPEG a Firebase Storage:', error);
      throw error; // Propagar el error
    }
  }