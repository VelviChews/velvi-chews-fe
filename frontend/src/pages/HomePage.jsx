import React from "react";
import Logo from "../assets/Logo.png";
import WaveTop from "../assets/upper.png";
import WaveBottom from "../assets/homebottom.png";
import WaveBg from "../assets/wave.png";
import Navbar from "../components/Navbar";
import GummyProductImage from "../assets/gummy-product.png";
import VisashiLabLogo from "../assets/VelvixVisashi.png";
import QrCodeImage from "../assets/qrcode.jpg";

const HomePage = () => {
    return (
      <div className="relative min-h-screen w-full bg-white pb-0 overflow-x-hidden font-sans">
        
        <Navbar />

        {/* HEADER SECTION */}
        <header className="relative w-full -mt-30">
          <img src={WaveTop} alt="Top wave" className="w-full object-cover" />
          <div className="absolute top-48 left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 transform items-center justify-center gap-4 px-6">
            <img
              src={Logo}
              alt="Velvi Chews Logo"
              className="w-24 flex-shrink-0 md:w-32"
            />
            <h2 className="text-left text-lg font-bold text-[#FF89AC] text-justify">
              Velvi Chews,
              <br />
              <span className="font-semibold text-white">
                healthier option for you to chew!
              </span>
            </h2>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex flex-col items-center text-center w-full">
          
          {/* --- BAGIAN 1: INTRO --- */}
          <div className="w-full px-6 flex flex-col items-center max-w-lg mx-auto">
            <section className="mt-8 flex flex-col items-center gap-4 w-full">
              <div className="w-full text-center">
                <p className="mt-3 text-xs text-[#FCAFC1] leading-relaxed tracking-wide text-justifyy">
                  Diawali dengan kesadaran akan kesehatan yang semakin meningkat,
                  Velvi Chews menghadirkan opsi snack atau dessert yang lebih
                  sehat untuk kamu yang tetap ingin ngemil yang manis namun tidak
                  mau meresikokan kesehatan.
                </p>
              </div>
              <div className="w-4/5 mx-auto">
                <img
                  src={GummyProductImage}
                  alt="Velvi Chews Gummies"
                  className="w-full rounded-lg shadow-md object-cover"
                />
              </div>
            </section>

            <div className="mt-6 w-full rounded-xl bg-[#FCAFC1]/90 p-4 text-white shadow-md">
              <p className="mt-3 text-xs text-white leading-relaxed tracking-wide text-justify">
                Velvi Chews menjamin setiap produk kami tidak memakai pengawet
                buatan maupun pemanis atau gula tambahan, memakai bahan buah asli
                sehingga lebih aman untuk dikonsumsi sehari-hari.
              </p>
            </div>
          </div> 


          {/* --- BAGIAN 2: OUR PRODUCT --- */}
          {/* Tambah overflow-hidden agar scale gambar aman */}
          <section className="relative mt-8 w-full overflow-hidden">
            {/* FIX: Scale diubah jadi 1.5 dan origin-top. 
                Ini menarik background biru menjadi lebih panjang ke bawah 
                supaya teks tidak kena bagian putih wave */}
            <img
              src={WaveBg}
              alt="Our Product Wave"
              className="absolute top-0 left-0 w-full h-full object-cover scale-[1.5] z-0 origin-top"
            />
            
            <div className="relative z-10 py-16 px-6">
              <h3 className="text-lg font-bold text-[#FF89AC]">OUR PRODUCT</h3>
              <p className="mt-1 text-sm font-semibold text-white">
                Homemade Gummy
              </p>
              {/* Teks tetap polos (tanpa kotak) sesuai request */}
              <p className="mt-3 text-xs text-white leading-relaxed tracking-wide text-justify max-w-lg mx-auto">
                Gummy yang mengandung vitamin dari buah asli; gelatin yang baik
                untuk kesehatan kulit, rambut, sendi, dan tulang; serta madu
                asli yang baik untuk imunitas dan pencernaan menjadikan produk
                homemade gummy Velvi Chews sebagai pilihan yang cocok sebagai
                pengganti permen untuk kamu konsumsi.
              </p>
            </div>
          </section>


          {/* --- BAGIAN 3: VISION & MISSION --- */}
          <div className="w-full px-6 max-w-lg mx-auto">
            <section className="mt-10 mb-10">
              <h3 className="text-lg font-bold text-[#FF89AC]">OUR VISION</h3>
              <p className="mt-3 text-xs text-[#FCAFC1] leading-relaxed tracking-wide text-justify">
                Visi kami adalah menjadi pelopor camilan sehat berbasis buah dan
                sayur tanpa gula maupun pengawet untuk kesehatan yang lebih
                baik.
              </p>
            </section>

            <div className="relative w-full overflow-hidden mb-10">
              <div className="bg-[#FFCFDD] p-6 rounded-3xl shadow-sm">
                <div className="bg-white/60 border-2 border-white rounded-2xl p-6">
                  <section className="text-center">
                    <h3 className="text-lg font-bold text-[#FF89AC]">OUR MISSION</h3>
                    <p className="mt-3 text-xs text-[#2F2B2B] leading-relaxed tracking-wide text-justify">
                      Misi kami ialah menghadirkan produk yang lebih sehat dan alami,
                      mendorong gaya hidup yang sehat, serta mengedepankan konsumen.
                    </p>
                  </section>
                  <section className="mt-8 text-center">
                    <h3 className="text-lg font-bold text-[#FF89AC]">
                      OUR CONTRIBUTION TO THE EARTH
                    </h3>
                    <p className="mt-3 text-xs text-[#2F2B2B] leading-relaxed tracking-wide text-justify">
                      Velvi Chews akan berusaha semampu kami untuk selalu bertanggung jawab
                      dengan produksi kami. Maka dari itu, kami menggunakan biodegradable
                      packaging yang bisa terurai sendiri di alam dalam waktu 2 tahun.
                    </p>
                  </section>
                </div>
              </div>
            </div>
          </div>


          {/* --- BAGIAN 4: VISASHI LAB --- */}
          {/* Overflow hidden agar aman */}
          <div className="relative w-full mt-0 pb-40 overflow-hidden">

            <div className="absolute top-20 left-0 w-full h-full bg-[#B4E2F2] z-0"></div>

            <img
              src={WaveBottom}
              alt="Bottom wave"
              className="absolute -top-1 left-0 w-full z-10 scale-[1.05] object-cover origin-top"
            />

            {/* FIX: Padding Top (pt) diperbesar jadi 36.
                Ini menurunkan seluruh konten (Logo, kotak, QR) ke bawah
                agar Logo tidak menabrak gelombang pink di atas. */}
            <section className="relative z-20 w-full pt-36 px-4 flex flex-col items-center">
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center gap-6">
                  <img src={VisashiLabLogo} alt="Visashi Lab" className="w-72" />
                </div>
              </div>

              <div className="w-full bg-white/50 backdrop-blur-sm border border-white rounded-3xl px-8 py-10 text-center text-[#2F2B2B] text-base shadow-sm leading-relaxed">
                <p>
                  Siap cari tahu rasa gummy yang paling match sama vibe kamu?
                  <br />
                  Jawab cepat, dan biarkan kepribadianmu pilih cemilanmu! 🍬🍇🍓🍋🍏
                </p>
              </div>

              <div className="flex justify-center mt-10">
                <a
                  href="https://visashilab.com/quiz/7af4d640-2944-4a79-99d3-87d03ddd6de3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FF89AC] text-white px-14 py-4 rounded-2xl font-bold shadow-md active:scale-95 text-xl tracking-wide"
                >
                  Klik di sini
                </a>
              </div>

              <div className="flex justify-center mt-10">
                <img
                  src={QrCodeImage}
                  alt="QR Code"
                  className="w-72 h-72 rounded-3xl shadow-lg bg-white p-4"
                />
              </div>
            </section>
          </div>
          
        </main>
      </div>
    );
};

export default HomePage;