'use strict';

const knex = require('../knex');
const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    // console.log('IM HERE')
    knex.select('id', 'name')
      .from('folders')
      .then(results => {
        res.json(results);
      })
      .catch(err => next(err));
  });

//   get folder by id
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
  
    knex  
      .select()
      .from('folders')
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
    const updateableFields = ['id', 'name'];
  
    updateableFields.forEach(field => 
     { if (field in req.body) 
        { updateObj[field] = req.body[field]; } 
    })
  
     /***** Never trust users - validate input *****/
     if (!updateObj.name) {
      const err = new Error('Missing `name` in request body');
      err.status = 400;
      return next(err);
    }
  
    knex
      .select('folders.id', 'id', 'name')
      .from('folders')
      .where('id', `${id}`)
      .returning(['folders.id', 'name'])
      .update(updateObj)
        .then(results => {
          res.json(results[0]);
        })
        .catch(err => {
          next(err);
        }); 
    });

    // Post (create) an item
router.post('/', (req, res, next) => {
    const { id, name } = req.body;
  
    const newItem = { id, name };
    /***** Never trust users - validate input *****/
    if (!newItem.name) {
      const err = new Error('Missing `name` in request body');
      err.status = 400;
      return next(err);
    }
  
    knex('folders')
      .returning(['folders.id', 'name'])
      .insert(newItem)
      .then(results => {
        res.json(results);
      })
      .catch(err => {
        next(err);
        });
  });


router.delete('/:id', (req, res, next) => {
const id = req.params.id;

knex('folders')
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