import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogService } from '../dialog.service';
import { ImageModuleComponent } from '../image-module/image-module.component';
import { ReceiveOrderModalComponent } from '../receive-order-modal/receive-order-modal.component';

@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss']
})
export class PurchaseOrderDetailComponent implements OnInit {
  order_id:any={}
  order_data:any=[];
  invoice_data:any=[];
  
  show_save : any = 0;
  
  
  constructor(public serve:DatabaseService,public route:ActivatedRoute,public editdialog:DialogService,public dialog: MatDialog,private router: Router,public dialog2:MatDialog,public toast: ToastrManager) {
    this.route.params.subscribe( params => {
      console.log(params);
      this.order_id = params.id;
      console.log(this.order_id);
      if(this.order_id)
      {
        this.order_detail()
        this.invoice_item_detail();
        
      }
      
    });
  }
  
  ngOnInit() {
  }
  
  order_detail(){
    console.log(this.order_id);
    this.serve.fetchData({'id':this.order_id},"Organization/purchase_order_detail").subscribe((result=>
      {
        console.log(result);
        this.order_data=result;
        console.log(this.order_data);
        
      }))
    }
    
    invoice_item_detail()
    {
      this.serve.fetchData({'id':this.order_id},"Organization/recieved_order_detail").subscribe((result=>
        {
          console.log(result);
          this.invoice_data=result;
          console.log(this.invoice_data);
        }))
        
      }
      back(){
        window.history.go(-1)
      }
      
      onClick(){
        
        this.router.navigate(['/add-receive-order'],{ queryParams:{'id' : this.order_data.id}});
        
      }
      
      receiving_list()
      {
        
        this.router.navigate(['/receive-order-list'],{ queryParams:{'id' : this.order_data.id}});
        
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
      
      
      
      calc(id,qty){
        
        console.log(id,qty);
        var index = this.order_data['order_item'].findIndex(row=>row.id === id)
        console.log(index);
        this.order_data['order_item'][index].amount=(this.order_data['order_item'][index].price)*this.order_data['order_item'][index].qty;
        console.log(this.order_data['order_item'][index].amount);
        
        this.order_data.order_item_qty=0;
        this.order_data.order_total=0;
        
        for(let i=0;i<this.order_data['order_item'].length;i++){
          
          this.order_data.order_item_qty=parseInt(this.order_data.order_item_qty)+parseInt(this.order_data['order_item'][i].qty);
          this.order_data.order_total=parseFloat(this.order_data.order_total)+parseFloat(this.order_data['order_item'][i].amount);
          console.log(this.order_data.order_item_qty);
          
        }
        
        
        
      }
      
      update_order(id)
      {
        console.log(id);
        var index = this. order_data['order_item'].findIndex(row=>row.id === id)
        console.log(index);
        console.log(this.order_data['order_item'][index]);
        
        
         this.order_data['order_item'][index]['pending_qty'] = this.order_data['order_item'][index]['qty'];
        this.serve.fetchData({'id':id,'order_item':this.order_data['order_item'][index],'total_qty':this.order_data.order_item_qty,'total_amount':this.order_data.order_total},'Organization/update_item')
        .subscribe((result)=>{
          console.log(result);
          if(result=='Success'){
            this.toast.successToastr('item Successfully Updated')
            
          }
          this.order_detail();
          
          
        })
      }
      
    }
    