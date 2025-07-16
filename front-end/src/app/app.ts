import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { Upload } from './services/upload'
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('interview');
  files: any[] = [];
  file: File | null = null;
  fileUrl: SafeResourceUrl | null = null;
  loader: boolean = false;
  selectedFile: File | undefined;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  constructor(private uploadService: Upload,
    private sanitizer: DomSanitizer
  ) {
    this.getFiles();
  }

  getFiles() {
    this.uploadService.getFiles('images').subscribe({
      next: (resp: any) => {
        this.files = resp.data;
      },
      error: (err) => {
        console.error('Failed to fetch files', err);
      }
    });
  }

  onFileChange(event: Event) {
    console.log(event);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  handleUploadImage() {
    console.log('clicked', this.selectedFile)

    if (!this.selectedFile) {
      alert("Please upload a file")
      return;
    }
    console.log('clicked')
    const formData = new FormData();

    formData.append('image', this.selectedFile);

    this.loader = true;
    this.uploadService.uploadImage('upload-image', formData).subscribe((resp: any) => {
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(resp.imageUrl)
      console.log(this.fileUrl)
      this.loader = false;
      this.getFiles();
    })
  }

  download(fileUrl: string | SafeResourceUrl) {
    if (fileUrl) {
      const link = document.createElement('a');
      const url = this.sanitizer.sanitize(4, fileUrl); // 4 = SecurityContext.RESOURCE_URL
      if (url) {
        link.href = url;
        link.target = "_blank"
        link.download = 'download';
        link.click();
      } else {
        console.error('Failed to sanitize fileUrl');
      }
    }
  }

  reset() {
    this.selectedFile = undefined;
    this.fileUrl = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

}
