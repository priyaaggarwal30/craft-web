import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { findIndex } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit {
  loader:any;
  data:any={};
  state_list:any=[];
  exist:any={};
  district_list:any=[];
  city_list:any=[];
  pinCode_list:any=[];
  active: any = {};
  raw_material:any=[]
  multiple_item:any= new FormControl([]);
  item_list:any=[];
  id:any=0;
  login_data:any=[];
  item_data:any=[];
  
  constructor(public serve:DatabaseService,public route: ActivatedRoute,public session:sessionStorage,public toast: ToastrManager ) {
    
    this.route.params.subscribe(params => {
      console.log(params);
      this.id = params.id;
      console.log(this.id);
      this.id != '0' ? this.update_vendorinfo():'';
    });
    this.login_data = this.session.getSession();  
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    console.log(this.login_data);
    
  }
  
  ngOnInit() {
    
    this.getStateList();
    this.raw_material_list();
    
    
  }
  
  
  submit(){
    if(this.id==0){
      
      console.log(this.data);  
      this.serve.fetchData({'vendor_data':this.data,'raw_material':this.item_list,'uid':this.login_data.id}, "Organization/add_sfa_vendor").subscribe((response => {
        console.log(response);
        if(response=='success')
        {
          this.toast.successToastr('Vendor Successfully Added')
          window.history.go(-1);
        }
        
      }));
    }
    
    else if(this.id!=0){
      
      this.serve.fetchData({'vendor_id':this.id,'vendor_data':this.data,'raw_material':this.item_list},"Organization/add_sfa_vendor").subscribe((result=>
        {
          console.log(result);
          if(result=='success')
          {
            this.toast.successToastr('Vendor Detail Successfully Updated')
            
            window.history.go(-1);
          }
          
          
        }))
        
      }
      
    }
    
    assign_item()
    {
      console.log(this.multiple_item);
      this.item_list=this.multiple_item['_pendingValue']
      
    }
    check_number() {
      if (this.data.mobile.length == 10) {
        this.serve.fetchData({ "mobile": this.data.mobile }, "Distributors/check_dr").subscribe((result => {
          if (result['exists']) {
            this.exist = true;
          }
          else {
            this.exist = false;
          }
        }))
      }
    }
    MobileNumber(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
      
    }
    
    getStateList() {
      this.serve.fetchData(0, "User/state_user_list").subscribe((response => {
        console.log(response);
        this.state_list = response['query']['state_name'];
        
        this.id != '0' ? this.getDistrict():'';
        
      }));
    }
    
    getDistrict() {
      this.serve.fetchData(this.data.state, "User/district_user_list").subscribe((response => {
        this.district_list = response['query']['district_name'];
        this.id != '0' ? this.getCityList():'';
        
        
      }));
      
      
    }
    
    getCityList() {
      let value = { "state": this.data.state, "district": this.data.district }
      this.serve.fetchData(value, "User/city_user_list").subscribe((response => {
        console.log(response);
        this.city_list = response['query']['city'];
        this.id != '0' ? this.getPinCodeList():'';
        
      }));
      
    }
    
    
    
    getPinCodeList() {
      let value = { "state": this.data.state, "district": this.data.district, "city": this.data.city }
      this.serve.fetchData(value, "User/pincode_user_list").subscribe((response => {
        console.log(response);
        this.pinCode_list = response['query']['pincode'];
      }));
    }
    
    toggleterritory(key, action) {
      if (action == 'open') {
        this.active[key] = true;
      }
      if (action == 'close') {
        this.active[key] = false;
      }
      
    }
    
    tmp_product_List:any = [];
    
    raw_material_list()
    {
      
      this.serve.fetchData({},"Organization/raw_material_list").subscribe((result=>
        {
          console.log(result);
          this.raw_material = result;
          this.tmp_product_List = result;
          
        }))
        
      }
      
      vendor_dealing_item()
      {
        this.serve.fetchData({'id':this.id},"Organization/itemsinfo").subscribe((result=>
          {
            console.log(result);
            this.item_data=result['id'];
            console.log(this.item_data);
            if(this.item_data){
              this.temp()
            }
            
            
          }))
        }
        
        temp(){
          console.log("temp method calls");
      
          console.log(this.item_data);
          this.multiple_item.setValue(this.item_data);
          
            console.log(this.multiple_item);
          
        }
        
        
        update_vendorinfo(){
          
          this.serve.fetchData({'id':this.id},"Organization/vendor_detail").subscribe((result=>
            {
              console.log(result);
              this.data=result
              console.log(this.data);
              this.vendor_dealing_item()
              
            }))
          }
          
          edit_item(){
            this.serve.fetchData({'raw_material':this.item_list,'vendor_id':this.id,'uid':this.login_data.id, },"Organization/assigned_item").subscribe((result=>
              {
                console.log(result);
                this.raw_material_list()
                
              }))
              
            }
            back(){
              window.history.go(-1)
            }
            
            
            tmpsearch: any = {};
            filter_dr(search) {
              console.log("filter_dr method calls", search);
              console.log(this.tmp_product_List);
              this.raw_material = [];
              for (var i = 0; i < this.tmp_product_List.length; i++) {
                search = search.toLowerCase();
                const filterSearchBrand = this.tmp_product_List[i]['brand'].toLowerCase(); ''
                const filterSearchCategory = this.tmp_product_List[i]['category'].toLowerCase(); ''
                const filterSearcStockType = this.tmp_product_List[i]['item_name'].toLowerCase(); ''
                const unit_of_measurment = this.tmp_product_List[i]['unit_of_measurment'].toLowerCase(); ''
                if (filterSearchBrand.includes(search) || unit_of_measurment.includes(search) || filterSearchCategory.includes(search) || filterSearcStockType.includes(search)) {
                  this.raw_material.push(this.tmp_product_List[i]);
                }
              }
            }
            
            
          }
          