

export const emailTemplateData = (orderData) => {

    console.log("emailOrderData", orderData);




    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Invoice for Order ID: ${orderData[0].id}</title>
    </head>
    <body>
        <h1>Invoice for Order ID: ${orderData[0].id}</h1>
        <p>Customer Name: ${orderData[0].ord_customer_name}</p>
        <p>Customer Email: ${orderData[0].ord_customer_email}</p>
    </body>
    </html>
    `;
};