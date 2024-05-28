import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Readable } from 'stream'; // Import Readable to convert buffer to stream

@Injectable()
export class DriveService {
  private drive: any;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'path-to-your-credentials-file.json', // Path to the JSON file with credentials
      scopes: ['https://www.googleapis.com/auth/drive.file'], // Scopes for file upload
    });

    this.drive = google.drive({ version: 'v3', auth });
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, folderId: string) {
    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };
    const media = {
      mimeType: 'application/pdf', // MIME type for PDF files
      body: new Readable({
        read() {
          this.push(fileBuffer);
          this.push(null); // End the stream
        }
      })
    };

    try {
      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id',
      });

      console.log('File ID: ', response.data.id); // File ID of the uploaded file
      return response.data;
    } catch (error) {
      console.error('Error uploading file: ', error.message);
      throw new Error('Failed to upload file.');
    }
  }
}
