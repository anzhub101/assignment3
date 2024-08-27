import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MCardComponent } from '../../m-framework/m-card/m-card.component';
import { MContainerComponent } from '../../m-framework/m-container/m-container.component';
import { FirebaseService } from '../../services/firebase.service';
import { Car2 } from '../../data/Car2';

@Component({
  selector: 'app-feature1',
  standalone: true,
  imports: [CommonModule, FormsModule, MContainerComponent, MCardComponent],
  templateUrl: './feature1.component.html',
  styleUrl: './feature1.component.css'
})
export class Feature1Component {
  cars: Car2[] = [];
  CarIds: Set<string> = new Set();

  constructor(private firebaseService: FirebaseService) {}

  async loadCars() {
    await this.getList('/cars2');
  }

  async getList(path: string) {
    const loadlist = await this.firebaseService.getList(path) as Car2[];

    loadlist.forEach(car => {
      if (!this.CarIds.has(car.id)) {
        this.cars.push(car);
        this.CarIds.add(car.id);
      }
    });
  }
}