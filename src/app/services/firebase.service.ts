import { Injectable } from '@angular/core';
import { Car } from '../data/Car';
// Firebase Module API functions
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
  push,
  DataSnapshot,
} from 'firebase/database';
import { initializeApp } from 'firebase/app';

// getDatabase: takes in your account and project info and returns an instance (an object) giving you access to db functions
// ref: identifies a location/path within this database (looks like a folder with folders in it)
// set: puts an object in the database
// get: gets an object from the database once (returns a promise resolving with DataSnapshot)
// update: modifies an existing object in the database
// remove: removes an object from the database
// push: Adds an object to a database list. Autogenerates the ID
// onValue: subscribes to changes in the database. Gets called everytime the changes happen with new data.
// child: gives you a reference to your children
// Firebase Service
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  db: any;

  constructor() {
    this.setupFirebase(); // How we pass account and project info
    this.db = getDatabase(); // this is how we get a db object to use to access all the others functions
  }
  setupFirebase() {
    const firebaseConfig = {
      apiKey: "AIzaSyA1Pb1G-eXWOvDkP_8AW59e7BuuzJc3FLY",
      authDomain: "fir-app-4fb9a.firebaseapp.com",
      databaseURL: "https://fir-app-4fb9a-default-rtdb.firebaseio.com",
      projectId: "fir-app-4fb9a",
      storageBucket: "fir-app-4fb9a.appspot.com",
      messagingSenderId: "4375361106",
      appId: "1:4375361106:web:219cbb5a008f8f2eec118b",
      measurementId: "G-1E2WGK8THK"
    };
    initializeApp(firebaseConfig);
  }

  // CRUD: Create, Retrieve, Update, Delete 
  create(path: string, data: any): Promise<void>{ // Create
    return set(ref(this.db, path), data);
  }
  async retrieve(path: string, key: string): Promise<DataSnapshot>{
    return await get(ref(this.db, path+"/"+key));
  }
  update(path: string, key: string, data: any): Promise<void>{ 
    return update(ref(this.db, path + "/" + key), data);
  }
  delete(path: string, key: string): Promise<void>{ 
    return remove(ref(this.db, path+"/"+key));
  }
  // List
  // Add to List
  
  async pushToList(path: string, data: any) {
      const snapshot = await get(ref(this.db, path));
      let nextKey = 1;

      if (snapshot.exists()) {
        const cars = snapshot.val();
        const keys = Object.keys(cars).map(Number);
        const lastKey = Math.max(...keys);
        nextKey = lastKey + 1;
      }
      await set(ref(this.db, path+'/'+nextKey), data);
      return nextKey;
  }
  async deleteFromList(path: string, carID: string) {
    this.delete(path, carID);
    
    const snapshot = await get(ref(this.db, path));
    if (snapshot.exists()) {
      const cars = snapshot.val();
      const updatedCars: { [key: string]: Car } = {};
      let Lkey = 1;

      for (const key in cars) {
        if (cars.hasOwnProperty(key)) {
          updatedCars[Lkey] = cars[key];
          Lkey++;
        }
      }
      await set(ref(this.db, path), updatedCars);
    }
  }
  
  // Get List Once 
  async getList(path: string){
    const dblist = await get(ref(this.db, path));
    let locallist: any[] = [];
    dblist.forEach( item =>{locallist.push(item.val());});
    return locallist; 
  }
  reset(){
    this.delete("","");
  }
  getDB(){
    return this.db; 
  }

}

