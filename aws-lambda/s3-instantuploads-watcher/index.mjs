import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

export const handler = async (event) => {
  console.log(JSON.stringify(event, null, 2));

  try {
    for (const record of event.Records) {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

      // Parse userId and imageId from key: instantuploads/userid/imageid.extension
      const keyParts = key.split("/");
      if (keyParts.length < 3) {
        console.error(`Invalid key format: ${key}`);
        continue;
      }

      const userId = keyParts[1];
      const imageFileName = keyParts[2];
      const imageId = imageFileName.substring(0, imageFileName.lastIndexOf(".")) || imageFileName;

      const item = {
        "userid-imageid": `${userId}-${imageId}`,
        userId: userId,
        imageId: imageId,
        tmpImgLocation: key,
        convertedImageUrls: [],
      };

      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: item
      });

      await docClient.send(command);
      console.log(`Successfully inserted item for ${userId}-${imageId}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify("Successfully processed S3 event"),
    };
  } catch (error) {
    console.error("Error processing event:", error);
    throw error;
  }
};

