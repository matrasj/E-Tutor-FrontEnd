import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SubjectSearchResponseModel} from "../../../../model/subject/subject-search-response-model";
import {SubjectService} from "../../../../service/subject-service";
import {FormBuilder, FormControl, FormGroup, UntypedFormControl, Validators} from "@angular/forms";
import {ReplaySubject, Subject, take, takeUntil} from "rxjs";
import {MatSelect} from "@angular/material/select";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {AdvertisementPayloadRequestModel} from "../../../../model/advertisement/advertisement-payload-request-model";
import {AvailabilityPayloadModel} from "../../../../model/advertisement/availability-payload-model";
import {AdvertisementService} from "../../../../service/advertisement-service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {CityPayloadModel} from "../../../../model/city/city-payload-model";
import {CityService} from "../../../../service/city-service";
import {UserPayloadModel} from "../../../../model/user/user-payload-model";
import {UserService} from "../../../../service/user-service";
import {AuthService} from "../../../../service/auth-service";

@Component({
  selector: 'app-create-advertisement',
  templateUrl: './create-advertisement.component.html',
  styleUrls: ['./create-advertisement.component.css']
})
export class CreateAdvertisementComponent implements OnInit, AfterViewInit, OnDestroy{
  advertisementFormGroup : FormGroup | any;
  private ADVERTISEMENT_TYPE : string = '';
  protected subjects: SubjectSearchResponseModel[] = [];
  public subjectCtrl: UntypedFormControl = new UntypedFormControl();
  public subjectFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public currentUserModel : UserPayloadModel | any = null;

  protected cities: CityPayloadModel[] = [];
  public cityCtrl: UntypedFormControl = new UntypedFormControl();
  public cityFilterCtrl: UntypedFormControl = new UntypedFormControl();

  public filteredSubjects: ReplaySubject<SubjectSearchResponseModel[]> = new ReplaySubject<SubjectSearchResponseModel[]>(1);
  public filteredCities: ReplaySubject<CityPayloadModel[]> = new ReplaySubject<CityPayloadModel[]>(1);

  public places : { name : string, checked : boolean}[] = [
    {name : "At tutor", checked : false},
    {name : "At student", checked : false},
    {name : "Online", checked : false},
    {name : "Another", checked : false}
  ];
  public availabilityWithDaysAndHours : {dayName : string, hourStart : string | null, hourEnd : string | null, checked : boolean}[] = [
    {dayName : "Monday",hourStart : null, hourEnd : null, checked : false},
    {dayName : "Tuesday",hourStart : null, hourEnd : null, checked : false},
    {dayName : "Wednesday",hourStart : null, hourEnd : null, checked : false},
    {dayName : "Thursday",hourStart : null, hourEnd : null, checked : false},
    {dayName : "Friday",hourStart : null, hourEnd : null, checked : false},
    {dayName : "Saturday",hourStart : null, hourEnd : null, checked : false},
    {dayName : "Sunday",hourStart : null, hourEnd : null, checked : false},
  ];
  public lessonsRanges : {name : string, checked : boolean}[] = [
    {name : "Kindergarten", checked : false},
    {name : "Primary school", checked : false},
    {name : "High school", checked : false},
    {name : "Studies", checked : false}
  ]
  // @ts-ignore
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  @Input() placeholderLabel = 'Search';
  protected _onDestroy = new Subject<void>();
  constructor(private subjectService : SubjectService,
              private cityService : CityService,
              private formBuilder : FormBuilder,
              private advertisementService : AdvertisementService,
              private toastrService : ToastrService,
              private router : Router,
              private activatedRouter : ActivatedRoute,
              private userService : UserService,
              private authService : AuthService) { }

