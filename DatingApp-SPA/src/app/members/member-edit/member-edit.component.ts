import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private authService: AuthService,
              private alertify: AlertifyService
    ) {}
  @ViewChild('EditForm', { static: true }) editForm: NgForm;
  user: User;
  photoUrl: string;
  live: true;
  @HostListener('window: beforeunload', ['$event'])
  unloadNotification($event: any){
    if (this.editForm.dirty){
      $event.returnValue = true;
    }
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data['user'];
    });
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(
      next => {
        this.alertify.success('profile updated!');
        this.editForm.reset(this.user);}, error =>{
          this.alertify.error(error);
        }
    );
  }

  updateMainPhoto(photoUrl){
    this.user.photoUrl = photoUrl;
  }
}
