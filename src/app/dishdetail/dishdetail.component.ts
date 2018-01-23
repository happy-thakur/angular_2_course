import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import 'rxjs/add/operator/switchMap';
import { visibility, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    visibility(),
    expand()
  ]
})


export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;
  dishcopy = null;

  visibility = 'shown';

  feedbackForm: FormGroup;

  formErrors = {
    'name': '',
    'comment': ''
  };

  errMess: string;


  validationMessages = {
    'name': {
      'required':      'Author Name is required.',
      'minlength':     'Author Name must be at least 2 characters long.',
      'maxlength':     'Author Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.'
    },
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
      this.createForm();
     }

    ngOnInit() {

      this.dishservice.getDishIds()
        .subscribe(dishIds => this.dishIds = dishIds);

      this.route.params
      .switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); })
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
          errmess => { this.dish = null; this.errMess = <any>errmess; });
    }

    createForm() {
      this.feedbackForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        slider: 5,
        comment: ['', Validators.required ]
      });
      this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }
  
  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

    setPrevNext(dishId: number) {
      let index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
    }

    
  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.dishcopy.comments.push({
      rating: this.feedbackForm.value.slider,
      comment: this.feedbackForm.value.comment,
      author: this.feedbackForm.value.name,
      date: new Date() + ""
    });

    this.dishcopy.save()
      .subscribe(dish => { this.dish = dish; console.log(this.dish); });


    this.feedbackForm.reset({
      name: '',
      slider: 5,
      comment: ''
    });
    this.onValueChanged(); 
  }
  
}