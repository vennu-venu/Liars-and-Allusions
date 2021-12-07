import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { ImageService } from 'src/app/shared/image.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  imageData : any;
  selectedImage : any;
  isSubmitted : boolean = false;

  formTemplate = new FormGroup({
    imageUrl : new FormControl('', Validators.required),
    desc : new FormControl('', Validators.required)
  })

  constructor(private storage:AngularFireStorage, private service:ImageService, private router:Router, public toastr:ToastrService) { }

  ngOnInit(): void {
    if(localStorage.getItem('user') !== null) {
      this.resetForm();
      this.service.getImageDetailList();
    }
    else {
      this.router.navigateByUrl('/login');
    }
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.selectedImage = (event.target as HTMLInputElement).files![0];
    this.formTemplate.patchValue({image:file});
    const allowedFileType = ["image/png", "image/jpeg", "image/jpg"];
    if (file && allowedFileType.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as String;
      }
      reader.readAsDataURL(file);
    }
  }

  onSubmit(formValue:any) {
    this.isSubmitted = true;
    if(this.formTemplate.valid) {
      var filePath = `Posts/${this.selectedImage.name}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(()=>{
          fileRef.getDownloadURL().subscribe((url)=>{
            formValue['imageUrl']=url;
            this.service.insertImageDetails(formValue);
          })
        })
      ).subscribe();
      this.toastr.success('Post was uploaded !!', 'Success');
      this.resetForm();
    }
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  resetForm() {
    this.formTemplate.reset();
    this.formTemplate.setValue({
      imageUrl:'',
      desc:''
    });
    this.isSubmitted = false;
    this.selectedImage = null;
    this.imageData = null;
  }

  logout() {
    this.service.logout();
    this.router.navigateByUrl('/login');
  }

  edit() {
    this.router.navigateByUrl('/editposts');
  }

}