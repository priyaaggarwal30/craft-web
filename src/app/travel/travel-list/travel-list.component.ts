import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { TravelStatusModalComponent } from '../travel-status-modal/travel-status-modal.component';
import { addTravelListModal } from '../add-travel-list/add-travel-list-modal.component';



@Component({
  selector: 'app-travel-list',
  templateUrl: './travel-list.component.html'
})
export class TravelListComponent implements OnInit {
  travel_list:any=[];
  loader:any=false;
  page_limit:any=50
  search:any={};
  skelton:any;
  data_not_found=false;
  active_tab = 'Pending';
  status:any={};
  travel_list1: any=[];
  travel_list2: any=[];
  today_date:Date;
  count_list:any={};
  
  constructor( public alert:DialogComponent, public serve:DatabaseService, public dialog: MatDialog) 
  { 
    this.skelton = new Array(10);
    this.today_date = new Date();

    
  }
  
  ngOnInit()
  {
    this.getTravelList();
  
  this.travel_list2;
  }
  
  getTravelList(action:any='')
  {
    if(action == "refresh")
    {
      this.search = {};   
    }

    this.loader=true;
    if(this.search.date_to)
    this.search.date_to=moment(this.search.date_to).format('YYYY-MM-DD');

    if(this.search.date_from)
    this.search.date_from=moment(this.search.date_from).format('YYYY-MM-DD');

    
    this.serve.fetchData({'start':this.travel_list.length,'pagelimit':this.page_limit,'search':this.search,'active_tab':this.active_tab},"Travel/travel_list").subscribe((result=>
      {
        console.log(result);
        this.loader= false;
        this.travel_list = result['travel_list']?result['travel_list']:result;
        this.count_list=result['count_travelplan_data']?result['count_travelplan_data']:{};
        // console.log(this.count_list);
        this.travel_list2= result['travel_plan'];
        console.log(this.travel_list2);

        if(this.travel_list.length == 0)
        {
          this.data_not_found = true;
        }
        else
        {
          this.data_not_found = false;
        }
      }))
    }
    
    public onDate(event): void 
    {
      if(this.search.date_created)
    {
      this.search.travel_date=moment(event.value).format('YYYY-MM-DD');    
      console.log(this.search.travel_date);
    }
    if(this.search.date_from)
    {
      this.search.date_from=moment(this.search.date_from).format('YYYY-MM-DD');
    }
    console.log(this.search.date_to)
  

    if(this.search.date_to)
    {
      this.search.date_to=moment(this.search.date_to).format('YYYY-MM-DD');
      console.log(this.search.date_to)
    }

      this.getTravelList();
     
  }

   statusModal(id)
    {
      
      const dialogRef = this.dialog.open(TravelStatusModalComponent, {
        width: '400px',
           data:{
           id
           }});
          dialogRef.afterClosed().subscribe(result => {
 
            this.getTravelList();
      });
 
    }


    addTravelPlan(){
    const dialogRef = this.dialog.open(addTravelListModal, {
      width:'720px',
      data:{
        
      }});
      dialogRef.afterClosed().subscribe(result => {
        this.getTravelList();
        setTimeout (() => {
          this.loader='';
        }, 100);

        if(result!=false){
          this.active_tab = 'Approved'
          this.getTravelList();
        }
        else{
          this.active_tab = 'Pending'
          this.getTravelList();
        }

      });
      
    
    }
    refresh()
    {
      this.search={};
      this.getTravelList();

    }
    
  }
  