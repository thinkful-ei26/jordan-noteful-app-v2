// 'use strict';

// const knex = require('../knex');

// let searchTerm = 'cats';

// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   }) 
//   .catch(err => {
//     console.error(err);
//   });

//   // get note by ID -- what exactly is returning doing
//   let idNum = req.params
//   const idNum = 1005;

//   knex  
//     .select('notes.id')
//     .from('notes')
//     .where('id', `${idNum}`)
//     .returning('id')
//     .then(results => {
//     console.log(JSON.stringify(results[0]));
//   })
//   .catch(err => {
//     console.error(err);
//   }); 

//   // update note by ID 
  // knex
  //   .select('notes.id', 'title', 'content')
  //   .from('notes')
  //   .where('id', 1000)
  //   .returning(['notes.id', 'title', 'content'])
  //   .update({
  //     title: 'Beyonce Loves Cats Too',
  //     content: 'Lorem ipsum dolor sit amet'
  //     })
  // .then(results => {
  //   console.log(JSON.stringify(results));
  // })
  // .catch(err => {
  //   console.error(err);
  // }); 

  // knex('notes')
  //   .returning(['notes.id', 'title', 'content'])
  //   .insert({title: 'Brand New Note', content: 'lorem ipsum'})
  //   .then(results => {
  //       console.log(JSON.stringify(results));
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     });


  // knex('notes')
  //   .where({id: 1005})
  //   .del()
  //   .then(results => {
  //     console.log(JSON.stringify(results));
  //   })
  //   .catch(err => {
  //     console.error(err);
  //   });
