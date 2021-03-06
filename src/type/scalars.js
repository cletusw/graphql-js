/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import { GraphQLScalarType } from './definition';
import { Kind } from '../language';

// Integers are only safe when between -(2^53 - 1) and 2^53 - 1 due to being
// encoded in JavaScript and represented in JSON as double-precision floating
// point numbers, as specified by IEEE 754.
var MAX_INT = 9007199254740991;
var MIN_INT = -9007199254740991;

function coerceInt(value) {
  var num = Number(value);
  if (num === num && num <= MAX_INT && num >= MIN_INT) {
    return (num < 0 ? Math.ceil : Math.floor)(num);
  }
  return null;

}

export var GraphQLInt = new GraphQLScalarType({
  name: 'Int',
  serialize: coerceInt,
  parseValue: coerceInt,
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      var num = parseInt(ast.value, 10);
      if (num <= MAX_INT && num >= MIN_INT) {
        return num;
      }
    }
    return null;
  }
});

function coerceFloat(value) {
  var num = Number(value);
  return num === num ? num : null;
}

export var GraphQLFloat = new GraphQLScalarType({
  name: 'Float',
  serialize: coerceFloat,
  parseValue: coerceFloat,
  parseLiteral(ast) {
    return ast.kind === Kind.FLOAT || ast.kind === Kind.INT ?
      parseFloat(ast.value) :
      null;
  }
});

export var GraphQLString = new GraphQLScalarType({
  name: 'String',
  serialize: String,
  parseValue: String,
  parseLiteral(ast) {
    return ast.kind === Kind.STRING ? ast.value : null;
  }
});

export var GraphQLBoolean = new GraphQLScalarType({
  name: 'Boolean',
  serialize: Boolean,
  parseValue: Boolean,
  parseLiteral(ast) {
    return ast.kind === Kind.BOOLEAN ? ast.value : null;
  }
});

export var GraphQLID = new GraphQLScalarType({
  name: 'ID',
  serialize: String,
  parseValue: String,
  parseLiteral(ast) {
    return ast.kind === Kind.STRING || ast.kind === Kind.INT ?
      ast.value :
      null;
  }
});
