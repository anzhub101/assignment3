export class Car {
    id: string;
    make: string;
    model: string;
    year: number;
    constructor(id: string, make: string, model: string, year: number) {
      this.id = id; 
      this.make = make;
      this.model = model;
      this.year = year;
    }
  }