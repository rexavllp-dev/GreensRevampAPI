
// create notify product
export const createNotifyProduct = async (product_id, user_id) => {
    const newNotifyProduct = await db("notify_products").insert({ product_id, user_id }).returning("*");
    return newNotifyProduct;
}