const axios = require('axios')
const _ = require('lodash')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')

// Customer Type
const CustomerType = new GraphQLObjectType({
  name: 'customer',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
    picture: { type: GraphQLString },
    phone: { type: GraphQLString },
    company: { type: GraphQLString }
  })
})

// Hardcoded data
// const customers = [
//   {
//     id: '1',
//     name: 'Tien Do',
//     email: 'domanhtien@gmail.com',
//     age: 29
//   },
//   {
//     id: '2',
//     name: 'Dung Do',
//     email: 'dovandung@gmail.com',
//     age: 60
//   },
//   {
//     id: '3',
//     name: 'Hieu Do',
//     email: 'domanhhieu@gmail.com',
//     age: 24
//   }
// ]


// Root Query

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        // for (let i = 0; i < customers.length; i++) {
        //   if (customers[i].id === args.id) {
        //     return customers[i]
        //   }
        // }
        return axios.get('http://localhost:3000/customers/' + args.id)
          .then(res => {
            data = res.data
            data.name = data.name.first + ' ' + data.name.last
            return data
          })
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return axios.get('http://localhost:3000/customers/')
          .then((res) => {
            data = res.data
            data.map((customer) => {
              customer.name = customer.name.first + ' ' + customer.name.last
            })
            return data
          })
      }
    }
  }
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parentValue, args) {
        return axios.post('http://localhost:3000/customers', {
          email: args.email,
          age: args.age
        })
          .then(res => res.data)
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) }

      },
      resolve(parentValue, args) {
        return axios.delete('http://localhost:3000/customers/' + args.id)
          .then(res => res.data)
      }
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        return axios.patch('http://localhost:3000/customers/' + args.id, args)
          .then(res => res.data)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})