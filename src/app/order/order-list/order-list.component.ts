import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute,Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { Location } from '@angular/common'


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  animations: [slideToTop()]
  
})
export class OrderListComponent implements OnInit {
  view_tab:any='all';
  value:any={};
  tabStatus:any='all';
  
  orderlist:any=[];
  start:any=0;
  count:any;
  total_page:any; 
  pagenumber:any;
  page_limit:any=50;
  loader:any;
  tmp_list:any=[];
  tmp_orderlist:any=[];
  data:any=[];
  search_val:any={};
  data_not_found:any=false;
  login_data:any=[];
  login_dr_id:any;
  skelton:any={};
  today_date:Date;
  searchData: any;
  backButton: boolean = false;
  count_list:any=[];
  
  constructor(public serve:DatabaseService,public location: Location, public navparams: ActivatedRoute,public route:Router,public dialog:DialogComponent,public session:sessionStorage) 
  { 
    this.today_date = new Date();
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    this.skelton = new Array(10);
    
    if(this.login_data.access_level !='1')
    {
      this.login_dr_id = this.login_data.id;
    }
  }
  
  ngOnInit() {
    
    console.log(this.navparams['params']['_value']);
    this.searchData = (this.navparams['params']['_value']);
    console.log(this.searchData);
    
    if (this.searchData.selectedUser && this.searchData.selectedDate && this.searchData.from == 'attendence') {
      this.backButton = true;
      console.log("in navparams");
      console.log("from attendence");
      this.search_val.created_by = this.searchData.selectedUser;
      this.search_val.date_created = this.searchData.selectedDate;
      this.orderList();
    }
    
    else if(this.searchData.selectedUser && this.searchData.selectedDate && this.searchData.company_name && this.searchData.from == 'checkin'){
      console.log("from checkin");
      this.backButton = true;
      this.search_val.created_by = this.searchData.selectedUser;
      this.search_val.date_created = this.searchData.selectedDate;
      this.search_val.company_name = this.searchData.company_name;
      this.orderList();
      
    }
    
    
    else{
      this.search_val =this.serve.orderFilterPrimary;
      this.orderList();
    }
    
  }
  
  orderList(action:any='')
  { console.log(this.search_val);
    console.log(this.tabStatus);
    if(action == "refresh")
    {
      this.search_val = {};
      this.orderlist = [];
      
    }
    this.loader=1;
    console.log(this.data.search);
    if( Object.getOwnPropertyNames(this.search_val).length != 0)
    {
      this.page_limit = 0;
      this.orderlist = '';
      console.log( this.orderlist );
      
    }
    this.serve.fetchData({'start':this.orderlist.length,'pagelimit':this.page_limit,'search':this.search_val,'login_user':this.login_dr_id},"Order/order_list")
    .subscribe((result=>{
      
      console.log(result);
      this.count=result['order_list']['data'];
      this.tmp_orderlist=result['order_list']['result'];
      this.filter_order_data(this.tabStatus);
      console.log(this.tmp_orderlist);
      console.log(this.orderlist);
      
      
      setTimeout (() => {
        this.loader='';
        
      }, 700);
      if(this.orderlist.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
        
      }
      
    }))
    this.serve.count_list();
    
  }
  refresh()
  {
    this.orderList();
  }
  detailOrder(id)
  {
    this.serve.orderFilterPrimary = this.search_val ;
    this.route.navigate(['/order-detail/'+id]);
  }
  
  deleteOrder(id)
  {
    this.dialog.delete('Order Data !').then((result) => {
      if(result){
        console.log("order deleted");
        
        this.serve.fetchData({'order_id':id},"Order/order_delete").subscribe((result=>{
          console.log(result);
          if(result)
          {
            this.orderList();
          }
        }))
      }});
    }
    tmpsearch:any={};
    tmpsearch1:any={};
    
    filter_order_data(status){
      console.log(status);
      this.tabStatus=status;
      this.view_tab=status;
      if(status!='all'){
        this.orderlist=[];
        for(var i=0;i<this.tmp_orderlist.length; i++)
        {
          // status=status.toLowerCase();
          this.tmpsearch=this.tmp_orderlist[i]['order_status'];
          if(this.tmpsearch.includes(status))
          {
            // console.log(this.orderlist);
            
            this.orderlist.push(this.tmp_orderlist[i]);
          }     
        }    
        console.log(this.orderlist);
      }else if(status=='all'){
        this.orderlist=this.tmp_orderlist;
      }
    }
    
