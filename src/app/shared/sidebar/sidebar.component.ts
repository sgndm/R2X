import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ROUTES } from './menu-items';
import { RouteInfo } from "./sidebar.metadata";
import { Router, ActivatedRoute } from "@angular/router";

import { ApiServicesService } from '../../services/api-services/api-services.service';

declare var $: any;

@Component({
  selector: 'ap-sidebar',
  templateUrl: './sidebar.component.html'

})
export class SidebarComponent implements OnInit {

  showMenu: string = '';
  showSubMenu: string = '';
  public sidebarnavItems: any[]; // array to store side nav menu items
  public tempSideNavItems: any[]; // array to store menu items temperary | these items will get from routes


  //this.getsideNavItems = [ 'Pages','Users', 'Dashboard', 'DropDown' ];
  //this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
        this.showMenu = '0';

    } else {
        this.showMenu = element;
    }
  }
  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
        this.showSubMenu = '0';

    } else {
        this.showSubMenu = element;
    }
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private apiServices: ApiServicesService
  ) {}

  // End open close

  ngOnInit() {

  // get sidebar menu items from routers
  this.tempSideNavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
  //  console.log(this.tempSideNavItems);
  const tempArray = [];
  
  // get user details
  // if (this.apiServices.access_token != '') {
  //   this.apiServices.checkLogin().subscribe(
  //     res => {
  //       console.log(res);
  //       $('#user_name').html(res['data']['phoneNumber']);
  //       // get nav items from server
        let getsideNavItems = [ 'Admin Dashboard', 'Categories', 'Products & Services'];
  //
  //       //console.log(typeof(tempArray));
        for (let x in this.tempSideNavItems) {
  //
          let n_item = this.tempSideNavItems[x]['title'].toLowerCase();
  
          for (let i in getsideNavItems) {
            let t_item = getsideNavItems[i].toLowerCase();
  //
            if (n_item == t_item) {
  //           //  console.log('matches ' + n_item + ' ' + t_item);
  //           //  const itemmmm = ;
              tempArray.push(this.tempSideNavItems[x]);
  //             //console.log(tempArray);
  //
  //
            }
  //
          }
        }
  //
  //
  //
  //     },
  //     err => {
  //       alert('Something went wrong!! Please Try Refresing...');
  //       console.log(err);
  //     }
  //   )
  // }

  this.sidebarnavItems = tempArray;
  console.log(this.sidebarnavItems);


  $(function () {
      $(".sidebartoggler").on('click', function() {
          if ($("#main-wrapper").hasClass("mini-sidebar")) {
              $("body").trigger("resize");
              $("#main-wrapper").removeClass("mini-sidebar");

          } else {
              $("body").trigger("resize");
              $("#main-wrapper").addClass("mini-sidebar");
          }
      });

  });


  }

  ngAfterViewInit() {

  }


}
