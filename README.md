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
*   ✅ **Error Boundary:** React Error Boundary ile runtime hataların yakalanması ve kullanıcı dostu hata mesajları (i18n ve NativeWind ile entegre).
*   ✅ **Environment Variables:** `.env` dosyası ile yapılandırma yönetimi ve farklı ortamlar için destek.
*   ✅ **Clean Architecture:** Custom hooks (`useAddVideoWizard`, `useVideoList`) ile business logic tamamen UI'dan ayrıştırıldı.
*   ✅ **Dark Mode Support:** Status bar renkleri dark mode'a göre otomatik ayarlanır (Zustand + system preferences).

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
├── app/                      # Expo Router sayfaları
│   ├── _layout.tsx           # Root layout (Theme, Query, Navigation)
│   ├── index.tsx             # Ana Liste Ekranı (Dumb view)
│   ├── add.tsx               # Video Ekleme Orkestratörü (Dumb view)
│   ├── edit/[id].tsx         # Video Düzenleme Sayfası
│   └── videos/[id].tsx       # Video Detay Sayfası
├── components/               # Yeniden kullanılabilir UI bileşenleri
│   ├── ErrorBoundary.tsx     # Runtime hata yakalama (i18n + NativeWind)
│   ├── LoadingScreen.tsx     # Uygulama başlatma ekranı
│   ├── ui/                   # Genel UI component'leri
│   │   ├── Button.tsx        # Loading state destekli button
│   │   └── SearchBar.tsx     # Arama bileşeni
│   ├── video/                # Video ile ilgili component'ler
│   │   ├── VideoListItem.tsx # Liste item bileşeni
│   │   ├── VideoPlayer.tsx   # Video oynatıcı wrapper
│   │   └── VideoTrimmer.tsx  # Video kırpma UI
│   └── wizard/               # Video ekleme wizard adımları
│       ├── Step1SelectVideo.tsx  # Adım 1: Video seçimi
│       ├── Step2TrimVideo.tsx    # Adım 2: Video kırpma
│       ├── Step3MetadataForm.tsx # Adım 3: Metadata girişi
│       └── WizardLayout.tsx      # Wizard layout wrapper
├── hooks/                    # Custom React hooks
│   ├── useAppLoading.ts      # Uygulama başlatma orkestratörü
│   ├── useColorScheme.ts     # Tema yönetimi (Zustand + system)
│   ├── useAddVideoWizard.ts  # Video ekleme business logic
│   └── useVideoList.ts       # Video listesi business logic
├── lib/                      # İş mantığı ve yardımcı fonksiyonlar
│   ├── database.ts           # SQLite işlemleri
│   ├── queries.ts            # Tanstack Query hook'ları
│   ├── validation.ts         # Zod şemaları (i18n entegreli)
│   ├── i18n.ts               # i18n yapılandırması
│   └── translations/         # Çeviri dosyaları
│       ├── en.json           # İngilizce çeviriler
│       └── tr.json           # Türkçe çeviriler
├── store/                    # Zustand store'lar
│   ├── filter-store.ts       # Filtreleme ve arama state
│   └── ui-store.ts           # UI tercihleri (tema modu)
├── types/                    # TypeScript tip tanımları
└── assets/                   # Statik dosyalar
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

---

## 🤖 AI ile Geliştirme Süreci

Bu proje, modern yazılım geliştirme pratiklerinin bir parçası olarak **AI destekli geliştirme** yaklaşımı ile oluşturulmuştur.

### AI Kullanımı

Proje boyunca Google Gemini AI aşağıdaki alanlarda aktif olarak kullanılmıştır:

#### 🎯 Kod Kalitesi ve Mimari
- **TypeScript Type Safety:** Tüm component'ler ve hook'lar için generic type tanımlamaları
- **Best Practices:** React Hook patterns, custom hook design, error handling strategies
- **Code Review:** `any` type kullanımı gibi anti-pattern'lerin tespit edilip düzeltilmesi
- **Refactoring:** FlashList v2 migration, fire-and-forget pattern'den kontrollu loading'e geçiş

