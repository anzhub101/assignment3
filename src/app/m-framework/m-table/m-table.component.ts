import { Component, Input, Output, EventEmitter, SimpleChanges  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDeleteButtonComponent } from '../m-delete-button/m-delete-button.component';
import { ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'm-table',
  standalone: true,
  imports: [CommonModule, MDeleteButtonComponent],
  templateUrl: './m-table.component.html',
  styleUrl: './m-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MTableComponent {
  @Input() data: any[] = [];
  @Input() filterTerm: string = '';
  @Input() showDeleteButton: boolean = false;
  @Input() showMoreDetails: boolean = false;
  @Input() showBuy: boolean = false; 
  @Input() showCaption: boolean = false;
  @Input() showUpdate: boolean = false;
  @Input() caption: string = 'Table Caption';
  @Input() tableHeaders: string[] = [];

  @Output() remove: EventEmitter<string> = new EventEmitter<string>();
  @Output() navigate: EventEmitter<number> = new EventEmitter<number>();
  @Output() buy: EventEmitter<string> = new EventEmitter<string>(); 
  @Output() update: EventEmitter<string> = new EventEmitter<string>(); 


  private originalData: any[]; 
  
  constructor() {
    this.originalData = [];
  }
  
  showBuyPressed(itemID: string){
    this.buy.emit(itemID);
  }
  getObjectKeys(obj: any): string[] {
    if (!obj) {
      return []; 
    }
    return Object.keys(obj);
  }
  showDetails(itemId: number) {
    this.navigate.emit(itemId);
  }
  removeItem(itemId: string) {
    this.remove.emit(itemId);
  }
  updateItem(itemID: string){
    this.update.emit(itemID);
  }
  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['data']) {
      this.originalData = [...this.data];
    }

    if (changes['filterTerm']) {
      this.filterData(this.filterTerm);
    }
  }
  filterData(searchTerm: string): void {
    if (!searchTerm) {
      this.data = [...this.originalData];
    } else {
      this.data = this.originalData.filter(item =>
        Object.values(item).some((value:any) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase().trim())
        )
      );
    }
  }
}
