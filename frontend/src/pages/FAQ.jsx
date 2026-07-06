function FAQ() {
  const daftarFaq = [
    { id: 1, pertanyaan: "Apa itu tracer study?", jawaban: "Tracer study adalah survei untuk melacak alumni." },
    { id: 2, pertanyaan: "Siapa yang wajib mengisi?", jawaban: "Semua alumni dan mahasiswa aktif." },
  ];

  return (
    <div>
      <h1>FAQ</h1>
      {daftarFaq.map((item) => (
        <div key={item.id}>
          <h3>{item.pertanyaan}</h3>
          <p>{item.jawaban}</p>
        </div>
      ))}
    </div>
  );
}

export default FAQ;