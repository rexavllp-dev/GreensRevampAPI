import db from '../../config/dbConfig.js';

// save item to express session
export const addToCart = async (session, productId, quantity, price ) => {

    session.cart = session.cart || [];

    console.log('Session:', session);

    // check if item already exists
    const existingProduct =  session.cart.find(item => item.productId === productId);

    console.log('Existing Product:', existingProduct);
    console.log('Cart Contents:', session.cart);


    if (existingProduct ) {
        // item already exists, update quantity
        existingProduct.quantity += quantity
    } else {
        // product doesn't exist, add it
        session.cart.push({
            productId: productId,
            quantity: quantity,
            price: price
        });
    }
  // Ensure the session is saved after modification
    await session.save();
 

}

// update item quantity in express session

export const updateCartItemQuantity = async (session, productId, newQuantity) => {

    console.log('Session:', session);
    // session.cart = session.cart || [];

    const product = await session?.cart?.find(item => item.productId === productId);

    console.log('Product:', product);

    if (product) {

        if (newQuantity  <= 0) {
            // remove item from cart
            session.cart = await session.cart.filter(item => item.productId !== productId);
        } else {
            // update quantity
            product.quantity = newQuantity;

            // Update the product price based on the new quantity (assuming price is a property of the product)
            product.price = product.price * newQuantity; // Adjust this line based on your actual data structure
        }
    }
    console.log('Updated Session:', session);
    // Ensure the session is saved after modification
    await session.save();

}

// get cart from express session

export const getCart = async (session) => {

    return session.cart || [];
}


// remove item from express session

export const removeCartItem = async (session, productId) => {

    session.cart = session.cart || [];

    session.cart = session.cart.filter(item => item.productId !== productId);

}


// get subtotal from cart

export const getSubtotal = async (session) => {
    
    const cart = session.cart || [];

    return cart.reduce((total, item) => total + item.price, 0);
    
}


// get product id 

export const getProductId = async (productId) => {
    const product = await db('products')
        .where({ 'products.id': productId })  
        .leftJoin('products_price', 'products.id', 'products_price.product_id')
        .select(
            'products.*',
            'products_price.*',
            'products_price.id as products_price_id'
        )
        .first(); 

    return product;
};
