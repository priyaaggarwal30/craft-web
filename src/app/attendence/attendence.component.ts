import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import * as moment from 'moment';
// import { Router } from '@angular/router';
// import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { DialogComponent } from '../dialog.component';
import { UserEmailModalComponent } from '../user/user-email-modal/user-email-modal.component';
import { MatDialog } from '@angular/material';
import { ImageModuleComponent } from '../image-module/image-module.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendancemodalComponent } from '../attendancemodal/attendancemodal.component';


// import { log } from 'console';

@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.scss']
})
export class AttendenceComponent implements OnInit {
  data: any = {};
  start_attend_time: string;
  loader: any;
  value: any = {};
  att_temp: any = [];
  data_not_foun: any = false;
  pagelimit: any = 50;
  skelton: any = {};
  data_not_found = false;
  today_date: Date;
  today_day:any;
  show: boolean = false;
  flag: number = 0;
  enableInput: boolean = false;
  newToday_date: string;
  logIN_user:any;
  uid:any;
  uname:any;
  pagenumber:any;
  total_page:any; 
  count: any;
  start:any=0;
  page_limit:any=50
  yesterday_date = new Date();
  tab:any;
  
  
  constructor(public rout: Router, public serve: DatabaseService, public navparams: ActivatedRoute,public dialog: DialogComponent, public toast: ToastrManager,public dialogs: MatDialog,public dialog2: MatDialog) {
    
    this.skelton = new Array(10);
    this.today_date = new Date();
    this.today_day = this.today_date.getDay();
    console.log(this.today_day);
    if(this.today_day == 5){
      this.today_day = 'Friday'
    }
    
    
    switch(this.today_day) {
      case 0:{
        this.today_day='Sunday';
        break;
      }
      case 1:{
        this.today_day='Monday';
        
        break;
      }
      case 2:{
        this.today_day='Tuesday';
        
        break;
      }
      case 3:{
        this.today_day='Wednesday';
        
        break;
      }
      case 4:{
        this.today_day='Thursday';
        
        break;
      }
      case 5:{
        this.today_day='Friday';
        
        break;
      }
      case 6:{
        this.today_day='Saturday';
        
        break;
      }
      default:{
        break;
      }
    }
    
    console.log(this.today_day);
    this.tab=navparams['params']['_value']['tab'];
    console.log(this.tab);
    
    console.log(this.today_date);
    this.newToday_date = moment(this.today_date).format('YYYY-MM-DD')
    console.log(this.newToday_date);
    this.logIN_user = JSON.parse(localStorage.getItem('st_user'));
    console.log(this.logIN_user);
    this.uid = this.logIN_user['data']['id'];
    this.uname = this.logIN_user['data']['name'];
    
  }
  
  ngOnInit() {
    if(this.tab=='yesterday')
    {
      this.attendance_list('getAttendance', 2);

    }
    else
    {
      this.attendance_list('getattendance_today', 1);

    }
    
  }
  
  
  attendancelist: any = [];
  show_today: boolean = true;
  count_1: any;
  count_2: any;
  
  change_tab(fn_name, type) {
    this.attendancelist = [];
    this.data={}
    this.attendance_list(fn_name, type);
  }
  
