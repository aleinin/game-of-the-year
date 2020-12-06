import { AppComponent } from './app.component'
import {createComponentFactory, Spectator} from "@ngneat/spectator/jest"

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>
  const createComponent = createComponentFactory({
    component: AppComponent
  })

  it('should create the app', () => {
    spectator = createComponent()
    expect(spectator.component).toBeTruthy()
  })
})
