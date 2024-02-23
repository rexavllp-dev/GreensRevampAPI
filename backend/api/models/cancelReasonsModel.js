import db from '../../config/dbConfig.js';


// create cancel reason
export const createCancelReason = async (cancelReasonData) => {
    const cancelReason = await db('cancel_reasons').insert(cancelReasonData).returning('*');
    return cancelReason;
}

// update cancel reason
export const updateCancelReason = async (id, cancelReasonData) => {
    const cancelReason = await db('cancel_reasons').where({ id: id}).update(cancelReasonData)
    .returning('*');
    return cancelReason;
}


// get cancel reason by id
export const getCancelReasonById = async (id) => {
    const cancelReason = await db('cancel_reasons').select('*').where({ id: id }).first();
    return cancelReason;
}


// get all cancel reasons
export const getCancelReasons = async () => {
    const cancelReasons = await db('cancel_reasons').select('*');
    return cancelReasons;
}

// delete cancel reason
export const deleteCancelReason = async (id) => {
    const cancelReason = await db('cancel_reasons').where({ id: id }).del();
    return cancelReason;
}