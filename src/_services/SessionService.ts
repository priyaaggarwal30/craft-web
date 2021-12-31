import { Injectable, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from './DatabaseService';
// import { DialogComponent } from '../dialog/dialog.component';
import {Observable, of} from 'rxjs';
import { DialogComponent } from 'src/app/dialog.component';


@Injectable({ providedIn: 'root' })
export class SessionStorage implements OnInit {
    users: any = {};
    nextUrl: any;
    loginUrl: any = '';
    ActivatedRoute: any;
    loading: any = false;

    constructor(private route: ActivatedRoute, private router: Router, public db: DatabaseService, public dialog: DialogComponent)  {
          this.ActivatedRoute = route; //console.log(this.ActivatedRoute.snapshot._routerState);
        //   if(this.ActivatedRoute.snapshot._routerState.url == '') { this.loginUrl = 'login'; }
        //   if(this.ActivatedRoute.url.value[0].path == 'login') { this.loginUrl = ''; }
        }

        ngOnInit() {
            this.users.logged = false;
            this.users.token = '';
        }

        getSe():  Observable<any> {
            this.users = JSON.parse(localStorage.getItem('users')) || [];
            return of(this.users);
        }

        logoutSession() {
            this.users = {};
            this.users.logged = false;
            this.users.token = '';
            this.db.can_active = '';
            this.db.datauser = {};
            localStorage.removeItem('users');
        }

        setSession(data: any) {
            this.loading = true;
            this.db.auth_rqust(data, 'auth/login')
            .subscribe((data: any) => {
                if (data.token) {
                    this.users = data.user;
                    this.users.token = data.token;
                    this.users.logged = true;
                    localStorage.setItem('users', JSON.stringify(this.users) );

                    this.loading = false;
                    
                    var home_page = '';
                    if(   this.users.access_level == 1  ){
                    home_page = '/dashboard';
                    
                    }else{
                    // this.dialog.alert("info","Not Allowed ","  You'r not allowed for Login!");
                    home_page = '';


                    }


                    this.nextUrl = this.route.snapshot.queryParams['returnUrl'] || home_page;

                    this.router.navigate([ this.nextUrl ]);


                } else {
                    this.loading = false;

                    this.dialog.error( 'Username and Password does not exist ! please Try Again');
                    this.router.navigate([this.loginUrl]);
                }
            }, error => {
                this.loading = false;
                this.dialog.error('Something went wrong!');
                this.router.navigate([this.loginUrl]);
            });
        }
    // isValidToken(data: any) {
    //     this.db.get_rqst(data, 'is_valid_token').subscribe((data: any) => {//console.log(data)});
    //     }

    }
