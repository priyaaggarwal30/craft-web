import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import {  DialogComponent} from 'src/app/dialog.component';
import { Router } from '@angular/router';
import {  sessionStorage} from 'src/app/localstorage.service';



@Component({
  selector: 'app-add-order-web',
  templateUrl: './add-order-web.component.html',
  styleUrls: ['./add-order-web.component.scss']
})
export class AddOrderWebComponent implements OnInit {

  constructor(public serve:DatabaseService, public dialog1: DialogComponent,public rout: Router,public session: sessionStorage) { 
    this.get_distributor_list();
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    console.log(this.userData);
    this.userId=this.userData['data']['id'];
    console.log(this.userName);
    this.userName=this.userData['data']['name'];
    console.log(this.userId);
  }

  ngOnInit() {
  }
data:any={};
dr_list:any=[];
productlist:any=[];
noProduct:boolean=false;
size_List:any=[];
quotationData:any = [];
totalQty=0;
grandTotal=0;
totalSub_total=0;
totalGST_total=0;
productName:any;
productCode:any;
quotationDataErr:boolean=false;
orderData:any={};
userId:any;
  userName:any;
  userData:any;
product_id:any;
search:any={};
tmpsearch: string;
secondry_dr_list:any=[];
company_namee:any;
noSize:boolean=false;

get_distributor_list()
{
console.log(this.data.dr_type);
  this.serve.fetchData({'dr_type':this.search.dr_type},"order/dr_list")
  .subscribe((result=>{
    this.dr_list=result['result'];
    this.secondry_dr_list=result['result'];
  console.log(this.dr_list);
  
  }))
}
get_products()
{
  this.serve.fetchData({ }, "Product/product_list").subscribe((result) => {
    console.log(result);
    this.productlist = result['product_list'];
    this.product_id=result['product_list']['id'];
   console.log( this.product_id);

    console.log();
    
    if (this.productlist.length == 0) {
      this.noProduct=true;
    }
    else {
      this.noProduct=false;
    }
  })
}
get_product_size()
{
    // console.log("Size function call");
    // this.data.productSize = null
    // console.log(this.data.Product);
    // if(this.data.Product){
    //   let filterData= this.productlist.filter(row=>row.id == this.data.Product);
    //   console.log(filterData);
    //   for(let i = 0;i< filterData[0].multi_products.length ; i++){
    //     this.size_List=filterData[0].multi_products;
    //   }
    //   console.log(this.size_List);
    // } 
    this.serve.fetchData({'dr_id':this.search.company_name,'product_id':this.data.Product }, "order/getProductSizeData").subscribe((result) => {
      console.log(result);
      this.size_List = result['result'];
      console.log(this.size_List);
    
    })
  
}
conInt(val)
{
  // (parseFloat(val).toFixed(2)).toString()
  // console.log('value after tofixed = '+val);
  return parseFloat(val)
  
}
conFloat(val : any)
{
  // (parseFloat(val).toFixed(2)).toString()
  return parseFloat(val);
}
addToList(){ 
    
    
  // this.data.gst = (parseFloat(this.data.amount) * parseFloat(this.data.gstPercentage) / 100);
  
  
  let flag=0;
  this.data.productName = this.productName;
  this.data.product_code = this.productCode;
  this.data.total_amount = parseFloat(this.data.amount) + parseFloat(this.data.gst)  ;
  this.data.total_amount = parseFloat(parseFloat(this.data.total_amount).toFixed(2)).toString()
  console.log("this.data.total_amount = "+this.data.total_amount);
  
  
  
  console.log(this.data);
  
  
  for(let i=0 ;i<this.quotationData.length ;i++){
    
    if((this.data.Product == this.quotationData[i].Product) && (this.data.productSize == this.quotationData[i].productSize)){
      flag++;
      console.log(flag);
      this.quotationData[i].qty=parseInt(this.quotationData[i].qty)+parseInt(this.data.qty);
      this.quotationData[i].price=parseInt(this.data.price);
      this.quotationData[i].amount=parseInt(this.quotationData[i].price)*parseInt(this.quotationData[i].qty);
      this.quotationData[i].gst=(parseInt(this.quotationData[i].amount)*parseInt(this.data.gstPercentage))/100;
      this.quotationData[i].total_amount=parseInt(this.quotationData[i].gst)+parseInt(this.quotationData[i].amount);
      this.quotationData[i].gstPercentage=this.data.gstPercentage
      
    }
    
  }
  
  if(flag==0){
    this.quotationData.push(this.data);
  }
  
  console.log(this.quotationData);
  this.totalQty=0;
  this.grandTotal=0;
  this.totalSub_total=0;
  this.totalGST_total=0;
  
  for(let i=0 ;i<this.quotationData.length ;i++)
  {
    this.totalQty=parseFloat(this.quotationData[i].qty) + this.totalQty;
    this.grandTotal=parseFloat(this.quotationData[i].total_amount) + this.grandTotal;
    this.totalSub_total=parseFloat(this.quotationData[i].amount) + this.totalSub_total;
    this.totalGST_total=parseFloat(this.quotationData[i].gst) + this.totalGST_total;
    
    
  }
  this.grandTotal = parseFloat(this.grandTotal.toFixed(2).toString());
  this.totalSub_total = parseFloat(this.totalSub_total.toFixed(2).toString());
  this.totalGST_total = parseFloat(this.totalGST_total.toFixed(2).toString());
  
  // this.data.Product = '';
  // this.data.productSize = '';
  // this.data.qty = '';
  // this.data.gstPercentage = '';
  // this.data.price = '';
  // this.data.amount = '';

this.data={};
  console.log(this.data);
  
}
deleteQuotationDetail(arrayIndex) {
    
  if (this.quotationData.length < 2) {
    this.quotationDataErr = true;
  }
  console.log(arrayIndex);
  this.quotationData.splice(arrayIndex, 1);
  console.log(this.quotationData);
  
  this.totalQty=0;
  this.grandTotal=0;
  this.totalSub_total=0;
  this.totalGST_total=0;
  
  for(let i=0 ;i<this.quotationData.length ;i++)
  {
    this.totalQty=parseFloat(this.quotationData[i].qty) + this.totalQty;
    this.grandTotal=parseFloat(this.quotationData[i].total_amount) + this.grandTotal;
    this.totalSub_total=parseFloat(this.quotationData[i].amount) + this.totalSub_total;
    this.totalGST_total=parseFloat(this.quotationData[i].gst) + this.totalGST_total;
    
  }
  
  this.grandTotal = parseFloat(this.grandTotal.toFixed(2).toString());
  this.totalSub_total = parseFloat(this.totalSub_total.toFixed(2).toString());
  this.totalGST_total = parseFloat(this.totalGST_total.toFixed(2).toString());
  
  
  
}
saveQuotation(){
    
  console.log("save quotation call");
  
  
  if (this.quotationData.length < 1) {
    this.quotationDataErr = true;
  }
  
  else{
    
    this.totalQty=0;
    this.grandTotal=0;
    this.totalSub_total=0;
    this.totalGST_total=0;
    
    for(let i=0 ;i<this.quotationData.length ;i++)
    {
      this.totalQty=parseFloat(this.quotationData[i].qty) + this.totalQty;
      this.grandTotal=parseFloat(this.quotationData[i].total_amount) + this.grandTotal;
      this.totalSub_total=parseFloat(this.quotationData[i].amount) + this.totalSub_total;
      this.totalGST_total=parseFloat(this.quotationData[i].gst) + this.totalGST_total;
      
      
    }
    this.grandTotal = parseFloat(this.grandTotal.toFixed(2).toString());
    this.totalSub_total = parseFloat(this.totalSub_total.toFixed(2).toString());
    this.totalGST_total = parseFloat(this.totalGST_total.toFixed(2).toString());
    
    console.log(this.totalQty);
    console.log(this.grandTotal);
    console.log(this.quotationData);
    console.log(this.totalGST_total);
    console.log(this.totalSub_total);

          this.orderData={
              'total_qty' : this.totalQty,
               'grand_total':this.grandTotal,
               'total_gst_amount':this.totalGST_total,
               'sub_total':this.totalSub_total,
               'orderCreated_by':this.userId,
               'uname':this.userName,
               'dr_id':this.search.company_name}
    
    this.serve.fetchData({'orderData':this.orderData,'cart_data':this.quotationData}, "order/add_Primaryorder").subscribe((result) => {
      console.log(result);
      
      if ( result['status'] == 'success') {
        this.dialog1.success("Order", "Added Successfully");
        this.rout.navigate(['/order-list']);
      }
      else{
        this.dialog1.error("Something went wrong");
        this.rout.navigate(['/order-list']);
      }
      this.rout.navigate(['/order-list']);
      
    })
  }
  
}

filter_dr(company_namee){
  console.log("filter_dr method calls");
  console.log(company_namee);
  this.tmpsearch='';
  this.dr_list = [];
  for (var i = 0; i < this.secondry_dr_list.length; i++) {
    company_namee = company_namee.toLowerCase();
    this.tmpsearch = this.secondry_dr_list[i]['company_name'].toLowerCase();
    console.log(this.tmpsearch);
    if (this.tmpsearch.includes(company_namee)) {
      this.dr_list.push(this.secondry_dr_list[i]);
    }
  }
}
back()
{
  window.history.go(-1);
}

}
