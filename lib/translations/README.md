# i18n Translations

Bu klasör Video Diary uygulamasının çoklu dil desteği için çeviri dosyalarını içerir.

## Desteklenen Diller

- **en.json**: İngilizce çeviriler
- **tr.json**: Türkçe çeviriler

## Yapı

Çeviri dosyaları aşağıdaki kategorilere ayrılmıştır:

### 1. `common`

Ortak UI elemanları (butonlar, mesajlar, vb.)

### 2. `validation`

Form validasyon hata mesajları (Zod şemaları için)

### 3. `main`

Ana ekran metinleri

### 4. `add`

Video ekleme ekranı metinleri

### 5. `details`

Video detay ekranı metinleri

## Yeni Çeviri Ekleme

Yeni bir çeviri eklemek için:

1. Her iki JSON dosyasına da (en.json ve tr.json) aynı anahtarı ekleyin
2. İlgili kategori altına yerleştirin
3. Varolan kategori yoksa yeni bir kategori oluşturun

### Örnek:

```json
{
  "common": {
    "newKey": "New Translation"
  }
}
```

## Kullanım

```typescript
import i18n from '@/lib/i18n';

// Basit kullanım
const text = i18n.t('common.loading');

// Parametreli kullanım
const message = i18n.t('main.deleteConfirmMessage', { name: 'Video 1' });
```

## Notlar

- Parametreli çeviriler için `%{parameterName}` formatını kullanın
- Varsayılan dil İngilizce'dir (en)
- Bir çeviri eksikse otomatik olarak İngilizce versiyonu kullanılır