#### 📚 Dokümantasyon
- **Inline Comments:** Karmaşık logic'ler için açıklayıcı JSDoc yorumları
- **README Structure:** Kapsamlı ve yapılandırılmış proje dokümantasyonu
- **Translation Files:** JSON tabanlı i18n sistemi ve dokümantasyonu

#### 🏗️ Mimari Kararlar
- **Loading State Management:** Merkezi loading orchestration sistemi tasarımı
- **Error Boundary Pattern:** React Error Boundary implementation strategy
- **Separation of Concerns:** i18n metinlerinin JSON'a ayrılması

#### 🔍 Problem Solving
- **Debugging:** TypeScript type errors, FlashList v2 API değişiklikleri
- **Performance:** Splash screen timing, database initialization optimization
- **UX Improvements:** Loading states, error messaging, timeout mechanisms

### AI İle Elde Edilen Faydalar

✅ **Hız:** Boilerplate kod yazımında 3-4x hızlanma  
✅ **Kalite:** Consistent code style ve naming conventions  
✅ **Güvenlik:** Edge case'lerin erken tespit edilmesi (timeout, error handling)  
✅ **Dokümantasyon:** Comprehensive ve güncel dokümantasyon  
✅ **Learning:** Best practice'ler ve modern pattern'lerin öğrenilmesi

> **Not:** AI bir araç olarak kullanılmıştır. Tüm kod ve mimari kararlar incelendi, anlaşıldı ve gerektiğinde modifiye edildi. AI suggestion'ları körü körüne uygulanmadı, her değişiklik proje gereksinimlerine göre değerlendirildi.

---

## 💭 Teknik Karar Yorumları

Bu bölüm, projede alınan önemli teknik kararların **neden** alındığını açıklar.

### Neden FlashList?

**Karar:** `FlatList` yerine `@shopify/flash-list` kullanımı

**Sebep:**
- Video listeleri potansiyel olarak çok uzun olabilir (yüzlerce video)
- FlashList, FlatList'e göre %10x daha iyi scroll performance sağlar
- Blank area'ları minimize eder (better viewport recycling)
- Production'da 60 FPS garantisi kritik bir UX requirement

**Trade-off:** Ek dependency (~100KB), ancak UX kazancı buna değer.

---

### Neden JSON Tabanlı i18n?

**Karar:** Çeviri metinlerini koddan ayrı JSON dosyalarına taşıma

**Sebep:**
1. **Separation of Concerns:** Content vs. Code
2. **Scalability:** Yeni dil eklemek sadece yeni JSON dosyası gerektirir
3. **Non-developer Friendly:** Çevirmenler kod görmeden çalışabilir
4. **Version Control:** Çeviri değişiklikleri koddan ayrı track edilir
5. **Bundle Optimization:** Kullanılmayan diller code-splitting ile exclude edilebilir (future)

**Alternatif:** Inline objects (önceki yaklaşım) - Kabul edilmedi çünkü scalable değil.

---

### Neden Merkezi Loading System?

**Karar:** `useAppLoading` hook ile centralized loading orchestration

**Sebep:**
1. **Race Conditions:** Database init tamamlanmadan query atılması engellenir
2. **User Feedback:** Splash screen kontrolü ile professional startup UX
3. **Error Handling:** Initialization failure'ları yakalanıp gösterilir
4. **Timeout Protection:** Sonsuz loading durumları 10s ile sınırlanır
5. **Single Source of Truth:** Loading logic tek bir noktada, test edilebilir

**Alternatif:** Fire-and-forget database init - Kabul edilmedi çünkü:
- Race condition riski var
- Error handling yetersiz
- User'a feedback yok

---

### Neden TypeScript Strict Mode?

**Karar:** `strict: true` ile TypeScript configuration

**Sebep:**
- Runtime'da type-related bug'ların önüne geçmek
- Refactoring güvenliği (rename, move operations)
- IDE intelliSense desteği
- Large-scale codebase'de maintainability

