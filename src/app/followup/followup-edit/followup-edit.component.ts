import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-followup-edit',
  templateUrl: './followup-edit.component.html',
  styleUrls: ['./followup-edit.component.scss']
})
export class FollowupEditComponent implements OnInit {
  
  followup_detail: any={};
  today_date:any = new Date();
  followup_type:any = [];
  
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public serve:DatabaseService,public dialogComponent: DialogComponent) { 
    console.log(this.data);
    if(this.data['from'] == 'followup detail page'){
      this.followup_detail = this.data['followup_detail'];
      this.get_followup_types();

    }
    
  }
  
  ngOnInit() {
  }

  date_format(){
    this.followup_detail.next_follow_date = moment(this.followup_detail.next_follow_date).format('YYYY-MM-DD');
  }
  
  update_followup(){
    console.log("update_followup method calls");
    console.log(this.followup_detail);
    this.serve.fetchData({ 'followup_detail': this.followup_detail }, "Distributors/update_followup").subscribe((result => {
      console.log(result);
      if (result['msg'] == 'Updated Successfully') {
        console.log('in success function');
        this.dialogComponent.success("Follow Up Detail","Update Successfully");
        this.dialog.closeAll();
      }
      else {
        console.log('in failed function');
        this.dialogComponent.error("Something Went Wrong Please Try Again !");
      }
    }))
    
  }

  get_followup_types(){
    console.log("get_followup_types method calls");
    this.serve.fetchData({}, "Distributors/followup_type_master_list").subscribe((result) => {
      console.log(result);
      this.followup_type = result['followup_type_master_list']
    })
    
  }
  
}
