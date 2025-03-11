import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AwsService {
  private readonly s3: S3Client;
  private readonly BUCKET_NAME = 'my-bucket';

  constructor() {
    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:4566',
      forcePathStyle: true,
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });
  }

  async getPresignedUrl(): Promise<{ url: string; key: string }> {
    console.info('AWSService > Generating presigned URL');
    const key = `uploads/${Date.now()}.jpg`;
    console.debug('AWSService >  Key:', key);
    const command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: key,
      ContentType: 'image/png',
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 300 });
    console.info('AWSService > URL/KEY  :', { url, key });
    return { url, key };
  }

  async uploadFile(
    presignedUrl: string,
    fileContent: Buffer,
  ): Promise<{ message: string; key: string }> {
    console.info('AWSService > Uploading file to S3');

    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: fileContent,
      headers: { 'Content-Type': 'image/png' },
    });

    console.debug('AWSService > Response:', response);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        'Erro no upload, status:',
        response.status,
        'Detalhes:',
        errorText,
      );
      throw new BadRequestException(
        `Upload failed with status ${response.status}`,
      );
    }

    console.info('AWSService > Upload successful');

    return { message: 'Upload successful', key: presignedUrl.split('?')[0] };
  }
}
