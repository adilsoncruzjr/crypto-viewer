import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showToolbar: boolean = true;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  ngOnInit() {
    // Verifica o caminho da URL
    this.router.events.subscribe(() => {
      this.showToolbar = this.router.url === '/';  // A barra de ferramentas será mostrada apenas na página inicial
    });
  }

  onMenuClick() {
    console.log('Menu item clicked!');

    this.sidenav.toggle();
  }

  constructor(private router: Router) { }

  isHomePage(): boolean {
    return this.router.url === '/';
  }
}

