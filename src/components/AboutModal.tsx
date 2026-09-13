import React, { useState } from 'react';
import { X, Heart, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitted(true);
    onShowToast('感谢您的反馈与建议！站长会认真查阅。');
    setTimeout(() => {
      setSubmitted(false);
      setFeedback('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[var(--iiice-white)] border border-[var(--iiice-border)] rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0f3460] to-[#2563eb] text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
            陈淑婷
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--iiice-title)]">关于 陈淑婷 · 个人精选导航</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">数字美学 · 高效工具 · 优质资源分享</p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-b border-slate-200/80 dark:border-slate-800 py-3.5 my-3">
          <div className="flex items-start gap-2.5">
            <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">站长陈淑婷寄语：</span>
              欢迎来到我的个人精选导航站点！我是陈淑婷，一名热爱生活、热衷探索前沿数字化工具与互联网优质资源的分享者。这里整理了我长期精选自全网的百宝箱，包括影音视听、前沿AI、设计灵感、开发必备与效率神器。
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">纯净原则与初心：</span>
              秉持“真诚分享、纯净无套路”的原则，站点所有收录资源均经过体验与筛选，杜绝虚假与诱导。您的所有个性化收藏、自建卡片以及主题偏好均保存在您的本地浏览器中，绝不上报隐私，安心使用。
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            💡 <strong className="text-slate-700 dark:text-slate-200">便捷操作指南：</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>按下键盘 <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">Ctrl + D</kbd> (Mac: Cmd + D) 可将陈淑婷的主页加入书签；</li>
              <li>在顶部搜索栏可一键在外部搜索引擎与“全站实时筛选”之间秒级切换，支持拼音与关键词模糊过滤；</li>
              <li>点击分类右上角的“编辑模式”可多选卡片进行批量收藏或管理，支持在“数据备份”中一键导出导入配置。</li>
            </ul>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mt-2">
          <h4 className="text-xs font-bold text-[var(--iiice-title)] mb-2 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>给陈淑婷留言 / 推荐好站</span>
          </h4>

          {submitted ? (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>提交成功！感谢您的宝贵建议与推荐。</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                required
                placeholder="有任何失效链接需要修正，或有想要推荐收录的好用网站，请随时留言告诉我们..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--iiice-border)] bg-[var(--search-input-bg)] text-[var(--iiice-title)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
                >
                  发送留言
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
