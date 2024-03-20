import db from '../../config/dbConfig.js';

export const createAMenu = async (menuData) => {

    const newMenu = await db('menus')
        .insert(menuData)
        .returning('*');
    return newMenu;
};


export const updateAMenu = async (menuId, menuData) => {

    const Menu = await db('menus')
        .where('menu_id', menuId)
        .update(menuData)
        .returning('*');

    return Menu;
};



export const getAMenu = async (menuId) => {
    const Menu = await db('menus')
        .where('menu_id', menuId)
        .select('*')
        .first();

    return Menu;
};



export const getsAllMenus = async () => {

    const Menus = await db('menus')
        .select('*');

    return Menus;
};



export const deleteAMenu = async (menuId) => {
    const Menu = await db('menus')
        .where('menu_id', menuId)
        .del()
        .returning('*');

    return Menu;

};

