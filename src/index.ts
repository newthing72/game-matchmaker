import express from "express";
import * as AWS from "aws-sdk";
const app = express();
const port = 5000;

app.get("/", (_, res) => {
  res.status(200).send("hello1");
});

app.listen(port, () => console.log(`Running on port ${port}`));

// console.log(new AWS.Config());

const ecs = new AWS.ECS({
  region: "us-east-1",
});

const ec2 = new AWS.EC2({
  region: "us-east-1",
});

const clusterName = "game-cluster";
const serviceName = "game-service";

// TODO define
function getAllTaskPublicIps(
  region: string,
  clusterName: string,
  serviceName: string
): string[] {
  console.log(region, clusterName, serviceName);
  return [];
}

var params = {
  cluster: clusterName,
  serviceName: serviceName,
};

ecs
  .listTasks(params)
  .promise()
  .then((value) => {
    var params = {
      cluster: clusterName,
      tasks: [value.taskArns[0]],
    };
    return ecs.describeTasks(params).promise();
  })
  .then((value) => {
    const task = value.tasks[0];
    const attachments = task.attachments;
    const elasticNetworkInterface = attachments[0];

    const networkInterfaceId = elasticNetworkInterface.details.find(
      (element) => element.name == "networkInterfaceId"
    );

    const params = {
      NetworkInterfaceIds: [networkInterfaceId.value],
    };

    return ec2.describeNetworkInterfaces(params).promise();
  })
  .then((value) => {
    const first = value.NetworkInterfaces[0];
    console.log("PublicIp", first.Association.PublicIp);
  })
  .catch((rejection) => {
    console.error(rejection);
  });
