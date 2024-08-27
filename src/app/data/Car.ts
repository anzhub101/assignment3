export class Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
 

  constructor(id: string, make: string, model: string, year: number, price: number) {
    this.id = id;
    this.make = make;
    this.model = model;
    this.year = year;
    this.price = price;
     }
  }