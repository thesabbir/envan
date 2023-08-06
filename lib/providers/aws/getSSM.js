const { SSMClient } = require("@aws-sdk/client-ssm");
const { fromIni } = require("@aws-sdk/credential-providers");
const { GetParametersByPathCommand } = require("@aws-sdk/client-ssm");

const initSSM = async ({ profile }) => {
  let awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  };

  if (!awsConfig.accessKeyId || !awsConfig.secretAccessKey) {
    try {
      awsConfig = fromIni({ profile });
      console.log(`using ${profile} profile credentials`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  } else {
    console.log(`using env aws credentials`);
  }
  const client = new SSMClient(awsConfig);
  return client;
};

const getAllParameters = async (
  profile,
  ssmPath,
  parameters = [],
  NextToken = undefined
) => {
  try {
    const client = await initSSM({ profile });
    const input = {
      Path: ssmPath,
      Recursive: true,
      WithDecryption: true,
      MaxResults: 10,
      NextToken,
    };
    const command = new GetParametersByPathCommand(input);
    const data = await client.send(command);
    const { Parameters, NextToken: nextToken } = data;
    const newParameters = [...parameters, ...Parameters];
    if (data.NextToken) {
      return getAllParameters(profile, ssmPath, newParameters, nextToken);
    }
    console.log(`fetched ${newParameters.length} parameters from ${ssmPath}`);
    return newParameters;
  } catch (err) {
    console.error(`failed to fetch parameters from ${ssmPath}`);
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = {
  getAllParameters,
};
