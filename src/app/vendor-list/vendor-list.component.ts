import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ToastrComponent } from 'ng6-toastr-notifications/lib/toastr.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {
  data_not_found:boolean= false;
  skelton:any=[]
  loader:any;
  vendoe_list:any=[];
  vendor_data:any=[];
  data:any={};
  exp_loader:any;


  constructor(public serve:DatabaseService,public alert: DialogComponent,public toast:ToastrManager) { }

  ngOnInit() {
    this.vendor_list();
  }

  vendor_list()
  {
    this.serve.fetchData({'data':this.data},"Organization/vendor_list").subscribe((result=>
      {
        console.log(result);
        this.vendor_data=result;
        console.log(this.vendor_data);
        if(this.vendor_data.length=='' ||this.vendor_data.length==null ||this.vendor_data.length==undefined){

          this.data_not_found=true

        }
      }))
  }
  delete_vendor(id)
  {
    this.alert.confirm('You will not be able to recover this  Data!').then((result) => {
      if (result) {
        this.serve.fetchData({ 'id': id, }, "Organization/vendor_delete").subscribe((result => {
          console.log(result);
          if (result == true) {
          this.toast.successToastr('Vendor Successfully Deleted')
            this.vendor_list();
          }
          
        }))
      }
    });

  }

  exportAsXLSX(){

    this.exp_loader = true;
      this.serve.fetchData({'search':this.data},"Organization/vendor_list_excel")
      .subscribe(resp=>{
        console.log(resp);
        if(resp['msg']=='Success'){

        this.exp_loader = false;
        document.location.href = 'http://phpstack-83335-2231038.cloudwaysapps.com/api/uploads/Vendor.csv';

        }
      })

  }

}
