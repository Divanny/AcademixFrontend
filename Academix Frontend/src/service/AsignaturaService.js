export const AsignaturaService = {
    getAsignaturasData() {
        return [
            {
                id: '1000',
                codigoAsignatura: 'ING-325',
                nombre: 'Aseguramiento de la Calidad',
                creditos: 4,
                carrera: 'Ingenieria de Software',
                cantidadEstudiantes: 24,
                estado: 'Activa',
                area: 'Ingenieria',
            },
            /* {
                id: '1001',
                codigoAsignatura: 'nvklal433',
                name: 'Black Watch',
                description: 'Product Description',
                image: 'black-watch.jpg',
                price: 72,
                category: 'Accessories',
                quantity: 61,
                inventoryStatus: 'INSTOCK',
                rating: 4
            }, */
            
        ];
    },

    /* getProductsWithOrdersData() {
        return [
            {
                id: '1000',
                code: 'ING-325',
                name: 'Aseguramiento de la Calidad',
                description: 'Carrera Importante',
                price: 4,
                category: 'Ingenieria de Software',
                quantity: 24,
                inventoryStatus: 'Activa',
                rating: 5,
               
            },
            {
                id: '1001',
                code: 'nvklal433',
                name: 'Black Watch',
                description: 'Product Description',
                image: 'black-watch.jpg',
                price: 72,
                category: 'Accessories',
                quantity: 61,
                inventoryStatus: 'INSTOCK',
                rating: 4,
                orders: [
                    {
                        id: '1001-0',
                        productCode: 'nvklal433',
                        date: '2020-05-14',
                        amount: 72,
                        quantity: 1,
                        customer: 'Maisha Jefferson',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1001-1',
                        productCode: 'nvklal433',
                        date: '2020-02-28',
                        amount: 144,
                        quantity: 2,
                        customer: 'Octavia Murillo',
                        status: 'PENDING'
                    }
                ]
            },
            
        ];
    },

    getProductsMini() {
        return Promise.resolve(this. getAsignaturasData().slice(0, 5));
    },

    getProductsSmall() {
        return Promise.resolve(this. getAsignaturasData().slice(0, 10));
    }, */

    getAsignaturas() {
        return Promise.resolve(this. getAsignaturasData());
    },

    /* getProductsWithOrdersSmall() {
        return Promise.resolve(this.getProductsWithOrdersData().slice(0, 10));
    },

    getProductsWithOrders() {
        return Promise.resolve(this.getProductsWithOrdersData());
    } */
};

