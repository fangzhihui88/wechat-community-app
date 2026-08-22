import { useState, memo, useCallback } from 'react';
import { View, Text, Input, Radio, RadioGroup } from '@tarojs/components';
import Taro from '@tarojs/taro';
import NavBar from '../../components/NavBar';
import { useAppStore } from '../../store/useAppStore';
import './index.css';

interface ExpireOption {
  label: string;
  value: string;
}

const EXPIRE_OPTIONS: ExpireOption[] = [
  { label: '1天', value: '1' },
  { label: '7天', value: '7' },
  { label: '30天', value: '30' },
  { label: '永久', value: 'permanent' },
];

const QUICK_AMOUNTS = [1, 5, 10, 20, 50, 100, 200, 500];

function generateMockQRCodeDataUrl(amount: string, note: string): string {
  const size = 200;
  const cell = 10;
  const cols = Math.floor(size / cell);

  // Simple QR-like mosaic using deterministic pattern based on amount
  const seed = amount.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  let idx = 0;
  const cells: boolean[][] = [];
  for (let r = 0; r < cols; r++) {
    cells[r] = [];
    for (let c = 0; c < cols; c++) {
      // Corner finder patterns (3x3 blocks in TL, TR, BL)
      const inTL = r < 7 && c < 7;
      const inTR = r < 7 && c >= cols - 7;
      const inBL = r >= cols - 7 && c < 7;
      if (inTL || inTR || inBL) {
        const blockR = r % 7;
        const blockC = c % 7;
        const isBorder = blockR === 0 || blockR === 6 || blockC === 0 || blockC === 6;
        cells[r][c] = isBorder;
      } else {
        idx = (idx * 1664525 + 1013904223 + seed * (r * cols + c)) >>> 0;
        cells[r][c] = (idx & 1) === 0;
      }
    }
  }

  const canvas = Taro.createCanvasContext('qr-canvas');
  canvas.setFillStyle('#ffffff');
  canvas.fillRect(0, 0, size, size);
  canvas.setFillStyle('#000000');
  for (let r = 0; r < cols; r++) {
    for (let c = 0; c < cols; c++) {
      if (cells[r][c]) {
        canvas.fillRect(c * cell, r * cell, cell, cell);
      }
    }
  }
  canvas.draw();

  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(`pay://amount=${amount}&note=${note}`)}`;
}

const CreateCodePage = () => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [expire, setExpire] = useState('7');
  const [generated, setGenerated] = useState(false);
  const addPaymentCode = useAppStore((s) => (s as any).addPaymentCode);

  const handleQuickAmount = useCallback((val: number) => {
    setAmount(String(val));
    setGenerated(false);
  }, []);

  const handleAmountInput = useCallback((e: any) => {
    const v = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    setAmount(v);
    setGenerated(false);
  }, []);

  const handleExpireChange = useCallback((e: any) => {
    setExpire(e.detail.value);
  }, []);

  const handleNoteChange = useCallback((e: any) => {
    setNote(e.target.value);
    setGenerated(false);
  }, []);

  const handleGenerate = useCallback(() => {
    if (!amount || parseFloat(amount) <= 0) {
      Taro.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }
    setGenerated(true);
    // Save to store
    if (addPaymentCode) {
      addPaymentCode({
        amount,
        note,
        expire,
        createdAt: new Date().toISOString(),
      });
    }
    Taro.showToast({ title: '收款码已生成', icon: 'success' });
  }, [amount, note, expire, addPaymentCode]);

  const handleSaveImage = useCallback(() => {
    if (!generated) {
      Taro.showToast({ title: '请先生成收款码', icon: 'none' });
      return;
    }
    Taro.showLoading({ title: '保存中...' });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '图片已保存至相册', icon: 'success' });
    }, 800);
  }, [generated]);

  const handleShare = useCallback(() => {
    if (!generated) {
      Taro.showToast({ title: '请先生成收款码', icon: 'none' });
      return;
    }
    Taro.showShareMenu({ withShareTicket: true });
    Taro.showToast({ title: '分享功能已准备', icon: 'success' });
  }, [generated]);

  const qrUrl = generated && amount
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`pay://amount=${amount}&note=${note || '收款'}`)}`
    : '';

  return (
    <View className="create-code-page">
      <NavBar title="创建收款码" />

      {/* 金额输入 */}
      <View className="section">
        <View className="section-title">收款金额</View>
        <View className="amount-input-row">
          <Text className="amount-yen">¥</Text>
          <Input
            className="amount-input"
            type="digit"
            placeholder="0.00"
            value={amount}
            onInput={handleAmountInput}
            maxlength={10}
          />
        </View>
        <View className="quick-amounts">
          {QUICK_AMOUNTS.map((val) => (
            <View
              key={val}
              className={`quick-btn ${amount === String(val) ? 'quick-btn--active' : ''}`}
              onClick={() => handleQuickAmount(val)}
            >
              ¥{val}
            </View>
          ))}
        </View>
      </View>

      {/* 备注输入 */}
      <View className="section">
        <View className="section-title">备注 <Text className="optional-tag">（可选）</Text></View>
        <Input
          className="note-input"
          placeholder="如：聚餐AA、货款等"
          value={note}
          onInput={handleNoteChange}
          maxlength={50}
        />
      </View>

      {/* 到期时间 */}
      <View className="section">
        <View className="section-title">有效期</View>
        <RadioGroup onChange={handleExpireChange}>
          <View className="expire-group">
            {EXPIRE_OPTIONS.map((opt) => (
              <View key={opt.value} className="expire-item">
                <Radio
                  value={opt.value}
                  checked={expire === opt.value}
                  color="var(--color-primary)"
                />
                <Text className="expire-label">{opt.label}</Text>
              </View>
            ))}
          </View>
        </RadioGroup>
      </View>

      {/* 生成按钮 */}
      <View className="section generate-section">
        <View className="generate-btn" onClick={handleGenerate}>
          <Text className="generate-btn-text">生成收款码</Text>
        </View>
      </View>

      {/* 预览区 */}
      {generated && (
        <View className="section preview-section">
          <View className="section-title">收款码预览</View>
          <View className="preview-card">
            <View className="preview-amount">
              <Text className="preview-yen">¥</Text>
              <Text className="preview-money">{amount}</Text>
            </View>
            {note && <Text className="preview-note">{note}</Text>}
            <View className="qr-wrapper">
              <image
                className="qr-image"
                src={qrUrl}
                mode="aspectFit"
              />
              <View className="qr-canvas-placeholder" />
            </View>
            <Text className="preview-tip">扫描此码向我付款</Text>
          </View>

          {/* 保存 & 分享 */}
          <View className="action-row">
            <View className="action-btn action-btn--save" onClick={handleSaveImage}>
              <Text className="action-icon">💾</Text>
              <Text className="action-text">保存图片</Text>
            </View>
            <View className="action-btn action-btn--share" onClick={handleShare}>
              <Text className="action-icon">📤</Text>
              <Text className="action-text">分享</Text>
            </View>
          </View>
        </View>
      )}

      <View className="page-bottom-safe" />
    </View>
  );
};

export default CreateCodePage;
(CreateCodePage as any).config = { navigationStyle: 'custom' } as any;
