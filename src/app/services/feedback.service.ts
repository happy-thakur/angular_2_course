import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { RestangularModule, Restangular } from 'ngx-restangular';


@Injectable()
export class FeedbackService {

  constructor(private restangular: Restangular,) { }

  submitFeedback(feedbackData: object): Observable<object> {
    return this.restangular.all("feedback").post(feedbackData);
  }

}
