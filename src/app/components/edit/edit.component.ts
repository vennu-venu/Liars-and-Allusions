import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/shared/image.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  imageList !: any[];
  viewImageList !: any[];
  rowIndexArray !:any[];
  editPageView : boolean = false;
  imageUrl : string = "";
  imageDesc : String = "";
  isSubmitted : boolean = false;
  cId : string = "";

  formTemplate = new FormGroup({
    desc : new FormControl('', Validators.required)
  })

  constructor(private service : ImageService, public toastr: ToastrService, private router : Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('user') == null) {
      this.router.navigateByUrl('/login');
    }
    this.service.imageDetailsList.snapshotChanges().subscribe(
      list=>{
        // this.imageList = list.map(item => { return item.payload.val(); });
        this.imageList = [];
        list.forEach(item=> {
          let a = item.payload.val();
          a['$key'] = item.key;
          this.imageList.push(a);
        })
        // this.rowIndexArray = Array.from(Array(Math.ceil(this.imageList.length/3)).keys());
        this.viewImageList = JSON.parse(JSON.stringify(this.imageList));
        for(let i of this.viewImageList) {
          if(i.desc.length > 20) {
            i.desc = i.desc.slice(0,20) + "....";
          }
        }
      }
    );
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  edit(id:any, url:any) {
    this.editPageView = true;
    this.imageUrl = url;
    this.cId = id;
    for(let i of this.imageList) {
      if(i.$key == id) {
        this.imageDesc = i.desc;
        break;
      }
    }
  }

  onSubmit(formRef:any) {
    this.isSubmitted = true;
    if(formRef.desc == this.imageDesc) {
      this.toastr.warning('Change the description', ':(');
      return;
    }
    if(formRef.desc=="") {
      return;
    }
    this.editPageView = false;
    this.service.updateImageDesc(this.cId, formRef.desc);
    this.toastr.success('Post was updated !!', 'Success');
    this.resetForm();
  }

  goBack() {
    this.editPageView = false;
    this.resetForm();
  }

  delete(id:any, url:any) {
    if (window.confirm('Do you want to delete the post ?')) {
      this.service.deleteImageDetails(id);
      this.service.deleteImage(url);
      this.toastr.success('Post was deleted !!', 'Success');
    }
  }

  resetForm() {
    this.formTemplate.reset();
    this.formTemplate.setValue({
      desc:''
    });
    this.isSubmitted = false;
  }

}
