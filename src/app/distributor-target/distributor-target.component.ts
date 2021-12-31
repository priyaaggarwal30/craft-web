import { Component, OnInit} from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { MatDialog} from '@angular/material';


@Component({
  selector: 'app-distributor-target',
  templateUrl: './distributor-target.component.html',
  styleUrls: ['./distributor-target.component.scss']
})
export class DistributorTargetComponent implements OnInit {
  come_from : any =''
  value:any={};
  distributor_list:any=[];
  state_list:any=[];
  district_list:any=[];
  skelton: any = {}
  loader: any;
  exp_loader:any=false;
  excel_list:any=[];
  excel_data:any=[];
  tmp_distributor_list:any=[];
  tmp:any=[];
  constructor(public serve: DatabaseService,public alrt:MatDialog) { 
    
    this.get_distributor_list();
    this.getStateList();
    this.skelton = new Array(10);

  }
 
  ngOnInit() {
  }

  get_distributor_list()
  {
    this.loader = 1;
    this.serve.fetchData(this.value,"User/distributors_target_list").subscribe((result => {
      console.log(result);
      this.distributor_list=result['target_list'];
      console.log(this.distributor_list);
      this.loader = '';
      
    }));
  }

  upload_excel()
    {
      const dialogRef = this.alrt.open(UploadFileModalComponent,{
        width: '500px',
        data:{
          'from':'distributor_target',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.get_distributor_list();

      });
  }

  refresh1()
  {

    this.value={};
    this.get_distributor_list();

  }
  getStateList()
  {
    console.log("addUser");
    
    this.serve.fetchData('',"User/state_user_list").subscribe((response=>{
      console.log(response);  
      this.state_list=response['query']['state_name'];
      console.log(this.state_list);
    }));
    
  }
  getDistrict()
  {
    this.serve.fetchData(this.value.state,"User/district_user_list").subscribe((response=>{
      this.district_list=response['query']['district_name'];
      console.log(this.district_list);
      
    }));
    
  }

  exportAsXLSX():void {
    this.exp_loader = true;
   
      this.excel_list=this.distributor_list;
      console.log(this.excel_list);

      for(let i=0;i<this.excel_list.length;i++)
      {
        this.excel_data.push({'Company Name':this.excel_list[i].company_name,'Contact Person':this.excel_list[i].assign_user,'Contact No.':this.excel_list[i].mobile,'State ':this.excel_list[i].state,'District ':this.excel_list[i].district,'Assigned Sales User ':this.excel_list[i].assign_user,'Year':this.excel_list[i].year,'Month':this.excel_list[i].month,'Product Name':this.excel_list[i].product_name,'Product Size':this.excel_list[i].productSize,'Target':this.excel_list[i].value,'Achievement':this.excel_list[i].achieve});
      }
      this.exp_loader = false;
      
      this.serve.exportAsExcelFile(this.excel_data, 'DISTRIBUTOR TARGET SHEET');
      this.excel_data = [];
      this.excel_list = [];
      
  }
  
  assignuser_search(index, search) {
    this.distributor_list = [];
    for (var i = 0; i < this.tmp_distributor_list.length; i++) {
      search = search.toLowerCase();
   console.log(search);
   
      search = search.toLowerCase();
      if (this.tmp_distributor_list[i][index] != null) {
        this.tmp = this.tmp_distributor_list[i][index].toLowerCase();
       console.log(this.tmp);

      }
      if (this.tmp_distributor_list[i][index] == null) {
        this.tmp = '';

      }

      // this.tmp=this.tmp_distributor_list[i][index].toLowerCase();
      if (this.tmp.includes(search)) {
        this.distributor_list.push(this.tmp_distributor_list[i]);
      }
    }
  }
    
    
}
