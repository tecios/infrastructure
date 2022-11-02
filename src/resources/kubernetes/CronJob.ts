import * as k8s from "@pulumi/kubernetes"
import {Namespace, Secret} from "@pulumi/kubernetes/core/v1";

export default function createBackupCronjob(namespace: Namespace, backupSecret: Secret ) {
  return new k8s.batch.v1.CronJob("backup-database", {
    metadata: {
      name: "database-backup",
      namespace: namespace.metadata.name
   },
    spec: {
      schedule: "0 2 * * *",
      jobTemplate: {
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: "directus-backup",
                  image: "bjoern5urban/postgres-s3-backup:latest",
                  imagePullPolicy: "Always",
                  env: [{
                    name: "DB_USER",
                    valueFrom: {secretKeyRef: {name: backupSecret.metadata.name, key: "db-user"}}
                  },
                    {
                      name: "DB_HOST",
                      value: "postgres-postgresql.postgres"
                    }, {
                    name: "DB_PASSWORD",
                      valueFrom: {secretKeyRef: {name: backupSecret.metadata.name, key: "db-password"}}
                    },
                    {name: "S3_ENDPOINT",
                      value: "minio.fbr.ai"
                    },
                    {name: "AWS_REGION",
                    value: "US"},
                    {
                      name: "S3_BUCKET_NAME",
                      value: "postgres-backup"
                    },
                    {name: "AWS_ACCESS_KEY_ID", valueFrom: {secretKeyRef: {name: backupSecret.metadata.name, key:"s3-user-key"}}},
                    {name: "AWS_SECRET_ACCESS_KEY", valueFrom: {secretKeyRef: {name: backupSecret.metadata.name, key:"s3-user-secret"}}},
                  ]
                }
              ],
              restartPolicy: "OnFailure"

            }
          }
        }
      }
    }
      }
  )
}
