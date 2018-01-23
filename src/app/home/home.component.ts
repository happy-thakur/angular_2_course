import { Component, OnInit, Inject } from '@angular/core';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

import { expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader

  dishErrMess: string;
  promotionErrMess: string;
  leaderErrMess: string;

  constructor(private dishservice: DishService,
    private leaderService: LeaderService,
    private promotionservice: PromotionService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe((data) => {
      this.dish = data;
    },
    errmess => this.dishErrMess = <any>errmess);

    this.promotionservice.getFeaturedPromotion().subscribe((data) => {
      this.promotion = data;
    },
    errmess => this.promotionErrMess = <any>errmess);

    this.leaderService.getFeaturedLeader().subscribe((data) => {
      this.leader = data;
    },
    errmess => this.leaderErrMess = <any>errmess);
  }

}