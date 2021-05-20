# Mock And Proxy

开启 mock 服务或代理服务

# mockAndProxy.config.json 示例

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