import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-vendor-edit-modal',
  templateUrl: './vendor-edit-modal.component.html',
  styleUrls: ['./vendor-edit-modal.component.scss']
})
export class VendorEditModalComponent implements OnInit {
  index:any='';
  vendor:any={};
  value:any=[];

  constructor(@Inject(MAT_DIALOG_DATA)public data,public serve:DatabaseService,public dialog:MatDialog,public toast:ToastrManager) { 
    console.log(this.data);
    
  }

  ngOnInit() {
  }

  update()
  {
    this.index=this.data.type;
    this.vendor[this.index]=this.data.value;
    this.value={data:this.vendor,"id":this.data.id}
    this.serve.fetchData(this.value,"Organization/vendor_update").subscribe((result=>
      {
        console.log(result);
        this.toast.successToastr("sucess");
        this.dialog.closeAll();
        
      }))

  }

}
