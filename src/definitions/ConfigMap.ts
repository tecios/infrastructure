import * as k8s from "@pulumi/kubernetes"


const appLabels = {};

export function createDirectusConfig() {
  return new k8s.core.v1.ConfigMap("directus", {
    metadata: { labels: appLabels },
    data: {

    }

  });

}