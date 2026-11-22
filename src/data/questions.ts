import type { BossMeta, HeroClassMeta, QuizQuestion, TopicId, TopicMeta } from '../types/game';

export const HERO_CLASSES: HeroClassMeta[] = [
  {
    id: 'alkemis',
    name: 'Alkemis Lab',
    roleTitle: 'Ahli Reaksi & Ramuan',
    maxHp: 100,
    baseDamage: 25,
    startingPotions: 3,
    startingFifty: 3,
    startingHints: 2,
    startingDoubles: 2,
    perkLabel: '3 Ramuan HP · 3× Analisis 50:50',
    suitColorHex: 0x0f766e,
    accentColorHex: 0x34d399,
  },
  {
    id: 'ksatria',
    name: 'Ksatria Mekanika',
    roleTitle: 'Pelindung Gaya & Energi',
    maxHp: 120,
    baseDamage: 30,
    startingPotions: 2,
    startingFifty: 2,
    startingHints: 2,
    startingDoubles: 3,
    perkLabel: '120 Max HP · 30 DMG · 3× Serangan 2×',
    suitColorHex: 0x1d4ed8,
    accentColorHex: 0xfbbf24,
  },
  {
    id: 'penjelajah',
    name: 'Penjelajah Bio',
    roleTitle: 'Pengamat Hayati & Anatomi',
    maxHp: 105,
    baseDamage: 26,
    startingPotions: 2,
    startingFifty: 2,
    startingHints: 3,
    startingDoubles: 2,
    perkLabel: '+8 HP tiap Kombo ×3 · 3× Petunjuk',
    suitColorHex: 0x047857,
    accentColorHex: 0xf43f5e,
  },
];

export const REGION_BOSSES: Record<TopicId, BossMeta> = {
  'zat-aditif': {
    topicId: 'zat-aditif',
    regionName: 'Jalur 1 · Laboratorium Kabut',
    bossName: 'Golem Aditif',
    bossTitle: 'Penjaga Zat & Senyawa',
    accentColor: '#10B981',
    gateColorHex: 0x10b981,
  },
  'gerak-newton': {
    topicId: 'gerak-newton',
    regionName: 'Jalur 2 · Rel Kinetik',
    bossName: 'Automaton Newton',
    bossTitle: 'Penguasa Gerak & Gaya',
    accentColor: '#38BDF8',
    gateColorHex: 0x38bdf8,
  },
  'usaha-pesawat': {
    topicId: 'usaha-pesawat',
    regionName: 'Jalur 3 · Terowongan Roda & Tuas',
    bossName: 'Titan Mekanis',
    bossTitle: 'Raksasa Pesawat Sederhana',
    accentColor: '#F59E0B',
    gateColorHex: 0xf59e0b,
  },
  tumbuhan: {
    topicId: 'tumbuhan',
    regionName: 'Jalur 4 · Hutan Klorofil',
    bossName: 'Penjaga Xilem',
    bossTitle: 'Roh Jaringan Tumbuhan',
    accentColor: '#34D399',
    gateColorHex: 0x34d399,
  },
  rangka: {
    topicId: 'rangka',
    regionName: 'Jalur 5 · Kripta Osteon',
    bossName: 'Ksatria Tengkorak',
    bossTitle: 'Pengawal Sistem Rangka',
    accentColor: '#FB7185',
    gateColorHex: 0xfb7185,
  },
};

