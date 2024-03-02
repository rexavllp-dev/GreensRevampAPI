

export const emailTemplateData = (orderData) => {

    console.log("emailOrderData", orderData);

    // console.log(orderData[0].orderItems.map(orderItem => orderItem));

  

    //  `
    // <!DOCTYPE html>
    // <html>
    // <head>
    //     <title>Invoice for Order ID: ${orderData[0].id}</title>
    // </head>
    // <body>
    //     <h1>Invoice for Order ID: ${orderData[0].id}</h1>
    //     <p>Customer Name: ${orderData[0].ord_customer_name}</p>
    //     <p>Customer Email: ${orderData[0].ord_customer_email}</p>
    // </body>
    // </html>
    // `;
    
    
    
    
    
    
    
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    
        <style type="text/css">
            /* CSS styles */
    
            @font-face {
    
                font-family: 'Libre Franklin';
                src: url('{{url('/email_fonts/libre/LibreFranklin-Regular.ttf')}}');
            }
    
            @font-face {
    
                font-family: 'Source Sans Pro';
                src: url('{{url('/email_fonts/anton/SourceSansPro-Light.ttf')}}');
            }
    
            sourcesanspro-extraLight.ttf
    
            body,
            table,
            td,
            a {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
    
            table,
            td {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
    
            img {
                -ms-interpolation-mode: bicubic;
            }
    
            img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
            }
    
            table {
                border-collapse: collapse !important;
            }
    
            body {
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
            }
    
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }
    
            @media screen and (max-width: 480px) {
                .mobile-hide {
                    display: none !important;
                }
    
                .mobile-center {
                    text-align: center !important;
                }
            }
    
            div[style*="margin: 16px 0;"] {
                margin: 0 !important;
            }
    
        </style>
    
    </head>
    
    <body style="margin: 0 !important; padding: 0 !important; background-color: #eeeeee;" bgcolor="#eeeeee">
        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Open Sans, Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        </div>
    
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center" style="background-color: #eeeeee;" bgcolor="#eeeeee">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:800px;background:#fff;">
                        <tr>
                            <td>
                                <img src="{{url('/email_images/email_banner.jpg')}}" width="100%">
                            </td>
                        </tr>
    
    
                        <tr>
                            <td align="center" style="padding: 15px 35px 20px 35px; background-color: #ffffff;" bgcolor="#ffffff">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:700px;">
                                    <p> Hi ${orderData[0].ord_customer_name},<br>Thank you for Shopping with us!
                                        We have received your order and will update you once our Warehouse team processes your
                                        order. You can find your purchase information below. </p>
    
    
    
    
                                    <tr>
                                        <td>
                                            <table align="center" width="100%" style="max-width:700px;">
                                                <tr style="border-bottom:1px solid #999999;">
                                                    <td align="center">
    
    
                                                        <h4 style="font-weight:bold;font-size:24px;font-family: 'Libre Franklin', sans-serif;line-height:0;">
    
                                                            Order Summary</h4>
    
                                                        <h4 style="font-weight:bold;font-size:20px;font-family: 'Libre Franklin', sans-serif;line-height:0;">
    
                                                            Order ${orderData[0].id}</h4>
                                                        <p style="font-size:18px;font-family: 'Source Sans Pro', sans-serif;font-weight: normal;padding-bottom:35px;">Placed on ${new Date(orderData[0].created_at).toDateString()}</p>
    
                                                    </td>
                                                </tr>
    
                                            </table>
                                        </td>
                                    </tr>
                                    ${orderData.map(order => order.products.map(orderItem => `
                                        <tr>
                                            <td>
                                                <table align="center" width="100%" style="max-width:700px;">
                                                    <tr style="border-bottom:1px solid #999999;">
                                                        <td width="40%" align="center" style="padding:10px;"><img src="${orderItem.base_image?.path || 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vectorstock.com%2Froyalty-free-vectors%2Fno-picture-vectors&psig=AOvVaw31UYQ4R0k6H6eFM1S60O6q&ust=1709030872988000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCNDJi6LqyIQDFQAAAAAdAAAAABAE'}" style="height: 173px;width: 185px;"></td>
                                                        <td width="80%" align="left" valign="top" style="padding:30px;">
                                                            <h4 style="font-family: 'Libre Franklin', sans-serif;font-size:18px;font-weight:bolder;"> ${orderItem.prd_name}</h4>
                                                            <p style="font-family: 'Source Sans Pro', sans-serif;
                                                                font-weight: normal;">${orderItem.prd_description}</p>
                                                            <h4 style="font-family: 'Source Sans Pro', sans-serif;"><b>Qty:${orderItem.op_qty}</b></h4>
    
                                                            <h4 style="font-family: 'Source Sans Pro', sans-serif;"><b>Price:${orderItem.op_line_total}</b></h4>
    
                                                            <h4 style="font-family: 'Source Sans Pro', sans-serif;"><b>Storage Type: ${orderItem.prd_storage_type}</b></h4>
    
    
    
    
                                                        </td>
                                                    </tr>
    
                                                </table>
                                            </td>
                                        </tr>
                                        `).join('')).join('')}
    
    
    
                                    <tr>
                                        <td align="left" style="padding-top: 20px;">
                                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td colspan="2" align="center" style="font-family: 'Libre Franklin', sans-serif; font-size: 18px; font-weight: 800; line-height: 24px; padding: 10px;"> INVOICE DETAILS</td>
    
                                                </tr>
                                                <tr>
                                                    <td width="75%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 15px 10px 5px 10px;"> Purchased Total </td>
                                                    <td width="25%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 15px 10px 5px 10px;">  ${orderData[0].ord_sub_total} </td>
                                                </tr>
    
                                
                                                                                        
                                                <tr>
                                                    <td width="75%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 5px 10px;"> Delivery Method</td>
                                                    <td width="25%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 5px 10px;">${orderData[0].ord_shipping_cost}</td>
    
                                                </tr>
    
                                                <tr>
                                                    <td width="75%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 5px 10px;"> Service Charge</td>
                                                    <td width="25%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 5px 10px;">AED ${orderData[0].transaction_charge || '50 AED Dummy Data'}</td>
    
    
    
    
                               </html>
    `
}