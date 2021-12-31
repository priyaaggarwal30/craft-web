import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';


@Component({
  selector: 'app-userview-target',
  templateUrl: './userview-target.component.html',
  styleUrls: ['./userview-target.component.scss']
})
export class UserviewTargetComponent implements OnInit {
  loader: any;
  skelton: any = {}
  value:any={};
  target_list:any=[];
  exp_loader:any=false;
  excel_list:any=[];
  excel_data:any=[];
  tmp_UserList:any=[];
  total_target:any;
  total_achievement:any;
  tmp: any = [];

  constructor(public serve: DatabaseService,public alrt:MatDialog) { 
     this.get_user_data();
     this.skelton = new Array(10);

  }

  ngOnInit() {
  }


refresh1()
{
  this.value={};
  this.get_user_data();
}
get_user_data()
{
    this.loader = 1;
  this.serve.fetchData(this.value,"User/user_target_list").subscribe((result => {
    console.log(result);
    this.target_list=result['target_list'];
    this.tmp_UserList=result['target_list'];
    this.total_target=result['total_target'];
    this.total_achievement=result['total_achivement'];
    console.log(this.tmp_UserList );

    console.log(this.target_list);
    this.loader = '';
    
  }));
}
upload_excel()
  {
    const dialogRef = this.alrt.open(UploadFileModalComponent,{
      width: '500px',
      data:{
        'from':'user_target',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.get_user_data()
    });
  }
  exportAsXLSX():void {
    this.exp_loader = true;
   
      this.excel_list=this.target_list;
      console.log(this.excel_list);

      for(let i=0;i<this.excel_list.length;i++)
      {
        this.excel_data.push({'Name':this.excel_list[i].name,'Employee Id':this.excel_list[i].employee_id,'Contact No.':this.excel_list[i].contact_01,'Year':this.excel_list[i].year,'Month':this.excel_list[i].month,'Sale Type':this.excel_list[i].sale_type,'Product Name':this.excel_list[i].product_name,'Product Size':this.excel_list[i].productSize,'Target':this.excel_list[i].value,'Achievement':this.excel_list[i].achieve});
      }
      this.exp_loader = false;
      
      this.serve.exportAsExcelFile(this.excel_data, 'USER TARGET SHEET');
      this.excel_data = [];
      this.excel_list = [];
    
  }
      
  assignuser_search(index, search) {
    this.target_list = [];
    for (var i = 0; i < this.tmp_UserList.length; i++) {
      search = search.toLowerCase();
      console.log(search);

      search = search.toLowerCase();
      if (this.tmp_UserList[i][index] != null) {
        this.tmp = this.tmp_UserList[i][index].toLowerCase();
       console.log(this.tmp);
       
      }
      if (this.tmp_UserList[i][index] == null) {
        this.tmp = '';

      }

      // this.tmp=this.tmp_UserList[i][index].toLowerCase();
      if (this.tmp.includes(search)) {
        this.target_list.push(this.tmp_UserList[i]);
      }
    }
  }
}
