# Google Sheets API 集成

本项目使用 Google Sheets API 从 Google 电子表格中读取数据，并将其上传到 Redis 数据库。

## 认证方式

本脚本支持两种认证方式：

1. **OAuth 客户端认证**（需要手动授权，适合本地开发）
2. **服务账号认证**（无需手动授权，适合 CI/CD 环境）

## 服务账号设置（推荐用于 CI/CD）

1. 在 [Google Cloud Console](https://console.cloud.google.com/) 中打开您的项目
2. 导航到 "IAM 和管理" > "服务账号"
3. 点击 "创建服务账号"
4. 输入服务账号名称和描述，然后点击 "创建"
5. 为服务账号分配角色，至少需要 "Sheets API 查看者" 角色
6. 点击 "完成" 创建服务账号
7. 在服务账号列表中，找到刚刚创建的服务账号，点击右侧的三点菜单，选择 "管理密钥"
8. 点击 "添加密钥" > "创建新密钥"，选择 JSON 格式
9. 下载生成的 JSON 密钥文件，并将其保存为项目根目录下的 `googlesheet.json`
10. 在包含您的电子表格的 Google 账号中，共享该电子表格给服务账号邮箱（格式为：`service-account-name@project-id.iam.gserviceaccount.com`），并授予至少"查看者"权限

## OAuth 客户端设置（适合本地开发）

如果您已经有 OAuth 客户端凭证（`googlesheet.json`），并希望在本地开发环境中使用：

1. 运行 token 生成脚本以获取访问令牌：

```bash
# 使用 ts-node 运行脚本
npx ts-node src/scripts/generateToken.ts
```

2. 按照提示在浏览器中访问授权 URL，然后将授权码粘贴到终端中
3. 成功后，将在项目根目录下生成 `token.json` 文件

## 运行脚本

```bash
# 使用 ts-node 运行脚本
npx ts-node src/scripts/uploadToRedis.ts
```

## 配置

您可以通过环境变量配置以下参数：

- `REDIS_URL`: Redis 数据库的 URL
- `SPREADSHEET_ID`: Google 电子表格的 ID

您可以在 `.env.development.local` 文件中设置这些变量。

## 电子表格格式

电子表格应包含两个工作表：

1. `ACC` - 包含准确率数据
2. `AUC` - 包含 AUC 数据

每个工作表的第一行应包含列标题，第一列应包含模型名称。
