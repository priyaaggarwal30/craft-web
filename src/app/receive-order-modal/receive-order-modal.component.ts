import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-receive-order-modal',
  templateUrl: './receive-order-modal.component.html',
  styleUrls: ['./receive-order-modal.component.scss']
})
export class ReceiveOrderModalComponent implements OnInit {
  skelton:any;
  loader:any;
  data_not_found:boolean=false;
  receiving_detail:any=[];

  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public serve:DatabaseService,) {
    console.log(this.data);
    
   }

  ngOnInit() {
    this.viewreceivedetail()
  }


  viewreceivedetail()
  {
    
    
    this.serve.fetchData({'id':this.data.id},"Organization/recieved_order_detail").subscribe((result=>
      {
        console.log(result);
        this.receiving_detail=result
       
      }))


  }
}
