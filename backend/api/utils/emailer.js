import dotenv from 'dotenv'
import { sendEmail } from '../helpers/sendEmail.js';


dotenv.config();


// verify email
export const sendVerificationEmail = async (usr_email, usr_firstname, token, from) => {
  const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${token}&orgin=${from}`;
  const emailData = {
    email: usr_email,
    subject: `Email verification`,
    html: `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
  </head>
  <body>
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

      <!-- Logo -->
      <div style="text-align: center;">
          <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
      </div>
  
          <h2>Email Verification</h2>
  
          <p> Hello, <b> ${usr_firstname} </b></p>
  
          <p>Thank you for signing up! Please click the link below to verify your email:</p>
  
          <p>
              <a href=${verificationLink} target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
          </p>
  
          <p>If you didn't sign up for our service, you can ignore this email.</p>
  
          <p>Best regards,<br> <b>Greens International </b> </p>
  
      </div>
  </body>
  </html>`,
  };

  try {
    await sendEmail(emailData);
  } catch (error) {
    throw error
  }

};


// user registration successful
export const sendUserRegistrationEmail = async (usr_email, usr_firstname) => {

  const emailData = {
    email: usr_email,
    subject: `Registration Complete`,
    html: `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Complete</title>
  </head>
  <body>
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

      <!-- Logo -->
      <div style="text-align: center;">
          <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
      </div>
  
          <h2>Registration Complete</h2>
  
          <p> Hello, <b> ${usr_firstname} </b></p>
  
          <p>Congratulations! You have successfully completed your registration.</p>
  
          <p>
          <a href="https://react.greens-intl.ae/auth/login/">Click here to Login </a> 
          </p>

  
          <p>Best regards,<br> <b>Greens International </b> </p>
  
      </div>
  </body>
  </html>`,
  };

  try {
    await sendEmail(emailData);
  } catch (error) {
    throw error
  }

};




// send reset password to email
export const sendPasswordResetEmail = async (usr_email, usr_firstname, token) => {
  console.log(usr_email);

  const resetPassLink = `${process.env.BASE_URL}/auth/reset?token=${token}`;
  const emailData = {
    from: process.env.FROM_GMAIL,
    email: usr_email,
    subject: 'Reset Password',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

        <!-- Logo -->
        <div style="text-align: center;">
            <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
        </div>
    
            <h2> Password Reset</h2>
    
            <p> Hello, <b> ${usr_firstname} </b></p>
    
            <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
    
            <p> Click the link below to reset your password: </p>
    
            <p>
                <a href= ${resetPassLink} target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 6px;">Reset Password</a>
            </p>
  
            <p>This link will expire in  <b> 24 Hours  </b> for security reasons.</p>
    
            <p>If you didn't request a password reset, please disregard this email.</p>
    
            <p>Best regards,<br> <b>Greens International </b> </p>
    
        </div>
    </body>
    </html>`,


  };

  try {
    await sendEmail(emailData);
  } catch (error) {
    throw error
  }


}



// send email for company verification 
export const sendVerificationApproved = async (usr_email, usr_firstname) => {

  const emailData = {
    from: process.env.FROM_GMAIL,
    email: usr_email,
    subject: 'Company Verification Approved',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Company verification </title>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

        <!-- Logo -->
        <div style="text-align: center;">
            <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
        </div>
    
            <h2>Company verification </h2>
    
            <p> Hello, <b> ${usr_firstname} </b></p>
    
            <p>Thank you for signing up!.Your company is verified successfully, Now you can login </p>
    
            <a href="https://react.greens-intl.ae/auth/login/">Click here to Login </a>
  
          
            <p>Best regards,<br> <b>Greens International </b> </p>
    
        </div>
    </body>
    </html>`,


    //   `<p> Dear ${usr_firstname} </p>
    //   <p>Thank you for signing up!.Your company is verified successfully, Now you can login </p>
    //   <a href="https://react.greens-intl.ae/auth/login/">Login Account</a>
    //   <p>Thank you</p>
    // `,
  };

  try {
    await sendEmail(emailData);
  } catch (error) {
    throw error
  }
};


// send email for company verification 
export const sendVerificationRejected = async (usr_email, usr_firstname) => {

  const emailData = {
    from: process.env.FROM_GMAIL,
    email: usr_email,
    subject: 'Company Verification Successfully',
    html: `<p> Dear ${usr_firstname} </p>
    <p>Thank you for signing up!.Your company has been rejected,reason...</p>
    <a href="https://react.greens-intl.ae/auth/register/">Try again</a>
    <p>Thank you</p>
  `,

  };
  try {
    await sendEmail(emailData);
  } catch (error) {
    throw error
  }
};


