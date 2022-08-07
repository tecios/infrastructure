
import {createDeployments} from "./src/WebDeployments";
import {WebService} from "./src/types/WebService";
import {createIngresses} from "./src/Ingress";
import {createService} from "./src/Service";
import {createDirectus, createEtcd, createGitlabRunner} from "./src/Charts";
import createCronjob from "./src/CronJob";


let cronjob = createCronjob()
let keelAnnotationsDev = {"keel.sh/match-tag":"true", "keel.sh/policy": "force"}
let keelAnnotationsProd = {"keel.sh/policy": "major"}

let ws1 = new WebService("webcv-dev","dev.burban.me", "registry.gitlab.com/privateprojectsbu/webcv", "development", keelAnnotationsDev);
let ws2 = new WebService("webcv-prod", "burban.me",  "registry.gitlab.com/privateprojectsbu/webcv", "v1.1.2", keelAnnotationsProd);

createDeployments(new Array<WebService>(ws1, ws2));
createService(new Array<WebService>(ws1, ws2));
createIngresses(new Array<WebService>(ws1, ws2));

let gitlabRunner = createGitlabRunner();
let directus = createDirectus();
let etcd = createEtcd();
//console.log(directus.ready);
