const express = require('express');
const app = express();
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema,GraphQLObjectType, GraphQLString,GraphQLList, GraphQLInt, GraphQLNonNull, graphqlSync } = require("graphql");

const items = [
    {
        id: 1,
        name: "Hoodie",
        price: "$29.99",
        brandId: 1
    },
    {
        id: 2,
        name: "T-Shirt",
        price: "$19.99",
        brandId: 1
    },{
        id: 3,
        name: "Trouser",
        price: "$14.99",
        brandId: 2
    },{
        id: 4,
        name: "Hoodie",
        price: "$29.99",
        brandId: 3
    },
    {
        id: 5,
        name: "Sneaker",
        price: "$99.99",
        brandId: 1
    },{
        id: 6,
        name: "Pants",
        price: "$44.99",
        brandId: 1
    }
];

const brands = [
    {
        id : 1,
        name: "nike",
    },{
        id: 2,
        name: "Tommy Hilfiger"
    },{
        id: 3,
        name: "Levis"
    }
];


const BrandType = new GraphQLObjectType({
    name: "Brand",
    description: "This is a brand",
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt),
        },
        name: {
            type: GraphQLNonNull(GraphQLString)
        }
    })
})

const ItemType = new GraphQLObjectType({
    name : "Item",
    description: "This is an item",
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt),
        },
        name: {
            type: GraphQLNonNull(GraphQLString)
        },
        price: {
            type: GraphQLNonNull(GraphQLString)
        },
        brandId : {
            type: GraphQLNonNull(GraphQLInt)
        },
        brand: {
            type: GraphQLNonNull(BrandType),
            resolve: (item) => {
                return brands.find(brand => brand.id === item.brandId)
            }
        }
        
    })
})

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        item: {
            type: ItemType,
            description: "An item",
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent,args) => {
                return items.find(item => item.id === args.id)
            }
        },
        items: {
            type: GraphQLList(ItemType),
            description: "List of items",
            resolve: () => items
        },
        brand: {
            type: BrandType,
            description: "A brand",
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent,args) => {
                return brands.find(brand => brand.id === args.id)
            }
        },
        brands: {
            type: GraphQLList(BrandType),
            description: "List of Brands",
            resolve: () => brands
        }
    })
});

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root mutation",
    fields: () => ({
        addItem: {
            type: ItemType,
            description: "Add an item",
            args: {
                name: {
                    type: GraphQLNonNull(GraphQLString)
                },
                price: {
                    type: GraphQLNonNull(GraphQLString)
                },
                brandId: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: (parent,args) => {
                var temp = {
                    id: items.length+1,
                    name: args.name,
                    price: args.price,
                    brandId: args.brandId
                };
                items.push(temp);
                return temp;
            }
        },
        addBrand: {
            type: BrandType,
            description: "Add a brand",
            args: {
                name: {
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (parent,args) => {
                var temp = {
                    id: brands.length+1,
                    name: args.name,
                };
                brands.push(temp);
                return temp;
            }
        },
        deleteItem: {
            type: GraphQLList(ItemType),
            description: "Delete an item",
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: (parent, args) => {
                items.splice(items.findIndex(item => item.id === args.id),1);
                return items;
            }
        },
        deleteBrand: {
            type: GraphQLList(BrandType),
            description: "Delete a brand",
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: (parent, args) => {
                brands.splice(brands.findIndex(brand => brand.id === args.id),1);
                return brands;
            }
        },
        updateItem: {
            type: ItemType,
            description: "Update an item",
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLInt)
                },
                name: {
                    type: GraphQLNonNull(GraphQLString)
                },
                price: {
                    type: GraphQLNonNull(GraphQLString)
                },
                brandId: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve:(parent, args) =>  {
                var temp = items.findIndex(item => item.id === args.id);
                items[temp] = {
                    id: args.id,
                    name: args.name,
                    price: args.price,
                    brandId: args.brandId
                }
                return items[temp];
            }
        },
        updateBrand: {
            type: BrandType,
            description: "Update a brand",
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLInt)
                },
                name: {
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (parent, args) => {
                var temp = brands.findIndex(brand => brand.id === args.id);
                brands[temp] = {
                    id: args.id,
                    name: args.name
                };
                return brands[temp];
            }
        }
    })
});

const schema = new GraphQLSchema({
    mutation: RootMutationType,
    query: RootQueryType 
});

app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(5000,() => console.log("Server running on port: 5000"));