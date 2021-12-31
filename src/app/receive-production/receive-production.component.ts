import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-receive-production',
  templateUrl: './receive-production.component.html',
  styleUrls: ['./receive-production.component.scss']
})
export class ReceiveProductionComponent implements OnInit {
  
  organizaton_data : any =[];
  data:any = {};
  state_data:any={};
  constructor(public serve: DatabaseService, public toast: ToastrManager) {
    
    this.organization_list();
    
  }
  
  ngOnInit() {
  }
  
  
  organization_list() {
    
    this.serve.fetchData({}, "Organization/organization_list").subscribe((result => {
      console.log(result);
      this.organizaton_data = result;
      
    }))
    
  }
  
  state_list() {
    
    this.serve.fetchData({ 'id': this.data.org_id }, "Organization/assignstate").subscribe((result => {
      console.log(result);
      this.state_data = result;
      
    }))
    
  }
  
  
  under_production_product = [];
  
  GET_UNDER_PRODUCTION_PRODUCT()
  {
    this.serve.fetchData(this.data, "Organization/production_plan_product_list").subscribe((result => {
      console.log(result);
      this.under_production_product = result['production_plan_product'];
      
    }))
    
  }
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }
  
  checkValidQty(index){
    
    console.log(this.under_production_product[index]['under_processing_stock']);
    
    console.log(this.under_production_product);
    
    
    if (parseInt(this.under_production_product[index]['under_processing_stock']) < parseInt(this.under_production_product[index]['received_qty']))
    {
      console.log("Invalid Qty");

      this.under_production_product[index]['received_qty'] = this.under_production_product[index]['under_processing_stock'];
      
      return;
    }
    else{
      console.log("Valid Qty");
      
    }
    
  }
  
  SEND_DATA_FRO_RECEIVING()
  {
    console.log(this.under_production_product);
    
    this.serve.fetchData({ product_array: this.under_production_product }, "Organization/add_received_for_FG").subscribe((result => {
      console.log(result);

      this.toast.successToastr("Production Received Successfully");
      // this.under_production_product = result['production_plan_product'];
      
    }))
    
  }
  
}
