export class Car2 {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    desc: string;
    url: string;
  
    constructor(id: string, make: string, model: string, year: number, price: number, desc: string, url: string) {
      this.id = id;
      this.make = make;
      this.model = model;
      this.year = year;
      this.price = price;
      this.desc = desc;
      this.url = url;
    }
  }