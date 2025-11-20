# 🇹🇷 Video Diary App (Türkçe Dokümantasyon)

**SevenApps** için teknik bir vaka çalışması (case study) olarak geliştirilen bu proje; video anılarını kaydetmek, kırpmak ve yönetmek için tasarlanmış, **prodüksiyon seviyesinde** ve **ölçeklenebilir** bir React Native uygulamasıdır.

Proje; modern mimari desenleri, katı tip güvenliği (strict type safety) ve offline-first (önce çevrimdışı) veri kalıcılığı prensiplerini sergilemektedir.

---

## 🚀 Temel Özellikler ve Teslimatlar

Bu proje, vaka çalışmasında belirtilen **tüm zorunlu ve bonus gereksinimleri** karşılamaktadır.

- ✅ **Video Kırpma Akışı:** Video seçimi, kırpma (5sn segment) ve kaydetme işlemlerini yöneten özel 3 adımlı sihirbaz.
- ✅ **Kalıcı Veri Depolama:** Metadata verileri **SQLite** üzerinde, fiziksel medya dosyaları ise **DocumentDirectory** (Kalıcı Dizin) içinde saklanır.
- ✅ **Yüksek Performanslı Liste:** 60FPS kaydırma performansı için önbellekli thumbnailler (küçük resimler) ile `@shopify/flash-list` kullanılmıştır.
- ✅ **Sağlam Mimari:** Tanstack Query (Sunucu Durumu) ve Zustand (UI Durumu) ile sorumlulukların ayrılması (Separation of Concerns).
- ✅ **Düzenleme Yeteneği:** Video metadata'sı üzerinde tam CRUD (Oluşturma, Okuma, Güncelleme, Silme) işlemleri.
- ✅ **Modern UI/UX:** Stil için `NativeWind`, akıcı geçişler için `Reanimated` ve etkileşimli scrubber için `Gesture Handler`.
- ✅ **Validasyon:** `Zod` kullanılarak sağlanan katı şema doğrulama.

---

## 🛠 Teknoloji Yığını (Tech Stack)

