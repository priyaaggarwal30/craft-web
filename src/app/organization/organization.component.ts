import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { StatusModalComponent } from '../order/status-modal/status-modal.component';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  
  organization_name:any=[];
  data:any={};
  multiple_state:any=[];
  selected_state:any=[];
  state_list:any=[];
  organizaton_data:any=[];
  state_data:any=[]
  unassign_state:any=[];
  
  constructor(public serve:DatabaseService,public alert: DialogComponent,public dialog: MatDialog) { }
  
  ngOnInit() {
    this.organization();
    this.organization_list()
    this.state();
  }
  
  organization()
  {
    this.serve.fetchData({},"Organization/organizations").subscribe((result=>
      {
        console.log(result);
        this.organization_name=result;
        console.log(this.organization_name);
        
      }))
    }
    state()
    {     
      this.serve.fetchData({},"Organization/state_list_unassigned").subscribe((result=>
        {
          console.log(result);
          this.state_list=result;
          console.log(this.state_list);
          
        }))

    }

    assign_state()
    {
      console.log(this.multiple_state);
      this.selected_state=this.multiple_state['_pendingValue']
      console.log(this.selected_state);
    }

    organization_list()
    {

      this.serve.fetchData({},"Organization/organization_list").subscribe((result=>
        {
          console.log(result);
          this.organizaton_data=result;
         
        }))

    }


    organization_assign_list()
    {

      this.serve.fetchData({'organization':this.data.organization,'state_id':this.selected_state,},"Organization/state_assign").subscribe((result=>
        {
          console.log(result);
          this.organization_list()
          this.data.organization=''
          this.multiple_state=[];
         
        }))

    }


    delete_state(organization)
    {
     
        const dialogRef = this.dialog.open(StatusModalComponent, {
          width:'450px',
          data:{

            'data':organization,
            'organization':'organization',
           
          }});
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            this.organization_list();
          });


      }


      

    

   

    
    
  }
  