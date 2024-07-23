import { Component } from '@angular/core';
import { MContainerComponent } from '../../m-framework/m-container/m-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Car } from '../../data/Car';
import { MTableComponent } from '../../m-framework/m-table/m-table.component';
import { MSearchButtonComponent } from '../../m-framework/m-search-button/m-search-button.component';
import { FirebaseService } from '../../services/firebase.service';
import { onValue } from 'firebase/database';
import { ref } from 'firebase/database';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MContainerComponent,
    MTableComponent,
    MSearchButtonComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  model: string;
  make: string;
  year: number;
  filterTerm: string = '';
  headers: string[] = ['ID','Make', 'Model', 'Year'];
  listofcars: Car[];

  constructor(private firebaseService: FirebaseService) {
    this.model = '';
    this.make = '';
    this.year = 2019;
    this.listofcars = [];
    
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

  addCar() {
    let car = new Car("", this.make, this.model, this.year);
    this.firebaseService.pushToList('cars', car);
    this.make = '';
    this.model = '';
    this.year = 2019;
  }

  removeCar(carID: string) { 
    this.firebaseService.deleteFromList("cars", carID);
  }
  removeAll() {
    this.firebaseService.delete("cars","");
  }
  navigateCar() {}
}
