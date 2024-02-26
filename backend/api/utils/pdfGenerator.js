import PDFDocument from 'pdfkit';


// Function to generate PDF
export const generatePDF = async (orderDetails) => {
    // Create a new PDF document
    const doc = new PDFDocument();

    // Buffer to store PDF
    let buffers = [];

    // Pipe PDF output to buffer
    doc.on('data', buffer => {
        buffers.push(buffer);
    });

    // Build PDF content
    doc.text(`Invoice for Order ID: ${orderDetails[0].id}`);
    doc.text(`Customer Name: ${orderDetails[0].ord_customer_name}`);
    doc.text(`Customer Email: ${orderDetails[0].ord_customer_email}`);

    // Add other invoice details as needed

    // Finalize PDF
    doc.end();

    // Return promise to resolve with the PDF buffer
    return new Promise((resolve, reject) => {
        // Collect PDF buffers
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            const responseHeaders = {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="invoice-${orderDetails[0].id}.pdf"`
            };
            resolve({ pdfData, responseHeaders });
        });

        // Handle errors
        doc.on('error', (err) => {
            reject(err);
        });
    });
};
