import express from "express";
import * as AWS from "aws-sdk";
import { ListClustersResponse, ListTasksResponse } from "aws-sdk/clients/ecs";
import { AWSError } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
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

const clusterName = "game-cluster";

var params = {
  cluster: clusterName,
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

//     console.log("elasticNetworkInterface", elasticNetworkInterface);
//   })
//   .catch((rejection) => {
//     console.error(rejection);
//   });

const ec2 = new AWS.EC2({
  region: "us-east-1",
});

const paramsENI = {
  NetworkInterfaceIds: ["eni-08c2866d98b1f41a6"],
};

ec2
  .describeNetworkInterfaces(paramsENI)
  .promise()
  .then((value) => {
    const first = value.NetworkInterfaces[0];

    console.log("PublicIp", first.Association.PublicIp);
  });
