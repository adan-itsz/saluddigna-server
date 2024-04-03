import fetch from "node-fetch";
import { getTemplateOrderInProgress } from "./templates.js";

export async function sendMessageTest() {
  try {
    sendOrderInProgressMessage(
      "Emmanuel",
      "+523841037422",
      "123213",
      "Cerveza Fortuna"
    );
  } catch (err) {
    console.error("error en sendMessageTest =>", err);
    return { status: "505", errorMessage: err };
  }
}

export async function sendOrderInProgressMessage(
  nombreCliente,
  telefonoPedido,
  idPedidoShort,
  nombreEmpresa
) {
  try {
    const url = `https://graph.facebook.com/v19.0/${process.env.FROM_PHONE_NUMBER_ID}/messages`;
    const headers = {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN_META}`,
      "Content-Type": "application/json"
    };
    const body = {
      messaging_product: "whatsapp",
      to: `${telefonoPedido}`,
      type: "template",
      template: getTemplateOrderInProgress(
        nombreCliente,
        idPedidoShort,
        nombreEmpresa
      )
    };

    await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    });

    return { status: "OK" };
  } catch (err) {
    return { status: "505", errorMessage: err };
  }
}