**Trade-off:** Development sırasında biraz daha fazla type tanımlama gerekiyor, ancak production bug sayısı azalıyor.

---

### Neden Expo SQLite?

**Karar:** Video metadata için `expo-sqlite` kullanımı

**Sebep:**
1. **Relational Data:** Video-thumbnail ilişkisi ve metadata queries
2. **Performance:** AsyncStorage'a göre çok daha hızlı read/write
3. **Querying:** SQL ile complex filtering/sorting yapılabilir
4. **Data Integrity:** ACID guarantees
5. **Future-proof:** Pagination, search gibi advanced features için hazır

**Alternatif:** AsyncStorage - Kabul edilmedi çünkü:
- Key-value store, relational data için uygun değil
- Query capabilities yok
- Performance issues with large datasets

---

### Neden Environment Variables?

**Karar:** `.env` dosyası ile configuration management

**Sebep:**
1. **Environment-specific Config:** Dev, staging, prod farklı değerler
2. **Security:** Sensitive data (API keys) commit edilmez
3. **Flexibility:** DB name, API endpoints runtime'da değiştirilebilir
4. **Team Collaboration:** Herkes kendi local config'ini kullanır

**Implementation:** `app.config.ts` ile `EXPO_PUBLIC_*` prefix requirement.

---

### Neden Clean Architecture Refactoring?

**Karar:** Business logic'i custom hooks'a, UI'ı focused component'lere taşıma

**Sebep:**
1. **Separation of Concerns:** Logic vs. Presentation tamamen ayrıldı
2. **Testability:** Hook'lar UI'dan bağımsız test edilebilir
3. **Reusability:** `useVideoList`, `useAddVideoWizard` farklı ekranlarda kullanılabilir
4. **Maintainability:** Her component tek bir sorumluluğa odaklanıyor (~50-100 satır)
5. **Scalability:** Yeni özellik eklemek daha kolay (hook extend et, component ekle)

**Implementation:**
- `app/add.tsx`: 320 satır → 60 satır ("Dumb View" pattern)
- `hooks/useAddVideoWizard.ts`: Tüm wizard business logic
- `components/wizard/*`: Her adım için focused component

**Alternatif:** Monolithic screen components - Kabul edilmedi çünkü:
- 300+ satırlık dosyalar maintainability problemleri
- Logic ve UI iç içe, test edilemez
- Kod tekrarı ve coupling issues

---

### Neden Image Picker Loading State?

**Karar:** Image picker açılırken button'a loading state ekleme

**Sebep:**
1. **UX Problem:** Native bridge lag'i kullanıcıya freeze gibi görünüyor
2. **Perceived Performance:** Spinner ile kullanıcı işlem olduğunu anlıyor
3. **State Management:** Ephemeral UI state → `useState` (Zustand'a gerek yok)
4. **Critical 100ms Delay:** React render cycle'ın UI'ı güncellemesi için native bridge block olmadan önce kısa delay

**Implementation:**
```typescript
const [isPicking, setIsPicking] = useState(false);

const handleSelectVideo = async () => {
  setIsPicking(true);
  await new Promise(r => setTimeout(r, 100)); // React render için
  try {
    await ImagePicker.launchImageLibraryAsync(...);
  } finally {
    setIsPicking(false); // Her durumda reset
  }
};
```

**Trade-off:** 100ms ek delay, ancak UX açısından çok daha iyi feedback.

---

## 🎓 Geliştirici Notları

### Öğrenilen Pattern'ler
- Custom hook design (separation of logic from UI)
- Splash screen orchestration
- Error boundary best practices
- i18n architecture in React Native
- FlashList optimization techniques

### Future Improvements
Bu proje için potansiyel iyileştirmeler:
- [ ] Sentry/Crashlytics entegrasyonu
- [ ] Unit test coverage (Jest + React Native Testing Library)
- [ ] E2E tests (Detox)
- [ ] CI/CD pipeline (GitHub Actions + EAS Build)
- [ ] Analytics tracking (Firebase Analytics)
- [ ] Performance monitoring
- [ ] Code splitting for translations

---
