import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  animations: [slideToTop()]
  
  
})
export class LeadListComponent implements OnInit {
  
  lead_List:any=[];
  leadtmp:any=[];
  start:any=0;
  count:any;
  total_page:any; 
  pagenumber:any;
  page_limit:any=50
  type_id:any = 1;
  loader:any;
  data:any=[];
  value:any={};
  data_not_found=false;
  search_val:any={}
  skelton:any={}
  today_date:any;
  tmpsearch1:any={};
  excelType:string= '';
  excel_data:any=[];
  constructor(public serve:DatabaseService,public dialog:DialogComponent, public router: Router, public route: ActivatedRoute ) { 

    this.route.params.subscribe( params => {
      this.today_date = new Date().toISOString().slice(0, 10);
      console.log(params);
      this.type_id = params.id;
      console.log(this.type_id);
      this.search_val.date_created='';
      this.search_val.created_by='';
      this.search_val.company_name='';
      this.search_val.assign_user='';
      this.leadList();
      });

 

    this.leadList();

    this.skelton = new Array(10);
  }
  
  ngOnInit() {
  }
  public onDate(event): void 
  {
    this.search_val.date_created=moment(event.value).format('YYYY-MM-DD');    
    this.leadList();
  }
  leadList()
  {
    console.log("lead list function call");
    
    this.loader=true;
    this.lead_List = [];

    this.serve.fetchData({'start':this.start,'pagelimit':this.page_limit,'search':this.search_val, 'type_id':this.type_id},"Lead/getLeadList")
    .subscribe((result=>{
      console.log(result);
      this.count=result['count'];
      this.total_page = Math.ceil(this.count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      this.lead_List= result['lead_list'];
      // ['data']
      this.leadtmp=result['lead_list'];
      console.log(this.lead_List);
      this.count=result['lead_list']['count'];
    
      setTimeout (() => {
        this.loader=false;
        
      }, 700);
      if(this.lead_List.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
        
      }
      this.serve.count_list();
      
    }))
 
  }
  
  deleteLead(id)
  {
    console.log("hello");
    
    this.dialog.delete('Lead Data !').then((result) => {
      if(result)
      {console.log(id);
        this.serve.fetchData({"id":id},"Distributors/distributors_delete").subscribe((result=>{
          console.log(result);
          if(result)
          {
            this.leadList();
          }
        }))
      }})
      
    }
    viewLead()
    {
      console.log("lead view");
      
    }
    refresh()
    {
      this.search_val={};
      this.leadList();
    }
    getItemsList(index,search)
    {
      console.log(search);
      this.lead_List=[];
      
      
      if(index=='created_by'){
        for(var i=0;i<this.leadtmp.length; i++)
        {
          search=search.toLowerCase();
          this.tmpsearch1=this.leadtmp[i]['created_name']['name'].toLowerCase();
          if(this.tmpsearch1.includes(search))
          {
            // console.log(this.orderlist);
            console.log(search);
            
            
            this.lead_List.push(this.leadtmp[i]);
          }     
          
        }
      }
      if(index!='created_by'){
        for(var i=0;i<this.leadtmp.length; i++)
        {
          search=search.toLowerCase();
          if(this.leadtmp[i][index]!=null){
            this.tmpsearch1=this.leadtmp[i][index].toLowerCase();
            
          }
          if(this.leadtmp[i][index]==null){
            this.tmpsearch1='';
            
          }
          if(this.tmpsearch1.includes(search))
          {
            // console.log(this.orderlist);
            console.log(search);
            
            this.lead_List.push(this.leadtmp[i]);
          }     
          
        }
      }
      
      
      console.log(this.lead_List);
      
    }

    exportAsXLSX():void {
      if(this.type_id==1){
        this.excelType='Distributor/Delaer';
      }
      else if(this.type_id==3){
        this.excelType='Retailers';
      }
      else if(this.type_id==9){
        this.excelType='Project';
      }
      else if(this.type_id==5){
        this.excelType='End-User';
      }
      else if(this.type_id==10){
        this.excelType='Contractor';
      }
      else if(this.type_id==11){
        this.excelType='Architect';
      }
      else if(this.type_id==13){
        this.excelType='Builder';
      }
      else if(this.type_id==15){
        this.excelType='Customer';
      }
      else if(this.type_id==14){
        this.excelType='Cement Dealer';
      }
      else if(this.type_id==12){
        this.excelType='Online Enquiry';
      }
      else{
        this.excelType='ERROR in';
      }
      for(let i=0;i<this.lead_List.length;i++){
        this.excel_data.push({'Date Created':this.lead_List[i].date_created,'Company Name':this.lead_List[i].company_name,'Source':this.lead_List[i].source,'Contact Person':this.lead_List[i].name,Mobile:this.lead_List[i].mobile,'WhatsApp No.':this.lead_List[i].whatsapp_no,Email:this.lead_List[i].email,'Address ':this.lead_List[i].address,'State ':this.lead_List[i].state,'District ':this.lead_List[i].district,'City ':this.lead_List[i].city,'Pincode ':this.lead_List[i].pincode,'Assigned Sales User':this.lead_List[i].assigned_to && this.lead_List[i].assigned_to !=''? this.lead_List[i].assigned_to : '-','Description':this.lead_List[i].description});
      }
      this.serve.exportAsExcelFile(this.excel_data, this.excelType+' LEAD SHEET');
      this.excel_data = [];

    }


    change_date_filter(type): void
    {
      
      console.log('change_date_filter method calls');
      console.log(type);
      
      if(type == 'date_from'){
        this.search_val.date_from=moment(this.search_val.date_from).format('YYYY-MM-DD'); 
        console.log(this.search_val);
        this.leadList()
      }
      
      else if(type == 'date_to'){
        this.search_val.date_to=moment(this.search_val.date_to).format('YYYY-MM-DD'); 
        console.log(this.search_val);
        this.leadList()
      }
      else{
        console.log(this.search_val);
      }
      
      
    }


  }