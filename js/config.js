/* =========================================================
   CONFIG.JS — Cấu hình nội dung Thiệp, Thư, Bó hoa & Video
   (Bạn chỉ cần chỉnh sửa nội dung tại file này)
   ========================================================= */

window.GRADUATION_CONFIG = {
  // Thông tin người nhận & lễ tốt nghiệp
  recipientName: "Trần Dương Hồng Lam",
  classYear: "TOÁN ỨNG DỤNG • K48 • ĐH CẦN THƠ",
  dateText: "Ngày 06/11/2026",
  venueText: "16h00 - 17h30 • Hội trường Rùa",

  // Icon Chibi của bạn ở cuối thư
  senderChibiAvatar: "ảnh/chibi_sender.jpg",

  // Nội dung lời chúc tự nhiên, gần gũi dành cho cô giáo tương lai
  greetingText: `Chúc mừng Hồng Lam chính thức tốt nghiệp nha! 🎓🎉

Vậy là sau bao ngày chạy deadline, giải toán vất vả ở trường thì ngày 06/11 này bạn tui cũng đã chính thức khoác lên mình bộ đồ cử nhân và cầm tấm bằng trên tay rồi.

Chúc "cô giáo tương lai" trên chặng đường sắp tới luôn giữ vững nhiệt huyết trên bục giảng, gặp được nhiều học trò ngoan, công việc thuận lợi và lúc nào cũng vui vẻ, cười tươi như hôm nay nha. Có dịp nhớ khao tui đó! 🥳💐`,

  // 3 tấm ảnh kỷ niệm đính trên bó hoa (Từ thư mục "ảnh")
  photos: [
    {
      src: "ảnh/1793600883192_2287570842013977784_1342522093597417382_5d1287daf050328ef0787e9bfb0a61ee.jpg",
      caption: "Rạng rỡ ngày ra trường 🌸",
      description: "Khoảnh khắc tươi tắn trong bộ lễ phục tốt nghiệp K48 Toán Ứng Dụng — Đại học Cần Thơ.",
      objectPosition: "center 72%",
      x: "84px",
      y: "58px",
      rotate: "-16deg",
      delay: "0s"
    },
    {
      src: "ảnh/1793600883413_2287570842013977784_1342522093597417382_b959392998140386d55db8810d6f4108.jpg",
      caption: "Tân Cử Nhân Hồng Lam 🎓",
      description: "Chính thức cầm trên tay tấm bằng cử nhân ngày 06/11/2026!",
      objectPosition: "center 48%",
      x: "231px",
      y: "14px",
      rotate: "0deg",
      delay: "0.3s"
    },
    {
      src: "ảnh/1793600883271_2287570842013977784_1342522093597417382_304e1baf471e018b4a369ec7f0ae8213.jpg",
      caption: "Chặng đường mới ✨",
      description: "Chúc bạn luôn tự tin, may mắn và thành công trên hành trình sắp tới!",
      objectPosition: "center 78%",
      x: "378px",
      y: "58px",
      rotate: "16deg",
      delay: "0.6s"
    }
  ],

  // Video kỷ niệm ở bước 4 (Từ thư mục "ảnh")
  video: {
    src: "ảnh/1793600883510_2287570842013977784_1342522093597417382.mp4",
    title: "Kỷ Niệm Ngày Tốt Nghiệp Của Hồng Lam 🎬",
    subtitle: "Ngày 06/11/2026 • Hội trường Rùa - Đại học Cần Thơ",
    caption: "🎓 Chúc mừng tốt nghiệp Hồng Lam — Luôn vui vẻ và thành công nha! 💕"
  }
};
