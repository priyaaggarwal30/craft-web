import { Component, OnInit,Injectable, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {MatProgressBarModule} from '@angular/material'
// import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
// import { PearlService } from '';

@Component({
  selector: 'app-upload-file-modal',
  templateUrl: './upload-file-modal.component.html',
  styleUrls: ['./upload-file-modal.component.scss']
})
export class UploadFileModalComponent implements OnInit {

  excel_name: any ='';
  file : any={};
  formData = new FormData();
  loader:any;
  come_from : any =''
  payment_flag = '';
  // excel_data:any=[];
  download_sample_area_excel_data: any=[];
  excel_loader:any=false;
  excel_data:any = [
    {
      "Name": "Ankita Bhatt",
      "'Contact No": "9667686942",
      "Type": "Primary Sale",
      "Year": "2021",
      "Month": "August",
      "Product Name ": "	Screw",
      "Product Code": "3.5*25MM ( 1000 Pcs. )",
      "Target": "40000"
    },
    {
      "Name": "Ankita Bhatt",
      "'Contact No": "9667686942",
      "Type": "Secondary Sale",
      "Year": "2021",
      "Month": "August",
      "Product Name ": "	Screw",
      "Product Code": "3.5*25MM ( 1000 Pcs. )",
      "Target": "40000"
    },
  ];
  
  
  
  
  constructor( @Inject(MAT_DIALOG_DATA)public data,public serve: DatabaseService,public dialog: DialogComponent,public dialogRef: MatDialogRef<UploadFileModalComponent>) {
    
    console.log(data);
    this.come_from = data['from']
    
    
  }
  ngOnInit() {
  }
  onUploadChange(evt) 
  {
    this.file = evt.target.files[0];
    console.log(this.file);
    console.log(this.file.length);
    console.log(this.file['name']);
    this.excel_name = this.file['name'];
    console.log(this.excel_name);
    
  }
  upload_user_data_excel()
  {
    console.log(this.file);
    this.dialogRef.disableClose = true;
    
    this.formData.append('category', this.file, this.file.name);
    console.log(this.formData);
    console.log(this.file);
    console.log(this.file.name);
    
    this.loader=1;
    this.serve.FileData(this.formData, 'user/import_user_excel')
    .subscribe(d => {  
      
      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if(d['msg'] == 'Data Imported successfully'){
        this.dialog.success("Excel Uploaded", " Successfully");
        this.dialogRef.close();
        setTimeout (() => {
          this.loader='';
        }, 700);
        return;
      } 
      else{
        setTimeout (() => {
          this.loader='';
        }, 700);
        this.dialog.error(d['msg']);
        return;
      }
      
    },err => {console.log(err);  this.formData = new FormData(); });
  }
  upload_distributor_data_excel()
  {
    console.log(this.file);
    this.dialogRef.disableClose = true;
    
    this.formData.append('category', this.file, this.file.name);
    console.log(this.formData);
    console.log(this.file);
    console.log(this.file.name);
    
    this.loader=1;
    this.serve.FileData(this.formData, 'user/import_distributor_excel')
    .subscribe(d => {  
      
      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if(d['msg'] == 'Data Imported successfully'){
        this.dialog.success("Excel Uploaded", " Successfully");
        this.dialogRef.close();
        setTimeout (() => {
          this.loader='';
        }, 700);
        return;
      } 
      else{
        setTimeout (() => {
          this.loader='';
        }, 700);
        this.dialog.error(d['msg']);
        return;
      }
      
    },err => {console.log(err);  this.formData = new FormData(); });
  }
  
  
  
  
  download_sample_excel(type):void {

    window.open("http://phpstack-83335-2231038.cloudwaysapps.com/api/uploads/sampleTarget.csv")
    
    // console.log("download_sample_excel method calls");
    // console.log("type = "+ type);
    
    // this.excel_data = [];
    
    
    
    
    //  if(type == 'User Target'){
    
    //   this.excel_loader = true;
      
    //       this.excel_data.push({'Name':'Ankita Bhatt','Contact No':'9667686942','Type':'Primary Sale','Year':'2021','Month':'August','Product Name':'Jali','Product Size':'6.5 Kg','Target':'40000'});
        
    //     console.log(this.excel_data);
    //     this.serve.exportAsExcelFile(this.excel_data, 'SAMPLE '+type+' EXCEL');
        
    //     setTimeout (() => {
    //       this.excel_loader = false;        
    //     }, 700);
    
      
    // }
    // else if(type == 'Distributor Target')
    // {
    //   this.excel_loader = true;
      
    //     this.excel_data.push({'Distributor Name':'Lead Test','Contact No':'9573198523','Year':'2021','Month':'August','Product Name':'Bond','Product Size':'10 Kg','Target':'50000'});
      
      
    //   console.log(this.excel_data);
    //   this.serve.exportAsExcelFile(this.excel_data, 'SAMPLE '+type+' EXCEL');
      
    //   setTimeout (() => {
    //     this.excel_loader = false;        
    //   }, 700);
    // }
    
    // else{
    //   console.log("in else");
    // }
    
   
  }
  
}
