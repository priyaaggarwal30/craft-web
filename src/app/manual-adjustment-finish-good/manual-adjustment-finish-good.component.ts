import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-manual-adjustment-finish-good',
  templateUrl: './manual-adjustment-finish-good.component.html',
  styleUrls: ['./manual-adjustment-finish-good.component.scss']
})
export class ManualAdjustmentFinishGoodComponent implements OnInit {
  data:any={};
  adjusted_data:any=[];
  stock_data:any=[];
  organizaton_data:any=[];
  state_list:any=[];
  login_data : any = [];
  loader = false;
  constructor(public serve: DatabaseService, public session: sessionStorage, private router: Router, public toast: ToastrManager) {
    
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
  }
  
  ngOnInit() {
    this.organization_list()
  }
  
  organization_list()
  {
    
    this.serve.fetchData({},"Organization/organization_list").subscribe((result=>
      {
        console.log(result);
        this.organizaton_data=result;
        
      }))
      
    }
    
    assignstate_list()
    {
      
      this.serve.fetchData({'id':this.data.organization},"Organization/assignstate").subscribe((result=>
        {
          console.log(result);
          this.state_list=result;
          
        }))
        
      }
      
      
      tmp_stock_data : any = [];
      stock_information(){
        this.serve.fetchData({data:this.data},"Organization/FG_list").subscribe((result=>
          {
            console.log(result);
            this.stock_data = result;
            this.tmp_stock_data = result;
            console.log(this.stock_data);
            
            
          }))
          
        }
        
        check_info(){
          
          if(this.data.item_name){
            
            let index=  this.stock_data.findIndex(row=>row.raw_id==this.data.item_name)
            if(index!= -1){
              
              this.data.current_stock=this.stock_data[index].stock
              
            }
            else{
              console.log("error");
              
            }
          }
        }
        
        check_qty(){
          
          if ((this.data.adjustment_type == 'decrement') && (this.data.adjustment_stock > this.data.balance_stock)){
            
            this.data.adjustment_stock = this.data.balance_stock
            
          }
          else{
            console.log("increment_data");
            
          }
          
        }
        
        adjust_multiple_stock(){
          
          console.log(this.data);
          
          
          let index= this.adjusted_data.findIndex(row=>row.item_id==this.data.item_name && row.state==this.data.state && row.organization==this.data.organization && row.adjustment_type==this.data.adjustment_type  )           
          console.log(index);
          if(index!= -1){
            
            this.adjusted_data[index].adjustment_stock= parseInt(this.adjusted_data[index].adjustment_stock)+parseInt(this.data.adjustment_stock)
            
          }
          else{
            
            this.adjusted_data.push({
              
              organization:this.data.organization,
              organization_name:this.data.organization_name,
              adjustment_type:this.data.adjustment_type,
              state:this.data.state,
              product_id: this.data.product_id,
              category: this.data.category,
              item_name:this.data.item_name_name,
              brand:this.data.brand,
              size:this.data.size,
              balance_stock:this.data.balance_stock,
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
          this.data.balance_stock = undefined;
          this.data.adjustment_stock = undefined;
          this.data.reason = undefined;
          
          
        }
        
        back(){
          window.history.go(-1)
          
        }
        
        
        submit_stock_information() {
          this.loader = true;
          this.serve.fetchData({ 'product_array': this.adjusted_data, 'created_by': this.login_data.id }, "Organization/manual_FG_stock_TXN").subscribe((result => {
            
            this.loader = false;
            
            this.toast.successToastr("Adjustment Successfully");
            window.history.go(-1)
            
            console.log(result);
            
          }))
          
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
            const filterSearcStockType = this.tmp_stock_data[i]['product_slug'].toLowerCase(); ''
            const unit_of_measurment = this.tmp_stock_data[i]['size'].toLowerCase(); ''
            if (filterSearchBrand.includes(search) || unit_of_measurment.includes(search) || filterSearchCategory.includes(search) || filterSearcStockType.includes(search)) {
              this.stock_data.push(this.tmp_stock_data[i]);
            }
          }
        }
        
        
        
      }
      