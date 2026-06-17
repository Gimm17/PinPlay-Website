export const config = {
  botName: 'PinPlay',
  botVersion: '4.0.0',
  botTagline: 'Premium Discord Music Bot',
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
    },
    {
      id: 'ai-features',
      title: 'AI Chat, Playlist Generator & Roast',
      description: 'Manfaatkan AI (NVIDIA Build / TokenRouter) untuk generate playlist otomatis dari tema, roast lagu yang lagi diputar, atau ngobrol dengan 13 personality (coding-helper, puisi, romantis, dll). /chat shared 5/jam (owner bypass unlimited); /roast & /aiplaylist unlimited (Free Command).',
      icon: 'sparkles'
    },
    {
      id: 'spotify-bypass',
      title: 'Mode Play-YT Anti Rate Limit',
      description: 'Gunakan /play-yt sebagai fallback saat Spotify rate limit. Bot scrape embed page Spotify untuk metadata, lalu resolve audio via YouTube — tanpa butuh Spotify API.',
      icon: 'youtube'
    }
  ],

  commandCategories: [
    { id: 'music', label: '🎵 Pemutar Musik', description: 'Command dasar untuk memutar, mencari, dan menampilkan informasi lagu. Semua member server bisa menggunakannya.' },
    { id: 'control', label: '🎛️ Kontrol Audio', description: 'Command untuk mengatur aliran musik, antrian, volume, dan efek filter. Mengikuti sistem akses kontrol server.' },
    { id: 'setup', label: '⚙️ Setup & Admin', description: 'Command konfigurasi khusus Administrator dan DJ untuk mengelola panel musik, mode 24/7, dan hak akses.' },
    { id: 'ai', label: '🤖 Fitur AI', description: 'Command berbasis AI (NVIDIA Build / TokenRouter): chat, generator playlist otomatis, dan roast lagu. /chat shared 5/jam (owner bypass); /roast & /aiplaylist unlimited (Free Command). Butuh API key AI di .env owner.' }
  ],

  // Changelog timeline data (newest first)
  changelog: [
    {
      version: '4.0.0',
      date: 'Juni 2026',
      title: 'AI Multi-Provider & 13 Personalities',
      tag: 'major',
      highlights: [
        '🤖 AI chat dengan 13 personality (general, puisi, romantis, coding-helper, dll) — auto-detect atau owner force via prefix --puisi',
        '🎧 /aiplaylist & 🔥 /roast jadi Free Command (unlimited, gak makan quota)',
        '⚡ Auto-fallback ke provider alternatif (NVIDIA ↔ TokenRouter) pada 5xx',
        '💬 Reply-to-continue chat 10 menit dengan mid-conversation personality picker',
        '📊 Token usage tracking: prompt/completion/total per provider & source, configurable cost per 1M tokens',
        '🛡️ Whitelist re-check di reply handler — owner hapus user = mid-conversation langsung di-block',
        '⚛️ Atomic write untuk semua JSON persistence (gak bakal corrupt kalau crash mid-write)',
        '💾 Rate limit persisted ke data/aiLimits.json (counter survive restart)',
        '🧠 Background fact extraction throttled (5 menit per-user, gak nambah latency)',
      ],
    },
    {
      version: '3.5.0',
      date: 'Mei 2026',
      title: 'Spotify Bypass Mode & Audio Filters',
      tag: 'minor',
      highlights: [
        '🎵 /play-yt — alternatif /play yang bypass dependency Spotify (scrape embed page)',
        '🎛️ 3 audio filter real-time: bassboost, nightcore, vaporwave',
        '📋 10-button interactive music panel (auto-update on state change)',
        '🔍 /search dengan StringSelectMenu dropdown 5 hasil teratas',
        '📜 /lyrics dari LRCLib (gratis, tanpa API key)',
      ],
    },
    {
      version: '3.0.0',
      date: 'April 2026',
      title: 'Access Control & 24/7 Standby',
      tag: 'major',
      highlights: [
        '🔐 Mode akses: all (default) atau restricted (hanya admin/DJ/allowed)',
        '👑 /djrole — set role DJ dengan auto-bypass mode restricted',
        '📡 /access — manage allowed users, roles, dan request channel',
        '⏰ /247 mode standby (auto-rejoin setelah restart)',
        '🎚️ Volume per-guild persistence di JSON storage',
      ],
    },
    {
      version: '2.0.0',
      date: 'Maret 2026',
      title: 'Multi-Platform & Queue Management',
      tag: 'major',
      highlights: [
        '🌐 YouTube + Spotify + Apple Music + SoundCloud + direct link support',
        '📜 Slash commands + prefix command (.p, .s, .q, dll) — 25+ commands total',
        '🎵 Queue management: add, remove, move, skipto, shuffle, clear',
        '🔁 Loop modes: none / track / queue',
        '⏱️ Seek, history, nowplaying dengan progress bar',
      ],
    },
  ],

  commands: [
    // --- MUSIC CATEGORY ---
    {
      name: 'play',
      category: 'music',
      syntax: '/play query:<judul | link>',
      prefix: '.p <judul | link> atau .play <judul | link>',
      description: 'Memutar lagu dari judul atau link (termasuk Spotify & playlist).',
      parameters: [
        { name: 'query', type: 'String', required: true, description: 'Judul lagu, kata kunci pencarian, link track/playlist YouTube, link Spotify, SoundCloud, atau direct link file audio (.mp3, .ogg).' }
      ],
      details: 'Command utama untuk memutar musik. Jika bot belum bergabung ke Voice Channel, bot akan otomatis masuk ke channel Anda. Playlist Spotify diproses dengan mode "play-first" (lagu pertama langsung diputar, sisanya dimuat di background). Pencarian judul di-cache untuk respon lebih cepat pada request berulang.',
      tips: 'Anda tidak wajib menyalin link. Ketik judul lagu dan artisnya saja (contoh: "/play query: Blinding Lights The Weeknd"), bot akan otomatis mengambil hasil pencarian pertama dari YouTube. Jika Spotify sedang rate limit (429), gunakan /play-yt sebagai alternatif.',
      permissions: 'Wajib berada di Voice Channel yang sama dengan bot. Mengikuti pengaturan /access requestchannel.'
    },
    {
      name: 'play-yt',
      category: 'music',
      syntax: '/play-yt query:<judul | link>',
      prefix: '.p-yt <judul | link> atau .play-yt <judul | link>',
      description: 'Memutar lagu/album/playlist dengan mode YouTube-only (bebas rate limit Spotify).',
      parameters: [
        { name: 'query', type: 'String', required: true, description: 'Judul lagu, link YouTube, atau link Spotify (track/album/playlist) — semua akan di-resolve via pencarian YouTube.' }
      ],
      details: 'Alternatif dari /play yang mem-bypass dependency Spotify. Link Spotify (termasuk playlist & album) di-scrape dari embed page untuk mendapatkan judul+artis, lalu dicari versi audionya di YouTube. Sangat berguna saat Spotify sedang rate limit (429). Untuk album, semua track akan di-resolve via batch (5 paralel + retry) sebelum ditambahkan ke queue.',
      tips: 'Gunakan command ini ketika /play gagal dengan pesan error "rate limit" atau "401". Identik secara fungsional dengan /play untuk input YouTube langsung, hanya berbeda pada jalur Spotify → YouTube.',
      permissions: 'Wajib berada di Voice Channel. Mengikuti pengaturan /access requestchannel.'
    },
    {
      name: 'search',
      category: 'music',
      syntax: '/search query:<judul>',
      prefix: '.sc <judul> atau .search <judul>',
      description: 'Mencari lagu di YouTube dan menyajikan 5 pilihan teratas via dropdown.',
      parameters: [
        { name: 'query', type: 'String', required: true, description: 'Judul lagu atau kata kunci pencarian.' }
      ],
      details: 'Menampilkan StringSelectMenu (dropdown) interaktif berisi 5 hasil pencarian teratas. Hasil pencarian di-cache (key = query) untuk respon lebih cepat pada request berulang. Cache hasil hanya berlaku 60 detik.',
      tips: 'Sangat berguna jika judul lagu yang Anda cari cukup umum dan Anda ingin memastikan versi lagu yang diputar adalah yang benar (misalnya versi live, akustik, atau cover).',
      permissions: 'Wajib berada di Voice Channel. Mengikuti pengaturan /access requestchannel.'
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
      name: 'queue',
      category: 'music',
      syntax: '/queue [page]',
      prefix: '.q [halaman] atau .queue [halaman]',
      description: 'Menampilkan daftar antrian lagu (10 per halaman).',
      parameters: [
        { name: 'page', type: 'Integer', required: false, description: 'Nomor halaman yang ingin dilihat (default: 1). Otomatis di-clamp ke jumlah halaman yang tersedia.' }
      ],
      details: 'Menampilkan embed berisi lagu yang sedang diputar (▶) di bagian atas, diikuti daftar 10 lagu antrian berikutnya. Tidak perlu join voice channel — cukup ada player aktif di server.',
      tips: 'Untuk server dengan queue panjang, tambahkan nomor halaman: "/queue page:3" untuk langsung lompat ke halaman 3. Bisa dilihat siapa saja tanpa harus join VC.',
      permissions: 'None.'
    },
    {
      name: 'lyrics',
      category: 'music',
      syntax: '/lyrics [query]',
      prefix: '.ly [judul] atau .lyrics [judul]',
      description: 'Menampilkan lirik lagu dari LRCLib (gratis, tanpa API key).',
      parameters: [
        { name: 'query', type: 'String', required: false, description: 'Judul lagu tertentu secara spesifik. Jika dikosongkan, bot otomatis mengambil judul lagu yang sedang diputar saat ini (auto-clean dari suffix "(Official Video)", "[Lyrics]", dll).' }
      ],
      details: 'Mencari lirik dari database publik LRCLib (lrclib.net) — tidak butuh API key. Jika lirik melebihi 3900 karakter, akan otomatis dipotong. Pencarian dilakukan dengan menggabungkan judul + artis (untuk auto-detect dari now playing).',
      tips: 'Sangat berguna untuk bernyanyi bersama (karaoke) langsung di server Anda tanpa harus membuka tab browser terpisah. Coba kosongkan parameter untuk lirik lagu yang sedang diputar.',
      permissions: 'None'
    },
    {
      name: 'history',
      category: 'music',
      syntax: '/history',
      prefix: '.hist atau .history',
      description: 'Menampilkan daftar 15 lagu terakhir yang telah diputar.',
      parameters: [],
      details: 'Menampilkan riwayat trek lagu (maks 20 tersimpan, 15 ditampilkan) yang selesai diputar di server. Include judul, artis, durasi, dan link ke YouTube. Riwayat tersimpan in-memory — akan di-reset saat bot restart.',
      tips: 'Jika Anda tidak sengaja melewatkan lagu bagus di sesi sebelumnya, Anda bisa membuka riwayat ini dan klik judulnya untuk langsung buka link YouTube-nya.',
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
      description: 'Memasang filter Equalizer (EQ) / Timescale ke audio secara langsung.',
      parameters: [
        { name: 'name', type: 'String', required: true, description: 'Nama filter: "bassboost" (meningkatkan kekuatan bass via 5-band equalizer), "nightcore" (timescale speed 1.15x + pitch 1.12), "vaporwave" (timescale speed 0.85x + pitch 0.9 - slowed style), "off" (matikan filter).' }
      ],
      details: 'Mengaplikasikan filter audio real-time menggunakan Lavalink FilterChain (equalizer + timescale). Filter memerlukan akses kontrol yang valid — admin/Manage Server selalu boleh, atau sesuai mode /access.',
      tips: 'Mengaktifkan filter membutuhkan waktu sekitar 1-2 detik untuk buffering ulang audio. Menyetel filter ke "off" akan mengembalikan kualitas audio ke settingan original (clearFilters).',
      permissions: 'Admin/Manage Server, atau sesuai setting /access (mode restricted + DJ/allowed).'
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
        { name: 'action', type: 'String', required: true, description: 'Aksi: "create" (membuat embed kontrol baru dengan 10 tombol di channel ini), "show" (refresh/update panel yang sudah ada), "remove" (hapus data panel dari settings).' }
      ],
      details: 'Membuat sistem panel visual eksklusif di channel chat. Panel ini menampilkan status putar secara real-time dan dilengkapi tombol interaktif (Shuffle, Prev, Play/Pause, Next, Queue, Loop, Vol Down, Vol Up, Stop, Add Song). Aksi Add Song membuka modal input pop-up bawaan Discord. ID panel disimpan di guild settings (panelChannelId + panelMessageId).',
      tips: 'Disarankan membuat panel ini di channel khusus (misalnya channel #music-player) dan membatasi channel tersebut agar tidak dipenuhi chat teks biasa.',
      permissions: 'Administrator atau Manage Server.'
    },
    {
      name: 'access',
      category: 'setup',
      syntax: '/access <subcommand>',
      prefix: '.access <subcommand>',
      description: 'Atur akses kontrol musik (mode, allowed users/roles, request channel).',
      parameters: [
        { name: 'subcommand', type: 'String', required: true, description: 'Subcommand: "mode" (all/restricted), "allowuser" (add/remove/list), "allowrole" (add/remove/list), "requestchannel" (set/clear), "view" (lihat konfigurasi).' }
      ],
      details: 'Subcommands:\n• `mode <all|restricted>` — set mode akses kontrol\n• `allowuser <add|remove|list> [@user]` — kelola user pengecualian\n• `allowrole <add|remove|list> [@role]` — kelola role pengecualian\n• `requestchannel [#channel]` — batasi command music ke 1 channel (kosongkan untuk disable)\n• `view` — lihat semua setting (controlMode, DJ role, request channel, allowed users/roles) di 1 embed',
      tips: 'Untuk server komunitas, set mode ke "restricted" lalu daftarkan DJ role dengan /djrole. Gunakan /access view kapan saja untuk cek konfigurasi.',
      permissions: 'Administrator atau Manage Server.'
    },
    {
      name: 'djrole',
      category: 'setup',
      syntax: '/djrole <set role:@Role | view>',
      prefix: '.dj <set @Role | view> atau .djrole <set|view>',
      description: 'Set atau view role DJ (auto-bypass mode restricted).',
      parameters: [
        { name: 'subcommand', type: 'String', required: true, description: 'Subcommand: "set" (set DJ role baru) atau "view" (lihat DJ role saat ini).' },
        { name: 'role', type: 'Role', required: false, description: 'Role target (wajib untuk subcommand "set").' }
      ],
      details: 'Mendaftarkan role server tertentu sebagai role DJ PinPlay. Seluruh member yang memiliki role ini otomatis mendapat akses kontrol musik penuh (melewati mode restricted). Default (jika belum diset): user dengan Manage Server.',
      tips: 'Hanya bisa menyetel satu role DJ per server. Disarankan membuat role bernama "DJ" atau "Music Controller" agar mudah di-manage.',
      permissions: 'Administrator atau Manage Server.'
    },
    {
      name: '247',
      category: 'setup',
      syntax: '/247 enable:<true | false>',
      prefix: '.247 <true | false> atau .247 <on | off>',
      description: 'Mengaktifkan mode stand-by bot 24/7 di Voice Channel.',
      parameters: [
        { name: 'enable', type: 'Boolean', required: true, description: 'Pilihan: "true"/"on" (aktif) atau "false"/"off" (mati).' }
      ],
      details: 'Membuat bot tetap di Voice Channel meskipun queue kosong atau semua user keluar. VoiceChannelId disimpan di settings untuk auto-rejoin saat bot restart. Catatan: untuk enable, kamu harus sudah join VC target. Disable tidak butuh VC.',
      tips: 'Sangat cocok untuk membuat radio musik server yang terus menyala sepanjang hari. Setelah restart, bot akan otomatis rejoin ke channel yang terakhir disimpan.',
      permissions: 'Administrator atau Manage Server.'
    },
    {
      name: 'help',
      category: 'setup',
      syntax: '/help [command:<nama>] [all:true]',
      prefix: '.h [all|command]',
      description: 'Menampilkan panduan lengkap command bot (dengan pagination).',
      parameters: [
        { name: 'command', type: 'String', required: false, description: 'Nama command spesifik (contoh: "play", "loop", "panel") untuk lihat detail command itu saja.' },
        { name: 'all', type: 'Boolean', required: false, description: 'Set true untuk menampilkan SEMUA command (dipaginasi, 3 per page, dengan tombol Prev/Next).' }
      ],
      details: 'Tiga mode: (1) tanpa parameter → ringkasan semua kategori (Music/Control/Setup/AI), (2) `command:<nama>` → detail 1 command dengan usage + contoh, (3) `all:true` → halaman detail semua command dengan navigasi tombol.',
      tips: 'Bermanfaat bagi member baru server yang ingin mempelajari cara meminta lagu dalam hitungan detik. Gunakan /help command:aiplaylist untuk detail command tertentu.',
      permissions: 'None'
    },
    {
      name: 'helpv2',
      category: 'setup',
      syntax: '/helpv2 [mode:<summary | detail>]',
      prefix: '.hv2 [mode] atau .helpv2 [mode]',
      description: 'Daftar prefix commands dengan mode ringkas / detail.',
      parameters: [
        { name: 'mode', type: 'String', required: false, description: '"summary" (default, daftar ringkas per kategori) atau "detail" (full usage + contoh untuk tiap prefix command).' }
      ],
      details: 'Mengirimkan embed berisi daftar semua prefix command (default prefix: `.`) yang dikelompokkan per kategori: Music, Control, Setup, AI. Mode detail memperluas tiap command dengan Usage + Fungsi + Contoh. Listing 25+ prefix command + alias lengkap (`.p`, `.s`, `.q`, `.ap`, `.roast`, `.chat`, `.ais`, `.limit`, dll).',
      tips: 'Berguna sebagai cheat sheet prefix lengkap — lebih dari /help karena expose semua alias. Wajib enable MessageContent intent di Discord Developer Portal untuk prefix command bekerja. Detail mode cocok untuk admin/user baru yang perlu lihat syntax lengkap.',
      permissions: 'None'
    },

    // --- AI CATEGORY ---
    {
      name: 'aiplaylist',
      category: 'ai',
      syntax: '/aiplaylist [query]',
      prefix: '.ap [tema] atau .aiplaylist [tema]',
      description: 'AI membuat playlist 10-15 lagu otomatis dari tema/mood (free command, unlimited).',
      parameters: [
        { name: 'query', type: 'String', required: false, description: 'Tema/mood playlist (contoh: "lagu galau indo viral", "nongkrong santai", "workout energik"). Wajib di-isi untuk slash; untuk prefix bisa diketik di chat berikutnya (60 detik window).' }
      ],
      details: 'Generate playlist via AI (NVIDIA Build / TokenRouter) — terdaftar di FREE_COMMANDS set, jadi unlimited & gak ngambil slot rate limit. Bot panggil AI untuk dapet 10-15 lagu (JSON array), lalu resolve tiap judul ke track playable via Kazagumo YouTube search (batch paralel 8, retry 2x). Hasil ditampilkan dengan embed + tombol ✅ Tambah Semua / ❌ Batal. Approve → semua track masuk queue. Cache TTL 2 menit. Pakai callAIWithFallback → auto-switch provider kalau yang utama 5xx.',
      tips: 'Tema yang bagus: "lagu galau indo viral", "workout energik", "nongkrong sore", "lofi buat belajar". Bot akan mix lagu Indo & internasional. Wajib join voice channel untuk approve. Prefix mode tanpa query → bot akan tanya tema via message collector (60 detik). Bisa spam tanpa takut limit.',
      permissions: 'Semua user boleh pakai (free command, gak kena rate limit). Voice channel wajib untuk approve. Butuh NVIDIA_API_KEY atau TOKENROUTER_API_KEY di .env.'
    },
    {
      name: 'roast',
      category: 'ai',
      syntax: '/roast',
      prefix: '.roast',
      description: 'AI roast lagu yang lagi diputar (atau roast kamu kalau antrian kosong) — free command, unlimited.',
      parameters: [],
      details: 'AI bikin roast savage dengan gaya bahasa Indonesia gaul (bucin, red flag, insecure, healing, dll). Sambungin tema/lirik lagu ke kondisi mental requester. Terdaftar di FREE_COMMANDS set → unlimited & gak ngambil slot rate limit (bisa spam tanpa takut limit). Cache 1 jam per-(user, track) untuk avoid duplicate AI calls (pakai aiPromptCache dengan key = title+artist+userMemCtx). Kalau gaada lagu diputar → roast user-nya aja. Pakai callAIWithFallback → auto-switch provider kalau yang utama 5xx. Response di-pisah dari status "Roast..." supaya chat lebih clean.',
      tips: 'Pakai buat lucu-lucuan di server. Bisa di-spam tanpa takut limit (free command). Cuma 1x per lagu per user karena cache. Lyrics fetch paralel sama AI call (gak nambah latency).',
      permissions: 'Semua user boleh pakai (free command, gak kena rate limit). Butuh NVIDIA_API_KEY atau TOKENROUTER_API_KEY di .env.'
    },
    {
      name: 'chat',
      category: 'ai',
      syntax: '/chat prompt:<pesan> [personality:<nama>]',
      prefix: '.chat <pesan> [--<personality>]',
      description: 'Ngobrol sama AI (13 personality, auto-detect). Reply pesan bot 10 menit untuk lanjutin.',
      parameters: [
        { name: 'prompt', type: 'String', required: true, description: 'Pesan kamu untuk AI.' },
        { name: 'personality', type: 'String', required: false, description: '[Owner only] Force personality untuk 1 chat ini. Pilih salah satu dari 13: 💬 Temen Curhat (general) | 💔🔥 Savage Galau (roast-galau) | 🏛️🔥 Kritikus Cafe (roast-pemerintah) | 💖 Penulis Puisi Cinta (romantis) | 📜 Penyair Kali (puisi) | 💪 Kakak Supportif (motivator) | 💻 Kang Coding (coding-helper) | 📖 Tukang Cerpen (storyteller) | 🎯 Lawannya Debat (debate) | 🏋️ Temen Gym (gym-buddy) | 🍳 Kang Masak (chef) | 🎮 Temen Mabar (game-strategist) | 🃏 Badut Receh (joker).' }
      ],
      details: 'AI ChatGPT/Claude-style dengan 13 personality. Owner bisa force via option slash atau suffix `--<personality>` di prefix (contoh: `.chat puisi tentang hujan --puisi`). Personality auto-detect dengan classifier API call (cuma di pesan pertama, lanjutan pakai session.personality). Session expire 10 menit idle, max 20 history pairs (40 messages). Reply pesan bot untuk lanjutin — bot akan edit placeholder "💭 Lagi mikir..." jadi response final. Mid-conversation personality picker dropdown tersedia untuk owner. Memory per-user (nickname, mood, genre, artist, interests, facts) di-inject ke system prompt. Background fact-extraction throttled (5 menit per-user, min 20 chars, gak nambah latency). Whitelist re-check di reply handler — kalau owner hapus user dari whitelist, mid-conversation reply di-block.',
      tips: 'Cek sisa quota via /ai-limit atau .limit (ephemeral, gak makan quota). Owner bypass limit, user biasa 5/jam CUMA dari /chat (sejak /roast & /aiplaylist jadi free command). Personality auto-detect akurat — owner force hanya untuk eksperimen. Reply continuation cocok untuk obrolan panjang tanpa kehilangan konteks. Prefix mode pakai suffix `--<personality>` untuk force personality (owner only): `.chat puisi tentang hujan --puisi`, `.chat bantu debug --coding-helper`.',
      permissions: 'Owner + whitelist (lihat /ai-set whitelist). 5 req/jam CUMA dari /chat (owner bypass unlimited). Roast & aiplaylist unlimited. Butuh NVIDIA_API_KEY atau TOKENROUTER_API_KEY.'
    },
    {
      name: 'ai-limit',
      category: 'ai',
      syntax: '/ai-limit',
      prefix: '.limit atau .ai-limit',
      description: 'Cek sisa quota AI kamu (ephemeral, gak makan quota).',
      parameters: [],
      details: 'Self-service status viewer: tampilkan used/total, sisa request, progress bar visual, dan reset timer (dalam menit). Read-only — gak ngitung ke rate limit. Owner lihat: bypass (∞). User biasa: effective limit (override > bonus > base global). Footer text menampilkan: "Limit ini cuma dihitung dari /chat. /roast & /aiplaylist unlimited (gak makan quota)."',
      tips: 'Cek sebelum pakai /chat supaya gak ke-limit di tengah jalan. /roast & /aiplaylist bebas tanpa limit (free command). Bisa dilihat siapa saja (read-only operation). Window 1 jam rolling.',
      permissions: 'None (semua user boleh lihat status sendiri, termasuk yang gak ke-whitelist — read-only).'
    },
    {
      name: 'ai-set',
      category: 'ai',
      syntax: '/ai-set <subcommand>',
      prefix: '.ais <subcommand>',
      description: '[Owner] Atur setting global AI (model, limit, memory, whitelist, token usage, dll).',
      parameters: [
        { name: 'subcommand', type: 'String', required: true, description: 'Subcommand: "model", "limit", "userlimit", "bonus", "reset-limit", "whitelist", "memory", "fallback", "cache", "limits", "tokens", "view".' }
      ],
      details: 'Subcommands (semua owner-only, 12 total):\n• `model <MiniMax-M3|llama-3.3-70b>` — switch model (provider auto-set)\n• `limit <angka>` — global per-user hourly limit (default 5, min 1)\n• `userlimit <set|remove|list> [@user] [value]` — per-user override limit\n• `bonus <set|add|remove|list> [@user] [value]` — per-user bonus/penalty (boleh negatif)\n• `reset-limit [@user|all]` — manual reset counter window user / semua\n• `whitelist <add|remove|list> [@user]` — manage user yang boleh /chat\n• `memory <view|set|clear|global> [@user] [field] [value]` — manage AI memory (fields: nickname, mood, genre, artist, interests, facts)\n• `fallback <on|off>` — toggle auto-fallback ke provider alternatif (NVIDIA ↔ TokenRouter) on 5xx\n• `cache <stats|clear>` — manage prompt cache (untuk /roast, 1h TTL)\n• `limits` — monitor semua user yang pakai AI dalam window 1 jam\n• `tokens <action> [modelkey] [value]` — token usage tracking & cost configuration\n   ◦ `tokens stats` — lihat total tokens (prompt/completion/total + per-provider breakdown nvidia/tokenrouter + per-source breakdown chat/roast/aiplaylist/classifier/extractFacts + estimated cost kalau cost rates di-set)\n   ◦ `tokens reset` — zero semua stats (preserve `startedAt`)\n   ◦ `tokens cost <modelKey> <value>` — set harga USD per 1M tokens (untuk estimated cost calculation, misal `tokens cost MiniMax-M3 0.15`)\n   ◦ `tokens costlist` — lihat semua configured cost rates\n• `view` — lihat semua setting (model, limit, whitelist count, toggles, token usage summary)',
      tips: 'Model `MiniMax-M3` ringan & cepat (TokenRouter), `llama-3.3-70b` lebih powerful (NVIDIA Build). Setting disimpan di data/aiSettings.json (atomic write — write to .tmp then rename, gak bakal corrupt). Memory array fields pisahkan value dengan koma. Token tracking otomatis capture dari `completion.usage` SDK di setiap callAI, cache hits 0 token (gak ada API call). Atomic write + rate limit persistence pakai shared jsonFile helper.',
      permissions: 'Owner bot only. Setting apply global ke /chat, /aiplaylist, /roast. Subcommand output selalu ephemeral (flags:64).'
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
OWNER_ID=ID_DISCORD_KAMU # Wajib untuk /ai-set (owner-only commands)

# ==================== Lavalink ====================
LAVALINK_NAME=local
LAVALINK_HOST=127.0.0.1
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass
LAVALINK_SECURE=false

# ==================== AI Features (NVIDIA + TokenRouter) ====================
# Untuk /chat, /roast, /aiplaylist. Set minimal 1 key.
# Dapatkan gratis di: https://build.nvidia.com & https://tokenrouter.ai
NVIDIA_API_KEY=PASTE_NVIDIA_API_KEY_KAMU
TOKENROUTER_API_KEY=PASTE_TOKENROUTER_API_KEY_KAMU
AI_DEFAULT_PROVIDER=nvidia
AI_DEFAULT_MODEL=llama-3.3-70b

# ==================== Optional ====================
DEFAULT_VOLUME=60
LEAVE_TIMEOUT_SEC=120
LOG_LEVEL=info
PREFIX=.`
    },
    {
      number: '4',
      title: 'Konfigurasi AI (Opsional tapi Direkomendasikan)',
      description: 'Untuk mengaktifkan /chat, /roast, dan /aiplaylist, kamu butuh minimal 1 API key AI. Tanpa key, fitur musik tetap jalan tapi AI commands akan return error "Fitur AI belum diaktifkan".',
      commands: [
        '# Dapatkan API key gratis di:',
        '# 1. NVIDIA Build — https://build.nvidia.com (untuk llama-3.3-70b)',
        '# 2. TokenRouter — https://tokenrouter.ai (untuk MiniMax-M3)',
        '',
        '# Set minimal 1 key di .env, lalu set provider default:',
        'AI_DEFAULT_PROVIDER=nvidia  # atau tokenrouter',
        'AI_DEFAULT_MODEL=llama-3.3-70b',
        'OWNER_ID=YOUR_DISCORD_ID  # agar /ai-set bisa diakses',
        '',
        '# Test di Discord:',
        '/ai-set view  # cek apakah model sudah loaded',
        '/chat halo   # test chat AI'
      ]
    },
    {
      number: '5',
      title: 'Deploy Command & Nyalakan!',
      description: 'Daftarkan command slash ke Discord API, lalu jalankan bot utama. Lavalink server harus sudah menyala terlebih dahulu.',
      commands: [
        '# Register slash commands ke server test (Guild Mode)',
        'npm run deploy:guild',
        '# Untuk production (global, propagasi ~1 jam):',
        'npm run deploy:global',
        '',
        '# Start main process',
        'npm start'
      ]
    }
  ]
};
