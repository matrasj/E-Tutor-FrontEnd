import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ReviewService} from "../../../service/review-service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ReviewPayloadRequestModel} from "../../../model/review-payload-request-model";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {
  ratings : {name : string,value : number}[] = [
    { name : "Very bad (1 star)", value : 1},
    { name : "Bad (2 stars)", value : 2},
    { name : "Normal (3 stars)", value : 3},
    { name : "Good (4 stars)", value : 4},
    { name : "Very good (5 stars)", value : 5}
  ];

  userId : number = 0;
  advertisementId : number = 0;
  reviewFormGroup : FormGroup | any;
  constructor(private formBuilder : FormBuilder,
              private reviewService : ReviewService,
              private toastrService : ToastrService,
              private dialogRef : MatDialog,
              @Inject(MAT_DIALOG_DATA) public data : any
              ) {
    this.userId = Number(data.userId);
    this.advertisementId = Number(data.advertisementId);
  }

  ngOnInit(): void {
    this.reviewFormGroup = this.formBuilder.group({
      review : this.formBuilder.group({
        rate : new FormControl('', [Validators.required]),
        content : new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(4000)])
      })
    });


  }

  get rate() {
    return this.reviewFormGroup.get('review').get('rate');
  }

  get content() {
    return this.reviewFormGroup.get('review').get('content');
  }

  onReviewCreating() {
    if (!this.reviewFormGroup.invalid) {
      this.reviewService.createReviewForAdvertisement(new ReviewPayloadRequestModel(
        this.advertisementId,
        this.userId,
        Number(this.rate.value),
        this.content.value
      )).subscribe((res) => {
        this.dialogRef.closeAll();
        this.reviewFormGroup.reset();
        this.toastrService.success(res);
      })
    } else {
      this.reviewFormGroup.markAllAsTouched();
    }
  }
}
