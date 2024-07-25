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

  /* Assignment

  0. Do not show the key to the user. 
  1. Clicking on the navigate button, should take you to a page with the car details (make, model, year, desc, image, price). 
  2. Add an update button to the list of actions. Clicking on update loads the old data in the inputs. 
     Allow the user to change the data and then click on the update (which replaces the add) button to finish
     the update. The add button reappears and the update disappears. 
  4. Price needs to be added to the table. Clicking the $ button adds the car into a list. 
  5. The new list (cart) can be done by firebase, localstorage, list in RAM. */