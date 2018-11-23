'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();


const knex = require('../knex');


// Get All (and search by query)
router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const folderId = req.query.id;

//   knex.select('id', 'title', 'content')
//     .from('notes')
//     .modify(function (queryBuilder) {
//       if (searchTerm) {
//         queryBuilder.where('title', 'like', `%${searchTerm}%`);
//       }
//     })
//     .orderBy('notes.id')
//     .then(results => {
//       res.json(results);
//     })
//     .catch(err => {
//       next(err);
//     });
// });

knex.select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName')
  .from('notes')
  .leftJoin('folders', 'notes.folder_id', 'folders.id')
  .modify(function (queryBuilder) {
    if (searchTerm) {
      queryBuilder.where('title', 'like', `%${searchTerm}%`);
    }
  })
  .modify(function (queryBuilder) {
    if (folderId) {
      queryBuilder.where('folder_id', folderId);
    }
  })
  .orderBy('notes.id')
  .then(results => {
    res.json(results);
  })
  .catch(err => next(err));
});


// Get a single item by id
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex  
    .select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .where('id', `${id}`)
    .returning('id')
    .then(results => {
      res.json(results[0]);
    })
    .catch(err => {
      next(err);
    }); 
});

// Put update an item
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => 
   { if (field in req.body) 
      { updateObj[field] = req.body[field]; } 
  })

   /***** Never trust users - validate input *****/
   if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex
    .select('notes.id', 'title', 'content')
    .from('notes')
    .where('id', `${id}`)
    .returning(['notes.id', 'title', 'content'])
    .update(updateObj)
      .then(results => {
        res.json(results[0]);
      })
      .catch(err => {
        next(err);
      }); 
  });

// Post (insert) an item
router.post('/', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .returning(['notes.id', 'title', 'content'])
    .insert(`${newItem}`)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
      });
});

// Delete an item
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes')
    .where({'id': `${id}`})
    .del()
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
