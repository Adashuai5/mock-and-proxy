# Mock And Proxy

Open a mock or proxy service and switch freely

# Use

1. use command
   command+shift+P then input "Start Mock"

2. use config file
   Create a new mockAndProxy.config.json configuration file with the following example and restart the window to start the service automatically or use the command to start the service

# mockAndProxy.config.json example

```
{
  "port": 10088,
  "targets": [
    {
      "name": "开发环境",
      "target": "https://xxxdev.com.cn"
    },
    {
      "name": "测试环境",
      "target": "https://xxxtest.com.cn"
    },
    {
      "name": "预发环境",
      "target": "https://xxxpre.com.cn"
    },
    {
      "name": "生产环境",
      "target": "https://xxx.com.cn"
    }
  ]
}

```
