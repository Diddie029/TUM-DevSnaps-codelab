import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SnapService, DevSnap } from './services/snap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 font-sans">
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 p-6 mb-8">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-center mb-6 text-blue-600 tracking-tight">TUM DevSnaps</h1>
          
          <div class="space-y-4 max-w-4xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" [(ngModel)]="author" placeholder="Your Name" 
                     class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all">
              <input type="text" [(ngModel)]="caption" placeholder="Caption this..." 
                     class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            </div>
            
            <div class="flex flex-col md:flex-row gap-4">
              <input type="file" (change)="onFileSelected($event)" accept="image/*" 
                     class="flex-1 p-2 border border-gray-300 rounded-lg bg-white file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer">
              
              <button (click)="submitSnap()" [disabled]="isUploading() || !selectedFile() || !author() || !caption()" 
                      class="md:w-48 bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg disabled:bg-gray-400 transition-all hover:bg-blue-700 active:scale-95 shadow-sm">
                @if (isUploading()) {
                  <span class="animate-pulse">Uploading...</span>
                } @else {
                  Share Snap
                }
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-6 pb-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (snap of snapService.snapsSignal(); track snap.id) {
            <div (click)="openFullView(snap)" 
                 class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group cursor-zoom-in">
              <div class="aspect-square overflow-hidden bg-gray-200">
                <img [src]="snap.imageUrl" alt="DevSnap" 
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
              </div>
              <div class="p-4 bg-white relative z-10">
                <p class="text-md font-bold text-gray-800 mb-1 truncate">{{ snap.caption }}</p>
                <p class="text-xs text-gray-500 flex items-center">
                  <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  By {{ snap.author }}
                </p>
              </div>
            </div>
          } @empty {
            <div class="text-center py-32 col-span-full bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p class="text-2xl text-gray-400 font-medium">The board is empty. Start the journey! 🚀</p>
            </div>
          }
        </div>
      </main>

      @if (activeSnap(); as snap) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
             (click)="closeFullView()">
          <button class="absolute top-6 right-6 text-white text-4xl hover:scale-110 transition-transform">&times;</button>
          
          <div class="max-w-5xl w-full max-h-[90vh] flex flex-col items-center gap-4" (click)="$event.stopPropagation()">
            <img [src]="snap.imageUrl" class="max-w-full max-h-[75vh] rounded-lg shadow-2xl object-contain animate-in zoom-in-95 duration-300">
            <div class="text-center text-white">
              <h2 class="text-2xl font-bold">{{ snap.caption }}</h2>
              <p class="text-blue-400 font-medium">Shared by {{ snap.author }}</p>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class App {
  snapService = inject(SnapService);
  
  author = signal('');
  caption = signal('');
  selectedFile = signal<File | null>(null);
  isUploading = signal(false);
  
  // Modal state signal
  activeSnap = signal<DevSnap | null>(null);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  openFullView(snap: DevSnap) {
    this.activeSnap.set(snap);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeFullView() {
    this.activeSnap.set(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  }

  async submitSnap() {
    const file = this.selectedFile();
    const currentAuthor = this.author();
    const currentCaption = this.caption();
    
    if (!file || !currentAuthor || !currentCaption) return;

    this.isUploading.set(true);
    try {
      await this.snapService.uploadAndSaveSnap(file, currentCaption, currentAuthor);
      this.caption.set('');
      this.selectedFile.set(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error("Critical: Upload failed", error);
    } finally {
      this.isUploading.set(false);
    }
  }
}