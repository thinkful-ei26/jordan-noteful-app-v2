'use strict';

const knex = require('../knex');
const express = require('express');

const router = express();

router.get('/folders', (req, res, next) => {
    knex.select('id', 'name')
      .from('folders')
      .then(results => {
        res.json(results);
      })
      .catch(err => next(err));
  });