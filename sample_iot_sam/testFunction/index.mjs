import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./ddbDocClient.mjs";

export const handler = (event, context, callback) => {
    let timestp = event.timestamp
    let temp_c = event.value;
    let temp_f = (temp_c * 9/5) + 32;
    let result = {
        timestamp: timestp,
        temperature_f: temp_f
    };

    console.log(result);
    callback(null, result); //FIXME - Take this out
    const convert_date = new Date(timestp).toISOString()
    let params = {
        TableName: "TEST_IOT_TABLE2",
        Item: {
            "dateinfo": String(convert_date.split('T')[0]),
            "timeinfo": String(convert_date.split('T')[1]),
            "original_temp": String(temp_c),
            "converted_temp": String(temp_f)
          },
      };
      
  try {
    const data = ddbDocClient.send(new PutCommand(params));
    console.log("Success - item added or updated", data);
  } catch (err) {
    console.log("Error", err.stack);
  }
};


