export async function newMedicalTest(datos,db, admin) {
    try {
      const testId = db.collection("medicalTest").doc().id; // Generar el UID del test
      const medicalTestRef = db.collection("medicalTest").doc(testId); // Crear una referencia al documento con el UID generado
      const newMedicalTest = {
        ...datos,
        phone:datos.phone,
        name:datos.name,
        orderNumber: datos.orderNumber,
        fechaCreacion: admin.firestore.FieldValue.serverTimestamp()
      };
      if(datos.phone){
        await medicalTestRef.set(newMedicalTest);
      }
      
      if (datos.phone) {
        sendMedicalTestWhatsapp(
          datos.phone,
          `Hola los resultados de tus estudios estan listos${datos.seller.name}`,
          `Tu vendedor ${datos.seller.name} ha creado un nuevo pedido`,
          {
            idPedido: pedidoId,
            type: "newOrderSeller"
          },
          db
        );
      }
      res.send({ status: "OK", newOrder, newClient: newClient });
    } catch (error) {
      console.log("error CrearPedido => ", error);
      res.send({ status: "505", errorMessage: error });
    }
  }