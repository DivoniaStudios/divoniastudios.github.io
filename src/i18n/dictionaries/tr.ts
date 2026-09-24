/**
 * Kaynak dil. en.ts bu dosyanın tipine uymak zorunda; bir alan eklenirse
 * iki dilde birden eklenmeli, yoksa derleme hata verir.
 *
 * Date For Dead metinleri Steam sayfasının resmi Türkçe metninden.
 */
export const tr = {
  meta: {
    siteName: "Divonia Studios",
    title: "Divonia Studios · Oyun stüdyosu",
    description:
      "PC, mobil ve mekânlar için oyun yapan bağımsız stüdyo. İlk oyunumuz Date For Dead yakında Steam'de.",
  },
  common: {
    skipToContent: "İçeriğe geç",
    wishlist: "İstek listesine ekle",
    wishlistLong: "Steam'de istek listesine ekle",
    startProject: "Proje başlat",
    opensNewTab: "yeni sekmede açılır",
  },
  nav: {
    home: "Ana sayfa",
    games: "Oyunlar",
    services: "Hizmetler",
    contact: "İletişim",
    mainNav: "Ana menü",
    menu: "Menüyü aç",
    close: "Menüyü kapat",
    paused: "DURAKLATILDI",
    resume: "Devam et",
    langLabel: "Dil",
  },
  hud: {
    level: "SEVİYE",
    progress: "İLERLEME",
  },
  hero: {
    title: [
      { text: "Kendi oyunlarımızı yapıyoruz.", accent: false },
      { text: " Seninkini de.", accent: true },
    ],
    subtitle:
      "Divonia Studios; PC, mobil ve fiziksel mekânlar için oyun geliştiren bağımsız bir stüdyo.",
    ctaPrimary: "Date For Dead'i keşfet",
    panels: [
      {
        title: "Kendi oyunumuz: Date For Dead",
        text: "Seçimlerin ilişkileri şekillendirdiği hikâye odaklı bir dating sim. Victoria’nın aradığı şey yeni bir aşk değil; aşkı geri getirmenin bir yolu.",
        link: "Oyunu gör",
      },
      {
        title: "Markalar için oyun",
        text: "KidZania İstanbul’daki Logo Yazılım Geliştirme Merkezi için bir PC oyunu geliştirdik; çocuklar yazılım dünyasını oynayarak keşfediyor. Her oyunu markanın mekânına ve amacına göre tasarlıyoruz.",
        link: "Hizmetlere bak",
      },
      {
        title: "PC, mobil, mekân",
        text: "Oyunu bir ekrandan fiziksel bir alana kadar taşıyoruz. PhotoSensia Kids iOS ve Android'de yayında.",
        link: "Tüm oyunlar",
      },
    ],
  },
  deck: {
    title: "Sağa kaydır. Âşık ol. Bedelini sorma.",
    text: "Date For Dead, seçimlerin ilişkileri şekillendirdiği hikâye odaklı bir dating sim. Victoria Frankenstein olarak profilleri kaydır, flört et ve randevulara çık. Ama Victoria’nın aradığı şey yeni bir aşk değil; aşkı geri getirmenin bir yolu.",
    facts: [
      { k: "Platform", v: "Windows" },
      { k: "Diller", v: "Türkçe, İngilizce" },
      { k: "Durum", v: "Erken Erişim, yakında" },
    ],
    pass: "Geç",
    like: "Beğen",
    hint: "Kartı sürükle ya da ok tuşlarını kullan.",
    matched: "Eşleştiniz",
    mysteryName: "Ve diğerleri",
    mysteryRole: "Ve sana gerçekten yaklaşabilecek insanlar",
    endTitle: "Hepsi seni bekliyor.",
    endText: "Date For Dead'i istek listene ekle, çıktığında ilk sen haberdar ol.",
    restart: "Baştan başla",
    matches: "Eşleşme",
    ageLabel: "yaşında",
    deckLabel: "Date For Dead karakter destesi",
    more: "Oyunun sayfası",
  },
  quests: {
    title: "Tamamlanan görevler",
    intro: "Markalar ve kurumlar için yaptığımız oyunlar.",
    client: "Müşteri",
    platform: "Platform",
    year: "Yıl",
    done: "TAMAMLANDI",
  },
  platforms: {
    pc: "PC",
    ios: "iOS",
    android: "Android",
    installation: "Mekân kurulumu",
  },
  stores: {
    steam: "Steam",
    appstore: "App Store",
    googleplay: "Google Play",
    web: "Merkezi gör",
  },
  skills: {
    title: "Yetenek ağacı",
    intro: "Yaptığımız işler ve her birinin arkasındaki oyun.",
    proof: "Oyna",
    items: [
      {
        id: "custom",
        title: "Özel oyun geliştirme",
        text: "Fikirden yayına, PC ve mobil için uçtan uca oyun üretimi.",
        game: "date-for-dead",
      },
      {
        id: "mobile",
        title: "Mobil oyunlar",
        text: "iOS ve Android için oyun, mağaza yayını dahil.",
        game: "photosensia-kids",
      },
      {
        id: "brand",
        title: "Marka deneyimleri",
        text: "Mekânlar ve markalar için etkileşimli kurulumlar ve oyunlar.",
        game: "kidzania",
      },
      {
        id: "unity",
        title: "Unity prototipleme",
        text: "Bir fikrin oynanabilir olup olmadığını hızlıca gösteren prototipler.",
        game: "",
      },
    ],
  },
  continueScreen: {
    title: "DEVAM?",
    text: "Aklında bir oyun mu var? Anlat, birlikte oynanabilir hâle getirelim.",
    or: "ya da doğrudan yaz:",
  },
  footer: {
    tagline: "PC, mobil ve mekânlar için oyun yapan bağımsız stüdyo.",
    rights: "Tüm hakları saklıdır.",
    follow: "Takip et",
    email: "contact@divoniastudios.com",
  },
  gamesPage: {
    title: "Oyunlar",
    subtitle: "Kendi oyunumuz ve markalar için yaptıklarımız.",
    own: "Kendi oyunumuz",
    client: "Müşteri işi",
    view: "Oyunu incele",
  },
  gamePage: {
    about: "Oyun hakkında",
    speaker: "Anlatıcı",
    lines: [
      "Ya devam etmek sandığın kadar kolay değilse?",
      "Victoria Frankenstein'ı oynuyorsun. Zeki bir bilim insanı ve büyük bir kaybın ardından hayatına devam etmeye çalışan biri.",
      "İleriye bakmak için bir dating app kullanmaya başlıyor. Yeni insanlarla tanışıyor, bağ kuruyor ama aradığı şeyin ne olduğundan o bile emin değil.",
      "Her kusursuz buluşmanın arkasında bir sır var: Sen aşk aramıyorsun. Aşkı geri getirmeye çalışıyorsun.",
    ],
    next: "Devam",
    replay: "Baştan oku",
    dialogueHint: "Tıkla ya da Enter'a bas",
    featuresTitle: "Alışılmışın dışında bir dating sim",
    features: [
      {
        title: "Seçimler gerçekten önemli",
        text: "Diyaloglarla bağ kur, karakterlerin farklı yönlerini keşfet, ne kadar ileri gideceğine karar ver.",
      },
      {
        title: "Yüzeyin altında bir şey var",
        text: "Bazı anlar garip şekilde tekrar eder. Bazı bağlar olması gerekenden daha ağır gelir. Bazı sessizlikler fazla şey anlatır.",
      },
      {
        title: "Eğlenceli, tuhaf, trajik",
        text: "Karanlık romantik komedi, duygusal öykü anlatımı ve felsefi alt metinler. Samimi ve kaçınılmaz derecede trajik.",
      },
    ],
    castTitle: "Tanışacağın canavarlar",
    galleryTitle: "Ekran görüntüleri",
    galleryLabel: "Ekran görüntüsü",
    factsTitle: "Künye",
    facts: [
      { k: "Geliştirici", v: "Divonia Studios" },
      { k: "Yayıncı", v: "Divonia Studios" },
      { k: "Platform", v: "Windows 10/11 (64-bit)" },
      { k: "Diller", v: "Türkçe, İngilizce" },
      { k: "Tür", v: "Görsel roman, dating sim" },
      { k: "Çıkış", v: "Duyurulacak (Erken Erişim)" },
    ],
    ctaTitle: "Çıktığında ilk sen bil.",
    ctaText: "İstek listesine eklersen Steam, oyun çıktığında sana haber verir.",
  },
  servicesPage: {
    title: "Hizmetler",
    subtitle:
      "Markalar ve kurumlar için oyun yapıyoruz. Kendi oyunumuzu yaparken öğrendiklerimizi sizin projenize taşıyoruz.",
    processTitle: "Nasıl çalışıyoruz",
    process: [
      {
        title: "Oynanabilir yap",
        text: "Fikri önce küçük, oynanabilir bir prototipe çeviriyoruz. Kâğıt üstünde iyi duran her şey oyunda iyi hissettirmiyor.",
      },
      {
        title: "Birlikte üret",
        text: "Tasarım, kod ve görselleri aynı ekipte yürütüyoruz. İlerlemeyi sunumlarla değil, oynanabilir sürümlerle görüyorsunuz.",
      },
      {
        title: "Oyuncuya ulaştır",
        text: "Steam, App Store, Google Play ya da mekândaki kurulum: oyunu oyuncuyla buluşturana kadar işin içindeyiz.",
      },
    ],
  },
  contactPage: {
    title: "İletişim",
    subtitle:
      "Bir oyun fikri, bir marka projesi ya da basın sorusu. Yaz, dönelim.",
    form: {
      name: "Adın",
      email: "E-posta",
      subject: "Konu",
      subjects: [
        "Özel oyun",
        "Marka deneyimi",
        "Mobil oyun",
        "Basın ve yayıncılar",
        "Diğer",
      ],
      message: "Mesaj",
      messagePlaceholder: "Projeni, hedefini ve takvimini kısaca anlat.",
      submit: "Gönder",
      note: "Gönder'e basınca mesajını Gmail, Outlook ya da e-posta uygulamanla gönderebilirsin.",
      readyTitle: "Mesajın hazır. Nasıl göndermek istersin?",
      readyText: "Seçtiğin yerde alıcı, konu ve mesaj dolu olarak açılır; tek yapman gereken göndermek.",
      viaGmail: "Gmail'de aç",
      viaOutlook: "Outlook'ta aç",
      viaApp: "E-posta uygulaması",
      copy: "Mesajı kopyala",
      copied: "Kopyalandı",
      copyHint: "Hiçbiri açılmazsa mesajı kopyalayıp bu adrese gönder:",
      toLabel: "Kime",
      bodyName: "Ad",
      subjectLabel: "Konu",
      required: "Bu alan gerekli.",
      invalidEmail: "Geçerli bir e-posta adresi yaz.",
    },
    direct: "Doğrudan e-posta",
    social: "Sosyal medya",
  },
};

export type Dictionary = typeof tr;
