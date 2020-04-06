const app = require('express')();
const gqlexpress = require('express-graphql');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
GraphQLList,
}  = require('graphql');

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]
const BookType = new GraphQLObjectType({
    name:'Book',
    description:'Book created by author',
    fields:()=>({
        id:{type:GraphQLNonNull(GraphQLInt)},
        name:{type:GraphQLNonNull(GraphQLString)},
        authorId:{type:GraphQLNonNull(GraphQLInt)},
        author:{ type:AuthorType,
        resolve:(book)=>{
            return authors.find(author=>author.id == book.authorId)
        }}
    }),
});

const AuthorType = new GraphQLObjectType({
    name:'Author',
    description:'List of authors',
    fields:()=>({
        id:{type:GraphQLNonNull(GraphQLInt)},
        name:{type:GraphQLNonNull(GraphQLString)},
        books:{
            type:new GraphQLList(BookType),
            resolve:(author)=>{
                return books.filter(b=>b.authorId == author.id )
            }
        }
        
    }),
})
const RootQuery = new GraphQLObjectType({
    name:'Query',
    fields:()=>({
        book:{
            type:BookType,
            description:'Single book',
            args:{
                id:{ type:GraphQLInt},
            },
            resolve:(parent,args)=>books.find(book=>book.id === args.id)
        },
        books:{
            type:new GraphQLList(BookType),
            description:'LIst of books',
            resolve:()=>books
        },
        author:{
            type:AuthorType,
            description:'author',
            args:{
                id:{ type:GraphQLInt},
            },
            resolve:(parent,args)=>authors.find(auth=>auth.id === args.id)
        },
        authors:{
            type:new GraphQLList(AuthorType),
            description:'LIst of Authors',
            resolve:()=>authors
        }
    })
});
const RootMutation = new GraphQLObjectType({
    name:'Mutation',
    description:'Mutation',
    fields:()=>({
            addBook:{type:BookType,
            description:'Add book',
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                authorId:{ type:GraphQLNonNull(GraphQLInt)}
            },
            resolve:(parent,args)=>{
                const book = { id:books.length,name:args.name,authorId:args.authorId};
                books.push(book);
                return book;

            }
            }
    })

});
const schema = new GraphQLSchema({
    query:RootQuery,
    mutation:RootMutation,
});
app.use('/graphql',gqlexpress({
    schema:schema,
    graphiql:true,
    

}))
app.listen(5000,()=>{
    console.log('server running')
});