export const TOPICS: TopicMeta[] = [
  {
    id: 'zat-aditif',
    label: 'Zat Aditif & Zat Adiktif',
    shortLabel: 'Zat Aditif',
    description: 'Pewarna, pemanis, pengawet, penyedap, serta dampak zat adiktif',
    questionCount: 16,
  },
  {
    id: 'gerak-newton',
    label: 'Gerak & Hukum Newton',
    shortLabel: 'Gerak & Newton',
    description: 'Jarak, perpindahan, kelajuan, percepatan, gaya gesek, dan Hukum I–III Newton',
    questionCount: 18,
  },
  {
    id: 'usaha-pesawat',
    label: 'Usaha, Daya & Pesawat Sederhana',
    shortLabel: 'Usaha & Pesawat',
    description: 'Usaha, daya, tuas/pengungkit, katrol, dan bidang miring',
    questionCount: 20,
  },
  {
    id: 'tumbuhan',
    label: 'Struktur & Jaringan Tumbuhan',
    shortLabel: 'Jaringan Tumbuhan',
    description: 'Epidermis, palisade, xilem, floem, stomata, kolenkim, meristem, dan akar',
    questionCount: 13,
  },
  {
    id: 'rangka',
    label: 'Sistem Rangka Manusia',
    shortLabel: 'Sistem Rangka',
    description: 'Fungsi rangka, bentuk tulang, jenis sendi, sumsum tulang, dan kelainan tulang',
    questionCount: 13,
  },
];

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question:
      'Zat yang ditambahkan ke dalam makanan untuk memperbaiki rasa, warna, tekstur, atau memperpanjang masa simpan disebut ...',
    options: [
      { key: 'A', text: 'zat adiktif' },
      { key: 'B', text: 'zat aditif' },
      { key: 'C', text: 'zat psikotropika' },
      { key: 'D', text: 'zat gizi' },
    ],
    answer: 'B',
    hint: 'Perhatikan perbedaan antara bahan tambahan pangan ("add") dan zat yang menyebabkan ketergantungan.',
    explanation:
      'Zat aditif adalah bahan yang sengaja ditambahkan ke dalam makanan/minuman dalam jumlah kecil untuk memperbaiki penampilan, cita rasa, tekstur, atau daya simpan.',
  },
  {
    id: 2,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question: 'Warna kuning pada nasi kuning secara alami diperoleh dari ...',
    options: [
      { key: 'A', text: 'daun suji' },
      { key: 'B', text: 'buah bit' },
      { key: 'C', text: 'Kunyit' },
      { key: 'D', text: 'karamel' },
    ],
    answer: 'C',
    hint: 'Rimpang dapur yang mengandung pigmen alami kurkumin berwarna kuning cerah.',
    explanation:
      'Kunyit mengandung zat warna alami kurkumin yang menghasilkan warna kuning khas pada nasi kuning sekaligus memberi aroma rempah.',
  },
  {
    id: 3,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question: 'Berikut yang termasuk pemanis buatan adalah ...',
    options: [
      { key: 'A', text: 'Sakarin' },
      { key: 'B', text: 'madu' },
      { key: 'C', text: 'gula aren' },
      { key: 'D', text: 'gula tebu' },
    ],
    answer: 'A',
    hint: 'Tiga pilihan lainnya berasal langsung dari alam (lebah atau tumbuhan).',
    explanation:
      'Sakarin adalah pemanis buatan (sintetis) dengan tingkat kemanisan ratusan kali lebih tinggi dari gula pasir, sedangkan madu, gula aren, dan gula tebu adalah pemanis alami.',
  },
  {
    id: 4,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question: 'Monosodium glutamat (MSG) merupakan zat aditif yang berfungsi sebagai ...',
    options: [
      { key: 'A', text: 'pemanis' },
      { key: 'B', text: 'pewarna' },
      { key: 'C', text: 'pengawet' },
      { key: 'D', text: 'penyedap rasa' },
    ],
    answer: 'D',
    hint: 'Zat ini memberikan cita rasa gurih (umami) pada masakan.',
    explanation:
      'MSG (Monosodium glutamat) adalah penyedap rasa buatan yang memperkuat cita rasa gurih (umami) pada makanan.',
  },
  {
    id: 5,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question: 'Bahan berikut yang termasuk pengawet alami adalah ...',
    options: [
      { key: 'A', text: 'formalin' },
      { key: 'B', text: 'boraks' },
      { key: 'C', text: 'garam dapur' },
      { key: 'D', text: 'rhodamin B' },
    ],
    answer: 'C',
    hint: 'Biasa digunakan pada pembuatan ikan asin atau telur asin untuk menghambat pertumbuhan bakteri.',
    explanation:
      'Garam dapur (NaCl) adalah pengawet alami yang menarik air dari sel mikroorganisme sehingga bakteri pembusuk tidak dapat berkembang. Formalin, boraks, dan rhodamin B adalah bahan kimia berbahaya/terlarang.',
  },
  {
    id: 6,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question: 'Zat berikut yang dilarang digunakan sebagai bahan tambahan makanan adalah ...',
    options: [
      { key: 'A', text: 'rhodamin B' },
      { key: 'B', text: 'asam sitrat' },
      { key: 'C', text: 'natrium benzoat' },
      { key: 'D', text: 'vanili' },
    ],
    answer: 'A',
    hint: 'Zat ini sebenarnya adalah pewarna tekstil merah keunguan yang bersifat karsinogenik.',
    explanation:
      'Rhodamin B merupakan pewarna sintetis untuk industri tekstil dan kertas yang dilarang keras ditambahkan pada pangan karena bersifat racun dan dapat memicu kerusakan hati serta kanker.',
  },
  {
    id: 7,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question: 'Konsumsi minuman beralkohol secara berlebihan dalam jangka panjang dapat merusak organ ...',
    options: [
      { key: 'A', text: 'Tulang' },
      { key: 'B', text: 'kulit' },
      { key: 'C', text: 'Rambut' },
      { key: 'D', text: 'hati' },
    ],
    answer: 'D',
    hint: 'Organ utama dalam sistem ekskresi dan pencernaan yang bertugas menetralkan racun dalam tubuh.',
    explanation:
      'Hati (liver) bertugas memecah dan menetralkan alkohol. Konsumsi alkohol berlebih memicu perlemakan hati, peradangan, hingga sirosis (pengerasan hati).',
  },
  {
    id: 8,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question: 'Zat dalam rokok yang menyebabkan perokok mengalami ketagihan adalah ...',
    options: [
      { key: 'A', text: 'tar' },
      { key: 'B', text: 'nikotin' },
      { key: 'C', text: 'karbon monoksida' },
      { key: 'D', text: 'amonia' },
    ],
    answer: 'B',
    hint: 'Alkaloid stimulan yang memicu pelepasan dopamin di otak sehingga menimbulkan kecanduan.',
    explanation:
      'Nikotin adalah zat adiktif dalam tembakau yang merangsang sistem saraf pusat dan menimbulkan efek ketagihan/adiksi. Tar memicu kanker paru-paru, sedangkan karbon monoksida mengikat hemoglobin.',
  },
  {
    id: 9,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question: 'Panjang lintasan yang ditempuh suatu benda selama bergerak disebut ...',
    options: [
      { key: 'A', text: 'perpindahan' },
      { key: 'B', text: 'jarak' },
      { key: 'C', text: 'kecepatan' },
      { key: 'D', text: 'percepatan' },
    ],
    answer: 'B',
    hint: 'Besaran skalar yang menghitung seluruh jejak langkah benda tanpa memperhatikan arah.',
    explanation:
      'Jarak adalah panjang seluruh lintasan yang ditempuh benda selama bergerak (besaran skalar), sedangkan perpindahan adalah perubahan posisi dari titik awal ke titik akhir (besaran vektor).',
  },
  {
    id: 10,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question:
      'Andi berlari 40 m ke timur, kemudian berbalik 30 m ke barat. Jarak dan perpindahan yang ditempuh Andi berturut-turut adalah ...',
    options: [
      { key: 'A', text: '70 m dan 10 m' },
      { key: 'B', text: '10 m dan 70 m' },
      { key: 'C', text: '70 m dan 70 m' },
      { key: 'D', text: '10 m dan 10 m' },
    ],
    answer: 'A',
    hint: 'Jarak = total lintasan (jumlahkan keduanya). Perpindahan = selisih posisi akhir terhadap posisi awal.',
    explanation:
      'Jarak total = 40 m + 30 m = 70 m. Karena Andi berbalik arah, perpindahannya = 40 m − 30 m = 10 m ke arah timur.',
    diagram: 'distance-displacement',
  },
  {
    id: 11,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question:
      'Sebuah mobil menempuh jarak 180 km dalam waktu 3 jam. Kelajuan rata-rata mobil tersebut adalah ...',
    options: [
      { key: 'A', text: '540 km/jam' },
      { key: 'B', text: '90 km/jam' },
      { key: 'C', text: '60 km/jam' },
      { key: 'D', text: '30 km/jam' },
    ],
    answer: 'C',
    hint: 'Gunakan rumus kelajuan rata-rata: v = s / t.',
    explanation: 'Kelajuan rata-rata v = jarak / waktu = 180 km / 3 jam = 60 km/jam.',
  },
  {
    id: 12,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question:
      'Sebuah sepeda motor bergerak dengan kecepatan 2 m/s, lalu dipercepat hingga 10 m/s dalam waktu 4 sekon. Percepatan sepeda motor tersebut adalah ...',
    options: [
      { key: 'A', text: '1 m/s²' },
      { key: 'B', text: '2 m/s²' },
      { key: 'C', text: '3 m/s²' },
      { key: 'D', text: '4 m/s²' },
    ],
    answer: 'B',
    hint: 'Percepatan adalah perubahan kecepatan dibagi selang waktu: a = (vt − v0) / t.',
    explanation: 'a = (10 m/s − 2 m/s) / 4 s = 8 / 4 = 2 m/s².',
  },
  {
    id: 13,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question: 'Penumpang bus terdorong ke depan ketika bus direm mendadak. Peristiwa ini sesuai dengan ...',
    options: [
      { key: 'A', text: 'Hukum Gravitasi' },
      { key: 'B', text: 'Hukum II Newton' },
      { key: 'C', text: 'Hukum I Newton' },
      { key: 'D', text: 'Hukum III Newton' },
    ],
    answer: 'C',
    hint: 'Hukum kelembaman (inersia): benda cenderung mempertahankan keadaan geraknya.',
    explanation:
      'Sesuai Hukum I Newton (kelembaman), tubuh penumpang cenderung mempertahankan gerak majunya ketika bus tiba-tiba berhenti sehingga terdorong ke depan.',
  },
  {
    id: 14,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question: 'Gaya sebesar 20 N bekerja pada benda bermassa 5 kg. Percepatan benda tersebut adalah ...',
    options: [
      { key: 'A', text: '100 m/s²' },
      { key: 'B', text: '25 m/s²' },
      { key: 'C', text: '15 m/s²' },
      { key: 'D', text: '4 m/s²' },
    ],
    answer: 'D',
    hint: 'Menurut Hukum II Newton: F = m × a, sehingga a = F / m.',
    explanation: 'Berdasarkan Hukum II Newton, a = F / m = 20 N / 5 kg = 4 m/s².',
  },
  {
    id: 15,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question:
      'Benda bermassa 4 kg bergerak dengan percepatan 3 m/s². Besar gaya yang bekerja pada benda tersebut adalah ...',
    options: [
      { key: 'A', text: '12 N' },
      { key: 'B', text: '7 N' },
      { key: 'C', text: '1,3 N' },
      { key: 'D', text: '0,75 N' },
    ],
    answer: 'A',
    hint: 'Gunakan rumus Hukum II Newton: F = m × a.',
    explanation: 'F = m × a = 4 kg × 3 m/s² = 12 N.',
  },
  {
    id: 16,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question: 'Contoh peristiwa yang sesuai dengan Hukum III Newton (aksi-reaksi) adalah ...',
    options: [
      { key: 'A', text: 'bola menggelinding lalu berhenti karena gesekan' },
      { key: 'B', text: 'roket meluncur karena gas disemburkan ke belakang' },
      { key: 'C', text: 'buku diam di atas meja' },
      { key: 'D', text: 'mobil bergerak makin cepat saat gas ditekan' },
    ],
    answer: 'B',
    hint: 'Cari peristiwa dua benda yang saling memberi gaya sama besar dan berlawanan arah.',
    explanation:
      'Roket menyemburkan gas ke belakang (gaya aksi) dan gas mendorong roket maju ke depan/atas dengan besar gaya sama dan arah berlawanan (gaya reaksi), sesuai Hukum III Newton.',
  },
  {
    id: 17,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question: 'Gaya gesek yang terjadi antara benda dan permukaan yang dilaluinya memiliki arah ...',
    options: [
      { key: 'A', text: 'tegak lurus bidang' },
      { key: 'B', text: 'searah dengan gerak benda' },
      { key: 'C', text: 'ke bawah' },
      { key: 'D', text: 'berlawanan dengan arah gerak benda' },
    ],
    answer: 'D',
    hint: 'Gaya gesek bersifat menghambat laju benda yang sedang bergerak atau akan bergerak.',
    explanation:
      'Gaya gesek selalu bekerja sejajar bidang sentuh dan berlawanan arah dengan kecenderungan gerak atau arah gerak benda.',
  },
  {
    id: 18,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question:
      'Dua gaya bekerja pada sebuah benda dalam satu garis lurus: 30 N ke kanan dan 20 N ke kiri. Resultan gayanya adalah ...',
    options: [
      { key: 'A', text: '50 N ke kanan' },
      { key: 'B', text: '10 N ke kiri' },
      { key: 'C', text: '10 N ke kanan' },
      { key: 'D', text: '50 N ke kiri' },
    ],
    answer: 'C',
    hint: 'Dua gaya berlawanan arah saling mengurangi, dan arah resultan mengikuti gaya yang lebih besar.',
    explanation:
      'Resultan R = 30 N (kanan) − 20 N (kiri) = 10 N ke arah kanan (mengikuti gaya yang lebih besar).',
    diagram: 'resultant-force',
  },
  {
    id: 19,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question:
      'Seorang anak mendorong meja dengan gaya 50 N hingga meja berpindah sejauh 4 m searah gaya. Usaha yang dilakukan anak adalah ...',
    options: [
      { key: 'A', text: '200 J' },
      { key: 'B', text: '54 J' },
      { key: 'C', text: '46 J' },
      { key: 'D', text: '12,5 J' },
    ],
    answer: 'A',
    hint: 'Rumus usaha adalah W = F × s.',
    explanation: 'Usaha W = F × s = 50 N × 4 m = 200 Joule.',
  },
  {
    id: 20,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question: 'Sebuah mesin melakukan usaha 600 J dalam waktu 20 sekon. Daya mesin tersebut adalah ...',
    options: [
      { key: 'A', text: '12.000 W' },
      { key: 'B', text: '30 W' },
      { key: 'C', text: '580 W' },
      { key: 'D', text: '620 W' },
    ],
    answer: 'B',
    hint: 'Daya adalah laju usaha tiap satuan waktu: P = W / t.',
    explanation: 'Daya P = W / t = 600 J / 20 s = 30 Watt.',
  },
  {
    id: 21,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question: 'Peristiwa berikut yang tidak menghasilkan usaha dalam pengertian fisika adalah ...',
    options: [
      { key: 'A', text: 'menarik gerobak sejauh 10 m' },
      { key: 'B', text: 'mengangkat buku ke atas rak' },
      { key: 'C', text: 'mendorong mobil mogok hingga bergeser' },
      { key: 'D', text: 'mendorong tembok beton hingga lelah, tetapi tembok tetap diam' },
    ],
    answer: 'D',
    hint: 'Dalam fisika, usaha W = F × s bernilai nol jika perpindahan (s) sama dengan nol.',
    explanation:
      'Meskipun gaya dikerahkan hingga lelah, tembok tidak mengalami perpindahan (s = 0 m), sehingga usaha W = F × 0 = 0 J.',
  },
  {
    id: 22,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question: 'Satuan daya dalam Sistem Internasional (SI) adalah ...',
    options: [
      { key: 'A', text: 'joule' },
      { key: 'B', text: 'newton' },
      { key: 'C', text: 'watt' },
      { key: 'D', text: 'pascal' },
    ],
    answer: 'C',
    hint: 'Dinamai dari ilmuwan James Watt (1 J/s).',
    explanation:
      'Satuan SI untuk daya adalah watt (W) atau J/s. Joule untuk usaha/energi, newton untuk gaya, dan pascal untuk tekanan.',
  },
  {
    id: 23,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question: 'Sebuah pompa air berdaya 200 W bekerja selama 30 sekon. Usaha yang dilakukan pompa tersebut adalah ...',
    options: [
      { key: 'A', text: '6,67 J' },
      { key: 'B', text: '230 J' },
      { key: 'C', text: '170 J' },
      { key: 'D', text: '6.000 J' },
    ],
    answer: 'D',
    hint: 'Dari rumus P = W / t, maka W = P × t.',
    explanation: 'W = P × t = 200 W × 30 s = 6.000 Joule.',
  },
  {
    id: 24,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question:
      'Berikut ini yang termasuk contoh tuas jenis pertama (titik tumpu berada di antara beban dan kuasa) adalah ...',
    options: [
      { key: 'A', text: 'pinset' },
      { key: 'B', text: 'jungkat-jungkit' },
      { key: 'C', text: 'gerobak beroda satu' },
      { key: 'D', text: 'pembuka botol' },
    ],
    answer: 'B',
    hint: 'Alat bermain di taman yang bertumpu tepat di tengah papannya.',
    explanation:
      'Jungkat-jungkit memiliki titik tumpu di tengah antara beban dan kuasa (tuas jenis I). Gerobak beroda satu dan pembuka botol adalah jenis II, sedangkan pinset jenis III.',
    diagram: 'lever',
  },
  {
    id: 25,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question:
      'Untuk mengangkat beban 300 N digunakan tuas dengan gaya kuasa 100 N. Keuntungan mekanis tuas tersebut adalah ...',
    options: [
      { key: 'A', text: '3' },
      { key: 'B', text: '0,33' },
      { key: 'C', text: '200' },
      { key: 'D', text: '400' },
    ],
    answer: 'A',
    hint: 'Keuntungan mekanis KM = Berat Beban (w) / Gaya Kuasa (F).',
    explanation: 'KM = w / F = 300 N / 100 N = 3.',
  },
  {
    id: 26,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question:
      'Sebuah tuas dalam keadaan seimbang. Beban 60 N berada pada lengan beban 20 cm, sedangkan lengan kuasa 60 cm. Besar gaya kuasa yang diperlukan adalah ...',
    options: [
      { key: 'A', text: '180 N' },
      { key: 'B', text: '60 N' },
      { key: 'C', text: '20 N' },
      { key: 'D', text: '10 N' },
    ],
    answer: 'C',
    hint: 'Persamaan kesetimbangan tuas: w × Lb = F × Lk.',
    explanation: 'F × Lk = w × Lb → F × 60 cm = 60 N × 20 cm → F = 1.200 / 60 = 20 N.',
    diagram: 'lever',
  },
  {
    id: 27,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question: 'Keuntungan mekanis katrol tetap adalah ...',
    options: [
      { key: 'A', text: '0,5' },
      { key: 'B', text: '2' },
      { key: 'C', text: '4' },
      { key: 'D', text: '1' },
    ],
    answer: 'D',
    hint: 'Katrol tetap hanya mengubah arah gaya tarik ke bawah, tanpa memperkecil besar gaya yang dibutuhkan.',
    explanation:
      'Pada katrol tetap tunggal, besar gaya kuasa sama dengan berat beban (F = w), sehingga keuntungan mekanisnya KM = 1.',
    diagram: 'pulley',
  },
  {
    id: 28,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question:
      'Beban 100 N diangkat menggunakan sebuah katrol bergerak (ideal, tanpa gesekan). Gaya kuasa yang diperlukan adalah ...',
    options: [
      { key: 'A', text: '100 N' },
      { key: 'B', text: '50 N' },
      { key: 'C', text: '200 N' },
      { key: 'D', text: '25 N' },
    ],
    answer: 'B',
    hint: 'Katrol bergerak ditopang oleh 2 segmen tali sehingga keuntungan mekanisnya bernilai 2.',
    explanation:
      'Katrol bergerak memiliki KM = 2, maka gaya kuasa F = w / 2 = 100 N / 2 = 50 N.',
    diagram: 'pulley',
  },
  {
    id: 29,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question:
      'Pada bidang miring dengan ketinggian yang sama, semakin landai (panjang) bidang miring tersebut maka gaya kuasa yang diperlukan ...',
    options: [
      { key: 'A', text: 'semakin kecil' },
      { key: 'B', text: 'semakin besar' },
      { key: 'C', text: 'tetap' },
      { key: 'D', text: 'menjadi nol' },
    ],
    answer: 'A',
    hint: 'Perhatikan rumus KM bidang miring = s / h. Jika panjang lintasan (s) makin besar, beban makin ringan didorong.',
    explanation:
      'Semakin panjang/landai bidang miring (s besar, h tetap), keuntungan mekanis s/h makin besar sehingga gaya dorong yang diperlukan semakin kecil.',
    diagram: 'inclined-plane',
  },
  {
    id: 30,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question:
      'Sebuah papan sepanjang 4 m digunakan sebagai bidang miring untuk memindahkan drum 400 N ke bak truk setinggi 1 m. Gaya minimum yang diperlukan adalah ...',
    options: [
      { key: 'A', text: '1.600 N' },
      { key: 'B', text: '400 N' },
      { key: 'C', text: '100 N' },
      { key: 'D', text: '25 N' },
    ],
    answer: 'C',
    hint: 'Gunakan persamaan bidang miring: F / w = h / s.',
    explanation: 'F = (h / s) × w = (1 m / 4 m) × 400 N = 100 N.',
    diagram: 'inclined-plane',
  },
  {
    id: 31,
    topic: 'tumbuhan',
    topicLabel: 'Struktur & Jaringan Tumbuhan',
    question: 'Jaringan yang berfungsi mengangkut air dan mineral dari akar ke daun adalah ...',
    options: [
      { key: 'A', text: 'floem' },
      { key: 'B', text: 'xilem' },
      { key: 'C', text: 'epidermis' },
      { key: 'D', text: 'parenkim' },
    ],
    answer: 'B',
    hint: 'Pembuluh kayu yang mengalirkan air satu arah ke atas menuju daun.',
    explanation:
      'Xilem (pembuluh kayu) mengangkut air dan garam mineral dari akar menuju batang dan daun untuk proses fotosintesis.',
    diagram: 'plant-tissue',
  },
  {
    id: 32,
    topic: 'tumbuhan',
    topicLabel: 'Struktur & Jaringan Tumbuhan',
    question: 'Hasil fotosintesis diangkut dari daun ke seluruh bagian tubuh tumbuhan oleh ...',
    options: [
      { key: 'A', text: 'xilem' },
      { key: 'B', text: 'kambium' },
      { key: 'C', text: 'floem' },
      { key: 'D', text: 'gabus' },
    ],
    answer: 'C',
    hint: 'Ingat huruf depannya: "F" untuk mengangkut hasil "Fotosintesis" (pembuluh tapis).',
    explanation:
      'Floem (pembuluh tapis) berfungsi mengedarkan zat makanan hasil fotosintesis dari daun ke seluruh bagian tubuh tumbuhan.',
    diagram: 'plant-tissue',
  },
  {
    id: 33,
    topic: 'tumbuhan',
    topicLabel: 'Struktur & Jaringan Tumbuhan',
    question: 'Pertukaran gas dan penguapan air pada daun terjadi melalui ...',
    options: [
      { key: 'A', text: 'kutikula' },
      { key: 'B', text: 'xilem' },
      { key: 'C', text: 'rambut akar' },
      { key: 'D', text: 'stomata' },
    ],
    answer: 'D',
    hint: 'Celah mikroskopis ("mulut daun") yang dijaga oleh sepasang sel penutup.',
    explanation:
      'Stomata (mulut daun) adalah celah pada epidermis daun yang mengatur pertukaran gas (CO₂ dan O₂) serta penguapan air (transpirasi).',
    diagram: 'plant-tissue',
  },
  {
    id: 34,
    topic: 'tumbuhan',
    topicLabel: 'Struktur & Jaringan Tumbuhan',
    question:
      'Jaringan yang selnya aktif membelah sehingga tumbuhan dapat bertambah panjang dan besar adalah ...',
    options: [
      { key: 'A', text: 'meristem' },
      { key: 'B', text: 'parenkim' },
      { key: 'C', text: 'epidermis' },
      { key: 'D', text: 'kolenkim' },
    ],
    answer: 'A',
    hint: 'Jaringan muda yang terdapat di ujung akar, ujung batang, dan kambium.',
    explanation:
      'Jaringan meristem tersusun atas sel-sel yang terus aktif membelah secara mitosis untuk pertumbuhan primer (memanjang) dan sekunder (membesar).',
  },
  {
    id: 35,
    topic: 'tumbuhan',
    topicLabel: 'Struktur & Jaringan Tumbuhan',
    question: 'Rambut akar berfungsi untuk ...',
    options: [
      { key: 'A', text: 'melakukan fotosintesis' },
      { key: 'B', text: 'menyimpan cadangan makanan' },
      { key: 'C', text: 'memperluas bidang penyerapan air dan mineral' },
      { key: 'D', text: 'menguapkan air' },
    ],
    answer: 'C',
    hint: 'Modifikasi sel epidermis akar berbentuk tonjolan halus yang kontak langsung dengan tanah.',
    explanation:
      'Rambut akar adalah perluasan sel epidermis akar yang memperbesar luas permukaan penyerapan air dan zat hara dari dalam tanah.',
  },
  {
    id: 36,
    topic: 'rangka',
    topicLabel: 'Sistem Rangka Manusia',
    question: 'Fungsi utama rangka pada tubuh manusia adalah ...',
    options: [
      { key: 'A', text: 'mengatur suhu tubuh' },
      { key: 'B', text: 'menopang tubuh dan melindungi organ dalam' },
      { key: 'C', text: 'mencerna makanan' },
      { key: 'D', text: 'mengedarkan darah' },
    ],
    answer: 'B',
    hint: 'Contohnya tulang rusuk melindungi jantung & paru-paru, serta tulang belakang menegakkan badan.',
    explanation:
      'Rangka memberi bentuk dan menopang tubuh, melindungi organ vital (otak, jantung, paru-paru), menjadi tempat melekatnya otot, serta membentuk sel darah di sumsum tulang.',
  },
  {
    id: 37,
    topic: 'rangka',
    topicLabel: 'Sistem Rangka Manusia',
    question: 'Contoh tulang pipih adalah ...',
    options: [
      { key: 'A', text: 'tulang belikat' },
      { key: 'B', text: 'tulang paha' },
      { key: 'C', text: 'tulang jari' },
      { key: 'D', text: 'tulang betis' },
    ],
    answer: 'A',
    hint: 'Berbentuk lempengan lebar dan tipis di bagian punggung atas.',
    explanation:
      'Tulang belikat, tulang dada, tulang rusuk, dan tulang tengkorak merupakan contoh tulang pipih. Tulang paha, betis, dan jari termasuk tulang pipa.',
  },
  {
    id: 38,
    topic: 'rangka',
    topicLabel: 'Sistem Rangka Manusia',
    question: 'Tulang-tulang tengkorak berhubungan satu sama lain melalui sendi ...',
    options: [
      { key: 'A', text: 'peluru' },
      { key: 'B', text: 'pelana' },
      { key: 'C', text: 'engsel' },
      { key: 'D', text: 'mati (tidak dapat digerakkan)' },
    ],
    answer: 'D',
    hint: 'Disebut juga sinartrosis (sutura) karena menyatu rapat melindungi otak.',
    explanation:
      'Tulang-tulang penyusun tengkorak dihubungkan oleh sendi mati (sinartrosis) berupa sutura sehingga tidak dapat digerakkan.',
    diagram: 'skull-joint',
  },
  {
    id: 39,
    topic: 'rangka',
    topicLabel: 'Sistem Rangka Manusia',
    question: 'Berikut ini yang BUKAN jenis dari tulang rawan adalah ...',
    options: [
      { key: 'A', text: 'Hialin' },
      { key: 'B', text: 'Elastis' },
      { key: 'C', text: 'Fibrosa' },
      { key: 'D', text: 'Fiolin' },
    ],
    answer: 'D',
    hint: 'Tiga jenis tulang rawan (kartilago) yang benar terdapat di sendi, daun telinga, dan antar-ruas tulang belakang.',
    explanation:
      'Tulang rawan (kartilago) terdiri atas tiga jenis: tulang rawan hialin, elastis, dan fibrosa. "Fiolin" bukan merupakan jenis tulang rawan.',
  },
  {
    id: 40,
    topic: 'rangka',
    topicLabel: 'Sistem Rangka Manusia',
    question: 'Penyakit pengeroposan tulang pada usia lanjut akibat kekurangan kalsium disebut ...',
    options: [
      { key: 'A', text: 'rakhitis' },
      { key: 'B', text: 'skoliosis' },
      { key: 'C', text: 'osteoporosis' },
      { key: 'D', text: 'fraktur' },
    ],
    answer: 'C',
    hint: 'Berasal dari kata "osteo" (tulang) dan "poros" (berpori/keropos).',
    explanation:
      'Osteoporosis adalah kondisi menurunnya kepadatan tulang sehingga tulang menjadi keropos dan rapuh akibat kekurangan kalsium. Rakhitis akibat kurang vitamin D, skoliosis adalah kelainan tulang belakang melengkung ke samping, dan fraktur adalah patah tulang.',
  },
  // --- 20 Soal Tambahan Setipe (41–60) ---
  {
    id: 41,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question: 'Pewarna alami yang sering digunakan untuk memberi warna hijau pada kue tradisional adalah ...',
    options: [
      { key: 'A', text: 'daun suji dan pandan' },
      { key: 'B', text: 'tartrazin' },
      { key: 'C', text: 'buah naga merah' },
      { key: 'D', text: 'kuning kunyit' },
    ],
    answer: 'A',
    hint: 'Mengandung pigmen hijau klorofil sekaligus memberi aroma harum khas jajanan pasar.',
    explanation:
      'Daun suji dan daun pandan mengandung pigmen klorofil alami untuk warna hijau pada makanan, sedangkan tartrazin adalah pewarna kuning sintetis.',
  },
  {
    id: 42,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question: 'Selain sakarin, bahan berikut yang tergolong pemanis buatan rendah kalori adalah ...',
    options: [
      { key: 'A', text: 'gula kelapa' },
      { key: 'B', text: 'aspartam' },
      { key: 'C', text: 'sirup fruktosa tebu' },
      { key: 'D', text: 'madu hutan' },
    ],
    answer: 'B',
    hint: 'Sering digunakan pada minuman bebas gula atau permen bebas kalori.',
    explanation:
      'Aspartam adalah pemanis buatan (sintetis) dengan tingkat kemanisan sekitar 200 kali gula pasir dan sangat rendah kalori, sedangkan gula kelapa, tebu, dan madu adalah pemanis alami.',
  },
  {
    id: 43,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question: 'Bahaya utama gas karbon monoksida (CO) yang terkandung dalam asap rokok bagi tubuh adalah ...',
    options: [
      { key: 'A', text: 'memperkuat tulang belakang' },
      { key: 'B', text: 'meningkatkan penyerapan vitamin' },
      { key: 'C', text: 'mengikat hemoglobin sehingga menghambat pengangkutan oksigen' },
      { key: 'D', text: 'melancarkan pencernaan lambung' },
    ],
    answer: 'C',
    hint: 'Gas ini memiliki daya ikat terhadap sel darah merah jauh lebih kuat dibanding oksigen.',
    explanation:
      'Karbon monoksida (CO) berikatan sangat kuat dengan hemoglobin membentuk karboksihemoglobin, sehingga darah kehilangan kemampuan mengangkut oksigen ke seluruh jaringan tubuh.',
  },
  {
    id: 44,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question: 'Zat pengawet sintetis yang diizinkan pada minuman ringan dalam batas aman adalah ...',
    options: [
      { key: 'A', text: 'boraks' },
      { key: 'B', text: 'formalin' },
      { key: 'C', text: 'metanil yellow' },
      { key: 'D', text: 'natrium benzoat' },
    ],
    answer: 'D',
    hint: 'Garam dari asam benzoat yang efektif menghambat pertumbuhan jamur dan bakteri pada minuman asam.',
    explanation:
      'Natrium benzoat adalah pengawet makanan dan minuman yang diizinkan BPOM dalam batas takaran tertentu. Boraks, formalin, dan metanil yellow dilarang pada pangan.',
  },
  {
    id: 45,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question:
      'Seorang pelari bergerak lurus beraturan dengan kelajuan tetap 6 m/s. Waktu yang diperlukan untuk menempuh jarak 120 m adalah ...',
    options: [
      { key: 'A', text: '20 sekon' },
      { key: 'B', text: '15 sekon' },
      { key: 'C', text: '30 sekon' },
      { key: 'D', text: '720 sekon' },
    ],
    answer: 'A',
    hint: 'Gunakan rumus gerak lurus beraturan: t = s / v.',
    explanation: 'Waktu tempuh t = jarak / kelajuan = 120 m / 6 m/s = 20 sekon.',
  },
  {
    id: 46,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question:
      'Sebuah mobil bergerak dengan kecepatan 20 m/s, lalu direm hingga kecepatannya turun menjadi 4 m/s dalam waktu 4 sekon. Besar perlambatan mobil tersebut adalah ...',
    options: [
      { key: 'A', text: '6 m/s²' },
      { key: 'B', text: '4 m/s²' },
      { key: 'C', text: '5 m/s²' },
      { key: 'D', text: '2 m/s²' },
    ],
    answer: 'B',
    hint: 'Hitung perubahan kecepatan (20 − 4) lalu bagi dengan selang waktu 4 sekon.',
    explanation:
      'Percepatan a = (4 m/s − 20 m/s) / 4 s = −16 / 4 = −4 m/s², yang berarti mobil mengalami perlambatan sebesar 4 m/s².',
  },
  {
    id: 47,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question:
      'Sebuah benda didorong dengan gaya tetap. Jika massa benda diperbesar menjadi dua kali massa semula, maka percepatan benda menjadi ...',
    options: [
      { key: 'A', text: 'dua kali semula' },
      { key: 'B', text: 'empat kali semula' },
      { key: 'C', text: 'setengah kali semula' },
      { key: 'D', text: 'tetap sama' },
    ],
    answer: 'C',
    hint: 'Perhatikan Hukum II Newton a = F / m: percepatan berbanding terbalik dengan massa benda.',
    explanation:
      'Menurut Hukum II Newton (a = F / m), untuk gaya tetap percepatan berbanding terbalik dengan massa. Jika massa menjadi 2 kali lipat, percepatan menjadi ½ kali semula.',
  },
  {
    id: 48,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question:
      'Dua anak mendorong gerobak ke arah yang sama: gaya pertama 25 N ke timur dan gaya kedua 15 N ke timur. Resultan gaya pada gerobak adalah ...',
    options: [
      { key: 'A', text: '10 N ke timur' },
      { key: 'B', text: '10 N ke barat' },
      { key: 'C', text: '40 N ke barat' },
      { key: 'D', text: '40 N ke timur' },
    ],
    answer: 'D',
    hint: 'Dua gaya yang searah dijumlahkan dan arahnya tetap mengikuti arah kedua gaya.',
    explanation: 'Karena kedua gaya searah ke timur, resultannya R = 25 N + 15 N = 40 N ke timur.',
  },
  {
    id: 49,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question:
      'Contoh alat yang bekerja berdasarkan prinsip tuas jenis kedua (beban berada di antara titik tumpu dan kuasa) adalah ...',
    options: [
      { key: 'A', text: 'gunting' },
      { key: 'B', text: 'gerobak dorong beroda satu' },
      { key: 'C', text: 'sekop' },
      { key: 'D', text: 'tang' },
    ],
    answer: 'B',
    hint: 'Roda di depan berperan sebagai titik tumpu, bak muatan di tengah sebagai beban, dan pegangan tangan di belakang sebagai kuasa.',
    explanation:
      'Gerobak dorong beroda satu memiliki tumpu di roda depan, beban di bak tengah, dan kuasa di gagang belakang (tuas jenis II). Gunting dan tang adalah jenis I, sekop adalah jenis III.',
    diagram: 'lever',
  },
  {
    id: 50,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question:
      'Beban seberat 300 N diangkat menggunakan sistem katrol majemuk dengan keuntungan mekanis 3. Besar gaya kuasa minimum yang dibutuhkan adalah ...',
    options: [
      { key: 'A', text: '100 N' },
      { key: 'B', text: '150 N' },
      { key: 'C', text: '300 N' },
      { key: 'D', text: '900 N' },
    ],
    answer: 'A',
    hint: 'Gunakan persamaan keuntungan mekanis katrol: F = w / KM.',
    explanation: 'Gaya kuasa F = berat beban / KM = 300 N / 3 = 100 N.',
    diagram: 'pulley',
  },
  {
    id: 51,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question:
      'Sebuah kotak bermassa 5 kg diangkat vertikal setinggi 3 m (percepatan gravitasi g = 10 m/s²). Besar usaha yang dilakukan adalah ...',
    options: [
      { key: 'A', text: '15 J' },
      { key: 'B', text: '50 J' },
      { key: 'C', text: '150 J' },
      { key: 'D', text: '300 J' },
    ],
    answer: 'C',
    hint: 'Hitung gaya berat w = m × g terlebih dahulu, lalu kalikan dengan ketinggian h.',
    explanation: 'Berat kotak w = 5 kg × 10 m/s² = 50 N. Usaha W = w × h = 50 N × 3 m = 150 Joule.',
  },
  {
    id: 52,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question:
      'Untuk menaikkan peti 600 N ke atas panggung setinggi 2 m menggunakan gaya dorong 150 N, panjang papan bidang miring yang diperlukan adalah ...',
    options: [
      { key: 'A', text: '4 m' },
      { key: 'B', text: '6 m' },
      { key: 'C', text: '12 m' },
      { key: 'D', text: '8 m' },
    ],
    answer: 'D',
    hint: 'Dari rumus w / F = s / h, cari nilai s = (w / F) × h.',
    explanation: 'Keuntungan mekanis KM = 600 N / 150 N = 4. Karena KM = s / h, maka s = 4 × 2 m = 8 m.',
    diagram: 'inclined-plane',
  },
  {
    id: 53,
    topic: 'tumbuhan',
    topicLabel: 'Struktur & Jaringan Tumbuhan',
    question: 'Jaringan terluar pada daun, batang, dan akar yang berfungsi melindungi jaringan di dalamnya adalah ...',
    options: [
      { key: 'A', text: 'epidermis' },
      { key: 'B', text: 'sklerenkim' },
      { key: 'C', text: 'kambium' },
      { key: 'D', text: 'endodermis' },
    ],
    answer: 'A',
    hint: 'Tersusun rapat selapis sel di permukaan luar organ tumbuhan.',
    explanation:
      'Jaringan epidermis merupakan lapisan sel terluar yang rapat untuk melindungi jaringan di bawahnya dari kerusakan mekanis, kekeringan, dan patogen.',
    diagram: 'plant-tissue',
  },
  {
    id: 54,
    topic: 'tumbuhan',
    topicLabel: 'Struktur & Jaringan Tumbuhan',
    question: 'Pada penampang daun, proses fotosintesis paling banyak berlangsung di jaringan ...',
    options: [
      { key: 'A', text: 'epidermis bawah' },
      { key: 'B', text: 'parenkim palisade (jaringan tiang)' },
      { key: 'C', text: 'xilem' },
      { key: 'D', text: 'kutikula' },
    ],
    answer: 'B',
    hint: 'Sel-selnya berbentuk memanjang tegak rapat dan kaya akan kloroplas.',
    explanation:
      'Jaringan parenkim palisade (jaringan tiang) tepat di bawah epidermis atas memiliki kepadatan kloroplas paling tinggi sehingga menjadi tempat utama fotosintesis.',
  },
  {
    id: 55,
    topic: 'tumbuhan',
    topicLabel: 'Struktur & Jaringan Tumbuhan',
    question: 'Jaringan penyokong yang memberi kekuatan lentur pada organ tumbuhan muda yang masih aktif tumbuh adalah ...',
    options: [
      { key: 'A', text: 'meristem' },
      { key: 'B', text: 'floem' },
      { key: 'C', text: 'kolenkim' },
      { key: 'D', text: 'gabus' },
    ],
    answer: 'C',
    hint: 'Sel-selnya hidup dengan penebalan selulosa di bagian sudut dinding sel.',
    explanation:
      'Jaringan kolenkim merupakan jaringan penguat pada organ tumbuhan yang masih muda dan aktif tumbuh, misalnya pada tangkai daun dan batang muda.',
  },
  {
    id: 56,
    topic: 'tumbuhan',
    topicLabel: 'Struktur & Jaringan Tumbuhan',
    question: 'Lapisan lilin pada permukaan daun yang berfungsi mengurangi penguapan air berlebih disebut ...',
    options: [
      { key: 'A', text: 'stomata' },
      { key: 'B', text: 'lentisel' },
      { key: 'C', text: 'korteks' },
      { key: 'D', text: 'kutikula' },
    ],
    answer: 'D',
    hint: 'Lapisan kedap air yang melapisi dinding luar sel epidermis daun.',
    explanation:
      'Kutikula adalah lapisan zat lilin (kutin) di permukaan luar epidermis daun yang mencegah penguapan air (transpirasi) secara berlebihan.',
    diagram: 'plant-tissue',
  },
  {
    id: 57,
    topic: 'rangka',
    topicLabel: 'Sistem Rangka Manusia',
    question:
      'Persendian yang memungkinkan gerakan bebas ke segala arah seperti pada sendi bahu dan panggul adalah ...',
    options: [
      { key: 'A', text: 'sendi peluru' },
      { key: 'B', text: 'sendi engsel' },
      { key: 'C', text: 'sendi putar' },
      { key: 'D', text: 'sendi geser' },
    ],
    answer: 'A',
    hint: 'Ujung tulang berbentuk bola masuk ke dalam mangkuk tulang lainnya.',
    explanation:
      'Sendi peluru memiliki ujung tulang berbentuk bonggol/bola dan rongga mangkuk sehingga memungkinkan gerakan bebas ke segala arah (misalnya gelang bahu dan panggul).',
  },
  {
    id: 58,
    topic: 'rangka',
    topicLabel: 'Sistem Rangka Manusia',
    question: 'Kelainan tulang belakang yang melengkung terlalu jauh ke arah depan disebut ...',
    options: [
      { key: 'A', text: 'kifosis' },
      { key: 'B', text: 'lordosis' },
      { key: 'C', text: 'skoliosis' },
      { key: 'D', text: 'artritis' },
    ],
    answer: 'B',
    hint: 'Pinggang tampak tertarik ke depan; kebalikan dari kifosis (membungkuk ke belakang).',
    explanation:
      'Lordosis adalah kelainan tulang belakang melengkung ke depan di daerah pinggang. Kifosis melengkung ke belakang (bungkuk), dan skoliosis melengkung ke samping (bentuk S/C).',
  },
  {
    id: 59,
    topic: 'rangka',
    topicLabel: 'Sistem Rangka Manusia',
    question: 'Bagian dalam tulang yang berperan memproduksi sel darah merah dan sel darah putih adalah ...',
    options: [
      { key: 'A', text: 'periosteum' },
      { key: 'B', text: 'tulang rawan' },
      { key: 'C', text: 'sumsum tulang merah' },
      { key: 'D', text: 'ligamen' },
    ],
    answer: 'C',
    hint: 'Jaringan lunak di rongga bagian dalam tulang spons.',
    explanation:
      'Sumsum tulang merah merupakan tempat pembentukan sel-sel darah (hematopoiesis), meliputi sel darah merah, sel darah putih, dan keping darah.',
  },
  {
    id: 60,
    topic: 'rangka',
    topicLabel: 'Sistem Rangka Manusia',
    question: 'Berikut ini yang merupakan contoh tulang pendek pada tubuh manusia adalah ...',
    options: [
      { key: 'A', text: 'tulang lengan atas' },
      { key: 'B', text: 'tulang rusuk' },
      { key: 'C', text: 'tulang tengkorak' },
      { key: 'D', text: 'tulang pergelangan tangan' },
    ],
    answer: 'D',
    hint: 'Berukuran pendek seperti kubus kecil untuk menopang kelenturan gerak pergelangan.',
    explanation:
      'Tulang pergelangan tangan (karpal), pergelangan kaki (tarsal), dan ruas tulang belakang termasuk tulang pendek. Tulang lengan atas adalah tulang pipa, sedangkan rusuk dan tengkorak adalah tulang pipih.',
  },
  // --- 20 Soal Tambahan Bertema Petualangan RPG (61–80) ---
  {
    id: 61,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question:
      'Untuk memulihkan energi di pos perbekalan, seorang Alkemis meracik minuman herbal berwarna merah keunguan alami. Bahan pewarna alami yang tepat adalah ...',
    options: [
      { key: 'A', text: 'buah bit atau buah naga merah' },
      { key: 'B', text: 'rhodamin B' },
      { key: 'C', text: 'tartrazin' },
      { key: 'D', text: 'metanil yellow' },
    ],
    answer: 'A',
    hint: 'Mengandung pigmen alami antosianin/betasianin yang aman dikonsumsi tubuh.',
    explanation:
      'Buah bit dan buah naga merah menghasilkan warna merah keunguan alami yang aman bagi tubuh. Rhodamin B dan metanil yellow adalah pewarna tekstil berbahaya.',
  },
  {
    id: 62,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question:
      'Di pos pemeriksaan jajanan kota, seorang petualang mendeteksi bakso bertekstur sangat kenyal namun berisiko mengandung bahan kimia berbahaya yang dilarang untuk makanan, yaitu ...',
    options: [
      { key: 'A', text: 'natrium klorida' },
      { key: 'B', text: 'boraks' },
      { key: 'C', text: 'asam askorbat' },
      { key: 'D', text: 'karamel' },
    ],
    answer: 'B',
    hint: 'Sering disalahgunakan sebagai pengenyal ilegal padahal sebenarnya bahan pembersih dan solder.',
    explanation:
      'Boraks (natrium tetraborat) merupakan bahan kimia industri yang dilarang keras digunakan sebagai pengenyal atau pengawet makanan karena dapat merusak ginjal dan hati.',
  },
  {
    id: 63,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question:
      'Ramuan penyedap alami yang digunakan juru masak benteng agar sup tetap gurih tanpa tambahan MSG sintetis adalah ...',
    options: [
      { key: 'A', text: 'sakarin dan siklamat' },
      { key: 'B', text: 'formalin dan benzoat' },
      { key: 'C', text: 'bawang putih, kaldu daging, dan daun salam' },
      { key: 'D', text: 'rhodamin B dan vanili sintetis' },
    ],
    answer: 'C',
    hint: 'Berasal dari rempah dan bahan pangan segar di dapur alami.',
    explanation:
      'Bawang putih, kaldu daging, serai, dan daun salam merupakan penyedap rasa alami yang aman dan memperkaya cita rasa masakan.',
  },
  {
    id: 64,
    topic: 'zat-aditif',
    topicLabel: 'Zat Aditif & Zat Adiktif',
    question:
      'Saat menelusuri jalur kabut asap, Penjelajah menghindari zat tar dalam asap rokok karena zat tersebut bersifat karsinogenik yang dapat memicu ...',
    options: [
      { key: 'A', text: 'pertumbuhan tulang lebih cepat' },
      { key: 'B', text: 'peningkatan kadar kalsium darah' },
      { key: 'C', text: 'penyerapan oksigen makin tinggi' },
      { key: 'D', text: 'kanker paru-paru dan penyempitan saluran napas' },
    ],
    answer: 'D',
    hint: 'Tar menempel sebagai residu hitam lengket di alveolus paru-paru.',
    explanation:
      'Tar dalam asap rokok mengandung berbagai senyawa karsinogenik yang mengendap di saluran pernapasan dan memicu kanker paru-paru serta bronkitis kronis.',
  },
  {
    id: 65,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question:
      'Kereta logistik melaju dengan kelajuan tetap 12 m/s di jalur lurus. Jarak yang ditempuh kereta selama 15 sekon adalah ...',
    options: [
      { key: 'A', text: '180 m' },
      { key: 'B', text: '27 m' },
      { key: 'C', text: '1,25 m' },
      { key: 'D', text: '90 m' },
    ],
    answer: 'A',
    hint: 'Gunakan rumus jarak pada Gerak Lurus Beraturan: s = v × t.',
    explanation: 'Jarak tempuh s = v × t = 12 m/s × 15 s = 180 m.',
  },
  {
    id: 66,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question:
      'Agar gerobak senjata bermassa 10 kg mendapat percepatan 2,5 m/s², gaya dorong yang harus dikerahkan Ksatria Mekanika adalah ...',
    options: [
      { key: 'A', text: '4 N' },
      { key: 'B', text: '25 N' },
      { key: 'C', text: '12,5 N' },
      { key: 'D', text: '7,5 N' },
    ],
    answer: 'B',
    hint: 'Terapkan Hukum II Newton: F = m × a.',
    explanation: 'F = m × a = 10 kg × 2,5 m/s² = 25 N.',
  },
  {
    id: 67,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question:
      'Sepatu bot petualang dibuat beralur kasar di bagian sol bawahnya. Tujuan utama desain ini berdasarkan konsep gaya adalah ...',
    options: [
      { key: 'A', text: 'menghilangkan gaya berat tubuh' },
      { key: 'B', text: 'menurunkan massa jenis sepatu' },
      { key: 'C', text: 'memperbesar gaya gesek agar tidak mudah terpeleset' },
      { key: 'D', text: 'mengubah gerak lurus menjadi melingkar' },
    ],
    answer: 'C',
    hint: 'Permukaan kasar meningkatkan cengkeraman kaki terhadap lantai licin.',
    explanation:
      'Alur kasar pada sol sepatu memperbesar gaya gesek antara sepatu dan lintasan sehingga pelari tidak mudah tergelincir saat berbelok cepat.',
  },
  {
    id: 68,
    topic: 'gerak-newton',
    topicLabel: 'Gerak & Hukum Newton',
    question:
      'Saat Ksatria mendayung perahu ke arah belakang, perahu justru meluncur maju ke depan. Peristiwa ini merupakan penerapan ...',
    options: [
      { key: 'A', text: 'Hukum I Newton tentang inersia' },
      { key: 'B', text: 'Hukum Kekekalan Massa' },
      { key: 'C', text: 'Hukum Archimedes saja' },
      { key: 'D', text: 'Hukum III Newton (gaya aksi-reaksi)' },
    ],
    answer: 'D',
    hint: 'Dayung mendorong air ke belakang (aksi), air mendorong dayung dan perahu ke depan (reaksi).',
    explanation:
      'Sesuai Hukum III Newton, gaya aksi dayung mendorong air ke belakang menimbulkan gaya reaksi dari air dengan besar sama yang mendorong perahu maju ke depan.',
  },
  {
    id: 69,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question:
      'Untuk menaikkan peti harta 240 N ke menara setinggi 2 m melalui bidang miring licin sepanjang 6 m, gaya dorong minimum yang dibutuhkan adalah ...',
    options: [
      { key: 'A', text: '80 N' },
      { key: 'B', text: '120 N' },
      { key: 'C', text: '720 N' },
      { key: 'D', text: '40 N' },
    ],
    answer: 'A',
    hint: 'Gunakan rumus bidang miring: F = (h / s) × w.',
    explanation: 'F = (2 m / 6 m) × 240 N = (1/3) × 240 N = 80 N.',
    diagram: 'inclined-plane',
  },
  {
    id: 70,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question:
      'Sebuah katrol mekanis mengangkat batu gerbang dengan usaha sebesar 1.200 J dalam waktu 15 sekon. Daya katrol tersebut adalah ...',
    options: [
      { key: 'A', text: '18.000 W' },
      { key: 'B', text: '80 W' },
      { key: 'C', text: '120 W' },
      { key: 'D', text: '60 W' },
    ],
    answer: 'B',
    hint: 'Daya dihitung dengan membagi usaha terhadap waktu: P = W / t.',
    explanation: 'Daya P = 1.200 J / 15 s = 80 Watt.',
  },
  {
    id: 71,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question:
      'Berikut ini yang merupakan contoh tuas jenis ketiga (kuasa berada di antara titik tumpu dan beban) di perlengkapan petualangan adalah ...',
    options: [
      { key: 'A', text: 'jungkat-jungkit' },
      { key: 'B', text: 'linggis pengungkit batu' },
      { key: 'C', text: 'pinset penjepit spesimen' },
      { key: 'D', text: 'pembuka tutup botol' },
    ],
    answer: 'C',
    hint: 'Pangkal alat sebagai tumpu, jari menekan di tengah sebagai kuasa, dan ujung menjepit beban.',
    explanation:
      'Pinset bekerja dengan prinsip tuas jenis ketiga karena gaya kuasa (tekanan jari) terletak di antara titik tumpu di pangkal dan beban di ujung penjepit.',
    diagram: 'lever',
  },
  {
    id: 72,
    topic: 'usaha-pesawat',
    topicLabel: 'Usaha, Daya & Pesawat Sederhana',
    question:
      'Sebuah pengungkit seimbang menahan batu 150 N pada lengan beban 40 cm. Jika panjang lengan kuasa 120 cm, gaya kuasa yang diperlukan adalah ...',
    options: [
      { key: 'A', text: '450 N' },
      { key: 'B', text: '150 N' },
      { key: 'C', text: '75 N' },
      { key: 'D', text: '50 N' },
    ],
    answer: 'D',
    hint: 'Gunakan persamaan kesetimbangan tuas: F × Lk = w × Lb.',
    explanation: 'F × 120 cm = 150 N × 40 cm → F = 6.000 / 120 = 50 N.',
    diagram: 'lever',
  },
  {
    id: 73,
    topic: 'tumbuhan',
    topicLabel: 'Struktur & Jaringan Tumbuhan',
    question:
      'Saat melewati Hutan Klorofil pada siang hari yang terik, daun menggulung atau menutup sebagian celah udaranya untuk mengurangi penguapan. Struktur yang menutup tersebut adalah ...',
    options: [
      { key: 'A', text: 'stomata' },
      { key: 'B', text: 'xilem' },
      { key: 'C', text: 'floem' },
      { key: 'D', text: 'kambium' },
    ],
    answer: 'A',
    hint: 'Celah pada epidermis daun yang diapit oleh dua sel penjaga.',
    explanation:
      'Sel penjaga akan mengempis saat kekurangan air sehingga celah stomata menutup dan mengurangi laju penguapan (transpirasi) berlebih.',
    diagram: 'plant-tissue',
  },
  {
    id: 74,
    topic: 'tumbuhan',
    topicLabel: 'Struktur & Jaringan Tumbuhan',
    question:
      'Penjelajah menemukan batang pohon tua di hutan memiliki lingkaran tahun dan terus membesar ke samping. Aktivitas pembelahan ini dilakukan oleh jaringan ...',
    options: [
      { key: 'A', text: 'epidermis' },
      { key: 'B', text: 'kambium (meristem sekunder)' },
      { key: 'C', text: 'parenkim spons' },
      { key: 'D', text: 'kutikula' },
    ],
    answer: 'B',
    hint: 'Terletak di antara berkas pembuluh xilem dan floem pada tumbuhan dikotil.',
    explanation:
      'Kambium adalah jaringan meristem sekunder pada tumbuhan dikotil yang membelah ke arah dalam membentuk xilem sekunder dan ke luar membentuk floem sekunder sehingga batang membesar.',
  },
  {
    id: 75,
    topic: 'tumbuhan',
    topicLabel: 'Struktur & Jaringan Tumbuhan',
    question:
      'Jaringan dasar tumbuhan yang berfungsi menyimpan cadangan makanan berupa pati (amilum) pada umbi kentang dan singkong adalah ...',
    options: [
      { key: 'A', text: 'sklerenkim' },
      { key: 'B', text: 'epidermis' },
      { key: 'C', text: 'parenkim penimbun' },
      { key: 'D', text: 'xilem' },
    ],
    answer: 'C',
    hint: 'Sering disebut jaringan dasar karena mengisi sebagian besar organ tumbuhan.',
    explanation:
      'Parenkim penimbun memiliki vakuola besar untuk menyimpan cadangan makanan seperti amilum, protein, atau lemak di akar, umbi, dan biji.',
  },
  {
    id: 76,
    topic: 'tumbuhan',
    topicLabel: 'Struktur & Jaringan Tumbuhan',
    question:
      'Pada ujung akar yang menembus tanah berbatu, terdapat struktur pelindung ujung meristem akar agar tidak rusak saat memanjang, yaitu ...',
    options: [
      { key: 'A', text: 'stomata' },
      { key: 'B', text: 'lenti sel' },
      { key: 'C', text: 'kutikula' },
      { key: 'D', text: 'kaliptra (tudung akar)' },
    ],
    answer: 'D',
    hint: 'Menyelubungi titik tumbuh paling ujung pada akar dan menghasilkan lendir pelicin.',
    explanation:
      'Kaliptra (tudung akar) melindungi sel-sel meristem apikal di ujung akar saat menembus partikel tanah yang keras.',
  },
  {
    id: 77,
    topic: 'rangka',
    topicLabel: 'Sistem Rangka Manusia',
    question:
      'Ketika pelari menekuk lutut dan siku saat melompati rintangan lintasan, persendian yang bekerja dengan gerakan satu arah tersebut adalah ...',
    options: [
      { key: 'A', text: 'sendi engsel' },
      { key: 'B', text: 'sendi peluru' },
      { key: 'C', text: 'sendi putar' },
      { key: 'D', text: 'sendi mati' },
    ],
    answer: 'A',
    hint: 'Gerakannya mirip engsel pintu yang hanya membuka dan menutup ke satu arah.',
    explanation:
      'Sendi engsel pada siku dan lutut memungkinkan gerakan satu arah (menekuk dan meluruskan), mirip cara kerja engsel pintu.',
  },
  {
    id: 78,
    topic: 'rangka',
    topicLabel: 'Sistem Rangka Manusia',
    question:
      'Saat pelari menolehkan kepala ke kiri dan ke kanan untuk melihat jalur, hubungan antara tulang tengkorak (atlas) dan tulang pemutar bekerja menggunakan ...',
    options: [
      { key: 'A', text: 'sendi pelana' },
      { key: 'B', text: 'sendi putar' },
      { key: 'C', text: 'sendi engsel' },
      { key: 'D', text: 'sendi geser' },
    ],
    answer: 'B',
    hint: 'Satu tulang bertindak sebagai poros tempat tulang lain berotasi.',
    explanation:
      'Sendi putar menghubungkan tulang atlas (leher teratas) dengan tulang aksis sehingga kepala dapat berputar ke kiri dan ke kanan.',
  },
  {
    id: 79,
    topic: 'rangka',
    topicLabel: 'Sistem Rangka Manusia',
    question:
      'Untuk menjaga kepadatan tulang agar terhindar dari rakhitis dan osteoporosis, nutrisi utama yang penting bagi petualang adalah ...',
    options: [
      { key: 'A', text: 'natrium dan sakarin' },
      { key: 'B', text: 'glukosa dan tartrazin' },
      { key: 'C', text: 'kalsium, fosfor, dan vitamin D' },
      { key: 'D', text: 'kafein dan nikotin' },
    ],
    answer: 'C',
    hint: 'Mineral pembentuk matriks tulang keras serta vitamin yang membantu penyerapannya.',
    explanation:
      'Kalsium dan fosfor adalah mineral penyusun utama tulang keras, sementara vitamin D (dibantu sinar matahari pagi) memaksimalkan penyerapan kalsium di usus.',
  },
  {
    id: 80,
    topic: 'rangka',
    topicLabel: 'Sistem Rangka Manusia',
    question:
      'Jaringan ikat kuat yang menghubungkan antara satu tulang dengan tulang lainnya pada persendian agar sendi tetap stabil saat berlari disebut ...',
    options: [
      { key: 'A', text: 'tendon' },
      { key: 'B', text: 'kartilago' },
      { key: 'C', text: 'periosteum' },
      { key: 'D', text: 'ligamen' },
    ],
    answer: 'D',
    hint: 'Tendon menghubungkan otot ke tulang, sedangkan jaringan ini mengikat tulang ke tulang.',
    explanation:
      'Ligamen adalah pita jaringan ikat fibrosa yang kuat yang mengikat tulang dengan tulang pada persendian untuk menjaga stabilitas gerak.',
  },
];
