import pdf from 'html-pdf';

// Function to generate PDF from HTML
export const generatePDF = async (orderDetails) => {
    // Define the HTML content
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Invoice for Order ID: ${orderDetails[0].id}</title>
    </head>
    <body>
        <h1>Invoice for Order ID: ${orderDetails[0].id}</h1>
        <p>Customer Name: ${orderDetails[0].ord_customer_name}</p>
        <p>Customer Email: ${orderDetails[0].ord_customer_email}</p>
    </body>
    </html>
    `;

    // Options for PDF generation
    const options = {
        format: 'Letter',
        // Add other options as needed
    };

    // Return promise to resolve with the PDF buffer
    return new Promise((resolve, reject) => {
        // Generate PDF from HTML
        pdf.create(htmlContent, options).toBuffer((err, buffer) => {
            if (err) {
                reject(err);
            } else {
                const responseHeaders = {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="invoice-${orderDetails[0].id}.pdf"`
                };
                resolve({ pdfData: buffer, responseHeaders });
            }
        });
    });
};
