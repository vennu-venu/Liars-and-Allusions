import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './components/edit/edit.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { LoginComponent } from './components/login/login.component';
import { PostComponent } from './components/post/post.component';

const routes: Routes = [
  {path:'', redirectTo:'/gallery', pathMatch:'full'},
  {path:'gallery', component:GalleryComponent},
  {path:'login', component:LoginComponent},
  {path:'post', component:PostComponent},
  {path:'editposts', component:EditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
