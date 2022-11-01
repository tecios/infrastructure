import * as k8s from "@pulumi/kubernetes"
import {namespaceGitlab} from "./index";



function createServiceAccount() {
  return new k8s.core.v1.ServiceAccount("gitlab-runner",
      {
        metadata: {
          name: "gitlab-runner",
          namespace: namespaceGitlab.metadata.name
        }
      })
}
export const serviceAccount = createServiceAccount();
function createRole() {
  return new k8s.rbac.v1.Role("gitlab-runner", {
    metadata: {
      name: "gitlab-runner",
      namespace: namespaceGitlab.metadata.name
    },
    rules: [
      { apiGroups: [""],
        resources: ["secrets","pods", "configmaps","service", "pods/attach", "pods/exec"],
        verbs: ["get", "list", "watch", "create", "delete", "update", "patch"]
        }
    ]
  })
}
export const role = createRole();
function createRoleBinding() {
  return new k8s.rbac.v1.RoleBinding("gitlab-runner", {
    metadata: {
      name: "gitlab-runner",
      namespace: namespaceGitlab.metadata.name
    },
    roleRef: {
      apiGroup: "rbac.authorization.k8s.io",
      kind: "Role",
      name: role.metadata.name},
    subjects: [{
      kind: "ServiceAccount",
      name: serviceAccount.metadata.name,
      namespace: namespaceGitlab.metadata.name
    }]
  })

}
export const rolebinding = createRoleBinding()