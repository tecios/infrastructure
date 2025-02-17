import * as k8s from "@pulumi/kubernetes"
import {Namespace} from "@pulumi/kubernetes/core/v1";
import {redisDBPassword} from "../../../util/env";

export function createRedisHelm(namespace: Namespace) {
  return new k8s.helm.v3.Chart("redis", {
        chart: "redis",
        namespace: namespace.metadata.name,
        version: "17.3.8",
        fetchOpts: {
          repo: "https://charts.bitnami.com/bitnami",
        },
        values: {
          "global": {
            "storageClass": "local-path",
            "redis":{
                "password": redisDBPassword,
            }
          },
          master: {
            nodeSelector: {
              owner: "bjoern"
            }
          }
        }
      }
  );
}

