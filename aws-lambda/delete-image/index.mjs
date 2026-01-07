import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client();
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const handler = async (event) => {
    console.log('Event: ', JSON.stringify(event, null, 2));

    const keysToDelete = [];

    for (const record of event.Records) {
        // Only process REMOVE events
        if (record.eventName !== 'REMOVE') {
            continue;
        }

        const oldImage = record.dynamodb?.OldImage;
        if (!oldImage?.convertedImageUrls?.L) {
            continue;
        }

        // Extract S3 keys from CloudFront URLs
        for (const item of oldImage.convertedImageUrls.L) {
            const url = item.M?.url?.S;
            if (url) {
                // URL format: https://<cloudfront-domain>/<key>
                // Extract the key (everything after the domain)
                const urlObj = new URL(url);
                const key = urlObj.pathname.substring(1); // Remove leading '/'
                keysToDelete.push({ Key: key });
            }
        }
    }

    if (keysToDelete.length === 0) {
        console.log('No files to delete');
        return {
            statusCode: 200,
            body: JSON.stringify('No files to delete'),
        };
    }

    console.log('Deleting keys:', keysToDelete);

    try {
        const deleteCommand = new DeleteObjectsCommand({
            Bucket: BUCKET_NAME,
            Delete: {
                Objects: keysToDelete,
            },
        });

        const result = await s3Client.send(deleteCommand);
        console.log('Delete result:', JSON.stringify(result, null, 2));

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Files deleted successfully',
                deleted: result.Deleted,
                errors: result.Errors,
            }),
        };
    } catch (error) {
        console.error('Error deleting files:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error deleting files',
                error: error.message,
            }),
        };
    }
};
