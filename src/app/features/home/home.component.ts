import { Component } from '@angular/core';
import { MContainerComponent } from '../../m-framework/m-container/m-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { Car } from '../../data/Car';
import { Car2 } from '../../data/Car2';
import {onValue,ref} from 'firebase/database';
import { Router } from '@angular/router';
import { MTableComponent } from '../../m-framework/m-table/m-table.component';
import { MSearchButtonComponent } from '../../m-framework/m-search-button/m-search-button.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MContainerComponent,
    MTableComponent,
    MSearchButtonComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  model: string;
  make: string;
  year: number;
  id: string = '';
  filterTerm: string = '';
  headers: string[] = ['ID','Make', 'Model', 'Price', 'Year'];
  listofcars: Car[];
  desc : string;
  url : string = '';
  price : number = 1000;
  isUpdating: boolean = false;
  purchasedCars : any;

  // This is code added for live charts from CanvasJS example
  dataPoints: any[] = [];
  chart: any;
  chartOptions = {
    theme: 'light2',
    title: {
      text: 'Live Data',
    },
    data: [
      {
        type: 'bar',
        dataPoints: this.dataPoints,
      },
    ],
  };
  // Added code ends here

  constructor(private firebaseService: FirebaseService, private router: Router) {
    this.model = '';
    this.make = '';
    this.year = 2019;
    this.listofcars = [];
    this.desc ='';
    this.purchasedCars = [];
    
    //To get the list once
    /*
    this.firebaseService.getList("cars").then((list)=>{
      this.listofcars = list; 
    });
    */
    onValue(ref(this.firebaseService.getDB(), 'cars'), (snapshot) => {
      this.listofcars.splice(0, this.listofcars.length);
      snapshot.forEach((child) => {
        let car = child.val(); 
        car.id = child.key;
        this.listofcars.push(car);
      });
      this.listofcars = [...this.listofcars];
    });
  }

  getChartInstance(chart: object) {
    this.chart = chart;
  }
  buyCar(carID:string){
    this.firebaseService.retrieve('cars2', carID).then((car2Data) => {
      const data = car2Data.val();
      this.purchasedCars.push(data);
      this.firebaseService.pushToList('purchasedCars', this.purchasedCars)
      localStorage.setItem('purchasedCars', JSON.stringify(this.purchasedCars));
      this.purchasedCars=[];
        });
  }

  addCar() {
    let car2 = new Car2("", this.make, this.model, this.year, this.price, this.desc, this.url);
    let car = new Car("", this.make, this.model, this.year, this.price);
    this.firebaseService.pushToList('cars', car);
    this.firebaseService.pushToList('cars2', car2);
    this.make = '';
    this.model = '';
    this.year = 2019;
    this.price = 0;
    this.desc = '';
    this.url = '';
  }
  updateCar(carID: string){
    this.isUpdating = true;
    this.firebaseService.retrieve('cars', carID).then((carData) => {
      const data = carData.val();
      this.make = data.make;
      this.model = data.model;
      this.year = data.year;
      this.id = carID;
      this.price = data.price;
    });
    this.firebaseService.retrieve('cars2', carID).then((car2Data) =>{
      const data = car2Data.val();
      this.make = data.make;
      this.model = data.model;
      this.year = data.year;
      this.id = carID
      this.price = data.price;
      this.desc = data.desc;
      this.url = data.url;
    });
  }
  newDetails() {
    let car = new Car("", this.make, this.model, this.year, this.price);
    this.firebaseService.update('cars', this.id, car )
    let car2 = new Car2("", this.make, this.model, this.year, this.price, this.desc, this.url);
    this.firebaseService.update('cars2', this.id, car2 )
    this.isUpdating = false;
    }
  
  removeCar(carID: string) { 
    this.firebaseService.deleteFromList("cars", carID);
    this.firebaseService.deleteFromList("cars2", carID);

  }
  removeAll() {
    this.firebaseService.delete("cars","");
    this.firebaseService.delete("cars2","");


  }
  navigateCar() {
    this.router.navigate(['/feature1']);
  }

}
// What is the event cycle leading to the removal of a row from the table upon clicking on the delete
// button? 

/*
0. The ngFor rendered the rows in the table, giving a key for every row's removeItem callback.
1. M-table has a button with a (click) event tied to its own removeItem() callback. 
2. The removeItem() callback used the EventEmitter remove to inform its parent. Passing the key. 
3. The (remove) event at the parent was tied to the removeCar() callback. 
4. The removeCar() callback used the firebaseServce deleteFromList() wrapper, passing the key. 
5. The deleteFromList() used the .delete() Firebase module function passing in the path
   made from the cars path and the key combined into cars/key
6. Firebase detected changes to the cars list and published the new list to its subscribers.
7. onValue has subscribed to the list cars and now receives the data its callback as a 
   DataSnapshot object. 
8. The local RAM copy of the cars list is emptied using splice
9. The DataSnapshot is used to populate the list by interating over the children 
   one by one using forEach
10. As we get a child, we strip it from overhead and acquire the value using .val()
    We get the key using .key. Both are used to create a new car with key for the ram list.
11. The new RAM list gets destroyed and rebuilt to trigger ngChanges in MTable
12. The ngChanges callback inside MTable is called to update the original data.
13. The table re-renders. 


*/