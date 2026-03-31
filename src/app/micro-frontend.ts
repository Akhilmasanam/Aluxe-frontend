import { loadRemoteModule } from '@angular-architects/native-federation';
import { Component, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MicroFrontend {

  async loadremotecomponent(port:number, remotename:string){
    try{
      return await loadRemoteModule({
        exposedModule:'./Component',
        remoteName:remotename,
        remoteEntry:`http://localhost:${port}/remoteEntry.json`,
        // remoteEntry:`http://localhost:${port}/`,
        fallback:'unauthorized'
      })

    } catch(err ){
      console.error(`errorloading the ${remotename} component:`, err)
      throw err;
    }
  }

}
