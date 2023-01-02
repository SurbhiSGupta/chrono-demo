# Context
This repo sets up the demo as described in this [doc|https://chronosphere.io/learn/instrumenting-a-javascript-application-for-opentelemetry-part-1-setup/]

# What does this demo do.
This demo creates an application that starts and can serve helloworld in the browser. Request count data is provided as an endpoint for Prometheus to scrape. The metric is a count of all the requests made to the web application. It can be found in `rc-uat` as ` requests_surbhi_dev` metric.

# Steps to create this environment

### 1. Install `minikube`

### 2. Install packages
```
npm install
```

### 3. Configure `minikube` and `docker` 
```
eval $(minikube docker-env)
```

### 4. Create a docker image of this application.
To create docker image for `minikube` , the image has to be
created in minikube docker registry.

```
docker build -t ot-express .
```

### 5. Deploy to `minikube`
```
minikube start
kubectl create configmap prometheus-config --from-file=prom-conf.yml
kubectl apply -f k8s-local.yml
kubectl apply -f chronocollector.yaml
```

### 6. Access the app
To access the app on local, we have to start tunneling  to the `minikube` cluster using the following command. This is because Minikube doesn't support LoadBalancer services, so the service will never get an external IP. But you can access the service by starting tunneling.

```
minikube service ot-express prometheus-service 
```

Copy the urls that starts with 127.0.0.1 and with their port number to access the app.

### 7. Troubshooting
To tail logs, use this command
```
// get sevice names
kubectl get pods
kubectl logs <serviceName> -f
```
