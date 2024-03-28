import db from '../../config/dbConfig.js';


export const createARecipeProducts = async (recipeId, productId) => {

    const recipeProduct = await db("recipe_products")
        .insert({

            recipe_id: recipeId,
            product_id: productId

        })
        .returning("*");

    return recipeProduct;

};


export const updateARecipeProducts = async (recipeProductId, data) => {

    const recipeProduct = await db("recipe_products")
        .where({ recipe_product_id: recipeProductId })
        .update(data)
        .returning("*");

    return recipeProduct;
};



export const getARecipeProducts = async (recipeProductId) => {

    const recipeProduct = await db("recipe_products")
        .where({ recipe_product_id: recipeProductId })
        .first();

    return recipeProduct;
};


export const getsAllRecipeProductByRecipeId = async (recipeId) => {

    const recipe_products = await db("recipe_products")
        .where({ 'recipe_products.recipe_id': recipeId })
        .leftJoin("recipes", "recipes.recipe_id", "recipe_products.recipe_id")
        .leftJoin("products", "products.id", "recipe_products.product_id")
        .leftJoin("product_inventory", "products.id", "product_inventory.product_id")
        .leftJoin("product_gallery", "products.id", "product_gallery.product_id")



        .select(

            "recipe_products.recipe_product_id as recipeProductId",

            "recipes.recipe_id as recipeId",
            "recipes.recipe_name as recipeName",

            "products.id as productId",
            "products.prd_name ",
            "products.prd_status ",

            "product_inventory.id as inventoryId",
            "product_inventory.sku",

            db.raw(`
            jsonb_agg(
                jsonb_build_object(
                    'url', product_gallery.url,
                    'id', product_gallery.id,
                    'is_baseimage', product_gallery.is_baseimage
                )
            ) as product_img
        `),


        )

        .groupBy(

            "recipe_products.recipe_product_id",
            "recipes.recipe_id",
            "products.id",
            "product_inventory.id",

        )


    return recipe_products;

};





export const deleteARecipeProducts = async (recipeProductId) => {

    const recipeProduct = await db("recipe_products")
        .where({ recipe_product_id: recipeProductId })
        .del();

    return recipeProduct;
};