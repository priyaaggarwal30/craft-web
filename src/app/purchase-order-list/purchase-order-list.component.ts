import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss']
})
export class PurchaseOrderListComponent implements OnInit {
  data_not_found:boolean=false;
  skelton:any;
  loader:any;
  item_data:any=[];
  data:any={};
  exp_loader:any;

  constructor(public alert: DialogComponent,public serve:DatabaseService) { }

  ngOnInit() {
    this.purchse_item_list()
  }

  purchse_item_list()
  {
    this.serve.fetchData({'data':this.data},"Organization/purchase_order_list").subscribe((result=>
      {
        console.log(result);
        this.item_data=result;
        console.log(this.item_data);
        if(this.item_data.length=='' ||this.item_data.length==null||this.item_data.length==undefined){
          this.data_not_found=true;
        }
        
        
      }))
  }

  edit_item()
  {
    
  }
  delete_item(id){
    this.alert.confirm('You will not be able to recover this  Data!').then((result) => {
      if (result) {
        this.serve.fetchData({ 'id': id, }, "Organization/delete_purchase_order").subscribe((result => {
          console.log(result);
          if (result == true) {
            this.purchse_item_list();
            
          }
          
        }))
      }
    });

  }

  exportAsXLSX(){

    this.exp_loader = true;
      this.serve.fetchData({'search':this.data},"Organization/purchase_order_list_excel")
      .subscribe(resp=>{
        console.log(resp);
        if(resp['msg']=='Success'){

        this.exp_loader = false;
        document.location.href = 'http://phpstack-83335-2231038.cloudwaysapps.com/api/uploads/Purchase_Order.csv';

        }
      })

  }

}
