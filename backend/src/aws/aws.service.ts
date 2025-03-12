import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';
@Injectable()
export class AwsService {
  private readonly s3: S3Client;
  private readonly BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'my-bucket';

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.AWS_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'teste',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'teste',
      },
    });
  }

  async getPresignedUrl(): Promise<{
    url: string;
    fullUrl: string;
  }> {
    console.info('AWSService > Generating presigned URL');

    const key = `${Date.now()}.jpg`;
    console.debug('AWSService >  Key:', key);
    const command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: key,
      ContentType: 'image/jpg',
      ACL: 'public-read',
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 300 });
    const fullUrl = `${process.env.S3_IMAGE_URL}/${key}`;

    console.info('AWSService > URL/KEY/FULL-URL:', { url, key, fullUrl });
    return { url, fullUrl };
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
