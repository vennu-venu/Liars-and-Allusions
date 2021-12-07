import { Injectable } from '@angular/core';
import { AngularFireAuth } from'@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { getStorage, ref, deleteObject } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  isLoggedin : boolean = false;

  imageDetailsList!:AngularFireList<any>;
  imageDetailsObj !: AngularFireObject<any>;

  constructor(private firebase:AngularFireDatabase, private firebaseAuth : AngularFireAuth) { }

  async logIn(username:string, password:string) {
    await this.firebaseAuth.signInWithEmailAndPassword(username, password)
    .then((res)=>{
      this.isLoggedin = true;
      localStorage.setItem('user',JSON.stringify(res.user));
    },
    (err)=>{
      console.log("Error in Login : "+err);
    })
  }

  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
    this.isLoggedin = false;
  }

  getImageDetailList() {
    this.imageDetailsList = this.firebase.list('imageDetails');
  }

  insertImageDetails(imageDetails:any){
    this.imageDetailsList.push(imageDetails);
  }

  updateImageDesc(id:any, dsc:any) {
    this.imageDetailsObj = this.firebase.object('imageDetails/'+id);
    this.imageDetailsObj.update({
      desc : dsc
    })
  }

  deleteImageDetails(id : any) {
    this.imageDetailsObj = this.firebase.object('imageDetails/'+id);
    this.imageDetailsObj.remove();
  }

  deleteImage(url : any) {
    const storage = getStorage();
    const desertRef = ref(storage, url);
    deleteObject(desertRef).then(() => {
    }).catch((error) => {
      console.log("Error in deletion of Image from Cloud",error);
    });
  }

}
