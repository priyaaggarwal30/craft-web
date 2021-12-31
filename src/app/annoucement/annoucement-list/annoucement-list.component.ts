import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService'

@Component({
  selector: 'app-annoucement-list',
  templateUrl: './annoucement-list.component.html',
  animations: [slideToTop()]

})
export class AnnoucementListComponent implements OnInit {

  announcementList:any=[];
  loader:any;
  data_not_found=false;
  skelton:any={}
  constructor(public service:DatabaseService) 
  {
    this.annoucementList();
    this.skelton = new Array(10);
   }

  ngOnInit() {
  }

  annoucementList()
  {
    this.loader=1;

    this.service.fetchData('','Announcement/announcement_list').subscribe((resp)=>
    {
      console.log(resp);
      this.announcementList = resp;

      if(this.announcementList.length ==0)
      {
        this.data_not_found=true;
      } 
      else 
      {
        this.data_not_found=false;
      }
      this.loader='';

    })
  }

}
