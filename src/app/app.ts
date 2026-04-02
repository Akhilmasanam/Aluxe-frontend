import { Component, ComponentRef, OnDestroy, OnInit, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { MicroFrontend } from './micro-frontend';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected title = 'frontend';

 @ViewChild('frontend2',{read:ViewContainerRef, static:true})listcontainer!:ViewContainerRef


 private listcomponentref:ComponentRef<any>|null=null;

 constructor(private microfrontendservice:MicroFrontend){

 }

 async ngOnInit(): Promise<void> {

 try {
  //frontend2
    const fe2 =await this.microfrontendservice.loadremotecomponent(4202, "frontend2");
    this.listcontainer.createComponent(fe2.App)
     //frontend3
    const fe3=await this.microfrontendservice.loadremotecomponent(4203, "fontend3");
    this.listcontainer.createComponent(fe3.App)

    // this.listcontainer.clear();
    // this.listcomponentref =this.listcontainer.createComponent(listmodule.App)
    // this.listcomponentref.changeDetectorRef.detectChanges();
 } catch(err){

  console.error("loding problem due to", err)

 }
}

 ngOnDestroy(): void {
  if(this.listcomponentref){
    this.listcomponentref.destroy()
  }

 }

//  data:string
 data = signal('')

 inputdata(inputdata:any){

  this.data.set(inputdata);
  console.log(this.data)
 }








}
