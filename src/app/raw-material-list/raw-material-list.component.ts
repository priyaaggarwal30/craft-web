import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { StatusModalComponent } from '../order/status-modal/status-modal.component';

@Component({
  selector: 'app-raw-material-list',
  templateUrl: './raw-material-list.component.html',
  styleUrls: ['./raw-material-list.component.scss']
})
export class RawMaterialListComponent implements OnInit {
  data_not_found:boolean=false;
  skelton:any;
  loader:any;
  raw_material:any=[];
  data:any={};

  constructor(public serve:DatabaseService,public alert: DialogComponent,public dialog: MatDialog,public toast: ToastrManager) { }

  ngOnInit() {
    this.raw_material_list();
  }

  raw_material_list()
  {

    this.serve.fetchData(this.data,"Organization/raw_material_list").subscribe((result=>
      {
        console.log(result);
        this.raw_material=result;
        if(this.raw_material.length==0){
          this.data_not_found=true

        }
        
      }))

  }
  delete_material(id){
    this.alert.confirm('You will not be able to recover this  Data!').then((result) => {
      if (result) {
        this.serve.fetchData({ 'id': id, }, "Organization/raw_item_del").subscribe((result => {
          console.log(result);
          if (result == true) {
            this.toast.successToastr('Raw Material Successfully Deleted')
            this.raw_material_list();
          }
          
        }))
      }
    });

  }


  edit_material(organization)
    {
     
        const dialogRef = this.dialog.open(StatusModalComponent, {
          width : '800px',
          data:{

            'data':organization,
            'organization':'raw_material',
           
          }});
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            this.raw_material_list();
          });


      }

}
