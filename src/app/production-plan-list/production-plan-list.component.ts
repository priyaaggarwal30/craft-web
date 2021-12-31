import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ReceiveProductionComponent } from '../receive-production/receive-production.component';

@Component({
  selector: 'app-production-plan-list',
  templateUrl: './production-plan-list.component.html',
  styleUrls: ['./production-plan-list.component.scss']
})
export class ProductionPlanListComponent implements OnInit {
  filter:any={};
  data:any = {}
  productItemList = [];
  organizaton_data:any = [];
  state_data:any = [];
  loader = false;
  constructor(public serve: DatabaseService, public toast: ToastrManager, public dialog: MatDialog) {
    
    this.filter.org_id = '1';
    this.filter.state = 'GOA';
    this.GET_PRODUCTION_LIST();
    this.organization_list();
    this.state_list();
  }
  
  ngOnInit() {
  }
  
  GET_PRODUCTION_LIST() {

    this.loader = true;
    
    this.serve.fetchData(this.filter, "Organization/production_plan_list").subscribe((result => {
      console.log(result);
      this.loader = false;

      this.productItemList = result['production_plan'];
      
    }))
    
  }
  
  organization_list() {
    
    this.serve.fetchData({}, "Organization/organization_list").subscribe((result => {
      console.log(result);
      this.organizaton_data = result;
      
    }))
    
  }
  
  state_list() {
    
    this.serve.fetchData({ 'id': this.filter.org_id }, "Organization/assignstate").subscribe((result => {
      console.log(result);
      this.state_data = result;
      
    }))
    
  }

  refresh()
  {
    console.log("REFRESH");
    
  }

  receveProductionPlan() {

    const dialogRef = this.dialog.open(ReceiveProductionComponent, {
      width: '700px',
      data: {
        
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      this.GET_PRODUCTION_LIST()

    });

  }
  
}
