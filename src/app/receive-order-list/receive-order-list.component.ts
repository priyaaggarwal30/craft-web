import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ImageModuleComponent } from '../image-module/image-module.component';
import { ReceiveOrderModalComponent } from '../receive-order-modal/receive-order-modal.component';

@Component({
  selector: 'app-receive-order-list',
  templateUrl: './receive-order-list.component.html',
  styleUrls: ['./receive-order-list.component.scss']
})
export class ReceiveOrderListComponent implements OnInit {
  data_not_found:any={}
  skelton:any=[];
  loader:any;
  receive_list:any=[];
  order_id:any={};

  constructor(public serve:DatabaseService,public route:ActivatedRoute,public dialog2: MatDialog) {
    console.log(this.route);
    console.log(this.route.queryParams);
    this.order_id=this.route.queryParams['_value']
    console.log(this.order_id);
    
   }

  ngOnInit(){

    this.receive_order_list()
  }

  receive_order_list(){
    this.serve.fetchData(this.order_id,"Organization/recieved_order_list").subscribe((result=>
      {
        console.log(result);
        this.receive_list=result;
        console.log(this.receive_list);
      }))

  }

  view_receive_detail(id)
  {

    const dialogRef = this.dialog2.open(ReceiveOrderModalComponent, {
      width: '700px',
      data: {
        id
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });

  }

  openImage(image){
    console.log('test');

    const dialogRef = this.dialog2.open(ImageModuleComponent, {
      width: '500px',
      data: {
        type: 'receiving_image',
        image:image
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');

    });
  }

}
