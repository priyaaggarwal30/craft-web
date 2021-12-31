import {  Component,  Inject,  OnInit} from '@angular/core';
import {  MatDialog,  MAT_DIALOG_DATA} from '@angular/material';
import {  FormControl } from '@angular/forms';
import {  DialogComponent} from 'src/app/dialog.component';
import {  DatabaseService} from 'src/_services/DatabaseService';
import {  sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';

import * as moment from 'moment';

@Component({
  selector: 'app-quotation-add',
  templateUrl: './quotation-add.component.html'
})
export class QuotationAddComponent implements OnInit {
  
  today_date: any;
  selected_dr_type_id:any;
  selected_dr_type:any;
  dr_lead_name:any;
  data: any = {};
  lead_List:any;
  productlist: any;
  trimurtiBillingAddress:any;
  selectedTrimurtiBillingAddressID:any;
  selectedTrimurtiBillingAddressDetail:any;
  c_shipping_addr:any;
  c_billing_addr:any;
  c_shipping_city : any = '';
  c_shipping_state : any = '';
  c_shipping_country : any = '';
  c_billing_city:any = '';
  c_billing_state:any = '';
  c_billing_country:any = '';
  type_list:any=[];
  noTrimurtiBillingAddress:boolean=false;
  size_List:any;
  noLead:boolean=false;
  noProduct:boolean=false;
  noSize:boolean=false;
  productName:any;
  productCode:any;
  updated:any = "no";
  quotationData:any = [];
  quotationDataErr:boolean=false;
  termsNcondition='<div>GST :</div><div>5% GST Extra on POP/Gypsum Plaster</div><div>!8% GST Extra on Wall Putty</div><div>Payment : 100% Advance</div><div>Price : Freight included but unloading charges extra</div><div>Note : Price up to Ghaziabad, Uttar Pradesh</div>';
  grandTotal=0;
  totalSub_total=0;
  totalGST_total=0;
  totalQty=0;
  logIN_user=0;
  drId=0;
  userId:any;
  userName:any;
  userData:any;
  editorConfig = {
    editable: true,
    spellcheck: false,
    height: '10rem',
    minHeight: '5rem',
    placeholder: '',
    translate: 'no',
    "toolbar": [
      ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
      ["fontName", "fontSize", "color"],
      ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
      ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
      ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
      
    ]
  };
  
  spinner_loader:boolean = false;
  dr_name:any='';
  tmpsearch: string;
  secondary_lead_list: any = [];

  
  
  
  
  
  constructor(public serve: DatabaseService, public Toastr: ToastrManager,public rout: Router, public session: sessionStorage, public dialog: MatDialog, public dialog1: DialogComponent) { 
    this.today_date = new Date().toISOString().slice(0, 10);
    console.log(this.today_date);
    console.log("in quotation add");
    this.logIN_user = JSON.parse(localStorage.getItem('st_user'));
    console.log(this.logIN_user);
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    console.log(this.userData);
    this.userId=this.userData['data']['id'];
    console.log(this.userName);
    this.userName=this.userData['data']['name'];
    console.log(this.userId);
    this.get_type_list();
    
    
    
  }
  
  ngOnInit() {
  }
  get_type_list()
  {
    this.serve.fetchData('',"Lead/lead_type_list")
    .subscribe(resp=>{
      console.log(resp);
      this.type_list=resp['lead_type'];
      console.log(this.type_list);
    })
  }
  getLeadList(){
    console.log("lead list function call");
    console.log(this.selected_dr_type_id);
    
    if(this.selected_dr_type_id == '1'){
      this.selected_dr_type = 'Distributor'
    }
    else if(this.selected_dr_type_id == '3'){
      this.selected_dr_type = 'Dealer'
      
    }
    else if(this.selected_dr_type_id == '9'){
      this.selected_dr_type = 'Project'
      
    }
    else if(this.selected_dr_type_id == '5'){
      this.selected_dr_type = 'End user'
      
    }
    else if(this.selected_dr_type_id == '10'){
      this.selected_dr_type = 'Contractor'
      
    }
    else if(this.selected_dr_type_id == '15'){
      this.selected_dr_type = 'Customer'
    }
    else if(this.selected_dr_type_id == '13'){
      this.selected_dr_type = 'Builder'
    }
    else if(this.selected_dr_type_id == '14'){
      this.selected_dr_type = 'Cement Dealer'
    }
    else if(this.selected_dr_type_id == '11'){
      this.selected_dr_type = 'Architect'
    }
    
    else{
      this.selected_dr_type = 'Others'
      
    }
    
    this.spinner_loader = true;
    this.lead_List = [];
    this.serve.fetchData({'type_id':this.selected_dr_type_id},"Lead/getLeadList")
    .subscribe((result=>{
      console.log(result);
      this.spinner_loader = false;
      
      this.lead_List= result['lead_list'];
      this.secondary_lead_list= result['lead_list'];
      console.log(this.lead_List);
      if(this.lead_List.length == 0){
        this.noLead=true;
      }
      else {
        this.noLead=false;
      }
    }))
    
  }
  
  getProducts(){
    console.log("Product function call");
    console.log(this.dr_lead_name);
    this.serve.fetchData({ }, "Product/product_list").subscribe((result) => {
      console.log(result);
      this.productlist = result['product_list'];
      if (this.productlist.length == 0) {
        this.noProduct=true;
      }
      else {
        this.noProduct=false;
      }
    })
  }
  
  getSize(){
    console.log("Size function call");
    this.data.productSize = null
    console.log(this.data.Product);
    if(this.data.Product){
      let filterData= this.productlist.filter(row=>row.id == this.data.Product);
      console.log(filterData);
      for(let i = 0;i< filterData[0].multi_products.length ; i++){
        this.size_List=filterData[0].multi_products;
      }
      console.log(this.size_List);
    } 
  }
  
  
  add_quotation(){
    console.log("in add quotation");
  }
  
  conInt(val)
  {
    // (parseFloat(val).toFixed(2)).toString()
    // console.log('value after tofixed = '+val);
    return parseFloat(val)
    
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
    
    this.data = {};
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
      console.log(this.termsNcondition);
      console.log(this.quotationData);
      console.log(this.dr_lead_name);
      console.log(this.selected_dr_type);
      console.log(this.totalGST_total);
      console.log(this.totalSub_total);
      
      this.serve.fetchData({'total_qty' : this.totalQty,'grand_total':this.grandTotal,'gst_amount':this.totalGST_total,'total_amount':this.totalSub_total,'term_condition':this.termsNcondition,'dr_name':this.dr_lead_name,'type':this.selected_dr_type,'drId':this.drId,'uid':this.userId,'uname':this.userName,'item':this.quotationData,'company_address_id':this.selectedTrimurtiBillingAddressID,'customer_billing':this.c_billing_addr,'customer_shipping':this.c_shipping_addr,'c_billing_city':this.c_billing_city,'c_billing_state':this.c_billing_state,'c_billing_country':this.c_billing_country,'c_shipping_city':this.c_shipping_city,'c_shipping_state':this.c_shipping_state,'c_shipping_country':this.c_shipping_country }, "Lead/quotationAdd").subscribe((result) => {
        console.log(result);
        
        if (result['message'] == 'Quotation added sucessfully' && result['status'] == 'Success') {
          this.dialog1.success("Quotation", "Inserted");
          this.rout.navigate(['/quotation']);
        }
        else{
          this.dialog1.error("Something went wrong");
          this.rout.navigate(['/quotation']);
        }
        this.rout.navigate(['/quotation']);
        
      })
    }
    
  }
  
  getTrimurtiBillingAddress(){
    console.log("getTrimurtiBillingAddress function call");
    this.serve.fetchData({ }, "Lead/company_address").subscribe((result) => {
      console.log(result);
      this.trimurtiBillingAddress = result['data'];
      if (this.trimurtiBillingAddress.length == 0) {
        this.noTrimurtiBillingAddress=true;
      }
      else {
        this.noTrimurtiBillingAddress=false;
      }
    })
  }
  
  back()
  {
    window.history.go(-1);
  }
  
  conFloat(val : any)
  {
    // (parseFloat(val).toFixed(2)).toString()
    return parseFloat(val);
  }
  
  filter_dr(dr_name){
    console.log("filter_dr method calls");
    console.log(dr_name);
    this.tmpsearch='';
    this.lead_List = [];
    for (var i = 0; i < this.secondary_lead_list.length; i++) {
      dr_name = dr_name.toLowerCase();
      this.tmpsearch = this.secondary_lead_list[i]['company_name'].toLowerCase();
      if (this.tmpsearch.includes(dr_name)) {
        this.lead_List.push(this.secondary_lead_list[i]);
      }
    }
  }
  
}
