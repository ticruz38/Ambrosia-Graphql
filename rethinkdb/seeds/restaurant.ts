import * as r from 'rethinkdb';
const rethinkdb = require('rethinkdb');

import * as _ from 'lodash';
import foods from './json/food';
import pictures from './json/pictures';

import {getIDs} from './order';
//length 6
var restaurantsName = ['Vesuvio', 'La tour de Jade', 'Vesuvio', 'Le cheval blanc', 'le Khruathaï', 'Chez Ushio', 'Chez Toto'];
//length 5
var descriptions = ['You want find Better Fast-Food in the World', 'Nothing can beat those Pieces of Arts', 'Be ready to travel all accross the world', 'In Huge Quality we Trust', 'Come as you are'];

//length 12
var tags = ['chinese', 'burger', 'pizzas', 'sushis', 'asian', 'nems', 'kebap', 'chile', 'bio', 'vegeterian', 'healthy', 'gluten-free'];

var millisecondsPerDay = 24 * 60 * 60 * 1000;

/**
 * [openHours description]
 * @type {Array} length:3
 */
var openHours = [[{from: millisecondsPerDay/10, to: millisecondsPerDay/3}, {from: millisecondsPerDay/1.5, to: millisecondsPerDay/1.2}], [{from: millisecondsPerDay/3, to: millisecondsPerDay/2}, {from: millisecondsPerDay/1.4, to: millisecondsPerDay/1.2}], [{from: millisecondsPerDay/10, to: millisecondsPerDay/4}, {from: millisecondsPerDay/3, to: millisecondsPerDay/1.5}, {from: millisecondsPerDay/1.2, to: millisecondsPerDay}]];
var getRandomLocation = (geolocation: number[]) => {
  var location = [geolocation[0] - 0.5 + Math.random(), geolocation[1] - 0.5 + Math.random()];
  return r.point(location[0],location[1]);
};

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomTags(length: number) {
  var i = 0;
  var tagslist: string[] = [];
  while (i < length) {
    tagslist.push(tags[getRandomInt(0, tags.length)]);
    i++;
  }
  return _.uniq(tagslist);
}

function getRandomSchedule() {
 var schedule: Object[] = [];
 for (var i = 0; i<7; i++) {
   schedule.push({openHours: openHours[getRandomInt(0, 3)]});
 }
 return schedule;
}

function getRandomBoolean() {
  return Math.random() <= 0.5;
}


/**
 *generate one random restaurant
  TODO reviews
 */
const fakeRestaurant = (userIDs: string[], geolocation: number[]) => {
  return {
    name: restaurantsName[getRandomInt(0, 6)],
    description: descriptions[getRandomInt(0, 5)],
    foods: foods[getRandomInt(0, 2)],
    location: getRandomLocation(geolocation),
    scorable: getRandomBoolean(),
    open: getRandomBoolean(),
    tags: getRandomTags(getRandomInt(0, 5)),
    schedule: getRandomSchedule(),
    picture: pictures["background-restaurant"][getRandomInt(0, pictures["background-restaurant"].length)],
    userID: userIDs[getRandomInt(0, userIDs.length)]
  };
};
const restaurants: Object[] = [];

/**
 * 2nd table to populate after users
 * populate the restaurant table with fake restaurants
 */
export const restaurantSeed = (conn: r.Connection, geolocation: number[]) => {
  return new Promise((resolve, reject) => {
    // get all existing userID in database
    getIDs(conn, 'user').then((userIDs: string[]) => {
      for(var i = 0; i<59; i++) {
          var restaurant = fakeRestaurant(userIDs, geolocation);
          restaurants.push(restaurant);
      }
      r.table('restaurant').insert(restaurants).run(conn, function (err, res) {
          if(err) throw err;
          resolve(res);
      });
    })
  });
};
