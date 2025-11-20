# 📱 React Native Case Study - Video Diary App

---

## 🎯 Proje Özeti

**Video Diary App**, kullanıcıların videolarını içe aktarıp 5 saniyelik kesitler halinde kırparak, isim ve açıklama ekleyip saklayabildikleri bir dijital günlük uygulamasıdır.

### ✅ Teslim Edilen Özellikler (Deliverables)

Proje, belirtilen gereksinimlerin **tamamını** kapsamaktadır:

1.  **Ana Ekran (Main Screen):**
    *   Kırpılan videoların listelenmesi (`FlashList` ile yüksek performans).
    *   Kalıcı veri saklama (`SQLite` + `FileSystem`).
    *   Detay sayfasına navigasyon.
2.  **Detay Sayfası (Details Page):**
    *   Video oynatma ve metadata (isim, açıklama) gösterimi.
    *   Minimalist ve odaklı UI tasarımı.
3.  **Kırpma Modalı (Crop Modal - 3 Adımlı Sihirbaz):**
    *   **Adım 1:** Galeriden video seçimi (`expo-image-picker`).
    *   **Adım 2:** 5 saniyelik aralık seçimi ve önizleme (`VideoTrimmer` bileşeni).
    *   **Adım 3:** Metadata girişi ve doğrulama.
4.  **Video Kırpma İşlemi:**
    *   `expo-trim-video` kütüphanesi kullanılarak asenkron kırpma.
    *   `Tanstack Query` (useMutation) ile işlem yönetimi.

### 🌟 Bonus Özellikler (Tamamlandı)

*   ✅ **Düzenleme Sayfası (Edit Page):** Videoların isim ve açıklamalarını güncellemek için form yapısı.
*   ✅ **Expo SQLite:** Yapılandırılmış ve kalıcı veri depolama için `AsyncStorage` yerine `SQLite` tercih edildi.
*   ✅ **React Native Reanimated:** Akıcı liste animasyonları ve etkileşimler için entegre edildi.
*   ✅ **Zod Validasyonu:** Form girişleri (isim, açıklama) için katı şema kontrolü.
*   ✅ **Merkezi Loading State Yönetimi:** Database initialization ve splash screen kontrolü için `useAppLoading` hook'u ile profesyonel uygulama başlatma deneyimi.
*   ✅ **Çoklu Dil Desteği (i18n):** Türkçe ve İngilizce dil desteği, JSON tabanlı çeviri sistemi.
*   ✅ **Error Boundary:** React Error Boundary ile runtime hataların yakalanması ve kullanıcı dostu hata mesajları.
*   ✅ **Environment Variables:** `.env` dosyası ile yapılandırma yönetimi ve farklı ortamlar için destek.

---

## 🛠 Teknoloji Yığını (Tech Stack)

Vaka çalışmasında talep edilen teknolojilerin tamamı kullanılmıştır:

| Kategori | Teknoloji | Kullanım Amacı |
|----------|-----------|----------------|
| **Core** | **Expo (Managed)** | Proje altyapısı ve geliştirme ortamı. |
| **Navigasyon** | **Expo Router** | Dosya tabanlı, modern navigasyon yapısı. |
| **State** | **Zustand** | Global UI durumu yönetimi. |
| **Async State** | **Tanstack Query** | Veri çekme, önbellekleme ve asenkron işlem (kırpma) yönetimi. |
| **Veritabanı** | **Expo SQLite** | Video metadata'sının kalıcı ve güvenli saklanması. |
| **Video** | **expo-trim-video** | Video işleme ve kırpma mantığı. |
| **Oynatıcı** | **Expo Video** | Performanslı video oynatma bileşeni. |
| **Stil** | **NativeWind** | Tailwind CSS tabanlı hızlı ve tutarlı stillendirme. |
| **Animasyon** | **Reanimated** | Liste girişleri ve UI etkileşimleri. |
| **Validasyon** | **Zod** | Form verilerinin doğrulanması. |
| **i18n** | **i18n-js** | Çoklu dil desteği (Türkçe/İngilizce). |

---

## 🏗 Mimari Kararlar ve "Key Considerations"

Proje geliştirilirken vaka çalışmasındaki "Key Considerations" maddelerine özel önem verilmiştir:

### 1. Ölçeklenebilirlik (Scalability)
*   **Bileşen Mimarisi:** `VideoPlayer`, `VideoListItem`, `VideoTrimmer` gibi bileşenler tekrar kullanılabilir şekilde ayrıştırıldı.
*   **Veri Katmanı:** `lib/queries.ts` ve `lib/database.ts` ile veri erişim mantığı UI'dan tamamen izole edildi. Bu sayede veritabanı veya API değişikliği UI'ı etkilemez.

### 2. Performans (Performance)
*   **FlashList:** Uzun listelerde dahi 60 FPS kaydırma deneyimi için `FlatList` yerine `FlashList` kullanıldı.
*   **Thumbnail Stratejisi:** Listede doğrudan video oynatıcıları render etmek yerine, oluşturulan thumbnail resimleri (`<Image>`) gösterilerek bellek kullanımı minimize edildi.
*   **Tanstack Query:** Veri çekme ve güncelleme işlemleri optimize edildi, gereksiz render'ların önüne geçildi.

