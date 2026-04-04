import { ApplicationConfig } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';

// Initialize Firebase immediately at the app level
initializeApp(environment.firebaseConfig);

export const appConfig: ApplicationConfig = {
  providers: []
};