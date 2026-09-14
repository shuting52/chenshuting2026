---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: ccdcf6fbcaa4181e41cb05146c498a03_1d246f05afa611f18039525400461939
    ReservedCode1: CV+PFqgiYyS81jk0kcf42hTDU0FdsQfAatP7YzDVLG75rLoKG12IDD7Icms4L6tjCbE7r4wxpn5GB05Xc0zRyViTKjVTdeEjidnD/iOkV92oIqg3OcJdAGX6RmMBzv/PS/4Bo8yXbBX0e0sBdlPpAN3AGgxDaTUYNICnS4o0BEdLOASPQkiXnCzvKrk=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: ccdcf6fbcaa4181e41cb05146c498a03_1d246f05afa611f18039525400461939
    ReservedCode2: CV+PFqgiYyS81jk0kcf42hTDU0FdsQfAatP7YzDVLG75rLoKG12IDD7Icms4L6tjCbE7r4wxpn5GB05Xc0zRyViTKjVTdeEjidnD/iOkV92oIqg3OcJdAGX6RmMBzv/PS/4Bo8yXbBX0e0sBdlPpAN3AGgxDaTUYNICnS4o0BEdLOASPQkiXnCzvKrk=
---

# 陈淑婷工具箱 · 更新与内容仓库

App 的「检查更新」读取根目录 `version.json`（多源容错：gh-proxy / ghproxy.net / raw 直连；刻意不用 CDN 取清单，避免缓存旧版本导致漏检），版本号高于已安装版本即弹出升级弹窗；「内容同步」读取 `data/` 目录，用于不发版更新首页跑马灯与软件 / 提示词 / Skill 内容。

## 一、仓库文件（全部放 main 分支）

| 路径 | 说明 |
|---|---|
| `version.json` | 版本清单，App 更新检测依据 |
| `chenshuting-v1.6.0.apk` | 当前线上安装包，**仓库只保留最新一个** |
| `data/manifest.json` | 远端内容清单（`version` + `files[path,size,sha256]`） |
| `data/announcements.json` | 首页跑马灯文案（`enabled` / `welcome` / `items`） |

## 二、版本字段说明

```json
{
  "versionCode": 19,
  "versionName": "1.6.0",
  "changelog": "更新内容...（\\n 换行，弹窗展示）",
  "apkUrl": "https://cdn.jsdelivr.net/gh/shuting52/chenshuting2026@main/chenshuting-v1.6.0.apk"
}
```

## 三、下载地址写法（任选其一）

| 写法 | 地址格式 |
|---|---|
| jsDelivr（默认） | `https://cdn.jsdelivr.net/gh/shuting52/chenshuting2026@main/chenshuting-v1.6.0.apk` |
| GitHub 原始地址 | `https://raw.githubusercontent.com/shuting52/chenshuting2026/main/chenshuting-v1.6.0.apk` |
| ghproxy 代理 | `https://ghproxy.net/https://raw.githubusercontent.com/shuting52/chenshuting2026/main/chenshuting-v1.6.0.apk` |

## 四、发版流程（固定四步，缺一不可）

1. 版本号 +1：`AndroidManifest.xml` 的 `versionCode/versionName` 与 `build.sh` 的 `--version-code/--version-name` 必须一致。
2. 重新出包，新 APK 以英文名上传到根目录（如 `chenshuting-v1.6.0.apk`）。
3. **删除仓库中除最新版以外的全部旧 APK**：仓库只保留当前线上包，避免体积膨胀，也避免 CDN 误命中历史包。
4. 更新 `version.json`（`versionCode / versionName / changelog / apkUrl`），并同步更新本 README 的「当前版本」与文件表。

> 提示：同签名（`chenshuting-release.jks`）出的新包可直接覆盖安装，无需卸载。

## 五、内容实时更新（不发版即可增删）

1. 把内容文件放进 `data/` 目录：`announcements.json`（跑马灯）、`apps.json`、`prompts.json`、`skills.json`，或 `prompts/*.png`、`skills/*.zip`。
2. 在 `data/manifest.json` 的 `files` 中登记 `path` / `size` / `sha256`，并把顶层 `version` 递增（版本不递增客户端会跳过同步）。
3. 提交后 App 在启动与回到前台时检查同步，一般 10 分钟内生效；任一文件 sha256 校验不过，本次同步整次放弃并保留原内容。

## 六、当前版本

- 版本：**v1.6.0（versionCode 19）**
- 线上包：`chenshuting-v1.6.0.apk`，8,611,627 字节，sha256 `d66a1dcf75f396e0f1e48b77806944eeae74111d9ae4503488b008438b8f924e`
- 资源已整体打包为加密容器 `assets/data.pkg`，安装包内不暴露分类 / 提示词 / Skill 资源正文

*（内容由AI生成，仅供参考）*
