import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [

    // admin dashboard
    { path: '', title: 'Admin Dashboard', icon: '', class: 'nav-small-cap', label: '', labelClass: '', extralink: true, submenu: [] },

    // products & services
    {
        path: '', title: 'Products & Services', icon: 'mdi mdi-shopping', class: 'has-arrow', label: '', labelClass: 'label label-rouded label-themecolor pull-right', extralink: false,
        submenu: [
            { path: '/pages/admin/products', title: 'Products', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
            { path: '/pages/admin/services', title: 'Services', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
        ]
    },

    // categories
    { path: '/pages/admin/categories', title: 'Categories', icon: 'mdi mdi-tag-multiple', class: '', label: '', labelClass: '', extralink: false, submenu: [] },

    // Users
    {
        path: '', title: 'Users', icon: 'mdi mdi-account', class: 'has-arrow', label: '', labelClass: 'label label-rouded label-themecolor pull-right', extralink: false,
        submenu: [
            { path: '/pages/admin/users/sellers', title: 'Sellers', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
        ]
    },

    
    


];
