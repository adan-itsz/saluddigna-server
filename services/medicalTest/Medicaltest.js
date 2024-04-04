import {sendOrderInProgressMessage} from '../whatsapp/messages.js'
export async function newMedicalTest(dataForm,datos,db, admin) {
    try {
      const testId = db.collection("medicalTest").doc().id; // Generar el UID del test
      const medicalTestRef = db.collection("medicalTest").doc(testId); // Crear una referencia al documento con el UID generado
      const newMedicalTest = {
        ...datos,
        phone:dataForm.phone,
        orderNumber: dataForm.orderNumber,
        fechaCreacion: admin.firestore.FieldValue.serverTimestamp()
      };
      if(newMedicalTest.phone){
        await medicalTestRef.set(newMedicalTest);
      }
      
      if (newMedicalTest.phone) {
        sendOrderInProgressMessage(
          newMedicalTest.patient,
          newMedicalTest.phone,
          `Hola ${newMedicalTest.patient} los resultados de tus estudios estan listos`,
          `Omaka`,
          
        );
      }
      return({ status: "OK", newMedicalTest});
    } catch (error) {
      console.log("error CrearPedido => ", error);
      return({ status: "505", errorMessage: error });
    }
  }

  export async function findMedicalTest(orderNumber,db){
    try{
      const querySnapshot = await db.collection('medicalTest') // Reemplaza 'tuColeccion' con el nombre real de tu colección
      .where('orderNumber', '==', orderNumber)
      .get();

    if (querySnapshot.empty) {
      console.log('No se encontraron documentos con ese orderNumber.');
      return null;
    }

    querySnapshot.forEach(doc => {
      console.log(`Documento encontrado: ${doc.id}`, doc.data());
      // Haz algo con cada documento. Por ejemplo, puedes retornar los datos del documento.
    });

    // Si solo esperas un documento, puedes simplemente retornar el primer documento encontrado
    // Recuerda manejar adecuadamente el caso donde puedan existir múltiples documentos con el mismo orderNumber
    return querySnapshot.docs[0].data();

    }catch(err){
      console.log(err)
      console.log("error findMedicalTest => ", error);
      res.send({ status: "505", errorMessage: error });
    }
  }