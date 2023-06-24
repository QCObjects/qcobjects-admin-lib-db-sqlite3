# QCObjects Handler Hello World

# Install 

```shell
npm i qcobjects-handler-hello-world
```

# Setup in your config.json

```json
"backend":{
    "routes":[
        {
            "name":"Hello World!",
            "description":"Hello world Microservice!",
            "path":"^/hello-world",
            "microservice":"qcobjects-handler-hello-world",
            "headers": {
              "content-type": "text/html; charset=utf-8"
            },
            "responseHeaders":{
            },
            "cors":{
              "allow_origins":"*"
            }
        }
    ]
}
```

# Visit

Visit https://localhost:port/hello-world

# Create your own microservice

To make your own microservice, you can generate it with QCObjects CLI using this package as template:

```shell
qcobjects create --custom=qcobjects-handler-hello-world myown-handler-microservice
```

