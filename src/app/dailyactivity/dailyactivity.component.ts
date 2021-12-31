import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dailyactivity',
  templateUrl: './dailyactivity.component.html',
  styleUrls: ['./dailyactivity.component.scss']
})
export class DailyactivityComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
  console.log(data);
  
  
  }
  ngOnInit() {
    
  }

}

