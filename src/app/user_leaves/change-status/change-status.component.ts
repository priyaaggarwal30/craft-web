import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss']
})
export class ChangeStatusComponent implements OnInit {
  
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public serve:DatabaseService) 
  {
    console.log(this.data);

    
  }
  
  ngOnInit() 
  {
  }
  
  changeStatus()
  {
    
    this.serve.fetchData({'reason':this.data.reason,'status':this.data.status,'id':this.data.id},"Leaves/statusChange").subscribe((result=>{
      console.log(result);
    }))
    this.dialog.closeAll();
    
  }
  
}