### Çekirdek
- **Framework:** [Expo (Managed Workflow)](https://expo.dev)
- **Dil:** [TypeScript](https://www.typescriptlang.org/)
- **Navigasyon:** [Expo Router](https://docs.expo.dev/router/introduction/) (Dosya tabanlı yönlendirme)

### Veri & State
- **Sunucu/Asenkron State:** [@tanstack/react-query](https://tanstack.com/query/latest) (v5)
- **UI State:** [Zustand](https://github.com/pmndrs/zustand)
- **Veritabanı:** [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Validasyon:** [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)

### UI & Medya
- **Stil:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **Video İşleme:** `expo-trim-video` (Kırpma) & `expo-video-thumbnails` (Thumbnail oluşturma)
- **Video Oynatma:** `expo-video`
- **Animasyonlar:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) & [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)

---

## 🏗 Mimari ve Kritik Kararlar

Bu bölüm, ölçeklenebilirlik ve performans odaklı alınan kritik teknik kararların gerekçelerini açıklar.

### 1. SQLite vs. AsyncStorage
**Karar:** Birincil veri deposu olarak `expo-sqlite` kullanıldı.
**Gerekçe:** `AsyncStorage` basit olsa da, şifrelenmemiştir, sadece anahtar-değer (key-value) tabanlıdır ve boyut sınırları vardır. Gelecekte karmaşık filtreleme (örn: "Geçen ayın videolarını göster") gerektirebilecek ölçeklenebilir bir uygulama için ilişkisel bir veritabanı (SQLite) veri bütünlüğü ve sorgu performansı açısından çok daha üstündür.

### 2. Tanstack Query vs. Global State
**Karar:** Tüm veritabanı etkileşimleri için Tanstack Query kullanıldı.
**Gerekçe:** Veritabanı "Sunucu Durumu" (Server State) olarak ele alındı. Tanstack Query; önbellekleme, yükleme durumları ve en önemlisi **önbellek geçersiz kılma (cache invalidation)** süreçlerini yönetir.
- *Örnek:* `useAddVideoMutation` tamamlandığında, otomatik olarak `['videos']` sorgu anahtarını geçersiz kılar. Bu sayede Ana Ekran listesi, manuel bir state müdahalesine gerek kalmadan anında yenilenir.

### 3. Dosya Kalıcılık Stratejisi (Kritik)
**Sorun:** `expo-image-picker` ve `expo-trim-video` dosyaları işletim sisteminin `CacheDirectory` (Geçici Dizin) klasörüne kaydeder.
**Risk:** İşletim sistemi, depolama alanı azaldığında bu dizini temizler. Bu da veri kaybına (Veritabanında bozuk linkler) yol açar.
**Çözüm:**
1.  **Kırpma:** Video geçici bir yola kırpılır.
2.  **Taşıma:** Dosya açıkça `FileSystem.documentDirectory` (Kalıcı Depolama) konumuna taşınır.
3.  **Thumbnail:** Bir önizleme resmi oluşturulur ve o da kalıcı depolamaya taşınır.
4.  **Kaydetme:** Yalnızca bu *kalıcı* yollar (URI) SQLite'a kaydedilir.

### 4. Liste Performansı
**Karar:** Liste içinde `<Video />` yerine küçük resimler için `<Image />` kullanıldı.
**Gerekçe:** Bir liste içinde birden fazla video oynatıcı örneği (instance) oluşturmak ciddi bellek tüketimine yol açar. Oluşturma aşamasında statik bir thumbnail üreterek ve bunu `FlashList` içinde `Expo Image` ile render ederek, yüzlerce öğe olsa bile listenin performanslı kalması sağlanır.

---


# 📂 Proje Dosya Yapısı (File Structure)

```bash
app/
├── _layout.tsx          # Root Layout (QueryClient & SQLite Provider kurulumu)
├── index.tsx            # Ana Ekran (Video Listesi - FlashList)
├── add.tsx              # Video Ekleme Sihirbazı (Modal)
├── videos/
│   └── [id].tsx         # Video Detay ve Oynatma Sayfası
└── edit/
    └── [id].tsx         # Video Metadata Düzenleme Sayfası (Modal)

components/
├── video/
│   ├── VideoPlayer.tsx  # expo-video kullanan oynatıcı bileşeni
│   ├── VideoListItem.tsx # Listede thumbnail gösteren bileşen (<Image> kullanır)
│   └── VideoTrimmer.tsx # Reanimated & GestureHandler ile kırpma arayüzü
└── ui/
    └── Button.tsx       # NativeWind varyantlı buton bileşeni

lib/
├── database.ts          # SQLite veritabanı başlatma ve CRUD işlemleri
├── queries.ts           # Tanstack Query hook'ları ve mutasyonları (useAddVideoMutation vb.)
└── validation.ts        # Zod şemaları (videoMetadataSchema)

store/
└── ui-store.ts          # Global UI state (varsa tema vb. için)

types/
└── index.ts             # TypeScript interface'leri (Video, VideoInput)

```

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (LTS)
- iOS Simulator (Mac) veya Android Emulator

### Adımlar

1.  **Depoyu klonlayın:**
    ```bash
    git clone [https://github.com/kullaniciadiniz/video-diary-app.git](https://github.com/kullaniciadiniz/video-diary-app.git)
    cd video-diary-app
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    ```

3.  **Prebuild (Native Modüller İçin Zorunlu):**
    Bu proje native kod (`expo-sqlite`, video işleme mantığı) içerdiği için native dizinlerin oluşturulması gerekir.
    ```bash
    npx expo prebuild
    ```

4.  **iOS üzerinde çalıştırın:**
    ```bash
    npx expo run:ios
    ```

5.  **Android üzerinde çalıştırın:**
    ```bash
    npx expo run:android
    ```

---

## 🧐 İnceleme Rehberi (Reviewer Guide)

Eğer bu kodu **React Native Developer** pozisyonu için inceliyorsanız, aşağıdaki dosyalara odaklanmanızı öneririm:

1.  **`lib/queries.ts`**: Kırpma, dosya taşıma, thumbnail oluşturma ve veritabanı kaydı gibi karmaşık akışı yöneten `useAddVideoMutation` hook'unu içerir.
2.  **`components/video/VideoTrimmer.tsx`**: Özel scrubber arayüzü için `Reanimated` ve `GestureHandler` kullanımını gösterir.
3.  **`lib/database.ts`**: Saf SQLite implementasyonunu ve şema tanımını gösterir.
4.  **`app/add.tsx`**: Yerel state (Sihirbaz adımları) ile global mutasyonların nasıl etkileşime girdiğini gösterir.

---

**Yazar:** Alper
**Tarih:** Kasım 2025
```