### 3. Kullanılabilirlik (Usability)
*   **Adım Adım Sihirbaz:** Karmaşık video ekleme süreci, kullanıcıyı yormayan 3 adımlı bir sihirbaza dönüştürüldü.
*   **Geri Bildirimler:** İşlem başarı/hata durumları, yükleniyor göstergeleri ve Haptic (titreşim) geri bildirimleri ile kullanıcı deneyimi zenginleştirildi.

### 4. Doğrulama (Validation)
*   **Zod Entegrasyonu:** Kullanıcı hatalarını önlemek için form verileri `Zod` şemaları ile doğrulanıyor. Geçersiz veri girişinde kullanıcıya anlık uyarılar gösteriliyor.

### 5. Uygulama Başlatma (App Initialization)
*   **Merkezi Loading Yönetimi:** `useAppLoading` custom hook ile uygulama başlatma süreci orkestre edilir. Database initialization, splash screen kontrolü ve hata yönetimi tek bir noktadan yönetilir.
*   **Güvenlik:** 10 saniyelik timeout mekanizması ile sonsuz loading durumlarının önüne geçilir.
*   **Kullanıcı Deneyimi:** Uygulama kritik kaynaklar hazır olmadan render edilmez, kullanıcıya her zaman anlamlı geri bildirim sağlanır.

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### Gereksinimler
*   Node.js (LTS sürümü önerilir)
*   iOS Simulator (Mac için) veya Android Emulator

### Adımlar

1.  **Depoyu Klonlayın:**
    ```bash
    git clone <repo-url>
    cd VideoDiary
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Environment Variables Yapılandırması:**
    Proje kök dizininde `.env.example` dosyasını `.env` olarak kopyalayın:
    ```bash
    cp .env.example .env
    ```
    
    `.env` dosyasında aşağıdaki değişkenler tanımlanmıştır:
    
    | Değişken | Açıklama | Varsayılan Değer |
    |----------|----------|------------------|
    | `EXPO_PUBLIC_DB_NAME` | SQLite veritabanı dosya adı | `videodiary.db` |
    | `EXPO_PUBLIC_MAX_VIDEO_DURATION` | Maksimum video süresi (ms) | `5000` (5 saniye) |
    
    **Önemli Notlar:**
    - Expo'da environment variables'ın client tarafında kullanılabilmesi için `EXPO_PUBLIC_` prefix'i gereklidir.
    - `.env` dosyası `.gitignore` içinde yer aldığı için repository'ye commit edilmez.
    - Production ortamında bu değerleri `app.config.ts` üzerinden veya CI/CD pipeline'ınızdan enjekte edebilirsiniz.

4.  **Native Build Oluşturun (Prebuild):**
    Proje native modüller (`expo-sqlite`, video işleme) içerdiği için prebuild işlemi gereklidir.
    ```bash
    npx expo prebuild
    ```

5.  **Uygulamayı Başlatın:**
    *   **iOS:** `npx expo run:ios`
    *   **Android:** `npx expo run:android`

> ⚠️ **Not:** Video işleme ve SQLite özellikleri Expo Go uygulamasında tam performanslı çalışmayabilir veya desteklenmeyebilir. Bu nedenle `run:ios` veya `run:android` komutları ile Development Build kullanılması önerilir.

---

## 📂 Proje Yapısı

```
VideoDiary/
├── app/                 # Expo Router sayfaları
│   ├── index.tsx        # Ana Liste Ekranı
│   ├── add.tsx          # Video Ekleme Sihirbazı
│   └── videos/[id].tsx  # Detay Sayfası
├── components/          # Yeniden kullanılabilir UI bileşenleri
│   ├── LoadingScreen.tsx # Uygulama başlatma ekranı
│   └── ErrorBoundary.tsx # Runtime hata yakalama
├── hooks/               # Custom React hooks
│   └── useAppLoading.ts # Uygulama başlatma orkestratörü
├── lib/                 # İş mantığı ve yardımcı fonksiyonlar
│   ├── database.ts      # SQLite işlemleri
│   ├── queries.ts       # Tanstack Query hook'ları
│   ├── validation.ts    # Zod şemaları (i18n entegreli)
│   ├── i18n.ts          # i18n yapılandırması
│   └── translations/    # Çeviri dosyaları
│       ├── en.json      # İngilizce çeviriler
│       ├── tr.json      # Türkçe çeviriler
│       └── README.md    # i18n dokümantasyonu
├── types/               # TypeScript tip tanımları
└── assets/              # Statik dosyalar
```

---

## 🌍 Çoklu Dil Desteği (i18n)

Uygulama **Türkçe** ve **İngilizce** dillerini desteklemektedir. Dil seçimi cihazın sistem diline göre otomatik yapılır.

### Özellikler:
- ✅ **JSON Tabanlı Çeviriler:** Tüm metinler `lib/translations/` klasöründe ayrı JSON dosyalarında tutulur
- ✅ **Validation Mesajları:** Zod validation hata mesajları da i18n ile yerelleştirilmiştir
- ✅ **Fallback Desteği:** Bir çeviri eksikse otomatik olarak İngilizce kullanılır
- ✅ **Bakım Kolaylığı:** Çevirileri güncellemek için sadece JSON dosyalarını düzenlemek yeterlidir

### Kullanım Örneği:
```typescript
import i18n from '@/lib/i18n';

// Basit metin
const text = i18n.t('common.loading'); // "Yükleniyor..." veya "Loading..."

// Parametreli metin
const message = i18n.t('main.deleteConfirmMessage', { name: 'Video 1' });
```

Detaylı bilgi için: `lib/translations/README.md`

