# Mock And Proxy

Open a mock or proxy service and switch freely.

# Usage

1. using command

   command+shift+P then input "Start Mock".

2. using config file

   Create a configuration file named mockAndProxy.config.json with the following example then "Reload Window" to start the service automatically or use the command.

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
