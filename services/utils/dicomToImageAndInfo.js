import fs from'fs';
import dicomParser from 'dicom-parser';
import sharp from 'sharp';
import {uploadJpgToFirebaseStorage} from "./firebaseUploadFile.js"

const pathImageFirebase='/medicalTest/';
export async function dicomToJpg(dicomFilePath, jpgFilePath,bucket) {
  try {
    // Leer el archivo DICOM
    const dicomData = fs.readFileSync(dicomFilePath);
    const dataSet = dicomParser.parseDicom(dicomData);

    // Extraer el pixelData del archivo DICOM
    const numberOfFrames= isNaN(parseInt(dataSet.string('x00280008'),10) )?1:parseInt(dataSet.string('x00280008'),10);
    const pixelDataElement = dataSet.elements.x7fe00010;
    const samplesPerPixel = dataSet.uint16('x00280002')
    const pixelData = new Uint8Array(dicomData.buffer, pixelDataElement.dataOffset, pixelDataElement.length);
    const manufacturer = dataSet.string('x00080070')
    const institution = dataSet.string('x00080080')
    const station = dataSet.string('x00081010')
    const patient = dataSet.string('x00100010')
    const patientBirthDate = dataSet.string('x00100030')
    const patientGender = dataSet.string('x00100040')

    console.log('samples per pixel: ', typeof samplesPerPixel)
    //if(isNaN(numberOfFrames) || )
    for(let i=0;i<numberOfFrames;i++){
  // Determinar las dimensiones de la imagen
      let rows = dataSet.uint16('x00280010');
      let columns = dataSet.uint16('x00280011');

      console.log('samples per pixel: ', samplesPerPixel)
      // Convertir el pixelData a imagen JPG usando sharp
      const prePath=`ultrasonido${Date.now() + i}.jpg`;
      const outputPath = `.${jpgFilePath}/${prePath}`;
      await sharp(Buffer.from(pixelData), {
        raw: {
          width: columns,
          height: rows,
          channels: samplesPerPixel // Número de canales, en este caso, 1 para escala de grises
        }
      })
      .jpeg({ quality: 90 })
      .toFile(outputPath);

      console.log(`La conversión de ${dicomFilePath} a ${jpgFilePath} fue exitosa.`);
      const publicUrl=await uploadJpgToFirebaseStorage(outputPath,pathImageFirebase+prePath,bucket);
      const dataDicom= await {institution,station,patient,patientBirthDate,patientGender,medicalTest:{publicUrl}}
      return await dataDicom;
    }
 
  } catch (error) {
    console.error('Error al conveilePath, jpgFilrtir el archivo DICOM a JPG:', error);
  }
}



