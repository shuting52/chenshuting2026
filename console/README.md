# 淑婷控制台（ChenShuting Console）

陈淑婷工具箱（`com.chenshuting.console`）的**内容与版本发布控制台**：手机上直接管控工具箱的内容热更与版本发布，无需改代码。

## 文件

| 文件 | 说明 |
|---|---|
| `chenshuting-console-v1.0.0.apk` | 控制台安装包（866 KB，已签名，直装） |
| `chenshuting-console-src-v1.0.0.zip` | 完整源码包（13 个 Java 源文件 + 资源 + 无 Gradle 构建脚本） |

- APK SHA-256：`9f17e28ec9d744edfb91539c6645e787e12b80c519b8316453e03f99c8ccca61`
- 源码包 SHA-256：`bac25d8dc6eb318c559483e0c1cea998994d60bd0fff6b2ef30535c6c01309fe`
- 签名证书 SHA-256（与工具箱同一证书，可覆盖升级）：`A5:0D:61:C5:DF:1C:8F:1C:D5:FA:38:B2:93:4A:38:14:0C:16:60:C3:08:EA:35:B2:AA:71:D2:FE:D3:6B:C2:79`

## 功能

| 页签 | 能力 |
|---|---|
| 总览 | 连接自检、线上版本、内容清单、公告状态、操作日志 |
| 发布 | 选 APK → 上传 → 写 `version.json` → 清理历史旧包（仅 `chenshuting-v*.apk`）→ 复验 |
| 内容 | 提示词 / Skill / 软件 / 分类卡片热更发布，自动维护 `data/manifest.json` |
| 公告 | 欢迎语与滚动动态，发布到 `data/announcements.json`，独立通道约 1 分钟同步到 App |
| 设置 | 仓库 / 分支 / Token、连接自检、清单重建、日志 |

## 首次使用

1. 安装 APK，进入「设置」，填入 GitHub PAT（需 `repo` 权限）；
2. 点「连接自检」确认仓库可读写；
3. 「总览」刷新确认线上数据读取正常；
4. 发版：「发布」页选 APK → 「按线上版本自动 +1」→「一键发布新版本」。

Token 仅保存在手机本地（SharedPreferences），不会上传到任何服务器。

## 从源码重建

```bash
export TOOLS_ROOT=/path/to/tools   # 需含 jdk-17、android-sdk/build-tools/34.0.0、cmdline-tools/latest/lib/r8.jar
export KS_PATH=/path/to/chenshuting-release.jks
export KS_PASS=********
bash build.sh
```

源码包内**不含签名证书**（keystore 含私钥，不入仓库）。

## 注意

- 控制台自身的 APK 请勿放仓库根目录，根目录的旧包清理逻辑会处理 `chenshuting-v*.apk`。
- 根目录 `chenshuting-v1.6.3.apk`、`version.json` 属于工具箱本体发布链，控制台发布页会自动维护。
