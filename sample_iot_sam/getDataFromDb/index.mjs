import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { ddbDocClient } from './ddbDocClient.mjs';
import { ddbClient } from './ddbClient.mjs'; //FIXME - take out the unused imports
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

//Some references:
//https://dynobase.dev/dynamodb-errors/validationexception-invalid-keyconditionexpression-attribute-name-is-a-reserved-keyword/

export const handler = async (event) => {
  // let params = {
  // TableName: "TEST_IOT_TABLE",
  // Key: {
  //     "time": String(1673391043894)
  //   },
  // };
  // try {
  // const data = await ddbDocClient.send(new GetCommand(params));
  // console.log("Success :", data.Item);
  // const response = {
  // statusCode: 200,
  // body: JSON.stringify(data.Item),
  // };
  // return response;
  //  } catch (err) {
  // console.log("Error", err);

  const currenTimestamp = new Date().toISOString(); // it-IT
  //To sort well, the format has to be `YYYY-MM-DD HH:mm:ss.SSS
  const params = {
    TableName: 'TEST_IOT_TABLE2',
    Limit: 1,
    Select: 'ALL_ATTRIBUTES',
    //IndexName: "time-gsi",
    ScanIndexForward: false,
    KeyConditionExpression: 'dateinfo = :d',
    //FilterExpression: '#timestmp BETWEEN :s AND :e',
    //ExpressionAttributeNames: { "#timestmp": "time" },
    ExpressionAttributeValues: {
      //':t': {S: String(Date.now())}
      ':d': { S: String(currenTimestamp.split('T')[0]) },
    },
  };
  try {
    const data = await ddbClient.send(new QueryCommand(params));
    //const data = await ddbClient.send(new ScanCommand(params));
    const lastItem = data.Items[0];
    console.log(lastItem);
    const response = {
      statusCode: 200,
      //body:JSON.stringify(lastItem)
      body: JSON.stringify({
        Time: lastItem.dateinfo.S + 'T' + lastItem.timeinfo.S,
        'Temp(C)': lastItem.original_temp.S,
        'Temp(F)': lastItem.converted_temp.S,
      }),
    };
    return response;
  } catch (err) {
    console.log('Error', err);
  }
};
