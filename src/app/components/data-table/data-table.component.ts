import * as data from '../../data.json';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  cryptocurrencies: any = (data as any).default;

  /* ------------------------ VIRTUAL SCROLL PROPERTIES ----------------------- */
  itemSize = '2.5rem';
  viewportHeightPx = 500;

  constructor() { }

  ngOnInit(): void {
  }

}
