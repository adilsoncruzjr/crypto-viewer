import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent implements OnInit {
  coins = [
    { name: 'Bitcoin' },
    { name: 'Ethereum' },
    { name: 'Litecoin' },
  ];

  constructor() { }

  ngOnInit(): void {
    
  }
}
