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

# 陈淑婷 · 资源收藏导航 — 更新检测仓库

App 内置的「检查更新」会读取本仓库根目录的 `version.json`（多源容错：gh-proxy / ghproxy.net / GitHub API / raw 直连；刻意不用 CDN，避免缓存旧清单导致漏检），
版本号高于已安装版本时会弹出「新版本上线，体验升级」升级弹窗，不更新将无法继续使用；点「去更新」跳转下载。

## 一、仓库需上传的文件（全部放根目录、main 分支）

| 文件 | 说明 |
|---|---|
| `version.json` | 版本清单，App 检测的依据 |
| `chenshuting-1.3.5.apk` | 安装包本体（文件名保持英文且带版本号，避免 CDN 命中旧包） |

## 二、两步让更新检测生效

1. 仓库设为公开：`Settings → General → 页面底部 Danger Zone → Change visibility → Make public`
   （私有仓库时 raw / jsdelivr 一律 404，App 会静默跳过，检测不到更新。）
2. 把上表两个文件上传到仓库根目录（main 分支），1 分钟后 App 内「我的 → 检查更新」即可用。

## 三、版本字段说明

```json
{
  "versionCode": 5,              // 整数，必须大于 App 当前版本号才会提示更新（当前 5）
  "versionName": "1.3.0",        // 展示用版本名
  "changelog": "更新内容...",     // \n 换行，弹窗内展示
  "apkUrl": "下载地址"            // 点「立即更新」时打开的地址
}
```

## 四、apkUrl 可选写法（任选其一）

| 写法 | 地址格式 | 说明 |
|---|---|---|
| jsDelivr（默认，推荐） | `https://cdn.jsdelivr.net/gh/shuting52/chenshuting2026@main/chenshuting-v1.3.0.apk` | CDN 加速，国内可达性较好 |
| GitHub 原始地址 | `https://raw.githubusercontent.com/shuting52/chenshuting2026/main/chenshuting-v1.3.0.apk` | 直连 GitHub，国内可能超时 |
| ghproxy 代理 | `https://ghproxy.net/https://raw.githubusercontent.com/shuting52/chenshuting2026/main/chenshuting-v1.3.0.apk` | 代理加速备用 |

## 五、发新版本流程

1. 改版本号：`AndroidManifest.xml` 的 `versionCode/versionName` 与 `build.sh` 的 `--version-code/--version-name` 同步 +1（两者必须一致）。
2. 重新出包，把新 APK 以英文名上传（如 `chenshuting-v1.4.0.apk`）。
3. 更新 `version.json` 的 `versionCode / versionName / changelog / apkUrl` 三处即可，旧 APK 可保留。

> 提示：同签名（`chenshuting-release.jks`）出的新包可直接覆盖安装，无需卸载。
*（内容由AI生成，仅供参考）*
