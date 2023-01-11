// Create the DynamoDB service client module using ES6 syntax.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
//import { DEFAULT_REGION } from "../../../../libs/utils/util-aws-sdk.js";
const REGION = 'eu-central-1'
// Create an Amazon DynamoDB service client object.
export const ddbClient = new DynamoDBClient({ region: REGION });