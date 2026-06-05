import axios from "axios";

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || "https://api.fonnte.com/send";
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;

/**
 * Mengirim pesan WhatsApp melalui Gateway API.
 * Default menggunakan provider seperti Fonnte.
 */
export async function sendWhatsAppMessage(to: string, message: string) {
  if (!WHATSAPP_API_TOKEN) {
    console.warn("WHATSAPP_API_TOKEN tidak ditemukan. Pesan tidak terkirim.");
    return;
  }

  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        target: to,
        message: message,
      },
      {
        headers: {
          Authorization: WHATSAPP_API_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Gagal mengirim pesan WhatsApp:", error);
    throw error;
  }
}

/**
 * Notifikasi Booking Baru untuk Admin & Tutor
 */
export async function notifyNewBooking(data: {
  studentName: string;
  programName: string;
  date: string;
  time: string;
  tutorName: string;
}) {
  const adminPhone = "083120347713"; // Nomor Admin sesuai request
  
  const message = `
*NOTIFIKASI BOOKING BARU - EA*
---------------------------
Siswa: ${data.studentName}
Program: ${data.programName}
Tanggal: ${data.date}
Waktu: ${data.time}
Tutor: ${data.tutorName}

Mohon segera cek dashboard untuk konfirmasi.
---------------------------
_Be Brave to Act_
`;

  return sendWhatsAppMessage(adminPhone, message.trim());
}
