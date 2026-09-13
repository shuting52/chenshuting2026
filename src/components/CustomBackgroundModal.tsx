import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Trash2,
  Sliders,
  Palette,
  Eye
} from 'lucide-react';

export interface BackgroundSettings {
  type: 'none' | 'preset' | 'camera' | 'upload';
  value: string; // url or data url
  blur: number; // px blur
  opacity: number; // 0 to 1 opacity
}

interface CustomBackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: BackgroundSettings;
  onSaveSettings: (settings: BackgroundSettings) => void;
}

// Preset high-definition aesthetic backgrounds
export const PRESET_BACKGROUNDS = [
  {
    id: 'preset-1',
    name: '星际星云',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=60'
  },
  {
    id: 'preset-2',
    name: '晨曦雪山',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=60'
  },
  {
    id: 'preset-3',
    name: '极简青绿',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=300&q=60'
  },
  {
    id: 'preset-4',
    name: '暖阳微风',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=60'
  },
  {
    id: 'preset-5',
    name: '夜幕城市霓虹',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=300&q=60'
  },
  {
    id: 'preset-6',
    name: '清幽竹林',
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=300&q=60'
  }
];

export const CustomBackgroundModal: React.FC<CustomBackgroundModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSaveSettings
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'camera' | 'upload'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<string>(
    currentSettings.type === 'preset' ? currentSettings.value : PRESET_BACKGROUNDS[0].url
  );
  const [blur, setBlur] = useState<number>(currentSettings.blur || 0);
  const [opacity, setOpacity] = useState<number>(currentSettings.opacity || 0.85);

  // Camera capture states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(
    currentSettings.type === 'camera' ? currentSettings.value : null
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // File upload state
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    currentSettings.type === 'upload' ? currentSettings.value : null
  );

  useEffect(() => {
    if (isOpen) {
      setBlur(currentSettings.blur || 0);
      setOpacity(currentSettings.opacity || 0.85);
      if (currentSettings.type === 'camera') {
        setActiveTab('camera');
        setCapturedPhoto(currentSettings.value);
      } else if (currentSettings.type === 'upload') {
        setActiveTab('upload');
        setUploadedImage(currentSettings.value);
      } else {
        setActiveTab('preset');
      }
    } else {
      stopCamera();
    }
  }, [isOpen, currentSettings]);

  // Start web camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('当前浏览器环境不支持调用摄像头');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError(err.message || '无法访问摄像头，请检查浏览器权限');
      setIsCameraActive(false);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Capture photo from video feed
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setUploadedImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Apply chosen background
  const handleApply = () => {
    let settings: BackgroundSettings;
    if (activeTab === 'camera' && capturedPhoto) {
      settings = { type: 'camera', value: capturedPhoto, blur, opacity };
    } else if (activeTab === 'upload' && uploadedImage) {
      settings = { type: 'upload', value: uploadedImage, blur, opacity };
    } else {
      settings = { type: 'preset', value: selectedPreset, blur, opacity };
    }
    onSaveSettings(settings);
    onClose();
  };

  // Clear / reset background to default
  const handleResetDefault = () => {
    onSaveSettings({ type: 'none', value: '', blur: 0, opacity: 1 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[var(--iiice-white)] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-[var(--iiice-title)]">个性化背景设置</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="px-5 pt-3 border-b border-slate-100 dark:border-slate-800 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('preset');
              stopCamera();
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preset'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-800/60'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>精选高清壁纸</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              if (!isCameraActive && !capturedPhoto) startCamera();
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-800/60'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>摄像头实时拍照</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-800/60'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>自定义上传图片</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs text-slate-600 dark:text-slate-300">
          {/* Preset Tab */}
          {activeTab === 'preset' && (
            <div>
              <p className="mb-3 text-slate-500">点击选中任意一款精美风景或自然壁纸：</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_BACKGROUNDS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPreset(preset.url)}
                    className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all cursor-pointer group text-left ${
                      selectedPreset === preset.url
                        ? 'border-blue-600 ring-2 ring-blue-500/30 scale-102'
                        : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={preset.thumb}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                      <span className="text-white font-medium text-[11px] drop-shadow-sm">
                        {preset.name}
                      </span>
                    </div>
                    {selectedPreset === preset.url && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Camera Tab */}
          {activeTab === 'camera' && (
            <div className="space-y-3">
              {cameraError ? (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
                  <p className="font-semibold mb-1">摄像头启动失败：</p>
                  <p className="text-xs">{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="mt-3 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs cursor-pointer"
                  >
                    重试启动摄像头
                  </button>
                </div>
              ) : capturedPhoto && !isCameraActive ? (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-semibold">
                      已拍摄照片
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCapturedPhoto(null);
                        startCamera();
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>重新拍摄</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {!isCameraActive && (
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 cursor-pointer flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        <span>开启摄像头</span>
                      </button>
                    )}
                  </div>
                  {isCameraActive && (
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-5 py-2 bg-rose-600 text-white rounded-xl font-semibold shadow-lg hover:bg-rose-700 cursor-pointer flex items-center gap-2 text-xs"
                      >
                        <Camera className="w-4 h-4" />
                        <span>拍下当前画面作为背景</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer text-xs"
                      >
                        关闭摄像头
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <label className="block p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center cursor-pointer bg-slate-50 dark:bg-slate-800/40">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <ImageIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  点击选择本地图片或壁纸文件
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  支持 JPG, PNG, WebP 高清大图
                </p>
              </label>

              {uploadedImage && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                    title="移除图片"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Adjustments (Blur & Content Card Opacity) */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                背景高斯模糊（增强文字清晰度）：
              </span>
              <span className="font-mono text-blue-600 font-bold">{blur}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              step={1}
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                内容区域底色半透明度：
              </span>
              <span className="font-mono text-blue-600 font-bold">
                {Math.round(opacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0.4}
              max={1}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetDefault}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            恢复默认纯净背景
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md cursor-pointer"
            >
              应用并保存背景
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
