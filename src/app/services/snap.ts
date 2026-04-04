import { Injectable, signal } from '@angular/core';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface DevSnap {
  id?: string;
  imageUrl: string;
  caption: string;
  author: string;
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class SnapService {
  private db = getFirestore();
  private storage = getStorage();
  
  snapsSignal = signal<DevSnap[]>([]);

  constructor() { 
    this.listenToSnaps(); 
  }

  private listenToSnaps() {
    // TODO 4.2: Add listenToSnaps() logic here
  }

  async uploadAndSave(file: File, caption: string, author: string) {
    // TODO 4.3: Add uploadAndSave() logic here
  }
}