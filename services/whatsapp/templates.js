export function getTemplateOrderInProgress (
    nombreCliente,
    idPedidoShort,
    nombreEmpresa
){
    return(
        {
            name: "order_inprocess",
            language: {
              code: "es_ES"
            },
            components: [
              {
                type: "header",
                parameters: [
                  {
                    type: "text",
                    text: `${nombreEmpresa}`
                  }
                ]
              },
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: `${nombreCliente}`
                  },
                  {
                    type: "text",
                    text: `${nombreEmpresa}`
                  }
                ]
              },
              {
                type: "button",
                sub_type: "url",
                index: "0",
                parameters: [
                  {
                    type: "text",
                    text: `${idPedidoShort}`
                  }
                ]
              }
            ]
          }
    )
}

export function getTemplateContactBusiness (
    telefono,
    nombreEmpresa
){
    return(
        {
            name: "order_inprocess",
            language: {
              code: "es_ES"
            },
            components: [
 
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: `${nombreEmpresa}`
                  },
                  {
                    type: "text",
                    text: `${telefono}`
                  }
                ]
              },
    
            ]
          }
    )
}