  attendance_list(func_name, type) {
    
    if (Object.getOwnPropertyNames(this.data).length != 0) {
      // this.pagelimit = 0;
      this.attendancelist = [];
    }

     if(this.tab=='yesterday')
    {
      console.log("in yesterday block");
      
      this.yesterday_date.setDate(this.yesterday_date.getDate() - 1);
      console.log( this.yesterday_date);
      this.data.date_to=moment(this.yesterday_date).format('YYYY-MM-DD');
      this.data.date_from=moment(this.yesterday_date).format('YYYY-MM-DD');
    }

    if (this.data.date_created)
    this.data.date_created = moment(this.data.date_created).format('YYYY-MM-DD');
    if (this.data.date_from)
    this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD');
    if (this.data.date_to)
    this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD');
    
    
    this.loader = 1;
    this.serve.fetchData({ 'start': this.start, 'pagelimit': this.pagelimit, 'search': this.data }, "Attendance/" + func_name)
    .subscribe(((result: any) => {
      console.log(result);
      setTimeout(() => {
        this.loader = '';
        
      }, 100);

      this.data = result;
      
      this.attendancelist = func_name != 'getattendance_today' ? result['attendence_data'] : result['data'];
      this.count = func_name != 'getattendance_today' ? result['total_no_of_attendence'] : '0';
      
      this.total_page = Math.ceil(parseInt(this.count)/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      
      console.log(this.attendancelist);
      
      console.log(this.attendancelist[0]['date_created']);
      
      // console.log(tmpDay);
      
      for(let i = 0; i < this.attendancelist.length; i++){
        this.attendancelist[i].date_created_day = moment(this.attendancelist[i].date_created,'YYYY.MM.DD').format("dddd");
      }
      
      console.log(this.attendancelist);
      
      
      for (let i = 0; i < this.attendancelist.length; i++) {
        for(let j = 0; j < this.attendancelist[i].length; j++){
          if( this.attendancelist[i][j].stop_reading == "") {
            this.attendancelist[i][j].start_reading=parseInt(this.attendancelist[i][j].start_reading);
          }
          else{
            this.attendancelist[i][j].stop_reading=parseInt(this.attendancelist[i][j].stop_reading);
            this.attendancelist[i][j].start_reading=parseInt(this.attendancelist[i][j].start_reading);
          }
        }
      }
      console.log(this.attendancelist);
      
      this.att_temp = result;
      if (type == 1) {
        this.count_1 = this.attendancelist.length;
        this.count_2 = result.count;
        this.show_today = true;
      }
      else {
        this.count_1 = result.count;
        this.count_2 = this.attendancelist.length;
        this.show_today = false;
      }
      
      console.log(this.attendancelist);
      console.log('in');
      
      if (this.attendancelist.length == 0) {
        this.data_not_found = true;
      }
      else{
        this.data_not_found = false;
        
      }
      
    }))
    
    
    
    
  }
  get_designation()
  {
    this.serve.fetchData({'designation':this.data.designation}, 'Attendance/getattendance_today')
    .subscribe(res => {
      this.attendancelist=res;
      console.log( this.attendancelist);
      
    })
    
  }
  get_all_designation()
  {
    this.serve.fetchData({'designation':this.data.designation}, 'Attendance/getAttendance')
    .subscribe(res => {
      this.attendancelist=res;
      console.log( this.attendancelist);
    })
  }
  reset_attendance(id: any) {
    var value = this.dialog.reset_att().then((result) => {
      console.log(result);
      if (result) {
        this.serve.fetchData({ 'id': id }, 'Attendance/update_attendance')
        .subscribe(res => {
          console.log(res);
          this.attendance_list('getattendance_today', 1);
          this.dialog.success_att('Reset Done', 'Attendance has been updated.');
        }, err => {
          console.log(err);
          this.dialog.error('Something went wrong! Try Again ...');
        });
      }
    });
  }
  
  excel_data: any = [];
  exportAsXLSX(): void {
    console.log(this.attendance_list);
    console.log(this.attendancelist);
    
    
    for (let i = 0; i < this.attendancelist.length; i++) {
      this.excel_data.push({ 'Date': this.attendancelist[i].attend_date, 'User Name': this.attendancelist[i].name, 'Start Time': this.attendancelist[i].start_time, 'Start Location': this.attendancelist[i].start_address, 'Stop Time': this.attendancelist[i].stop_time, 'Stop Location': this.attendancelist[i].stop_address, 'Work Type': this.attendancelist[i].work_type,'Start reading': this.attendancelist[i].start_reading && this.attendancelist[i].start_reading != ''  ?  parseInt(this.attendancelist[i].start_reading) :0 ,'Stop reading': this.attendancelist[i].stop_reading && this.attendancelist[i].stop_reading != '' ?  parseInt(this.attendancelist[i].stop_reading):0,'Checkin count': this.attendancelist[i].check_in_count, 'Primary Order': this.attendancelist[i].today_primary_sales_count && this.attendancelist[i].today_primary_sales_count != ''? parseInt(this.attendancelist[i].today_primary_sales_count) :0, 'Secondary Order': this.attendancelist[i].today_secondary_sales_count && this.attendancelist[i].today_secondary_sales_count != '' ? parseInt(this.attendancelist[i].today_secondary_sales_count):0,'Secondary Order Amount': this.attendancelist[i].today_secondary_sales && this.attendancelist[i].today_secondary_sales != '' ? parseInt(this.attendancelist[i].today_secondary_sales):0,'Primary Order Amount': this.attendancelist[i].today_primary_sales && this.attendancelist[i].today_primary_sales != '' ? parseInt(this.attendancelist[i].today_primary_sales):0, 'Travel': this.attendancelist[i].km_per_day , 'Expense': this.attendancelist[i].expense_amount && this.attendancelist[i].expense_amount != ''?parseInt(this.attendancelist[i].expense_amount):0 , 'Contractor Meet': this.attendancelist[i].Meet_count
    });
  }
  this.serve.exportAsExcelFile(this.excel_data, 'Attendance Sheet');
  
}


filter_attendance(data) {
  console.log(data);
  console.log(this.data);
  this.serve.fetchData({ data: this.data.name, date: moment(this.data.date_created).format('YYYY-MM-DD') }, "Attendance/getAttendance")
  .subscribe((result => {
    console.log(result);
    
    // this.attendancelist = result;
    console.log(result);
    this.attendancelist = result;
    console.log(this.attendancelist);
    //     for (let i = 0; i < this.attendancelist.length; i++) {
    // this.attendence[i]
    
    //     }
    console.log('in');
    if (this.data.name == '') {
      this.attendance_list('getAttendance', 2);
    }
  }))
}
getItemsList(search) {
  console.log(search);
  this.attendancelist = [];
  
  
  for (var i = 0; i < this.att_temp.length; i++) {
    search = search.toLowerCase();
    this.tmpsearch1 = this.att_temp[i]['name'].toLowerCase();
    if (this.tmpsearch1.includes(search)) {
      // console.log(this.orderlist);
      console.log(search);
      
      this.attendancelist.push(this.att_temp[i]);
    }
    
  }
  
  
  
  console.log(this.attendancelist);
  
}
tmpsearch1: any = {};


test(){
  console.log("in test function ");
  
}

updateReading(stopReading, attendenceID) {
  console.log(stopReading);
  console.log(attendenceID);
  
  
  this.serve.fetchData({ 'id': attendenceID, "stop_reading": stopReading,'uid':this.uid,'name':this.uname }, "/Attendance/update_stop_reading").subscribe((result) => {
    console.log(result);
  });
  
  
  this.show = false;
  this.flag = 0
  this.attendance_list('getAttendance', 2)
  
}



goTo(SendName,SendDate,type) {
  console.log(SendName,SendDate);
  
  if (type == 'checkin') {
    this.rout.navigate(['/checkin', { selectedUser: SendName,selectedDate: SendDate }]);
  }
  
  else if (type == 'primary_sale') {
    this.rout.navigate(['/order-list', { selectedUser: SendName,selectedDate: SendDate,'from':'attendence' }]);
  } 
  
  else if (type == 'secondary_sale') {
    this.rout.navigate(['/secondary-order-list', { selectedUser: SendName,selectedDate: SendDate,'from':'attendence' }]);
  } 
  
  else if (type == 'contractor_meet') {
    this.rout.navigate(['/contractor-meet', { selectedUser: SendName,selectedDate: SendDate }]);
  } 
  
  else if (type == 'Expense') {
    console.log(SendName);
    console.log(SendDate);
    
    this.rout.navigate(['/expense-list', { selectedUser: SendName,selectedDate: SendDate }]);
  } 
  
  else {
    
  }
  
}
imageModel(start_meter_image, stop_meter_image)
{
  const dialogRef = this.dialogs.open( ImageModuleComponent, {
    // width: '500px',
    data:{
      start_meter_image,
      stop_meter_image,
    }});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');
      
    });
    
  }
  
  conInt(val : any){
    return val = parseFloat(val).toFixed(2);  //function convert data into float then number
  }
  
  
  conInt2(val : any){
    return val = parseInt(val)                // function convert dataa into int
  }
  
  
  enable_error() {
    console.log("error function call");
    console.log(this.data);
    
    this.toast.errorToastr("Stop reading must be greater than Start reading");
    
  }
  
  
  reset_attendence(id){
    console.log("reset_attendence method calls");
    console.log(id);
    this.loader = 1;
    this.serve.fetchData({ 'id': id}, "/Attendance/reset_attendence").subscribe((result) => {
      console.log(result);
      this.loader = '';
      if(result['msg'] == 'success'){
        this.dialog.success("Attendence", "Reset");
      }
      else{
        this.dialog.error("Something Went Wrong Please Try again later !");
      }
    });
    
    this.attendance_list('getattendance_today', 1)
    
  }
  refresh()
  {
    this.data={};
    this.attendance_list('getAttendance', 2);
    this.attendance_list('getattendance_today', 1);
    
  }
  attendancemodal(p)
  {
    
    const dialogRef = this.dialog2.open(AttendancemodalComponent, {
      panelClass: 'rightmodal',
      data:{
       p
      }});
      dialogRef.afterClosed().subscribe(result => {
        
      });
      
  }
  // send_id(id)
  // {
  //   console.log(id);
    
  //   this.rout.navigate(['/attendancemodal',{id}]);

  // }
}
