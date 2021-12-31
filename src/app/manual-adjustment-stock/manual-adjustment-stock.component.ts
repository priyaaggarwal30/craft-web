import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-manual-adjustment-stock',
  templateUrl: './manual-adjustment-stock.component.html',
  styleUrls: ['./manual-adjustment-stock.component.scss']
})
export class ManualAdjustmentStockComponent implements OnInit {
  data:any={};
  organizaton_data:any=[];
  stock_data:any=[];
  adjusted_data:any=[];
  login_data:any=[];
  state_data : any= [];
  stockType : any 
  
  constructor(public serve: DatabaseService, public session: sessionStorage, private router: Router, public toast: ToastrManager) {
    this.login_data = this.session.getSession();  
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    console.log(this.login_data);
  }
  
  ngOnInit() {
    this. organization_list()
    
  }
  
  check_qty(){
    
    if((this.data.adjustment_type=='decrement') && (this.data.adjustment_stock>this.data.current_stock)){
      
      this.data.adjustment_stock=this.data.current_stock
      
    }
    else{
      console.log("increment_data");
      
    }
    
  }
  
  state_list() {
    
    this.serve.fetchData({ 'id': this.data.organization, }, "Organization/assignstate").subscribe((result => {
      console.log(result);
      this.state_data = result;
      console.log(this.state_data);
      if (this.state_data) {
      }
      
    }))
    
  }
  
  GET_INFO(list)
  {
    
    console.log(list); 
    // this.data.state = list.type;
    this.stockType =list.type;    
    console.log(this.stockType);
    
    this.data.item_name_name = list.item_name
    this.data.brand = list.brand
    this.data.size = list.unit_of_measurment
    
  }
  
  
  organization_list()
  {
    
    this.serve.fetchData({},"Organization/organization_list").subscribe((result=>
      {
        console.log(result);
        this.organizaton_data=result;
        
      }))
      
    }
    
    GET_RAW_MATERIAL_STOCK() {
      
      this.serve.fetchData(this.data, "Organization/raw_material_current_stock").subscribe((result => {
        console.log(result);
        this.data['current_stock']=result['data'];
        // this.organizaton_data = result;
        
      }))
      
    }
    
    
  tmp_stock_data : any = [];
    stock_information(id)
    {
      
      this.serve.fetchData({'id':id},"Organization/adjustment_raw_material_stock").subscribe((result=>
        {
          console.log(result);
        this.stock_data = result;
        this.tmp_stock_data = result;
          console.log(this.stock_data);
          
        }))
        
      }
      
      // check_info(){
      
      
      //   console.log(this.stock_data);
      //   console.log(this.data.item_name)
      
      //   if(this.data.item_name){
      
      //     let index=  this.stock_data.findIndex(row=>row.raw_id==this.data.item_name)
      //     if(index!= -1){
      //       this.data.state= this.stock_data[index].state_name?this.stock_data[index].state_name:'Common'
      //       this.data.current_stock=this.stock_data[index].stock
      
      //     }
      //     else{
      //       console.log("error");
      
      //     }
      
      
      //   }
      // }
      
      
      adjust_multiple_stock(){
        
        console.log(this.data);
        
        
        let index = this.adjusted_data.findIndex(row => row.item_name==this.data.item_name && row.state==this.data.state && row.organization==this.data.organization && row.adjustment_type==this.data.adjustment_type  )
        console.log(index);
        if(index!= -1){
          
          this.adjusted_data[index].adjustment_stock= parseInt(this.adjusted_data[index].adjustment_stock)+parseInt(this.data.adjustment_stock)
          
        }
        else{
          
          this.adjusted_data.push({
            organization:this.data.organization,
            organization_name:this.data.organization_name,
            adjustment_type:this.data.adjustment_type,
            state: this.data.state,
            stock_type: this.data.stock_type,
            item_id:this.data.item_name,
            item_name:this.data.item_name_name,
            brand:this.data.brand,
            unit_of_measurement:this.data.size,
            current_stock:this.data.current_stock,
            adjustment_stock:this.data.adjustment_stock,
            reason:this.data.reason,
          })
        }
        
        
        console.log(this.adjusted_data);
        this.data.adjustment_type = undefined;
        this.data.state = undefined;
        this.data.item_name = undefined;
        this.data.item_name_name = undefined;
        this.data.brand = undefined;
        this.data.size = undefined;
        this.data.current_stock = undefined;
        this.data.adjustment_stock = undefined;
        this.data.reason = undefined;
        
      }
      
      delete_item(index){
        
        this.adjusted_data.splice(index,2)
        
      }
      
      loader = false;
      
      submit(){
        
        this.loader = true;
        
        this.serve.fetchData({'item_array':this.adjusted_data,'created_by':this.login_data.id},"Organization/manual_stock_TXN").subscribe((result=>
          {
            this.loader = false
            this.toast.successToastr("Adjustment Successfully");
            console.log(result);
            window.history.go(-1)
          }))
          
        }
        
        back(){
          window.history.go(-1)
        }
        
        
  tmpsearch: any = {};
  filter_dr(search) {
    console.log("filter_dr method calls", search);
    console.log(this.tmp_stock_data);
    this.stock_data = [];
    for (var i = 0; i < this.tmp_stock_data.length; i++) {
      search = search.toLowerCase();
      const filterSearchBrand = this.tmp_stock_data[i]['brand'].toLowerCase(); ''
      const filterSearchCategory = this.tmp_stock_data[i]['category'].toLowerCase(); ''
      const filterSearcStockType = this.tmp_stock_data[i]['item_name'].toLowerCase(); ''
      const unit_of_measurment = this.tmp_stock_data[i]['unit_of_measurment'].toLowerCase(); ''
      if (filterSearchBrand.includes(search) || unit_of_measurment.includes(search) || filterSearchCategory.includes(search) || filterSearcStockType.includes(search)) {
        this.stock_data.push(this.tmp_stock_data[i]);
      }
    }
  }
        
        
        
      }
      