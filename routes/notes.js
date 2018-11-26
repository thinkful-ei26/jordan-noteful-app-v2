'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();


const knex = require('../knex');


// Get All (and search by query)
router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const folderId = req.query.id;


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
    .where('notes.id', `${id}`)
    .returning('notes.id')
    .then(results => {
      res.json(results[0]);
    })
    .catch(err => {
      next(err);
    }); 
});

// Creat a new item
router.post('/', (req, res, next) => {
  const { title, content, folderId } = req.body; // Add `folderId` to object destructure
  
  const newItem = {
    title: title,
    content: content,
    folder_id: folderId  // Add `folderId`
  };

  let noteId;

  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  // Insert new note, instead of returning all the fields, just return the new `id`
  knex('notes')
    .returning('id')
    .insert(newItem)
    .then(([id]) => {
      noteId = id;
      // Using the new id, select the new note and the folder
      return knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', noteId);
    })
    .then(([result]) => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

// Put update an item
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content', 'folderId'];

  updateableFields.forEach(field => 
   { if (field in req.body){
      if(field === 'folderId'){
        updateObj['folder_id'] = req.body[field];
      } else
      { updateObj[field] = req.body[field]; } 
  }
}); 

   /***** Never trust users - validate input *****/
   if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName')
    .where('id', `${id}`)
    .update(updateObj)
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .returning(['notes.id', 'title', 'content'])
    .update(updateObj)
      .then(results => {
        res.json(results[0]);
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
