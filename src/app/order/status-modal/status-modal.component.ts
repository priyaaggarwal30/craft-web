import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';


@Component({
  selector: 'app-status-modal',
  templateUrl: './status-modal.component.html'
})
export class StatusModalComponent implements OnInit {
  // data:any={};
  login:any={};
  delivery_from:any;
  state_data:any=[];
  unassigned_state:any=[];
  delete_data:any=[];
  organization:any={};
  raw_data:any=[];
  login_data:any=[];
  raw_material:any=[];
  brand_data:any=[];
  
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public serve:DatabaseService,public session:sessionStorage) { 
    console.log(this.data);

    if (this.data['data']&&this.data['data']['assigned_state'])
    {
      this.state_data=this.data['data']['assigned_state'];
    }
    console.log(this.state_data);
    this.organization=this.data['organization']
    console.log(this.organization);
    this.raw_data=this.data['data']
    console.log(this.raw_data); 
    console.log(this.data.delivery_from);
    this.delivery_from=this.data.delivery_from;
    
    
    
  }
  
  ngOnInit() {
    this.login=JSON.parse(localStorage.getItem('login'));
    console.log(this.login.data.id);
    this.material()
    this.brand()
    
    
  }
  reason_reject:any
  order_status_change(reason,status){
    console.log(reason,status);
    
    this.serve.fetchData({'reason':reason,'status':status,'id':this.data.order_id,'action_by':this.login.data.id},"Order/orderstatus_change").subscribe((result=>{
      console.log(result);
    }))
    this.dialog.closeAll();
    
    // this.orderDetail();
  }
  
  
  delete_state()
  {
    console.log(this.unassigned_state);
    this.delete_data=this.unassigned_state['_pendingValue']
    console.log(this.delete_data);
    
  }
  
  
  stateUnassign()
  {
    this.serve.fetchData({'state_id':this.delete_data,},"Organization/state_unassign").subscribe((result=>
      {
        console.log(result);
        
      }))
      this.dialog.closeAll();
      
    }
    
    update_material()
    {
      this.serve.fetchData({'uid':this.login.data.id,'raw_material':this.raw_data},"Organization/update_raw_material").subscribe((result=>
        {
          console.log(result);
          
        }))
        this.dialog.closeAll();
        
      }
      
      material()
      {
        
        this.serve.fetchData({},"Organization/measurement_list").subscribe((result=>
          {
            console.log(result);
            this.raw_material=result;
          }))
          
        }

        brand(){

          this.serve.fetchData({},"Organization/brandlist").subscribe((result=>{
            console.log(result);
            this.brand_data=result;
            console.log(this.brand_data);
            
          })
          )
        }
        
        
      }
      