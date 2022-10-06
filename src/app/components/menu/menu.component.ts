import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  selectedCategory : string = '';
  constructor() { }

  ngOnInit(): void {
  }

  onCategorySelecting() {
    console.log(this.selectedCategory)
  }

}
