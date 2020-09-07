const graphql = require('graphql');

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;

const movies = [
  { id: '1', name: 'Pulp Fiction', genre: 'Crime', directorID: '1' },
  { id: '2', name: '1984', genre: 'Sci-Fi', directorID: '2' },
  { id: '3', name: 'V for Vendetta', genre: 'Sci-Fi-Triller', directorID: '3' },
  { id: '4', name: 'Snatch', genre: 'Crime-Comedy', directorID: '4' },
  { id: '5', name: 'Reservoir Dogs', genre: 'Crime', directorID: '1' },
  { id: '6', name: 'The Hateful Eight', genre: 'Crime', directorID: '1' },
  { id: '7', name: 'Inglorious Basterds', genre: 'Crime', directorID: '1' },
  { id: '8', name: 'Loc, Stock and Two Smoking Barrels', genre: 'Crime-Comedy', directorID: '4' },
];

const directors = [
  { id: '1', name: 'Quentin Tarantino', age: 56 },
  { id: '2', name: 'Michael Radford', age: 73 },
  { id: '3', name: 'James McTeigue', age: 52 },
  { id: '4', name: 'Guy Ritchie', age: 51 },
];

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        return directors.find((director) => director.id === parent.id);
      },
    },
  }),
});

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    movies: {
      type: new GraphQLList(MovieType), //GraphQLList - используется для выведения списка элементов
      resolve(parent, args) {
        return movies.filter((movie) => movie.directorID === parent.id); //в данном случае метод filter
      },
    },
  }),
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      //запрос фильма (объект запроса оных)
      type: MovieType, //тип фильма идёт через конструктор выше
      args: { id: { type: GraphQLID } }, //args = свойство указывающее на то, какие аргументы принимает запрос
      resolve(parent, args) {
        return movies.find((movie) => movie.id == args.id); //обращение к массиву movies через метод find, сравниваем id каждого элемента массива, с id, переданным в аргументах, после возвращаем найденный результат
      }, //внутри этого метода описываем логику того, какие данные должны возвращаться, алгоритмы возврата определённых данных
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return directors.find((director) => director.id == args.id);
      },
    },
    movies: {
      type: new GraphQLList(MovieType), //конструктор списка
      resolve(parent, args) {
        return movies;
      },
    },
    directors: {
      type: new GraphQLList(DirectorType), //конструктор списка
      resolve(parent, args) {
        return directors;
      },
    },
  },
});

//экспортируем корневой запрос
module.exports = new GraphQLSchema({
  query: Query,
});
