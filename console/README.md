# 淑婷控制台（ChenShuting Console）

陈淑婷工具箱（`com.chenshuting.console`）的**内容与版本发布控制台**：手机上直接管控工具箱的内容热更与版本发布，无需改代码。

## 文件

| 文件 | 大小 | 说明 |
|---|---|---|
| `chenshuting-console-v1.1.2.apk` | 939,758 B | 控制台安装包（v1.1.2，已签名，直装，**不含任何令牌**） |
| `chenshuting-console-src-v1.1.2.zip` | 898,536 B | 源码包（41 个源文件，已脱敏：无签名私钥、无令牌） |
| `chenshuting-console-v1.1.1.apk` | 931,566 B | 旧版安装包（v1.1.1） |
| `chenshuting-console-src-v1.1.1.zip` | 892,069 B | 源码包（39 个源文件，已脱敏：无签名私钥、无令牌） |
| `chenshuting-console-v1.1.0.apk` | 919,278 B | 旧版安装包（v1.1.0，干净版） |
| `chenshuting-console-src-v1.1.0.zip` | 885,193 B | 旧版源码包 |
| `chenshuting-console-v1.0.0.apk` | 886,510 B | 首个公开版 |
| `chenshuting-console-src-v1.0.0.zip` | 862,950 B | 首个公开版源码包 |

- v1.1.2 APK SHA-256：`4534297e67a2d56b3badeb421f3e93082b48e5b9533d48149ba7b02d513a5b14`
- v1.1.2 源码包 SHA-256：`8a339929e44954879dc500e951e7ad66f01eca5509a8cf3ac3c46abc2f7e56e6`
- v1.1.1 APK SHA-256：`cbebdec4176244b926e19f5f524109bcb4274c4c0526f0d0ef0296a02b6c1ab5`
- v1.1.1 源码包 SHA-256：`c23f17fdc6f314dd449dbf86ba1ea12d1801d573f5b182f27a71202d84b6871a`
- v1.0.0 APK SHA-256：`9f17e28ec9d744edfb91539c6645e787e12b80c519b8316453e03f99c8ccca61`
- 签名证书 SHA-256（与工具箱同一证书，可覆盖升级）：`A5:0D:61:C5:DF:1C:8F:1C:D5:FA:38:B2:93:4A:38:14:0C:16:60:C3:08:EA:35:B2:AA:71:D2:FE:D3:6B:C2:79`

## v1.1.2 更新

1. **默认主题改「新拟态 Neumorphism」**（`Theme.java`）：奶油粉底 + 白高光 + 粉紫阴影 + 玫瑰主色，凸起 / 凹槽质感统一。
2. **新增页签「本体」**（`PageGlobal.java`）：官方网址（`officialUrl`）、置顶弹窗文字、应用名、图标、首页布局，改完点「发布到本体」，工具箱 **1 分钟内自动同步**，不用发版。
3. **全局背景升级**（`Bg.java`）：支持图片或**视频**作全局背景（视频带声音、循环、center-crop 铺满），存 `getFilesDir/bg_*.dat`；未设背景时回落 Soft-UI 底色。
4. **弹窗预览改内嵌实时**（`DialogPreview.inline`）：预览挂在编辑页顶部，每 0.5 秒按当前配置重建，「改一下、看一眼」，不再依赖虚拟弹出。
5. **移除取色器与预设色板**：颜色一律用 `#RRGGBB` 代码输入，即时生效。
6. **发布链路补强**：`Repo.publishVersion` 同时写入 `apkUrl`（jsDelivr CDN）与 `apkUrlRaw`（仓库 raw 直链）双直链；`PagePublish` 强制要求选择 APK，从源头避免「发出版本却无包可下」。
7. 版本号对齐：`versionCode 4` / `versionName 1.1.2`，`Repo.APP_VER` 同步 1.1.2；页签顺序为 总览 / 发布 / 内容 / 弹窗 / 本体 / 公告 / 设置。

## v1.1.1 更新（历史）

1. **UI 换「少女拟态」Soft-UI 内核**：奶油粉底（`#FDF3F9` / `#F4E9FB`）+ 玫瑰主色（`#E86BA8` / `#F79BC6`），凸起 / 凹槽拟态控件、页面渐变背景、写实投影；页签选中态、根布局同步换肤，徽标升 v1.1.1。
2. **弹窗编辑器加 JSON 代码通道**：新增「编辑 JSON 代码」（单场景 / 整套切换）、「上传 JSON 文件」、「复制当前配置」、「从剪贴板导入」，套用前统一 `applyJson` 校验。
3. **令牌体检**：本地形状预检（空格换行、`ghp_` 位数、前缀合法性）+ 联网核验 + `repo` 权限检查；状态栏显示 mask 与位数。
4. **错误中文化**：401 / 403 / 404 / 409 / 422 全部翻成中文；401 明确提示「令牌无效或已被吊销（曾打进公开 APK 会被 GitHub 密钥扫描自动吊销）」。
5. 版本号对齐：`versionCode 3` / `versionName 1.1.1`，`Repo.APP_VER` 同步 1.1.1。

## v1.1.0 功能

1. 图标三态：内置图标 / 填网址自动识别站点图标 / 上传本地图片
2. 弹窗样式编辑器：通用 / 更新 / 置顶 / 我的 四个场景，实时预览，发布即生效（`data/dialogs.json`）
3. 全功能页「怎么用」分步教程
4. 图标直链带时间戳破 CDN 缓存

## v1.0.0 功能

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

## 令牌与分发包安全约定（重要）

- 公开分发的 APK **必须不内置真实令牌**：令牌随 APK 进公开仓库会被 GitHub 密钥扫描自动吊销（表现为 `HTTP 401 Bad credentials`）。本目录 v1.1.0 / v1.1.1 / v1.1.2 均为干净包，装好后在 App「设置」页手动粘贴令牌即可。
- 源码包中 `Prefs.java` 保留 `__TOKEN__` 源码占位；本地构建脚本可从 `$TEMP/.tok_use` 注入令牌，构建结束自动还原。此机制仅用于本机安装包，**切勿随公开包发布**。
- 源码包**不含签名私钥**（`keystore/*.jks`），`build.sh` 中签名口令改为读环境变量。

## 从源码重建

```bash
export TOOLS_ROOT=/path/to/tools   # 需含 jdk-17、android-sdk/build-tools/34.0.0、cmdline-tools/latest/lib/r8.jar
export KS_PATH=/path/to/your-release.jks
export KS_PASS=********
export KS_ALIAS=chenshuting
bash build.sh                      # 产物：output/chenshuting-console-v1.1.2.apk
```

## 注意

- 控制台自身的 APK 请勿放仓库根目录，根目录的旧包清理逻辑会处理 `chenshuting-v*.apk`。
- 根目录 `chenshuting-v1.6.5.apk`、`version.json` 属于工具箱本体发布链，控制台发布页会自动维护。
