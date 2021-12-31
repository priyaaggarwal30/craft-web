import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
    selector: 'app-order-dispatch',
    templateUrl: './order-dispatch.component.html',
})
export class OrderDispatchComponent implements OnInit {
    loader:any=1;
    order_id:any=0;
    order_detail:any=[];
    order_item:any=[];
    logIN_user:any;
    uid:any;
    constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public serve:DatabaseService,public toast : ToastrManager,public dialogs:DialogComponent) {
        console.log(data);
        this.order_id = data['order_id'];
        this.logIN_user = JSON.parse(localStorage.getItem('st_user'));
        console.log(this.logIN_user);
        this.uid = this.logIN_user['data']['id'];
    }
    
    ngOnInit() {
        this.orderDetail();
    }
    
    orderDetail()
    {
        this.loader=1;
        let id={'order_id':this.order_id}
        this.serve.fetchData(id,"Order/order_detail").subscribe((result=>{
            console.log(result);
            this.order_detail=result['order_detail'];
            this.order_item=result['order_detail']['order_item'];
            this.order_detail.order_cgst = this.order_detail.order_gst/2;  
            this.order_detail.order_cgst = parseFloat(this.order_detail.order_cgst).toFixed(2);
            setTimeout (() => {
                this.loader='';
                
            }, 700);
        }))
    }
    
    
    
    update_order()
    {
        let count=0

         for(let i=0;i<this.order_item.length;i++){

            console.log(this.order_item);
            if((this.order_item[i].dispatchQty=='' ||this.order_item[i].dispatchQty==null)){

                this.toast.errorToastr("Please Enter Atleast 1 Dispatch Quantity")

            }

           
            else{

               

                this.serve.fetchData({'order_id':this.order_id,"data":this.order_item,'dr_id':this.order_detail.dr_id,'uid':this.uid},"Order/dispatch_order")
                .subscribe(resp=>{
                    console.log(resp);
                    if(resp['dispatch_order'] == 'success')
                    {
                        this.dialog.closeAll();
                    }
                })
            }

        }


    }
    
    check_qty(indx:any=0)
    {
        console.log(this.order_item[indx]);
      

       
            if((parseInt(this.order_item[indx]['dispatchQty']) > parseInt(this.order_item[indx]['pending_qty']) ||(parseInt(this.order_item[indx]['dispatchQty']) > parseInt(this.order_item[indx]['balance_stock']))))
            {
                this.order_item[indx]['dispatchQty'] = 0;

                this.toast.errorToastr("Currently stock not available, please enter valid quantity..");
            } 
                  
        }
        
    
}
