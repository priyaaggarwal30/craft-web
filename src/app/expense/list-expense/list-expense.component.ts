import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { ExpenseModalComponent } from '../expense-modal/expense-modal.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute,Router } from '@angular/router';
import { Location } from '@angular/common'



@Component({
  selector: 'app-list-expense',
  templateUrl: './list-expense.component.html',
  styleUrls: ['./list-expense.component.scss']
})
export class ListExpenseComponent implements OnInit 
{
  expense_list:any=[];
  pagelimit:any=50; 
  search:any={};
  active_tab = 'Pending';
  loader:any;
  data_not_found=false;
  skelton:any;
  searchData: any;
  search_val: any = {}
  backButton: boolean = false;
  count_data:any={};
  exp_loader:any=false;
  excel_data:any=[];
  exp_data:any=[];
  count_list:any;

  constructor(public serve:DatabaseService,public location: Location,  public navparams: ActivatedRoute,public dialog: MatDialog,) 
  { 
    this.skelton = new Array(7);
   
  }

  ngOnInit() 
  {
    this.searchData = (this.navparams['params']['_value']);
    if (this.searchData.selectedUser && this.searchData.selectedDate) {
      this.backButton = true;
      console.log("in navparams");
      this.search.userName = this.searchData.selectedUser;
      this.search.dateCreated = this.searchData.selectedDate;
      
      this.expenseList();
      console.log(this.search.date_created);
      
    }

    this.expenseList();
  }

  refresh(){

    this.search = {}
    this.expenseList();


  }

  expenseList(action:any='')
  {
    if(action == "refresh")
    {
      this.search = {};   
    }
    // console.log(this.active_tab);
    // if(this.search.followup_date)
    // {
    //   this.search.followup_date=moment(this.search.followup_date).format('YYYY-MM-DD');    
    // }

    this.loader=1;

    if(this.search.dateCreated)
    {
    this.search.dateCreated = moment(this.search.dateCreated).format('YYYY-MM-DD');
    console.log(this.search.dateCreated);
    
    }
    
    this.serve.fetchData({'start':this.expense_list.length,'pagelimit':this.pagelimit,'search':this.search,'expenseStatus':this.active_tab},"Expense/expense_list").subscribe((result=>
    {
      console.log(result);
      // this.expense_list=result;

      this.expense_list = result['expense_list']?result['expense_list']:result;
      this.count_data=result['expense_count_data']?result['expense_count_data']:{};
      console.log(this.count_data);
      

      if(this.expense_list.length ==0)
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
   
    if(this.search.date_from)
    {
    this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');
    console.log(this.search.date_from);
    
    }
    if(this.search.date_to)
    {
    this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
    console.log(this.search.date_to )
    }
  }


  expModal(type,id)
  {
    const dialogRef = this.dialog.open(ExpenseModalComponent, {
      width:'400px',
      data:{
        type,
        id
        // data:this.detail
      }});
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
    this.expenseList();
      
        
      });
      
    }

    back(): void {
      console.log("in location back method");
      console.log(this.location);
      this.location.back()
    }

    exportAsXLSX():void
    {
      this.exp_loader = true;
      
      this.serve.fetchData({'search':this.search},"expense/expense_list_for_excel")
      .subscribe(resp=>{
        console.log(resp);
        this.exp_data = resp['expense_list'];
        console.log(this.exp_data);
        
        for(let i=0;i<this.exp_data.length;i++)
        {
          this.excel_data.push({'Date':this.exp_data[i].dateCreated,'User Name':this.exp_data[i].userName,'Expence Id':this.exp_data[i].travel_id,'Designation':this.exp_data[i].Designation,'Expense Type':this.exp_data[i].expenseType,'Amount':this.exp_data[i].Amount,'Senior Status':this.exp_data[i].seniorStatus,'A/C Status':this.exp_data[i].acStatus});
        }
        this.exp_loader = false;
        
        this.serve.exportAsExcelFile(this.excel_data, 'Expence-List');
        this.excel_data = [];
        this.exp_data = [];
      });
    }
}
