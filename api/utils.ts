interface rootValue {
  conn: Object,
  cookies?: {
    get: (string: string) => any;
  }
};

export declare var rootValue: rootValue;

export const toArrayPromiseResult = (query: any, rootValue: rootValue): Promise<Object[]> => {
  return new Promise((resolve, reject) => {
    query.run(rootValue.conn, (err: any, res: any) => {
      if (err) throw err;
      if(res) {
        res.toArray((err: any, res: any) => {
          if (err) reject(err);
          resolve(res);
        });
      }
      else {
        resolve([]);
      }      
    });
  });
}

export const PromiseResult = (query: any, rootValue: rootValue): Promise<Object> => {
  return new Promise((resolve, reject) => {
    query.run(rootValue.conn, (err: any, res: any) => {
      if (err) reject(err);
        resolve(res);
    });
  });
}

export const PromiseUpdateResult = (query: any, rootValue: rootValue): Promise<Object> => {
  return new Promise((resolve, reject) => {
    query.run(rootValue.conn, (err: any, res: any): void => {
      if (err) reject(err);
      if (!res.changes[0]) return null;
      resolve(res.changes[0].new_val);
    });
  });
}