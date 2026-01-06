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



//  this is the example of event object
// {
//   "Records": [
//     {
//       "eventVersion": "2.1",
//       "eventSource": "aws:s3",
//       "awsRegion": "us-east-1",
//       "eventTime": "2026-01-06T12:06:16.152Z",
//       "eventName": "ObjectCreated:Put",
//       "userIdentity": {
//         "principalId": "A161YKE3T3GHU2"
//       },
//       "requestParameters": {
//         "sourceIPAddress": "103.186.41.87"
//       },
//       "responseElements": {
//         "x-amz-request-id": "SMY1E51T82XVDYVR",
//         "x-amz-id-2": "EqvIqJD2RahhmyjJKYsrCxATKyewdOM59rtC9I0qcZl/6odPMYNdvVgKRWrFsix3fmHb7UnyaicX0a9u/C2g45oP/T7DJBaGITAZhErxLmc="
//       },
//       "s3": {
//         "s3SchemaVersion": "1.0",
//         "configurationId": "595cb64e-a635-4b61-b0ff-1677c21e13e8",
//         "bucket": {
//           "name": "img-util-web",
//           "ownerIdentity": {
//             "principalId": "A161YKE3T3GHU2"
//           },
//           "arn": "arn:aws:s3:::img-util-web"
//         },
//         "object": {
//           "key": "instantuploads/avatar.webp",
//           "size": 166510,
//           "eTag": "ca6b6234b5ce54c57b0ea674ccb0db3e",
//           "sequencer": "00695CFAB81D6AFBEF"
//         }
//       }
//     }
//   ]
// }



// schema to put into dynnamodb
// {
//   userId: ""
//   imageId: ""
//   tmpImgLocation: "instantuploads/user1/image1.png"
//   convertedImageUrls: []
// }
// key structure 
// userid-imageid which is derived from the image upload path which is instantuploads/userid/imageid.extension


