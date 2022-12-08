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
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    resolve(["the", "resolve"]);
  });
}

// getAllTaskPublicIps("test", "test", "test").then((value) => {
//   console.log(value);
// });

var params = {
  cluster: clusterName,
  serviceName: serviceName,
};

// ecs
//   .listTasks(params)
//   .promise()
//   .then((value) => {
//     var params = {
//       cluster: clusterName,
//       tasks: [value.taskArns[0]],
//     };
//     return ecs.describeTasks(params).promise();
//   })
//   .then((value) => {
//     const task = value.tasks[0];
//     const attachments = task.attachments;
//     const elasticNetworkInterface = attachments[0];

//     const networkInterfaceId = elasticNetworkInterface.details.find(
//       (element) => element.name == "networkInterfaceId"
//     );

//     const params = {
//       NetworkInterfaceIds: [networkInterfaceId.value],
//     };

//     return ec2.describeNetworkInterfaces(params).promise();
//   })
//   .then((value) => {
//     const first = value.NetworkInterfaces[0];
//     console.log("PublicIp", first.Association.PublicIp);
//   })
//   .catch((rejection) => {
//     console.error(rejection);
//   });

var paramsTask = {
  cluster: clusterName,
  taskDefinition: "game-task:219",
  launchType: "FARGATE",
  networkConfiguration: {
    awsvpcConfiguration: {
      assignPublicIp: "ENABLED",
      subnets: ["subnet-06c96d569f4a756c8"],
    },
  },
};
ecs.runTask(paramsTask, function (err, data) {
  console.log(err, data);
});

// var paramsTaskDefinition = {
//   taskDefinition: "game-task:219",
// };
// ecs.describeTaskDefinition(paramsTaskDefinition, function (err, data) {
//   console.log(err, JSON.stringify(data, null, 4));
// });