  ngOnInit(): void {
    this.advertisementFormGroup = this.formBuilder.group({
      advertisement : this.formBuilder.group({
        lessonPrice : new FormControl('', [Validators.required]),
        minutesDuration : new FormControl('', [Validators.required]),
        shortDescription : new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(400)]),
        content : new FormControl('', [Validators.required, Validators.minLength(10)]),
      })
    });

    this.activatedRouter.queryParamMap.subscribe((queryParamMap) => {
      queryParamMap.get('tutorLooking') === 'true' ? this.ADVERTISEMENT_TYPE = 'LOOKING_FOR_TUTOR' :this.ADVERTISEMENT_TYPE = 'LOOKING_FOR_STUDENT';
    });

    this.userService.getCurrentUserById(this.authService.getCurrentUser().id)
      .subscribe((user) => this.currentUserModel = user);

    this.cityService.getAllCities()
      .subscribe((cities) => {
        this.cities = cities;
        this.cityCtrl.setValue(this.cities[10]);
        this.filteredCities.next(this.subjects.slice());
        this.cityFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCities();
          });
      });

    this.subjectService.getAllSubjects()
      .subscribe((subjects) => {
        this.subjects = subjects;
        this.subjectCtrl.setValue(this.subjects[10]);
        this.filteredSubjects.next(this.subjects.slice());
        this.subjectFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterSubjects();
          });
      });


  }

  get lessonPrice() {
    return this.advertisementFormGroup.get('advertisement').get('lessonPrice');
  }

  get minutesDuration() {
    return this.advertisementFormGroup.get('advertisement').get('minutesDuration');
  }

  get shortDescription() {
    return this.advertisementFormGroup.get('advertisement').get('shortDescription');
  }

  get content() {
    return this.advertisementFormGroup.get('advertisement').get('content');
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredSubjects
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: SubjectSearchResponseModel, b: SubjectSearchResponseModel) => a && b && a.id === b.id;
      });

    this.filteredCities
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: CityPayloadModel, b: CityPayloadModel) => a && b && a.id === b.id;
      });
  }

  protected filterSubjects() {

    if (!this.subjects) {
      return;
    }
    // get the search keyword
    let search = this.subjectFilterCtrl.value;

    if (!search) {
      this.filteredSubjects.next(this.subjects.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredSubjects.next(
      this.subjects.filter(subject => subject.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterCities() {

    if (!this.cities) {
      return;
    }
    let search = this.cityFilterCtrl.value;

    if (!search) {
      this.filteredCities.next(this.cities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCities.next(
      this.cities.filter(city => city.name.toLowerCase().indexOf(search) > -1)
    );
  }

  onPlaceSelecting($event: MatCheckboxChange) {
    const place : {name : string, checked : boolean} | undefined
      = this.places.find((place) => place.name === $event.source.value);

    if (place) {
      place.checked = $event.checked;
    }
  }

  onAvailabilityChanging($event: MatCheckboxChange) {
    const availability : {dayName : string, hourStart : string | null, hourEnd : string | null, checked : boolean} | undefined
      = this.availabilityWithDaysAndHours.find((availability) => availability.dayName === $event.source.value);

    if (availability) {
      availability.checked = $event.checked;
      if (!$event.checked) {
        availability.hourEnd = null;
        availability.hourStart = null;
      }
    }


  }

  onLessonRangeSelecting($event: MatCheckboxChange) {
    const lessonRange : {name : string, checked : boolean} | undefined
      = this.lessonsRanges.find((lessonRange) => lessonRange.name === $event.source.value);

    if (lessonRange) {
      lessonRange.checked = $event.checked;
    }
  }

  onAdvertisingCreating() {
    if (this.advertisementFormGroup.invalid) {
      this.advertisementFormGroup.markAllAsTouched();
    } else {
      const advertisementPayloadRequest : AdvertisementPayloadRequestModel
       = new AdvertisementPayloadRequestModel(
        this.currentUserModel.id,
        this.subjectCtrl.value.name,
        this.lessonPrice.value,
        this.minutesDuration.value,
        this.places.filter((place) => place.checked)
          .map((place) => place.name),
        this.cityCtrl.value.name,
        this.shortDescription.value,
        this.content.value,
        this.availabilityWithDaysAndHours.filter((availability) => availability.checked)
          .map((availability) => new AvailabilityPayloadModel(
            availability.dayName,
            availability.hourStart ? availability.hourStart : '',
            availability.hourEnd ? availability.hourEnd : '')),
        this.lessonsRanges.filter((lessonRange) => lessonRange.checked)
          .map((lessonRange) => lessonRange.name),
        this.ADVERTISEMENT_TYPE,
        this.currentUserModel?.profileImagePath
      );



      this.advertisementService.createAdvertisement(advertisementPayloadRequest)
        .subscribe((res) => {
          this.advertisementFormGroup.reset();
          this.toastrService.success(res);
          this.router.navigate(['/profile']);
        }, (error) => {
          this.toastrService.error(error);
          this.router.navigate(['/profile']);
        })
    }
  }
}