// send email for company verification 
export const sendBlockVerification = async (usr_email, usr_firstname) => {

  const emailData = {
    from: process.env.FROM_GMAIL,
    email: usr_email,
    subject: 'User Blocked ',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

        <!-- Logo -->
        <div style="text-align: center;">
            <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
        </div>
    
            <h2>User Blocked </h2>
    
            <p> Hello, <b> ${usr_firstname} </b></p>
    
            <p>You are blocked temporary due to repeated incorrect attempts.Please Contact admin for assistance.</p>
    
        
    
            <a href="https://react.greens-intl.ae/auth/login/"> Login</a>
  
          
            <p>Best regards,<br> <b>Greens International </b> </p>
    
        </div>
    </body>
    </html>`,


    //   `<p> Dear ${usr_firstname} </p>
    //   <p>You are blocked temporary due to repeated incorrect attempts.Please Contact admin for assistance.</p>
    //   <a href="https://react.greens-intl.ae/auth/login/">Try again</a>
    //   <p>Thank you</p>
    // `

  };
  try {
    await sendEmail(emailData);
  } catch (error) {
    throw error
  }
};

// bulk orders

export const sendVerificationBulkApproved = async (usr_email, usr_firstname, productName, quantity) => {

  const emailData = {
    from: process.env.FROM_GMAIL,
    email: usr_email,
    subject: 'Your Bulk Order Request Approved',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bulk order verification </title>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

        <!-- Logo -->
        <div style="text-align: center;">
            <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
        </div>
    
            <h2> Your Bulk order request rejected </h2>
    
            <p> Hello, <b> ${usr_firstname} </b></p>
    
            <p>Your bulk order has been approved successfully for product <b>${productName}</b> with quantity <b> ${quantity} </b> </p>
    
  
          
            <p>Best regards,<br> <b>Greens International </b> </p>
    
        </div>
    </body>
    </html>`,


    //   `<p> Dear ${usr_firstname} </p>
    //   <p>Thank you for signing up!.Your company is verified successfully, Now you can login </p>
    //   <a href="https://react.greens-intl.ae/auth/login/">Login Account</a>
    //   <p>Thank you</p>
    // `,
  };

  try {
    await sendEmail(emailData);
  } catch (error) {
    throw error
  }
};



