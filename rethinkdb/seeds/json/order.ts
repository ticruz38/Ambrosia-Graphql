import { getIDs } from './../order';
const messages = ['sans oignons sauce blanche le kebab stp!', 'sans anchois la margarita thanks!', 'fais moi rever toto!', 'charge bien sur la mayonnaise stp', 'sans tomate la Napolitaine svp', 'passe le bonjour à ton père!']


interface order {
    id: string,
    userID: string,
    restaurantID: string,
    price: number,
    message: string,
    payed: boolean,
    treated: boolean,
    items: item[],
    rate: number,
    created: number //the date in number of milliseconds since...
}

interface item {
  id: string,
  parent: string,
  name: string,
}

const card = [{
  parent: 'Pizzas',
  items: [{
    name: 'Margarita',
    price: 3
  }, {
    name: 'Napolitaine',
    price: 4
  }, {
    name: 'Sicilienne',
    price: 5
  }, {
    name: 'Milanaise',
    price: 2
  }, {
    name: 'Calzone',
    price: 4
  } ]
}, {
  parent: 'Boissons',
  items: [{
    name: 'Coca-Cola',
    price: 1.5
  }, {
    name: 'Beer',
    price: 2
  }, {
    name: 'Sprite',
    price: 1.5
  }, {
    name: 'Orangina',
    price: 1.5
  }, {
    name: 'Pepsi',
    price: 3
  } ]
}, {
  parent: 'Dessert',
  items: [{
    name: 'Ile Flotante',
    price: 3.5
  }, {
    name: 'Tiramisu',
    price: 3
  }, {
    name: 'Tarte aux Pommes',
    price: 2.6
  }, {
    name: 'Clafouti',
    price: 2
  }, {
    name: 'Pancakes',
    price: 4
  } ]
} ];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const millisecondsPerDay = 24 * 60 * 60 * 1000;


//generate a fakeOrder
export const fakeOrder = (restaurantID: string, usersID: string[]) => {
  const currentTime = new Date().getTime();
  const midnightTime = new Date().setHours(0, 0, 0, 0);
  const numberOfItems = getRandomInt(1, 9);
  const items: item[] = [];
  let price = 0;
  for (let i = 0; i < numberOfItems; i++) {
    const parent = card[getRandomInt(0, 3)];
    const child = parent.items[getRandomInt(0, 5)];
    const item = {
      parent: parent.parent,
      name: child.name,
      id: '_' + Math.random().toString(36).substr(2, 9)
    };
    price += child.price;
    items.push(item);
  }
  const created = midnightTime + Math.random() * millisecondsPerDay;
  const message = messages[getRandomInt(0, 6)];
  const treated = (currentTime > created) ? (Math.random() > 0.8) ? false : true : false;
  const payed = !!Math.floor(Math.random() * 2);
  return {
    id: '_' + Math.random().toString(36).substr(2, 9),
    userID: usersID[getRandomInt(0, usersID.length)],
    restaurantID: restaurantID,
    price: price,
    message: message,
    payed: payed,
    treated: treated,
    items: items,
    rate: getRandomInt(0, 5),
    created: created
  };
};
let index = 0;

export const fakeOrders = (restaurantID: string, usersID: string[]): order[] => {
  let orders: order[] = [];
  for (let i = 0; i < 59; i++) {
    const order = fakeOrder(restaurantID, usersID);
    orders.push(order);
  }
  return orders;
};