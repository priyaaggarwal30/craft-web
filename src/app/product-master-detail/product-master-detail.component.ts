import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { ImageModuleComponent } from '../image-module/image-module.component';

@Component({
  selector: 'app-product-master-detail',
  templateUrl: './product-master-detail.component.html',
  styleUrls: ['./product-master-detail.component.scss']
})
export class ProductMasterDetailComponent implements OnInit {
  loader:any;
  id:any={};
  productdetail:any=[];

  constructor(public serve:DatabaseService,public route:ActivatedRoute,public dialog: DialogComponent,public dialog2: MatDialog) {

    this.route.params.subscribe( params => {
      console.log(params);
      this.id = params.id;
      console.log(this.id);
      if(this.id)
      {
        this. productmasterDetail()

      }
      
    });
    
   }

  ngOnInit() {
  }


  productmasterDetail()
  {

    this.serve.fetchData({'id':this.id},"Organization/product_details").subscribe((result=>
      {
        console.log(result);
        this.productdetail=result;
        console.log(this.productdetail);
        
      }))

  }
  openImage(image){

    const dialogRef = this.dialog2.open(ImageModuleComponent, {
      width: '500px',
      data: {
        type: 'product_image',
        image:image
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');

    });
  }

}
