import { Component, OnInit, ViewChildren } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ChangeStatusComponent } from '../change-status/change-status.component';
import { MatDialog, MatSelect } from '@angular/material';
import * as moment from 'moment';


@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent implements OnInit {
  @ViewChildren(MatSelect) mySelector: MatSelect;

  leave_list:any=[];
  loader:any;
  search:any={};
  skelton:any={}
  data_not_found = false;
  data:any={};
  today_date:Date;


  constructor(public serve:DatabaseService,public dialog:DialogComponent, public dialogs: MatDialog) 
  {
    this.skelton = new Array(10);
    this.today_date = new Date();

  }

  ngOnInit() 
  {
    this.leaveList();
    this.search = {};
  }

  openDialog(leave_id): void {
  
    const dialogRef = this.dialogs.open(ChangeStatusComponent, {
      width: '400px', data:{
        
        id : leave_id,
        reason: ''
      }
        
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.leaveList();
    });
  }

  leaveList()
  {
    if(this.search.date_created)
    {
      this.search.date_created = moment(this.search.date_created).format('YYYY-MM-DD');
      
      if(this.search.date_from)
    {
      this.search.date_from= moment(this.search.date_from).format('YYYY-MM-DD');
      console.log(this.search.date_from);
      
    }
    

    if(this.search.date_to)
    {
      this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
      console.log( this.search.date_to);
    }
    }
    console.log( this.search.date_to);

    
    this.loader=true;
    this.serve.fetchData({filter:this.search},"Leaves/leave_list").subscribe((result=>
    {
      this.loader=false;
      console.log(result);
      this.leave_list = result;

      console.log(this.leave_list.length);
      

      if(this.leave_list.length == 0)
      {
        this.data_not_found = true;
      }
      else
      {
        this.data_not_found = false;
      }
    }));
  }
  refresh()
  {
    this.search={};
   this.leaveList();
  }

  select_open(data,id)
  {
    console.log(data,id);
    console.log(this.mySelector);
    
    let index= this.mySelector['_result'].findIndex(row=>row.id==id)
    {
      this.mySelector['_result'][index].open() 

      
    }
    
    


  }
}
