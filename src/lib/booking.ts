import { prisma } from "@/lib/prisma";

/**
 * Memeriksa apakah ada konflik jadwal untuk tutor atau siswa.
 * Logika: (new_start_time < existing_end_time) AND (new_end_time > existing_start_time)
 */
export async function checkBookingConflict(
  tutorId: string,
  studentId: string,
  startTime: Date,
  endTime: Date,
  excludeBookingId?: string
) {
  // Filter untuk mengabaikan booking tertentu jika sedang update
  const idFilter = excludeBookingId ? { NOT: { id: excludeBookingId } } : {};

  // Memeriksa konflik tutor
  const tutorConflict = await prisma.classBooking.findFirst({
    where: {
      tutorId,
      status: "SCHEDULED",
      startTime: { lt: endTime },
      endTime: { gt: startTime },
      ...idFilter,
    },
  });

  if (tutorConflict) {
    return { 
      conflict: true, 
      message: "Tutor sudah memiliki jadwal pada waktu tersebut." 
    };
  }

  // Memeriksa konflik siswa
  const studentConflict = await prisma.classBooking.findFirst({
    where: {
      studentId,
      status: "SCHEDULED",
      startTime: { lt: endTime },
      endTime: { gt: startTime },
      ...idFilter,
    },
  });

  if (studentConflict) {
    return { 
      conflict: true, 
      message: "Siswa sudah memiliki jadwal pada waktu tersebut." 
    };
  }

  return { conflict: false };
}
