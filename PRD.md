# Product Requirements Document (PRD): Bacayuk

## 1. Project Overview
**Bacayuk** adalah platform bacaan anak interaktif berbasis web yang dirancang untuk menumbuhkan minat baca sejak dini melalui pengalaman yang modern dan aman. Berfokus pada kemudahan akses, Bacayuk menghilangkan hambatan navigasi dengan mengarahkan pengguna langsung ke pusat aktivitas (Dashboard).

**Visi:** Menjadi ekosistem literasi digital anak yang paling menyenangkan dengan sistem akses konten yang adaptif dan terstruktur.

---

## 2. User Personas

### A. Si Kecil (Pembaca Anak-anak)
*   **Profil:** Berusia 5-12 tahun.
*   **Kebutuhan:** Antarmuka yang ceria, cerita yang menarik, navigasi yang mudah tanpa teks yang terlalu padat.
*   **Pain Points:** Kebingungan dengan menu yang rumit atau proses login yang membosankan.

### B. Orang Tua (Pengawas & Pengelola)
*   **Profil:** Orang tua muda yang tech-savvy dan peduli pada kualitas bacaan anak.
*   **Kebutuhan:** Kontrol akses, proses pendaftaran yang cepat, serta keamanan data anak.
*   **Pain Points:** Kurangnya transparansi konten atau proses pembayaran/registrasi yang tidak intuitif.

---

## 3. Functional Requirements

| ID | Fitur | Deskripsi |
|---|---|---|
| **F01** | **Direct Dashboard** | Redirect otomatis dari root (`/`) ke `/dashboard` jika sesi aktif, atau ke halaman eksplorasi jika tamu. |
| **F02** | **BetterAuth System** | Login/Register menggunakan Email/Password dan Google OAuth (Seamless integration). |
| **F03** | **Freemium Reading** | Akses "Sneak Peek" (3-5 paragraf awal) untuk Guest, "Full Access" untuk logged-in users. |
| **F04** | **Library Management** | Pengelompokan cerita berdasarkan kategori (Fabel, Sejarah, Legenda). |
| **F05** | **Reading Room** | Mode pembaca yang bersih (distraction-free) dengan kontrol ukuran teks. |
| **F06** | **Search & Filter** | Pencarian berdasarkan judul atau kategori cerita. |

---

## 4. User Journey / Flow

1.  **Entry Point:** User membuka `bacayuk.com`.
2.  **Auto-Redirect:** Middleware mengecek sesi. User langsung mendarat di **Dashboard**.
3.  **Exploration:** User melihat grid koleksi cerita terbaru dan terpopuler.
4.  **Reading (Guest):** User (Guest) klik cerita -> Dibawa ke `/story/[slug]` -> Membaca ringkasan -> Muncul CTA "Login untuk baca selengkapnya".
5.  **Authentication:** User login via Google/Email melalui `/auth`.
6.  **Full Access:** User kembali ke halaman cerita sebelumnya dan kini dapat membaca seluruh konten dari awal hingga akhir.

---

## 5. Technical Architecture

### A. Database Schema (Drizzle ORM)
```typescript
import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";

// Tabel Cerita
export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  content: text("content").notNull(), // Digunakan tipe 'text' untuk konten panjang
  preview: text("preview").notNull(), // Potongan cerita untuk Guest
  categoryId: integer("category_id").references(() => categories.id),
  status: text("status").default("draft"), // draft, published
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabel Kategori
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

// Catatan: BetterAuth akan mengelola tabel 'user', 'session', dan 'account' secara internal.
```

### B. Middleware & Proteksi (BetterAuth)
*   **Logic:** Gunakan internal middleware BetterAuth untuk memvalidasi `session`.
*   **Path Protection:**
    *   `/dashboard`: Publik (Eksplorasi).
    *   `/story/[slug]`: Logika kondisional di tingkat komponen/server component berdasarkan status sesi.
    *   `/profile`: Khusus Logged-in.

---

## 6. UI/UX Design Guidance
*   **Vibe:** Ceria, Playful, dan Clean. Gunakan rounded corners (border-radius besar).
*   **Palet Warna:** 
    *   Primary: Biru Langit / Kuning Pastel (Energik).
    *   Background: White/Soft Cream untuk kenyamanan mata saat membaca lama.
*   **Tipografi:** Gunakan font Serif yang mudah dibaca untuk konten cerita (seperti *Outfit* atau *Inter* untuk UI). 
*   **Visual Elements:** Gunakan ilustrasi SVG yang ringan untuk ikon kategori.

---

## 7. Future Roadmap

*   **Phase 2:** Implementasi **Text-to-Speech (TTS)** agar anak bisa mendengarkan cerita.
*   **Phase 3:** Fitur **Bookmark** dan "Riwayat Bacaan".
*   **Phase 4:** **Gamifikasi** (Dapatkan badge setelah selesai membaca 5 cerita).
*   **Phase 5:** **Mode Offline** (PWA support) untuk membaca tanpa koneksi internet.

> [!IMPORTANT]
> **Catatan Implementasi:** Pastikan performa loading image (thumbnail) dioptimalkan menggunakan `next/image` agar dashboard tetap responsif di perangkat mobile entry-level.
