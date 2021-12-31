import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogService } from '../dialog.service';
import { EditAddressComponent } from '../edit-address/edit-address.component';
import { UserEmailModalComponent } from '../user/user-email-modal/user-email-modal.component';
import { VendorEditModalComponent } from '../vendor-edit-modal/vendor-edit-modal.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { DialogComponent } from '../dialog.component';


@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.scss']
})
export class VendorDetailComponent implements OnInit {
  loader:any;
  vendor_data:any={};
  vendor_id:any={};
  multiple_item:any=[];
  item_list:any=[];
  raw_material:any=[];
  login_data:any=[];
  activeTab = 'Detail';
  constructor(public serve:DatabaseService,public route:ActivatedRoute,public editdialog:DialogService,public dialog: MatDialog,public session:sessionStorage,public alert:DialogComponent ) { 
    
    this.login_data = this.session.getSession();  
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    console.log(this.login_data);
  }
  
  ngOnInit() {
    
    this.route.params.subscribe( params => {
      console.log(params);
      this.vendor_id = params.id;
      console.log(this.vendor_id);
      if(this.vendor_id)
      {
        this. vendor_detail()
        
      }
      
    });
    this.raw_material_list()
    
  }
  
  vendor_detail()
  {    
    console.log(this.vendor_id);
    this.serve.fetchData({'id':this.vendor_id},"Organization/vendor_detail").subscribe((result=>
      {
        console.log(result);
        this.vendor_data=result;
        console.log(this.vendor_data);
      }))
    }
    
    openEditDialog(value,type): void 
    {
      const dialogRef = this.dialog.open(VendorEditModalComponent, {
        width: '350px',
        data:{
          value,
          type,
          'id':this.vendor_id,
          
        }});
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          console.log('The dialog was closed');
          //  this.toast.successToastr("detail");
          this.vendor_detail();
          
        });
      }
      
      editaddress()
      {
        const dialogRef = this.dialog.open(EditAddressComponent, {
          width:'590px',
          data:{
            data:this.vendor_data,
            type:'vendor_address',
          }});
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            this.vendor_detail();
            
          });
          
        }
        assign_item()
        {
          console.log(this.multiple_item);
          this.item_list=this.multiple_item['_pendingValue']
          
        }
        raw_material_list()
        {
          
          this.serve.fetchData({},"Organization/raw_material_list").subscribe((result=>
            {
              console.log(result);
              this.raw_material=result;
              
            }))
            
          }
          
          
          
          delete_assign_item(id){
            console.log(id);
            
            this.alert.confirm('You will not be able to recover this  Data!').then((result) => {
              if (result) {
                this.serve.fetchData({ 'id': id, }, "Organization/unassigned_item").subscribe((result => {
                  console.log(result);
                  if (result == true) {
                    this.vendor_detail();
                  }
                  
                }))
              }
            });
            
            
          }
          
          item_data:any = [];
          GET_VENDOR_PO_DATA(id)
          {
            this.serve.fetchData({ 'vendor_id': id, }, "Organization/vendor_purchase_order").subscribe((result => {
              console.log(result);
              
              this.item_data = result['vendor_orders'];
            }))
          }
          
          
        }
        