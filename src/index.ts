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
      securityGroups: ["sg-045dd765d4d869c08", "sg-0c39de4a792107160"],
    },
  },
};

// "securityGroups": [
//   [1]                         "sg-045dd765d4d869c08",
//   [1]                         "sg-0c39de4a792107160"
//   [1]                    ],

ecs
  .runTask(paramsTask)
  .promise()
  .then((data) => {
    const first = data.tasks[0];
    const taskArn = first.taskArn;
    console.log("create taskArn", taskArn);
    var paramsWait = {
      cluster: clusterName,
      tasks: [taskArn],
    };
    return ecs.waitFor("tasksRunning", paramsWait).promise();
  })
  .then((value) => {
    console.log("waited for", value);
  });

// var paramsTaskDefinition = {
//   taskDefinition: "game-task:219",
// };

// ecs.describeTaskDefinition(paramsTaskDefinition, function (err, data) {
//   console.log(err, JSON.stringify(data, null, 4));
// });

// var paramsWait = {
//   tasks: ["STRING_VALUE"],
// };

// ecs.waitFor("tasksRunning", paramsWait, function (err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else console.log(JSON.stringify(data, null, 4)); // successful response
// });
