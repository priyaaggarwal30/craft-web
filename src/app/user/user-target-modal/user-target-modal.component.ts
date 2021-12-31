import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-user-target-modal',
  templateUrl: './user-target-modal.component.html',
  styleUrls: ['./user-target-modal.component.scss']
})
export class UserTargetModalComponent implements OnInit {
  
  
  subCategory_list:any=[];
  target_list:any=[];
  reset:any=[];
  productlist: any = [];
  sizeList:any;
  
  
  
  constructor(public serve:DatabaseService,@Inject(MAT_DIALOG_DATA)public data) {}
  
  ngOnInit() 
  {
    this.getSubCategoryList();
    this.getTargetList();
    this.getProductList();
    
  }
  
  getProductList() {
    
    
    this.serve.fetchData({ filter: 'sendData' }, "Product/product_list").subscribe((result) => {
      
      console.log(result);
      
      
      this.productlist = result['product_list'];
      if (this.productlist.length == 0) {
        console.log("yes");
      }
      setTimeout(() => {
        
      }, 700);
      // if (this.productlist.length == 0) {
      //   this.data_not_found = true;
      // } else {
      //   this.data_not_found = false;
      
      // }
    })
    
  }
  
  
  getSubCategoryList()
  {
    this.serve.fetchData('',"Product/product_sub_category_list").subscribe((result)=>{
      console.log(result);
      this.subCategory_list=result['sub_category'];
    });
  }
  
  getTargetList()
  {
    this.serve.fetchData({'id':this.data.user_id},"User/target_list").subscribe((result)=>{
      console.log(result);
      this.target_list=result['target_list'];
    });
  }
  
  add_data()
  {
    // this.all_data= this.data;
    console.log(this.data);
    this.serve.fetchData(this.data,"User/submit_target").subscribe((result)=>{
      console.log(result);
      this.getTargetList()
      var user_id = this.data.user_id;
      this.data = {};
      this.data.user_id = user_id;
      
    });
    
  }
  
  deleteTarget(id)
  {
    this.serve.fetchData({'id':id},"User/delete_target").subscribe((result)=>{
      console.log(result);
      this.getTargetList();
    });
  }
  
  sizeFunction(){
    this.data.productSize = null
    console.log(this.data.product_name);
    
    if(this.data.product_name){
      
      let filterData= this.productlist.filter(row=>row.product_name == this.data.product_name);
      console.log(filterData);
      
      
      for(let i = 0;i< filterData[0].multi_products.length ; i++){
        this.sizeList=filterData[0].multi_products;
      }
      console.log(this.sizeList);
    }
    
    
  }
  
}