export const sendVerificationBulkRejected = async (usr_email, usr_firstname, productName, quantity) => {

  const emailData = {
    from: process.env.FROM_GMAIL,
    email: usr_email,
    subject: 'Your Bulk Order Request Rejected',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bulk order verification </title>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

        <!-- Logo -->
        <div style="text-align: center;">
            <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
        </div>
    
            <h2> Your bulk order Rejected  </h2>
    
            <p> Hello, <b> ${usr_firstname} </b></p>
    
            <p>Your bulk order has been rejected for product <b>${productName}</b> with quantity <b> ${quantity} </b> </p>
    
  
          
            <p>Best regards,<br> <b>Greens International </b> </p>
    
        </div>
    </body>
    </html>`,

  };
  try {
    await sendEmail(emailData);
  } catch (error) {
    throw error
  }
};




export const sendOrderInvoices = async (orderData, pdfData) => {

  console.log(pdfData);

  const emailData = {
    from: process.env.FROM_GMAIL,
    email: orderData[0].ord_customer_email,
    subject: 'Your Order Invoice',
    html: `<!DOCTYPE html>
    <html>
    
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    
        <style type="text/css">
    
    
    
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
    
    
    }
        </style>
    
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
                                        <p> Hi ${ orderData[0].ord_customer_name },<br>Thank you for Shopping with us!
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
    
                                                                Order #{{ $order->id }}</h4>
                                                                <p style="font-size:18px;font-family: 'Source Sans Pro', sans-serif;font-weight: normal;padding-bottom:35px;">Placed on  {{ $order->created_at->toFormattedDateString() }}</p>
    
                                                            </td>
                                                        </tr>
    
                                                    </table>
                                                </td>
                                            </tr>
                                            @foreach ($order->invoiceProducts as $product)
                                            <tr>
                                                <td>
                                                    <table align="center" width="100%" style="max-width:700px;">
                                                        <tr style="border-bottom:1px solid #999999;">
                                                            <td width="40%" align="center" style="padding:10px;"><img src="{{ $product->base_image->path }}" style="height: 173px;width: 185px;"></td>
                                                            <td width="80%" align="left" valign="top" style="padding:30px;">
                                                                <h4 style="font-family: 'Libre Franklin', sans-serif;font-size:18px;font-weight:bolder;"> {{ $product->name }}</h4>
                                                                <p style="font-family: 'Source Sans Pro', sans-serif;
                                                                font-weight: normal;">{{ $product->short_description }}</p>
                                                                <h4 style="font-family: 'Source Sans Pro', sans-serif;"><b>Qty:{{ $product->qty }}</b></h4>
    
                                                                <h4 style="font-family: 'Source Sans Pro', sans-serif;"><b>Price:{{ $product->line_total->convert($order->currency, $order->currency_rate)->format($order->currency) }}</b></h4>
    
                                                                <h4 style="font-family: 'Source Sans Pro', sans-serif;"><b>Storage Type: {{ trans('storefront::storefront.'.$product->product->storage_type) }}</b></h4>
    
    
    
                                                            </td>
                                                        </tr>
    
                                                    </table>
                                                </td>
                                            </tr>
                                            @endforeach
    
    
    
    
    
                                            <tr>
                                                <td align="left" style="padding-top: 20px;">
                                                    <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td colspan="2" align="center"  style="font-family: 'Libre Franklin', sans-serif; font-size: 18px; font-weight: 800; line-height: 24px; padding: 10px;"> INVOICE DETAILS</td>
    
                                                        </tr>
                                                        <tr>
                                                            <td width="75%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 15px 10px 5px 10px;"> Purchased Total </td>
                                                            <td width="25%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 15px 10px 5px 10px;">  {{ $order->sub_total->convert($order->currency, $order->currency_rate)->format($order->currency) }} </td>
                                                        </tr>
    
                                                        @if ($order->hasShippingMethod())
                                                        <tr>
                                                            <td width="75%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 5px 10px;"> Shipping + Handling </td>
                                                            <td width="25%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 5px 10px;">{{ $order->shipping_cost->convert($order->currency, $order->currency_rate)->format($order->currency) }}</td>
    
                                                        </tr>
                                                        @endif
    
                                                        <tr>
                                                            <td width="75%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 5px 10px;"> Delivery Method</td>
                                                            <td width="25%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 5px 10px;">{{ $order->shipping_method }}</td>
    
                                                        </tr>
    
                                                        <tr>
                                                            <td width="75%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 5px 10px;"> Service Charge</td>
                                                            <td width="25%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 5px 10px;">AED {{ $order->transaction_charge }}</td>
    
                                                        </tr>
    
    
                                                        
    
                                                       
    
    
                                                          @if ($order->hasCoupon())
                                                             <tr>
                                                            <td width="75%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 5px 10px;"> Discount </td>
                                                            <td width="25%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 5px 10px;">{{ $order->discount->format() }}</td>
                                                        </tr>
    
                                                          @endif
    
                                                          <tr>
                                                            <td width="75%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 5px 10px;"> Sales Tax </td>
                                                            <td width="25%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 15px; font-weight: 400; line-height: 24px; padding: 5px 10px;">@foreach ($order->taxes as $tax)
                               {{ $tax->order_tax->amount->convert($order->currency, $order->currency_rate)->format($order->currency) }}
                                            @endforeach</td>
                                                        </tr>
    
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left" style="padding-top: 20px;">
                                                    <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td width="75%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 14px; font-weight: 800; line-height: 24px; padding: 10px; border-top: 3px solid #eeeeee; border-bottom: 3px solid #eeeeee;"> TOTAL PRICE</td>
                                                            <td width="25%" align="left" style="font-family: 'Libre Franklin', sans-serif; font-size: 14px; font-weight: 800; line-height: 24px; padding: 10px; border-top: 3px solid #eeeeee; border-bottom: 3px solid #eeeeee;"> {{ $order->total->convert($order->currency, $order->currency_rate)->format($order->currency) }}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
    
                                <tr>
                                    <td align="center" style="padding-left: 35px; padding-right: 35px; padding-bottom: 35px;background-color: #ffffff;" bgcolor="#ffffff">
    
    
                                        <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
    
                                            <tr>
                                                <td colspan="2" align="center"  style="font-family: 'Libre Franklin', sans-serif; font-size: 18px; font-weight: 800; line-height: 24px; padding: 10px;"> BILLING AND SHIPPING</td>
    
                                            </tr>
    
                                            <tr>
                                                <td align="center" valign="top" style="font-family: 'Libre Franklin', sans-serif;font-size: 16px; font-weight: 400; line-height: 24px;padding-top:30px;">
                                                    <div style="padding:10px;border-right:1px solid #000;">
                                                        <p style="font-weight: 800;">Billing</p>
                                                        <table style="width:100%;">
    
                                                            <tr>
    
                                                                <td  align="center"> {{ $order->billing_address_1 }}<br>
                                                                    {{ $order->billing_address_2 }}<br>
                                                                    {{ $order->billing_city }}, {{ $order->billing_state_name }} {{ $order->billing_zip }} ,  {{ $order->billing_country_name }}</td>
    
    
                                                                </tr>
    
                                                            </table>
                                                        </div>
                                                    </td>
                                                    <td align="center" valign="top" style="font-family: 'Libre Franklin', sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;padding-top:30px;">
                                                        <div style="padding:10px;border-radius:10px;">
                                                            <p style="font-weight: 800;">Shipping</p>
                                                            <table style="width:100%;">
    
                                                                <tr>
    
                                                                    <td align="center"> {{ $order->shipping_address_1 }}<br>
                                                                      {{ $order->shipping_address_2 }}<br>
                                                                      {{ $order->shipping_city }}, {{ $order->shipping_state_name }} {{ $order->shipping_zip }} ,  {{ $order->shipping_country_name }} </td>
    
    
                                                                  </tr>
    
                                                              </table>
                                                          </div>
                                                      </td>
                                                  </tr>
                                              </table>
    
                                          </td>
                                      </tr>
                                      <tr>
                                        <td align="center" style="padding: 15px 35px 20px 35px; background-color: #ffffff;" bgcolor="#ffffff">
                                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:700px;">
    
    
    
                                                <tr>
                                                    <td align="left" style="padding-top: 20px;">
                                                        <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                                            <tr>
                                                                <td colspan="2" align="left"  style="font-family: 'Libre Franklin', sans-serif; font-size: 14px;  line-height: 24px; padding: 10px;">
                                                                    <p>We are doing everything we can to ensure you get your order safely. We are constantly sanitizing our facilities and delivery vehicles; and monitoring hygiene without fail. Due to Covid-19 social
                                                                    distancing guidelines, delivery personnel are not permitted to enter the home for any reason. </p><br>
                                                                    <p>Please retain a copy of this e-mail for your records. It is our goal to ensure you have the best possible Shopping Experience. Thank you again for Shopping at greensintl.com.</p>
                                                                    <br>
                                                                    Sincerely,<br>
    
                                                                    Customer Services
                                                                    greensintl.com
    
    
                                                                </tr>
    
                                                                <p>View our <a href="https://greensintl.com/privacy-policy">Privacy Policy</a>  and <a href="https://greensintl.com/terms-of-use">Terms of Use</a>  here.</p>
    
                                                                <p>Have any questions about your order? Please visit our <a href="https://greensintl.com/contact">Contact Us</a>  section or send us a message.
                                                                    Please note that orders cannot be edited. Orders can be cancelled any time before the order has been dispatched from our warehouse. Please visit your <a href="https://greensintl.com/login">Customer portal</a>  to cancel your order.</p>
    
    
                                                                </table>
                                                            </td>
                                                        </tr>
    
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style=" padding-left: 35px; padding-right: 35px;background:url('{{ url('email_images/footer.jpg')}}');background-size:cover;">
    
    
                                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
                                                        <tr>
    
                                                            <td align="center"  style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 400; line-height: 24px; padding-top: 25px; "><img src="{{url('/email_images/phone.png')}}">
                                                                <a href="tele:0097 165 340 149" style="color:#fff;text-decoration:none;font-family: 'Libre Franklin', sans-serif; font-size: 16px; font-weight: 400;">+971 6 546 8622</a></td>
                                                            </tr><tr>
    
    
    
                                                                <td align="center" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 400; line-height: 24px;  padding-bottom: 25px;">
    
    
                                                                    <a href="mailto:customercare@greensintl.com" style="color:#fff;text-decoration:none;font-family: 'Libre Franklin', sans-serif; font-size: 16px; font-weight: 400;"><img src="{{url('/email_images/email.png')}}"> customercare@greensintl.com</a>
    
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
    
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </body>
    
                            </html>`,
   
    attachments: [
      {
        filename: 'invoice.pdf',
        content: Buffer.from(pdfData.pdfData, 'base64'),
        encoding: 'base64' // Ensure the correct encoding for the attachment content
      }
    ]
    
  };

  try {
    await sendEmail(emailData);
  } catch (error) {
    throw error
  }
};
