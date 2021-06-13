import React from 'react';
const fireBaseDataBase = firebase.database()
const DatabaseContext = React.createContext(fireBaseDataBase);
export {
  DatabaseContext,
  fireBaseDataBase
}