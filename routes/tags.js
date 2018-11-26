'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

const knex = require('../knex');

/* ========== GET ALL TAGS =========== */
router.get('/', (req, res, next) => {
  
  knex.select('id', 'name')
    .from('tags')
    .orderBy('tags.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
  });
  
/* ========== GET TAG BY ID =========== */
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
  
    knex  
      .select()
      .from('tags')
      .where('id', `${id}`)
      .returning('id')
      .then(results => {
        res.json(results[0]);
      })
      .catch(err => {
        next(err);
      }); 
  }); 

/* ========== POST/CREATE TAG ========== */
router.post('/', (req, res, next) => {
    const { name } = req.body;
  
    /***** Never trust users. Validate input *****/
    if (!name) {
      const err = new Error('Missing `name` in request body');
      err.status = 400;
      return next(err);
    }
  
    const newItem = { name };
  
    knex.insert(newItem)
      .into('tags')
      .returning(['id', 'name'])
      .then((results) => {
        // Uses Array index solution to get first item in results array
        const result = results[0];
        res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
      })
      .catch(err => next(err));
  });

/* ========== UPDATE TAG ========== */
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
    .select('tags.id', 'id', 'name')
    .from('tags')
    .where('id', `${id}`)
    .returning(['tags.id', 'name'])
    .update(updateObj)
    .then(results => {
        res.json(results[0]);
    })
    .catch(err => {
        next(err);
    }); 
});

/* ========== DELETE TAG ========== */

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    
    knex('tags')
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