    // getItemsList(index,search)
    // {
    //   console.log(search);
    //   this.orderlist=[];
    //   for(var i=0;i<this.tmp_orderlist.length; i++)
    //   {
    //     search=search.toLowerCase();
    //     this.tmpsearch1=this.tmp_orderlist[i][index].toLowerCase();
    //     if(this.tmpsearch1.includes(search))
    //     {
    //       // console.log(this.orderlist);
    
    //       this.orderlist.push(this.tmp_orderlist[i]);
    //     }     
    //   }    
    //   console.log(this.orderlist);
    
    // }
    
    allCount:any;
    selected_order:any ='';
    
    allOrderdata(){
      this.allCount = 0;
      
      if( !this.search_val.allStates ){
        for (let i = 0; i < this.orderlist.length; i++) {
          if(this.orderlist[i].selected_order = false)
          {
            this.allCount++;
          }
          console.log(this.allCount);
        }
        
      }else{
        for (let i = 0; i < this.orderlist.length; i++) {
          if(this.orderlist[i].selected_order = true)
          {
            this.allCount++;
          }
          console.log(this.allCount);
        }
      }
    }
    
    countSelected(){
      this.allCount = 0;
      for (let i = 0; i < this.orderlist.length; i++) {
        if( this.orderlist[i].selected_order )
        {
          this.allCount++;
        }
      }
    }
    
    
    
    deletecheckavailable() {
      this.dialog.delete('').then((result) => {
        if(result) {
          this.serve.fetchData({ 'check' : this.orderlist } , 'Order/primary_delete')
          .subscribe(result => {
            if(result)
            {
              this.orderList();
            }
          });
        }
      });
    } 
    
    exp_loader:any=false;
    exp_data:any=[];
    excel_data:any=[];
    // 
    exportAsXLSX():void
    {
      this.exp_loader = true;
      
      this.serve.fetchData({'search':this.search_val,'status':this.view_tab},"Order/primary_order_excel")
      .subscribe(resp=>{
        console.log(resp);
        if(resp['msg']=='Success'){

          this.exp_loader = false;
          document.location.href = 'http://phpstack-83335-2231038.cloudwaysapps.com/api/uploads/Order.csv';
  
          }
        // this.exp_data = resp['primary_order_excel'].result;
        // console.log(this.exp_data);
        
        // for(let i=0;i<this.exp_data.length;i++)
        // {
        //   this.excel_data.push({'Date':this.exp_data[i].date_created,'Created By':this.exp_data[i].created_by_name,'Order Id':this.exp_data[i].id,'Company Name':this.exp_data[i].company_name,'Total Item':this.exp_data[i].order_item,'Order Value':this.exp_data[i].order_total,'Status':this.exp_data[i].order_status});
        // }
        // this.exp_loader = false;
        
        // this.serve.exportAsExcelFile(this.excel_data, 'Primary-Order');
        // this.excel_data = [];
        // this.exp_data = [];
      });
    }
    // public onDate(event): void 
    // {
    //   this.search_val.date_created=moment(event.value).format('YYYY-MM-DD');    
    //   this.orderList();
    // }
    
    
    change_date_filter(type): void
    {
      
      console.log(type);
      if(type == 'date_created'){
        this.search_val.date_created=moment(this.search_val.date_created).format('YYYY-MM-DD'); 
        console.log(this.search_val);
        this.orderList()
        
        
      }
      
      else if(type == 'date_from'){
        this.search_val.date_from=moment(this.search_val.date_from).format('YYYY-MM-DD'); 
        console.log(this.search_val);
        this.orderList()
      }
      
      else if(type == 'date_to'){
        this.search_val.date_to=moment(this.search_val.date_to).format('YYYY-MM-DD'); 
        console.log(this.search_val);
        this.orderList()
      }
      else{
        console.log(this.search_val);
      }
      
      
    }
    
    
    
    back(): void {
      console.log("location back method calss");
      console.log(this.location);
      this.location.back()
    }
  }
  