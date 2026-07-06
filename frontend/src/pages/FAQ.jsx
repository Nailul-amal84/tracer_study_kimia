import { useState, useEffect } from 'react';
import { getFaq } from '../services/api';

function FAQ() {
  const [daftarFaq, setDaftarFaq] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFaq().then((result) => {
      setDaftarFaq(result.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p>Memuat data...</p>;
  }

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