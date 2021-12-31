import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-followup-list',
  templateUrl: './followup-list.component.html',
  // styleUrls: ['./followup-list.component.scss'],
  animations: [slideToTop()]
  
})
export class FollowupListComponent implements OnInit {
  
  followup_list:any=[];
  pagelimit:any=50; 
  search:any={};
  active_tab = 'pending';
  loader:any;
  data_not_found=false;
  skelton:any={}
  excel_data: any=[];
  tab:any;
  type_list:any=[];
  followup_count:any={}
  
  constructor(public serve:DatabaseService,public alert: DialogComponent,public navparams: ActivatedRoute,public dialog:MatDialog) 
  {
    this.skelton = new Array(10);
    console.log(navparams);
    this.tab=navparams['params']['_value']['tab'];
    console.log(this.tab);
    
  }
  
  ngOnInit() 
  {
    this.followUpList();
    this.get_type_list();

  }

  get_type_list(){
   
    
    this.serve.fetchData('',"Lead/lead_type_list")
    .subscribe(resp=>{
      console.log(resp);
      this.type_list=resp['lead_type'];
      console.log(this.type_list);
    })
  }
  
  followUpList(action:any='')
  {
    if(action == "refresh")
    {
      this.search = {};   
    }
    console.log(this.active_tab);
    if(this.search.followup_date)
    {
      this.search.followup_date=moment(this.search.followup_date).format('YYYY-MM-DD');
      console.log(this.search.followup_date);
    }  
    
    if(this.search.date_from)
    {
      this.search.date_from=moment(this.search.date_from).format('YYYY-MM-DD');  
      console.log(this.search.date_from)  
    }
    console.log(this.search.date_to);
    
    if(this.search.date_to)
    {
      this.search.date_to=moment(this.search.date_to).format('YYYY-MM-DD');    
      console.log(this.search.date_to);
      
    }
    
    
    
    this.loader=1;
    if(this.tab=='upcoming')
    {
      console.log("in if block upcoming ");
      
      this.active_tab='upcoming';
    }

    this.serve.fetchData({'start':this.followup_list.length,'pagelimit':this.pagelimit,'search':this.search,'active_tab':this.active_tab},"Distributors/followup_list").subscribe((result=>
      {
        console.log(result);
        this.followup_list=result['followup_list'];
        this.followup_count=result['followup_count'];
        
        if(this.followup_list.length ==0)
        {
          this.data_not_found=true;
        } 
        else 
        {
          this.data_not_found=false;
        }
        
        setTimeout (() => {
          this.loader='';
          
        }, 100);
      }))
    }
    
    
    delete_followup(followup_id){
      console.log("delete_followup method calls");
      console.log(followup_id);
      
      this.alert.delete('Followup !').then((result) => {
        if (result) {
          
          this.serve.fetchData({'followup_id':followup_id}, "Distributors/delete_followup").subscribe((result) => {
            console.log(result);
            if (result['msg'] == 'Deleted Successfully') {
              console.log('in success function');
              this.alert.success("Follow Up Detail","Update Successfully");
              this.followUpList()

            }
            else {
              console.log('in failed function');
              this.alert.error("Something Went Wrong Please Try Again !");
            }
          })
        }
      });
      
      
    }


    exportAsXLSX():void {
      
      for(let i=0;i<this.followup_list.length;i++){
        this.excel_data.push({'Date Created':this.followup_list[i].date_created,'Created By':this.followup_list[i].name,'Company Name':this.followup_list[i].company_name,'Followup Type':this.followup_list[i].next_follow_type,'Followup Date':this.followup_list[i].next_follow_date,'Assigned To':this.followup_list[i].assigned_to_name && this.followup_list[i].assigned_to_name !=''? this.followup_list[i].assigned_to_name : '-','Description':this.followup_list[i].description});
      }
      this.serve.exportAsExcelFile(this.excel_data,'Follow Up SHEET');
      this.excel_data = [];

    }
    refresh()
    {
      this.search={};
    this.followUpList();
    }
  }
  