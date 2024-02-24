import { generatePDF } from "../utils/pdfGenerator.js";

export const generateInvoice = async (orderDetails) => {
    
    // Generate PDF using the external module
    const { pdfData, responseHeaders } = await generatePDF(orderDetails);

    const invoice = {
        orderId: orderDetails[0].id,
        customerName: orderDetails[0].ord_customer_name,
        // Add other invoice details here
    };

    return { invoice, pdfData, responseHeaders };

};

