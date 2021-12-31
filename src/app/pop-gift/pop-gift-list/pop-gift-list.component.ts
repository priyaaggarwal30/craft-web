import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
// import { PearlService } from 'src/app/pearl.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import { PopGiftAddComponent } from '../pop-gift-add/pop-gift-add.component';
import { PopGiftIssueModalComponent } from '../pop-gift-issue-modal/pop-gift-issue-modal.component';


@Component({
  selector: 'app-pop-gift-list',
  templateUrl: './pop-gift-list.component.html'
})
export class PopGiftListComponent implements OnInit {
  skelton:any={}
  data:any={};
  PopData:any=[];
  result: any=[];
  data_not_found=false;
  loader:any;
search_val:any={};

  constructor(public serve: DatabaseService, public dialog: MatDialog,public dialog1:DialogComponent, public route:Router) {
    this.skelton = new Array(10);
    this.gift_list();
  }

  ngOnInit() {
  }

  gift_list()
  {
    this.loader=1;

    this.serve.fetchData({'search_val':this.search_val},"PopGift/pop_gift_list").subscribe((result=>{
      console.log(result);
      this.PopData=result['PopData'];

      console.log(this.PopData);
      if(this.PopData.length == 0)
        {
          this.data_not_found = true;
        }
        else
        {
          this.data_not_found = false;
        }
        this.loader='';
    }))

  }



  popModal(type,id)
  {
    const dialogRef = this.dialog.open(PopGiftIssueModalComponent, {
      width:'768px',
      data:{
        type,
        id
      }});
      dialogRef.afterClosed().subscribe(result => {
        this.gift_list();
        setTimeout (() => {
          this.loader='';

        }, 100);

      });
    }


    deleteGift(id)
    {
      this.dialog1.delete('POP Gift Data!').then((result) => {
        if(result)
        {console.log(id);
          this.serve.fetchData({"id":id},"PopGift/delete_pop_gift").subscribe((result=>{
            console.log(result);
            // if(result)
            // {
              this.gift_list();
            // }
          }))
        }})

      }

      edit(id) {

      this.route.navigate(["/pop-gift-add/"+id])

      }

      refresh()
      {
        this.search_val={};
        this.gift_list();

      }
    }
