export const config = {
  botName: 'PinPlay',
  description: 'Premium Discord Music Bot yang didesain untuk memberikan pengalaman memutar musik terbaik di server Discord Anda dengan kualitas audio HD, integrasi Spotify penuh, audio filter real-time, dan panel kontrol interaktif.',
  inviteUrl: 'https://discord.com/oauth2/authorize?client_id=1457409665183907983&permissions=8&integration_type=0&scope=bot',
  githubUrl: 'https://github.com/Gimm17/PinPlay-Bot',
  defaultInviteLink: 'https://discord.com/oauth2/authorize?client_id=1457409665183907983&permissions=8&integration_type=0&scope=bot',
  lavalinkDocsUrl: 'https://github.com/lavalink-devs/Lavalink',
  
  // Color Palette reference
  colors: {
    bg: '#F4F0E4',
    primary: '#A5D6F1',
    secondary: '#EFAAB9',
    text: '#2C2B29',
    white: '#FFFFFF',
  },

  features: [
    {
      id: 'music-panel',
      title: 'Music Control Panel',
      description: 'Gunakan panel interaktif dengan 10 tombol visual untuk mengontrol pemutaran musik tanpa harus mengetik command. Cukup klik untuk pause, skip, atur volume, shuffle, atau menambah lagu baru.',
      icon: 'panel'
    },
    {
      id: 'spotify-support',
      title: 'Integrasi Spotify Penuh',
      description: 'Putar lagu langsung dari link Spotify (track, album, playlist). Sistem membaca metadata track Spotify dan otomatis mencari versi audio berkualitas tinggi di YouTube secara real-time.',
      icon: 'spotify'
    },
    {
      id: 'audio-filters',
      title: 'Filter Audio Real-time',
      description: 'Ubah suasana musik Anda dengan filter audio siap pakai seperti Bassboost (bass tebal), Nightcore (tempo cepat), dan Vaporwave (aesthetic & slowed). Aktifkan dalam satu ketukan.',
      icon: 'filter'
    },
    {
      id: 'access-control',
      title: 'Akses Kontrol DJ & Admin',
      description: 'Atur siapa saja yang berhak mengontrol musik. Mode akses restricted memungkinkan Anda membatasi command kontrol hanya untuk role DJ, admin, atau user tertentu.',
      icon: 'shield'
    },
    {
      id: 'standby-mode',
      title: 'Mode Standby 24/7',
      description: 'Jaga bot tetap standby di Voice Channel bahkan saat antrian lagu kosong atau semua user sudah keluar. Sangat cocok untuk menghadirkan radio server yang selalu aktif.',
      icon: 'clock'
    },
    {
      id: 'prefix-aliases',
      title: 'Dukungan Prefix Command (.p, .s)',
      description: 'Selain slash command, bot mendukung prefix dot (.) klasik untuk eksekusi super cepat. Cukup ketik .p untuk memutar, .s untuk skip, dan .q untuk melihat queue.',
      icon: 'music-note'
    }
  ],

  commandCategories: [
    { id: 'music', label: '🎵 Pemutar Musik', description: 'Command dasar untuk memutar, mencari, dan menampilkan informasi lagu. Semua member server bisa menggunakannya.' },
    { id: 'control', label: '🎛️ Kontrol Audio', description: 'Command untuk mengatur aliran musik, antrian, volume, dan efek filter. Mengikuti sistem akses kontrol server.' },
    { id: 'setup', label: '⚙️ Setup & Admin', description: 'Command konfigurasi khusus Administrator dan DJ untuk mengelola panel musik, mode 24/7, dan hak akses.' }
  ],

  commands: [
    // --- MUSIC CATEGORY ---
    {
      name: 'play',
      category: 'music',
      syntax: '/play query:<judul | link>',
      prefix: '.p <judul | link> atau .play <judul | link>',
      description: 'Memutar lagu dari judul atau link musik langsung.',
      parameters: [
        { name: 'query', type: 'String', required: true, description: 'Judul lagu, kata kunci pencarian, link track/playlist YouTube, link Spotify, SoundCloud, atau direct link file audio (.mp3, .ogg).' }
      ],
      details: 'Command utama untuk memutar musik. Jika bot belum bergabung ke Voice Channel, bot akan otomatis masuk ke channel Anda. Jika lagu sedang diputar, lagu target akan dimasukkan ke antrian paling belakang.',
      tips: 'Anda tidak wajib menyalin link. Ketik judul lagu dan artisnya saja (contoh: "/play query: Blinding Lights The Weeknd"), bot akan otomatis mengambil hasil pencarian pertama dari YouTube.',
      permissions: 'Wajib berada di Voice Channel yang sama dengan bot.'
    },
    {
      name: 'search',
      category: 'music',
      syntax: '/search query:<judul>',
      prefix: '.sc <judul> atau .search <judul>',
      description: 'Mencari lagu di YouTube dan menyajikan 5 pilihan teratas.',
      parameters: [
        { name: 'query', type: 'String', required: true, description: 'Judul lagu atau kata kunci pencarian.' }
      ],
      details: 'Menampilkan menu dropdown interaktif yang berisi 5 hasil pencarian lagu teratas dari YouTube. User yang mengirim command dapat memilih satu atau beberapa lagu dari daftar untuk diputar.',
      tips: 'Sangat berguna jika judul lagu yang Anda cari cukup umum dan Anda ingin memastikan versi lagu yang diputar adalah yang benar (misalnya versi live, akustik, atau cover).',
      permissions: 'Wajib berada di Voice Channel.'
    },
    {
      name: 'nowplaying',
      category: 'music',
      syntax: '/nowplaying',
      prefix: '.np atau .nowplaying',
      description: 'Menampilkan detail lagu yang sedang aktif diputar saat ini.',
      parameters: [],
      details: 'Mengirimkan pesan embed kaya (rich embed) yang berisi informasi detail tentang lagu yang sedang berjalan: judul lagu, nama channel/artis, nama pengirim request (requester), durasi total, progress bar visual saat ini, dan status loop/filter.',
      tips: 'Embed nowplaying akan terus terupdate secara visual jika tombol play/pause ditekan. Anda juga bisa melihat thumbnail lagu di sana.',
      permissions: 'None'
    },
    {
      name: 'lyrics',
      category: 'music',
      syntax: '/lyrics [query]',
      prefix: '.ly [judul] atau .lyrics [judul]',
      description: 'Menampilkan lirik lagu secara instan.',
      parameters: [
        { name: 'query', type: 'String', required: false, description: 'Judul lagu tertentu secara spesifik. Jika dikosongkan, bot otomatis mengambil judul lagu yang sedang diputar saat ini.' }
      ],
      details: 'Mencari lirik dari database public LRCLib. Jika lirik terlalu panjang (melebihi batas karakter embed Discord), bot akan membaginya ke dalam beberapa halaman interaktif.',
      tips: 'Sangat berguna untuk bernyanyi bersama (karaoke) langsung di server Anda tanpa harus membuka tab browser terpisah.',
      permissions: 'None'
    },
    {
      name: 'history',
      category: 'music',
      syntax: '/history',
      prefix: '.hist atau .history',
      description: 'Menampilkan daftar 15 lagu terakhir yang telah diputar.',
      parameters: [],
      details: 'Menampilkan riwayat trek lagu yang selesai diputar di server saat ini. Riwayat ini tersimpan dalam memory bot selama bot tetap online.',
      tips: 'Jika Anda tidak sengaja melewatkan lagu bagus di sesi sebelumnya, Anda bisa membuka riwayat ini dan menyalin judulnya untuk diputar kembali.',
      permissions: 'None'
    },

    // --- CONTROL CATEGORY ---
    {
      name: 'pause',
      category: 'control',
      syntax: '/pause',
      prefix: '.pause',
      description: 'Menjedakan pemutaran musik yang sedang berjalan.',
      parameters: [],
      details: 'Menghentikan sementara aliran audio dari Lavalink ke Voice Channel. Lagu tidak akan di-restart, posisinya akan tertahan di detik saat di-pause.',
      tips: 'Gunakan ini ketika ada teman server yang sedang berbicara atau saat VC perlu hening sejenak tanpa kehilangan progres lagu.',
      permissions: 'Memerlukan hak akses kontrol musik (Default: Semua orang di VC).'
    },
    {
      name: 'resume',
      category: 'control',
      syntax: '/resume',
      prefix: '.re atau .resume',
      description: 'Melanjutkan kembali pemutaran musik yang dijeda.',
      parameters: [],
      details: 'Melanjutkan pemutaran lagu dari posisi detik terakhir sebelum lagu dijeda menggunakan command /pause.',
      tips: 'Jika lagu tidak kunjung menyala setelah di-resume, pastikan koneksi internet Anda stabil atau coba periksa status Lavalink Server.',
      permissions: 'Memerlukan hak akses kontrol musik.'
    },
    {
      name: 'skip',
      category: 'control',
      syntax: '/skip',
      prefix: '.s atau .skip',
      description: 'Melewati lagu aktif dan memutar lagu berikutnya di antrian.',
      parameters: [],
      details: 'Menghentikan lagu yang sedang diputar dan langsung memutar trek pertama yang ada di antrian (queue). Jika antrian kosong, pemutaran berhenti dan bot akan masuk ke mode idle.',
      tips: 'Jika tidak ada lagu lain di queue, command ini akan menghentikan pemutaran musik sepenuhnya.',
      permissions: 'Memerlukan hak akses kontrol musik.'
    },
    {
      name: 'stop',
      category: 'control',
      syntax: '/stop',
      prefix: '.st atau .stop',
      description: 'Menghentikan pemutaran musik dan menghapus seluruh antrian.',
      parameters: [],
      details: 'Menghentikan audio, membersihkan seluruh daftar antrian (queue), merestart filter, dan melepaskan status pemutar aktif di server. Bot akan meninggalkan Voice Channel setelah masa timeout selesai (jika mode 24/7 mati).',
      tips: 'Gunakan ini untuk membersihkan sesi musik sepenuhnya jika semua orang sudah selesai mendengarkan lagu.',
      permissions: 'Memerlukan hak akses kontrol musik.'
    },
    {
      name: 'clear',
      category: 'control',
      syntax: '/clear',
      prefix: '.cl atau .clear',
      description: 'Membersihkan seluruh antrian lagu tanpa menghentikan lagu saat ini.',
      parameters: [],
      details: 'Menghapus semua daftar antrian trek yang akan diputar berikutnya. Trek lagu yang sedang berjalan saat ini tetap akan dimainkan hingga selesai.',
      tips: 'Cocok digunakan jika Anda ingin mengganti seluruh rencana daftar lagu berikutnya tanpa memotong lagu bagus yang sedang berputar saat ini.',
      permissions: 'Memerlukan hak akses kontrol musik.'
    },
    {
      name: 'loop',
      category: 'control',
      syntax: '/loop mode:<none | track | queue>',
      prefix: '.lp <none | track | queue> atau .loop <none | track | queue>',
      description: 'Mengatur mode pengulangan lagu.',
      parameters: [
        { name: 'mode', type: 'String', required: true, description: 'Mode pengulangan: "none" (tanpa loop), "track" (ulang lagu saat ini secara terus menerus), "queue" (ulang seluruh antrian dari awal jika lagu terakhir selesai).' }
      ],
      details: 'Mengaktifkan siklus pengulangan pada player. Status loop akan ditampilkan di panel musik.',
      tips: 'Jika ingin memutar lagu santai berdurasi panjang (lo-fi) sepanjang hari, set mode ke "/loop mode:track".',
      permissions: 'Memerlukan hak akses kontrol musik.'
    },
    {
      name: 'shuffle',
      category: 'control',
      syntax: '/shuffle',
      prefix: '.sh atau .shuffle',
      description: 'Mengacak urutan lagu di antrian.',
      parameters: [],
      details: 'Mengacak susunan urutan lagu di queue secara acak (random). Trek lagu yang sedang diputar saat ini tidak akan terpengaruh.',
      tips: 'Sangat cocok untuk playlist berukuran besar agar susunan lagu terasa dinamis dan tidak membosankan.',
      permissions: 'Memerlukan hak akses kontrol musik.'
    },
    {
      name: 'volume',
      category: 'control',
      syntax: '/volume value:<0-100>',
      prefix: '.v <0-100> atau .volume <0-100>',
      description: 'Mengatur tingkat volume suara bot.',
      parameters: [
        { name: 'value', type: 'Integer', required: true, description: 'Tingkat kekerasan volume dari skala 0 (senyap) hingga 100 (maksimal).' }
      ],
      details: 'Mengubah volume pemutaran musik secara instan. Volume awal default diset pada nilai 60.',
      tips: 'Kualitas audio terbaik biasanya berada pada volume 40 - 70. Menaikkan volume terlalu keras dapat menyebabkan distorsi tergantung kualitas voice channel server Anda.',
      permissions: 'Memerlukan hak akses kontrol musik.'
    },
    {
      name: 'seek',
      category: 'control',
      syntax: '/seek seconds:<detik>',
      prefix: '.sk <detik> atau .seek <detik>',
      description: 'Melompat ke detik waktu tertentu dalam lagu.',
      parameters: [
        { name: 'seconds', type: 'Integer', required: true, description: 'Posisi waktu target dalam satuan detik (contoh: 90 untuk melompat ke menit 1:30).' }
      ],
      details: 'Memindahkan pemutaran lagu maju atau mundur secara instan ke posisi detik yang di-input.',
      tips: 'Pastikan nilai detik yang dimasukkan tidak melebihi durasi total lagu, jika tidak bot akan otomatis memutar lagu berikutnya.',
      permissions: 'Memerlukan hak akses kontrol musik.'
    },
    {
      name: 'filter',
      category: 'control',
      syntax: '/filter name:<bassboost | nightcore | vaporwave | off>',
      prefix: '.f <bassboost | nightcore | vaporwave | off> atau .filter <...>',
      description: 'Memasang filter Equalizer (EQ) ke audio secara langsung.',
      parameters: [
        { name: 'name', type: 'String', required: true, description: 'Nama filter: "bassboost" (meningkatkan kekuatan bass), "nightcore" (mempercepat tempo dan menaikkan nada), "vaporwave" (memperlambat tempo dan menurunkan nada - slowed & reverb style), "off" (matikan filter).' }
      ],
      details: 'Mengaplikasikan filter audio real-time menggunakan kemampuan pemrosesan Lavalink.',
      tips: 'Mengaktifkan filter membutuhkan waktu sekitar 1-2 detik untuk buffering ulang audio. Menyetel filter ke "off" akan mengembalikan kualitas audio ke settingan original.',
      permissions: 'Memerlukan hak akses kontrol musik.'
    },
    {
      name: 'remove',
      category: 'control',
      syntax: '/remove position:<nomor>',
      prefix: '.rm <posisi> atau .remove <posisi>',
      description: 'Menhatus satu lagu tertentu dari antrian.',
      parameters: [
        { name: 'position', type: 'Integer', required: true, description: 'Nomor index lagu yang ingin dihapus dari daftar antrian.' }
      ],
      details: 'Menghapus lagu yang berada pada nomor baris antrian yang dipilih. Nomor urutan antrian di bawahnya akan otomatis bergeser naik ke atas.',
      tips: 'Anda dapat melihat nomor posisi antrian lagu menggunakan command /queue atau mengklik tombol Queue di panel.',
      permissions: 'Memerlukan hak akses kontrol musik.'
    },
    {
      name: 'move',
      category: 'control',
      syntax: '/move from:<index asal> to:<index tujuan>',
      prefix: '.mv <dari> <ke> atau .move <dari> <ke>',
      description: 'Memindahkan posisi urutan lagu di antrian.',
      parameters: [
        { name: 'from', type: 'Integer', required: true, description: 'Nomor index asal lagu yang ingin dipindahkan.' },
        { name: 'to', type: 'Integer', required: true, description: 'Nomor index posisi baru target.' }
      ],
      details: 'Memindahkan antrian lagu tanpa menghapusnya. Berguna untuk menaikkan antrian lagu tertentu agar dimainkan lebih cepat.',
      tips: 'Contoh: "/move from: 5 to: 1" untuk memindahkan lagu di urutan ke-5 langsung ke antrian berikutnya (posisi 1).',
      permissions: 'Memerlukan hak akses kontrol musik.'
    },
    {
      name: 'skipto',
      category: 'control',
      syntax: '/skipto position:<nomor>',
      prefix: '.stt <posisi> atau .skipto <posisi>',
      description: 'Lompat langsung ke lagu tertentu di antrian.',
      parameters: [
        { name: 'position', type: 'Integer', required: true, description: 'Nomor index lagu target di antrian.' }
      ],
      details: 'Menghapus dan melewati semua trek lagu di antrian yang berada sebelum index target, lalu langsung memutar lagu target tersebut.',
      tips: 'Gunakan command ini jika Anda ingin melewati banyak lagu sekaligus di antrian secara instan.',
      permissions: 'Memerlukan hak akses kontrol musik.'
    },
    {
      name: 'leave',
      category: 'control',
      syntax: '/leave',
      prefix: '.l atau .leave',
      description: 'Mengeluarkan bot dari Voice Channel.',
      parameters: [],
      details: 'Mengeluarkan bot secara paksa dari voice channel, menghentikan player, dan menghapus antrian lagu.',
      tips: 'Gunakan command ini jika bot tampak mengalami lag koneksi atau Anda ingin membebaskan slot voice channel.',
      permissions: 'Memerlukan hak akses kontrol musik.'
    },

    // --- SETUP CATEGORY ---
    {
      name: 'panel',
      category: 'setup',
      syntax: '/panel action:<create | show | remove>',
      prefix: '.panel <create | show | remove>',
      description: 'Membuat atau mengelola Music Control Panel interaktif.',
      parameters: [
        { name: 'action', type: 'String', required: true, description: 'Aksi: "create" (membuat embed kontrol baru dengan 10 tombol), "show" (mengirim ulang/refresh panel yang sudah ada), "remove" (menonaktifkan panel).' }
      ],
      details: 'Membuat sistem panel visual eksklusif di dalam channel chat. Panel ini menampilkan status putar secara real-time dan dilengkapi 10 tombol interaktif (Shuffle, Prev, Play/Pause, Next, Queue, Loop, Vol Down, Vol Up, Stop, Add Song). Aksi Add Song akan membuka modal input pop-up bawaan Discord.',
      tips: 'Disarankan untuk membuat panel ini di channel khusus (misalnya channel #music-player) dan membatasi channel tersebut agar tidak dipenuhi chat teks biasa.',
      permissions: 'Memerlukan role Administrator atau permission Manage Server.'
    },
    {
      name: 'access mode',
      category: 'setup',
      syntax: '/access mode mode:<all | restricted>',
      prefix: '.access mode <all | restricted>',
      description: 'Mengatur mode batasan kontrol musik.',
      parameters: [
        { name: 'mode', type: 'String', required: true, description: 'Mode akses: "all" (semua member di VC bisa kontrol) atau "restricted" (hanya admin, DJ, atau user/role terdaftar).' }
      ],
      details: 'Mengubah pengaturan keamanan pemutar musik server. Mode "restricted" sangat penting untuk server komunitas besar guna mencegah user mengacak-acak musik.',
      tips: 'Setelah menyetel mode ke "restricted", pastikan Anda mendaftarkan DJ role menggunakan command /djrole set.',
      permissions: 'Memerlukan role Administrator atau permission Manage Server.'
    },
    {
      name: 'access allowuser',
      category: 'setup',
      syntax: '/access allowuser action:<add | remove | list> user:[@User]',
      prefix: '.access allowuser <add | remove | list> [@User]',
      description: 'Mengelola daftar user yang diizinkan mengontrol musik.',
      parameters: [
        { name: 'action', type: 'String', required: true, description: 'Aksi: "add" (tambah user), "remove" (hapus user), "list" (tampilkan daftar user terdaftar).' },
        { name: 'user', type: 'User', required: false, description: 'Mention user target (diperlukan untuk add/remove).' }
      ],
      details: 'Menambahkan pengecualian hak akses kontrol musik perorangan di mode restricted.',
      tips: 'Gunakan ini untuk memberikan akses sementara kepada teman terpercaya tanpa perlu memberikan role DJ.',
      permissions: 'Memerlukan role Administrator atau permission Manage Server.'
    },
    {
      name: 'access allowrole',
      category: 'setup',
      syntax: '/access allowrole action:<add | remove | list> role:[@Role]',
      prefix: '.access allowrole <add | remove | list> [@Role]',
      description: 'Mengelola daftar role yang diizinkan mengontrol musik.',
      parameters: [
        { name: 'action', type: 'String', required: true, description: 'Aksi: "add" (tambah role), "remove" (hapus role), "list" (tampilkan daftar role terdaftar).' },
        { name: 'role', type: 'Role', required: false, description: 'Mention role target (diperlukan untuk add/remove).' }
      ],
      details: 'Menambahkan pengecualian hak akses kontrol musik berdasarkan role server di mode restricted.',
      tips: 'Sangat berguna jika Anda ingin memberikan hak kontrol musik ke role moderator atau role donatur server.',
      permissions: 'Memerlukan role Administrator atau permission Manage Server.'
    },
    {
      name: 'access requestchannel',
      category: 'setup',
      syntax: '/access requestchannel [channel]',
      prefix: '.access requestchannel [#channel]',
      description: 'Membatasi pengiriman request lagu ke satu channel tertentu.',
      parameters: [
        { name: 'channel', type: 'Channel', required: false, description: 'Text channel Discord target. Kosongkan parameter ini untuk menonaktifkan batasan.' }
      ],
      details: 'Membatasi penggunaan command request musik (/play, /search, /panel) agar hanya berfungsi di channel yang dipilih. Jika user mengetik command di luar channel tersebut, bot akan memberikan pesan error.',
      tips: 'Membantu menjaga kerapihan server Anda agar room chat utama tidak dipenuhi spam request musik.',
      permissions: 'Memerlukan role Administrator atau permission Manage Server.'
    },
    {
      name: 'access view',
      category: 'setup',
      syntax: '/access view',
      prefix: '.access view',
      description: 'Melihat rangkuman pengaturan akses kontrol musik saat ini.',
      parameters: [],
      details: 'Menampilkan embed konfigurasi akses saat ini: mode akses aktif, daftar allowed users, daftar allowed roles, role DJ, dan request channel.',
      tips: 'Gunakan ini untuk memeriksa apakah setting pembatasan server Anda sudah terkonfigurasi dengan benar.',
      permissions: 'Memerlukan role Administrator atau permission Manage Server.'
    },
    {
      name: 'djrole set / djrole view',
      category: 'setup',
      syntax: '/djrole set role:<@Role> atau /djrole view',
      prefix: '.dj set <@Role> atau .dj view atau .djrole set/view',
      description: 'Mengatur atau melihat role DJ khusus server.',
      parameters: [
        { name: 'role', type: 'Role', required: false, description: 'Role target yang ingin didaftarkan sebagai role DJ (diperlukan untuk set).' }
      ],
      details: 'Mendaftarkan role server tertentu sebagai role DJ PinPlay. Seluruh member yang memiliki role ini secara otomatis mendapatkan kekuasaan kontrol musik penuh (melewati mode restricted).',
      tips: 'Anda hanya bisa menyetel satu role sebagai DJ utama server. Disarankan membuat role bernama "DJ" atau "Music Controller".',
      permissions: 'Memerlukan role Administrator atau permission Manage Server.'
    },
    {
      name: '247',
      category: 'setup',
      syntax: '/247 enable:<true | false>',
      prefix: '.247 <true | false>',
      description: 'Mengaktifkan mode stand-by bot 24/7 di Voice Channel.',
      parameters: [
        { name: 'enable', type: 'Boolean', required: true, description: 'Pilihan: "true" (aktif) atau "false" (mati).' }
      ],
      details: 'Membuat bot tetap berada di Voice Channel meskipun tidak ada lagu yang diputar atau semua user telah meninggalkan room. Bot juga akan otomatis masuk kembali (rejoin) ke Voice Channel tersebut jika bot dinyalakan ulang setelah down.',
      tips: 'Sangat cocok untuk membuat radio musik server yang terus menyala sepanjang hari. Catatan: Untuk mengaktifkan mode ini, Anda harus berada di Voice Channel target.',
      permissions: 'Memerlukan role Administrator atau permission Manage Server.'
    },
    {
      name: 'help',
      category: 'setup',
      syntax: '/help',
      prefix: '.h atau .help',
      description: 'Menampilkan panduan cepat pemakaian bot.',
      parameters: [],
      details: 'Menyajikan panduan penggunaan singkat, daftar pintasan command populer, dan link dokumentasi resmi.',
      tips: 'Bermanfaat bagi member baru server yang ingin mempelajari cara meminta lagu dalam hitungan detik.',
      permissions: 'None'
    },
    {
      name: 'helpv2',
      category: 'setup',
      syntax: '/helpv2 [mode]',
      prefix: '.hv2 [mode] atau .helpv2 [mode]',
      description: 'Menampilkan panduan bantuan visual versi 2.',
      parameters: [
        { name: 'mode', type: 'String', required: false, description: 'Mode tampilan (contoh: "simple" atau "detailed").' }
      ],
      details: 'Mengirimkan menu bantuan versi kedua yang dilengkapi tombol-tombol Discord interaktif untuk navigasi kategori help secara visual.',
      tips: 'Membantu member server menemukan petunjuk command yang tepat tanpa membanjiri chat room.',
      permissions: 'None'
    }
  ],

  // Step by step guide data
  inviteSteps: [
    {
      number: '1',
      title: 'Dapatkan Link Invite Bot',
      description: 'Buka URL Generator di Discord Developer Portal (OAuth2) atau cukup klik tombol "Invite PinPlay" di website ini.',
      substeps: [
        'Masuk ke Discord Developer Portal dan pilih aplikasi bot Anda.',
        'Pergi ke menu OAuth2 → URL Generator.',
        'Centang scopes: "bot" dan "applications.commands".',
        'Centang bot permissions: "Send Messages", "Embed Links", "Connect", "Speak", dan "Use Slash Commands" (atau Administrator).'
      ]
    },
    {
      number: '2',
      title: 'Otorisasi Masuk Server',
      description: 'Buka link invite di browser Anda, pilih server Discord target, dan izinkan bot masuk.',
      substeps: [
        'Pilih server Discord di mana Anda memiliki hak pengelolaan (Manage Server).',
        'Selesaikan verifikasi Captcha Discord.',
        'Periksa apakah bot sudah muncul di daftar member server Anda (biasanya berstatus offline sebelum hosting dijalankan).'
      ]
    },
    {
      number: '3',
      title: 'Hubungkan dan Mulai Putar',
      description: 'Masuk ke Voice Channel di server Anda, ketik command musik, dan nikmati lagunya!',
      substeps: [
        'Masuk ke voice room mana saja di server.',
        'Ketik command "/play query: Judul Lagu" atau ".p Judul Lagu" di teks channel mana pun.',
        'Untuk kenyamanan maksimal, buat panel kontrol visual dengan mengetik "/panel action:create" atau ".panel create".'
      ]
    }
  ],

  developerSteps: [
    {
      number: '1',
      title: 'Persiapkan Kebutuhan Lingkungan',
      description: 'PinPlay membutuhkan Node.js (v18.0+) untuk menjalankan script bot dan Java JDK (v17+) untuk menjalankan Lavalink audio server.',
      commands: [
        'node -v  # Pastikan versi >= 18.0.0',
        'java -version  # Pastikan versi >= 17'
      ]
    },
    {
      number: '2',
      title: 'Download & Konfigurasi Lavalink',
      description: 'Lavalink bertugas memproses streaming audio. Download file Lavalink.jar terbaru dan buat file konfigurasi application.yml di folder yang sama.',
      configFile: `server:
  port: 2333
  address: 0.0.0.0

lavalink:
  server:
    password: "youshallnotpass"
    sources:
      youtube: true
      soundcloud: true
      bandcamp: true
      twitch: true
      http: true
      local: false
    plugins:
      - dependency: "com.github.topi314.lavasrc:lavasrc-plugin:4.0.1"
        repository: "https://maven.lavalink.dev/releases"
      - dependency: "dev.lavalink.youtube:youtube-plugin:1.5.2"
        repository: "https://maven.lavalink.dev/releases"`,
      commands: [
        '# Buat folder baru dan jalankan server Lavalink',
        'cd C:\\LavalinkServer',
        'java -jar Lavalink.jar'
      ]
    },
    {
      number: '3',
      title: 'Clone Repo & Konfigurasi Bot',
      description: 'Salin file source code PinPlay, pasang library pendukung, dan isi file konfigurasi lingkungan (.env).',
      commands: [
        'git clone https://github.com/Gimm17/PinPlay-Bot.git',
        'cd PinPlay',
        'npm install',
        '# Copy template environment file',
        'cp .env.example .env'
      ],
      envFile: `# ==================== Discord ====================
DISCORD_TOKEN=PASTE_TOKEN_BOT_KAMU_DISINI
CLIENT_ID=PASTE_CLIENT_ID_KAMU_DISINI
GUILD_ID=ID_SERVER_TEST_KAMU # Opsional untuk test instan

# ==================== Lavalink ====================
LAVALINK_NAME=local
LAVALINK_HOST=127.0.0.1
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass
LAVALINK_SECURE=false

# ==================== Optional ====================
DEFAULT_VOLUME=60
LEAVE_TIMEOUT_SEC=120
LOG_LEVEL=info`
    },
    {
      number: '4',
      title: 'Deploy Command & Nyalakan!',
      description: 'Daftarkan command slash ke Discord API, lalu jalankan bot utama. Lavalink server harus sudah menyala terlebih dahulu.',
      commands: [
        '# Register slash commands ke server test (Guild Mode)',
        'npm run deploy:guild',
        '# Start main process',
        'npm start'
      ]
    }
  ]
};
