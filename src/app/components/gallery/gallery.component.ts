import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/shared/image.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  imageList !: any[];
  viewImageList !: any[];
  rowIndexArray !: any[];
  showGrid : boolean = true;
  viewImageUrl : string = "";
  viewImageDesc : string = "";

  constructor(private service : ImageService) { }


  ngOnInit(): void {
    this.service.getImageDetailList();
    this.service.imageDetailsList.snapshotChanges().subscribe(
      list=>{
        // this.imageList = list.map(item => { return item.payload.val(); });
        this.imageList = [];
        list.forEach(item=> {
          let a = item.payload.val();
          a['$key'] = item.key;
          this.imageList.push(a);
        })
        this.viewImageList = JSON.parse(JSON.stringify(this.imageList));
        for(let i of this.viewImageList) {
          if(i.desc.length > 20) {
            i.desc = i.desc.slice(0,20) + "....";
          }
        }
      }
    );
  }

  viewDesc(s : any) {
    this.showGrid=false;
    for(let i of this.imageList) {
      if(i.imageUrl == s) {
        this.viewImageUrl = i.imageUrl;
        this.viewImageDesc = i.desc;
      }
    }
  }

  goBack() {
    this.showGrid = true;
  }

}
