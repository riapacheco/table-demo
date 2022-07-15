import * as data from '../../data.json';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  cryptocurrencies: any = (data as any).default;

  constructor() { }

  ngOnInit(): void {
  }

}
