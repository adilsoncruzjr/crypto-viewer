import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  onMenuClick() {
    console.log('Menu item clicked!');

    this.sidenav.toggle();
  }

  constructor(private router: Router) { }

  isHomePage(): boolean {
    return this.router.url === '/';
  }
}

