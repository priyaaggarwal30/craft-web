import { Component, OnInit } from '@angular/core';
// import { import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';

import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { NavigationComponent } from '../../navigation/navigation.component';

@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.scss']
})
export class DealerComponent implements OnInit {
  data_not_found=false;
  skelton:any={}
  constructor(public serve:DatabaseService,public route:Router,public dialog:DialogComponent) {
   this.today_date=new Date();
   this.search_val.contact_person='';
    this.search_val.company_name='';
    this.search_val.created_by='';
    this.search_val.date_created='';
    this.search_val.contact_number='';
    this.search_val.state='';
    this.search_val.assign_user='';
   


  }
  
  ngOnInit() {
    this.search_val = this.serve.dealerListSearch
    this.distributorList();
    this.skelton = new Array(10);
  }
  value:any={};
  distributor_list:any=[];
  start:any=0;
  count:any;
  total_page:any; 
  pagenumber:any;
  page_limit:any=50
  exp_loader:any;
  loader:any;
  data:any=[];
  state_values:any=[];
  dr_list_temp:any=[];
  search_val:any={}
  type:any=3;
  dr_count:any;
  today_date:Date;
  public onDate(event): void 
  {
    this.search_val.date_created=moment(event.value).format('YYYY-MM-DD');    
    this.distributorList();
  }
  distributorList(action:any='')
  {

    if(action == "refresh")
    {
      this.search_val = {};
      this.distributor_list = [];
      
    }

    console.log(this.data.search);
    if( Object.getOwnPropertyNames(this.search_val).length != 0)
    {
      this.page_limit = 0;
      this.distributor_list = [];
    }
    if((this.dr_count != 0) && (this.dr_count == this.distributor_list.length))
    {
      return false;
    }

    this.loader=true;
    this.serve.fetchData({'start':this.distributor_list.length,'pagelimit':this.page_limit,'search':this.search_val,'type':this.type},"Distributors/distributor")
    .subscribe((result=>{
      console.log(result);
      this.count=result['distributor']['count'];
      this.state_values = result['distributor']['states'];
      this.dr_list_temp = result['distributor']['distributor'];
      this.dr_count = result['distributor']['count'];
      
      this.distributor_list = this.distributor_list.concat(result['distributor']['distributor']);
      setTimeout (() => {
        this.loader=false;
        
      }, 2000);
      if(this.distributor_list.length ==0){
        this.data_not_found=true;
      }else {
        this.data_not_found=false;
        
      }
      this.serve.count_list();
    }))
  }
  
  deleteUser(id)
  {
    this.dialog.delete('Distributor Data !').then((result) => {
      if(result){
        this.serve.fetchData({"id":id},"Distributors/distributors_delete").subscribe((result=>{
          console.log(result);
          this.distributorList('refresh');
          this.route.navigate([NavigationComponent]);
        }))
      }})
      
    }
    refresh()
    {
      this.distributorList();
    }
    userDetail(id)
    {
      this.serve.dealerListSearch = this.search_val
      console.log(id);
      this.route.navigate(['/distribution-detail/'+id]);
      
    }
    getItemsList(index,search)
    {
      console.log(search);
      this.distributor_list=[];
      
      
      if(index=='created_by'){
        for(var i=0;i<this.dr_list_temp.length; i++)
        {
          search=search.toLowerCase();
          this.tmpsearch1=this.dr_list_temp[i]['created_name']['name'].toLowerCase();
          if(this.tmpsearch1.includes(search))
          {
            // console.log(this.orderlist);
            console.log(search);
            
            
            this.distributor_list.push(this.dr_list_temp[i]);
          }     
          
        }
      }
      if(index!='created_by'){
        for(var i=0;i<this.dr_list_temp.length; i++)
        {
          search=search.toLowerCase();
          this.tmpsearch1=this.dr_list_temp[i][index].toLowerCase();
          if(this.tmpsearch1.includes(search))
          {
            // console.log(this.orderlist);
            console.log(search);
            
            this.distributor_list.push(this.dr_list_temp[i]);
          }     
          
        }
      }
      
      
      console.log(this.distributor_list);
      
    }
    tmpsearch1:any={};
    exp_data:any=[];
    excel_data:any=[];
    exportAsXLSX():void     
    {
      this.exp_loader = true;
      this.serve.fetchData({'search':this.search_val,'type':this.type},"Distributors/distributor")
      .subscribe(resp=>{
        console.log(resp);
        this.exp_data = resp['distributor']['distributor'];
        console.log(this.exp_data);
        for(let i=0;i<this.exp_data.length;i++)
        {
          this.excel_data.push({'Company Name':this.exp_data[i].company_name,'Contact Person':this.exp_data[i].name,Mobile:this.exp_data[i].mobile,'WhatsApp No.':this.exp_data[i].whatsapp_no,Email:this.exp_data[i].email,'Address ':this.exp_data[i].address,'State ':this.exp_data[i].state,'District ':this.exp_data[i].district,'City ':this.exp_data[i].city,'Pincode ':this.exp_data[i].pincode,'Distributor ':this.exp_data[i].assign_distributor,'Assigned Sales User':this.exp_data[i].assign_user,' Total Secondary Sale':this.exp_data[i].secondary_sale.count,'Secondary sale amount':this.exp_data[i].secondary_sale.sum});
        }
        this.serve.exportAsExcelFile(this.excel_data, 'RETAILER SHEET');
        this.excel_data = [];
        this.exp_data = [];
      });
    }
  }
  